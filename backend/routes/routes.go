package routes

import (
	"github.com/gin-gonic/gin"
	"photobooth-api/config"
	"photobooth-api/handlers"
	"photobooth-api/middleware"
)

type RouterDependencies struct {
	Config          *config.Config
	HealthHandler   *handlers.HealthHandler
	BoothHandler    *handlers.BoothHandler
	SessionHandler  *handlers.SessionHandler
	TemplateHandler *handlers.TemplateHandler
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
			sessions.GET("/:id", deps.SessionHandler.GetSession)
			sessions.GET("/active/:booth_id", deps.SessionHandler.GetActiveSession)
			sessions.POST("/start", deps.SessionHandler.StartSession)
			sessions.POST("/:id/capture", deps.SessionHandler.CapturePhoto)
			sessions.POST("/:id/retake", deps.SessionHandler.RetakePhoto)
			sessions.POST("/:id/confirm", deps.SessionHandler.ConfirmSession)
			sessions.POST("/:id/cancel", deps.SessionHandler.CancelSession)
			sessions.DELETE("/:id", deps.SessionHandler.DeleteSession)
		}

		// Template & Layout routes
		templates := v1.Group("/templates")
		{
			templates.GET("", deps.TemplateHandler.ListTemplates)
			templates.GET("/:id", deps.TemplateHandler.GetTemplate)
			templates.POST("", deps.TemplateHandler.CreateTemplate)
			templates.PUT("/:id", deps.TemplateHandler.UpdateTemplate)
			templates.DELETE("/:id", deps.TemplateHandler.DeleteTemplate)
			templates.PATCH("/:id/toggle", deps.TemplateHandler.ToggleActive)
			templates.PATCH("/:id/archive", deps.TemplateHandler.ToggleArchive)
			templates.POST("/:id/duplicate", deps.TemplateHandler.DuplicateTemplate)
		}
	}

	return r
}
