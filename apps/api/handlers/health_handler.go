package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"photobooth-api/database"
)

type HealthHandler struct {
	db *database.PostgresDB
}

func NewHealthHandler(db *database.PostgresDB) *HealthHandler {
	return &HealthHandler{db: db}
}

func (h *HealthHandler) Check(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	dbStatus := "connected"
	var dbError string

	if h.db == nil || h.db.DB == nil {
		dbStatus = "not_initialized"
		dbError = "database connection instance is nil"
	} else if err := h.db.Ping(ctx); err != nil {
		dbStatus = "unreachable"
		dbError = err.Error()
	}

	payload := gin.H{
		"service":     "photobooth-api",
		"status":      "healthy",
		"timestamp":   time.Now().UTC().Format(time.RFC3339),
		"database":    dbStatus,
		"db_error":    dbError,
		"environment": gin.Mode(),
	}

	if dbStatus == "connected" {
		SuccessResponse(c, http.StatusOK, "System is operating normally", payload)
	} else {
		// Return 200 with degraded state or 503 depending on requirements
		c.JSON(http.StatusOK, APIResponse{
			Success: true,
			Message: "API is alive but database is degraded",
			Data:    payload,
		})
	}
}
