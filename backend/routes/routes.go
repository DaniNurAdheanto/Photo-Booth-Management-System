package routes

import (
	"github.com/gin-gonic/gin"
	"photobooth-api/config"
	"photobooth-api/handlers"
	"photobooth-api/middleware"
)

type RouterDependencies struct {
	Config         *config.Config
	HealthHandler  *handlers.HealthHandler
	BoothHandler   *handlers.BoothHandler
	SessionHandler *handlers.SessionHandler
}

func SetupRouter(deps *RouterDependencies) *gin.Engine {
	if deps.Config.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// Global middlewares
	r.Use(middleware.CORSMiddleware(deps.Config.AllowedOrigins))
	r.Use(middleware.StructuredLogger())
	r.Use(middleware.RecoveryMiddleware())

	// API v1 group
	v1 := r.Group("/api/v1")
	{
		// Health check route
		v1.GET("/health", deps.HealthHandler.Check)

		// Booth routes
		booths := v1.Group("/booths")
		{
			booths.GET("", deps.BoothHandler.ListBooths)
			booths.GET("/:id", deps.BoothHandler.GetBooth)
			booths.POST("", deps.BoothHandler.CreateBooth)
		}

		// Photo session routes
		sessions := v1.Group("/sessions")
		{
			sessions.GET("", deps.SessionHandler.ListSessions)
			sessions.POST("/start", deps.SessionHandler.StartSession)
		}
	}

	return r
}
