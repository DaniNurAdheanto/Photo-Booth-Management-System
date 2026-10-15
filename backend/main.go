package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"photobooth-api/config"
	"photobooth-api/database"
	"photobooth-api/handlers"
	"photobooth-api/repositories"
	"photobooth-api/routes"
	"photobooth-api/services"
)

func main() {
	log.Println("🚀 Starting Photo Booth Management API Server...")

	// 1. Load Configurations from environment variables
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("❌ Failed to load configuration: %v", err)
	}

	// 2. Initialize Database Connection Pool
	pgDB, err := database.ConnectPostgres(cfg)
	if err != nil {
		log.Printf("⚠️ Warning: PostgreSQL initial connection ping failed: %v", err)
		log.Println("👉 Tip: Start PostgreSQL using 'docker compose up -d postgres'")
	}
	defer func() {
		if pgDB != nil {
			_ = pgDB.Close()
		}
	}()

	// 3. Initialize Repositories
	boothRepo := repositories.NewBoothRepository(pgDB.DB)
	sessionRepo := repositories.NewSessionRepository(pgDB.DB)
	templateRepo := repositories.NewTemplateRepository(pgDB.DB)

	// 4. Initialize Services (Business Logic)
	boothService := services.NewBoothService(boothRepo)
	sessionService := services.NewSessionService(sessionRepo, boothRepo)
	templateService := services.NewTemplateService(templateRepo)

	// 5. Initialize HTTP Handlers
	healthHandler := handlers.NewHealthHandler(pgDB)
	boothHandler := handlers.NewBoothHandler(boothService)
	sessionHandler := handlers.NewSessionHandler(sessionService)
	templateHandler := handlers.NewTemplateHandler(templateService)

	// 6. Setup Router & Middlewares
	router := routes.SetupRouter(&routes.RouterDependencies{
		Config:          cfg,
		HealthHandler:   healthHandler,
		BoothHandler:    boothHandler,
		SessionHandler:  sessionHandler,
		TemplateHandler: templateHandler,
	})

	serverAddr := fmt.Sprintf(":%s", cfg.Port)
	srv := &http.Server{
		Addr:         serverAddr,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// 7. Run Server in a Goroutine
	go func() {
		log.Printf("📡 HTTP server listening on %s (Environment: %s)", serverAddr, cfg.Environment)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("❌ Failed to start server: %v", err)
		}
	}()

	// 8. Graceful Shutdown on SIGINT / SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("🛑 Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("❌ Server forced to shutdown: %v", err)
	}

	log.Println("👋 Server exited gracefully")
}
