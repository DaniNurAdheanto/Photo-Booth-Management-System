package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"photobooth-api/config"
)

type PostgresDB struct {
	DB *sql.DB
}

// ConnectPostgres initializes a connection pool to PostgreSQL
func ConnectPostgres(cfg *config.Config) (*PostgresDB, error) {
	dsn := cfg.GetDSN()

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Set connection pool parameters
	db.SetMaxOpenConns(cfg.DBMaxOpenConns)
	db.SetMaxIdleConns(cfg.DBMaxIdleConns)
	db.SetConnMaxLifetime(cfg.DBConnMaxLifetime)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		log.Printf("⚠️ PostgreSQL ping failed (Is PostgreSQL running?): %v", err)
		return &PostgresDB{DB: db}, err
	}

	log.Printf("✅ Connected successfully to PostgreSQL database [%s] on %s:%s", cfg.DBName, cfg.DBHost, cfg.DBPort)
	return &PostgresDB{DB: db}, nil
}

// Ping checks if database is alive
func (p *PostgresDB) Ping(ctx context.Context) error {
	if p.DB == nil {
		return fmt.Errorf("database connection is nil")
	}
	return p.DB.PingContext(ctx)
}

// Close gracefully closes the database pool
func (p *PostgresDB) Close() error {
	if p.DB != nil {
		return p.DB.Close()
	}
	return nil
}
