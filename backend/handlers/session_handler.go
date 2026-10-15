package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"photobooth-api/services"
)

type SessionHandler struct {
	sessionService services.SessionService
}

func NewSessionHandler(sessionService services.SessionService) *SessionHandler {
	return &SessionHandler{sessionService: sessionService}
}

type StartSessionInput struct {
	BoothID       string `json:"booth_id" binding:"required"`
	CustomerName  string `json:"customer_name"`
	CustomerEmail string `json:"customer_email"`
	TemplateID    string `json:"template_id"`
}

func (h *SessionHandler) ListSessions(c *gin.Context) {
	boothID := c.Query("booth_id")
	sessions, err := h.sessionService.GetSessions(c.Request.Context(), boothID)
	if err != nil {
		InternalServerError(c, "Failed to retrieve sessions", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Photo sessions retrieved", sessions)
}

func (h *SessionHandler) StartSession(c *gin.Context) {
	var input StartSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid session request payload", err.Error())
		return
	}

	session, err := h.sessionService.StartSession(c.Request.Context(), input.BoothID, input.CustomerName, input.CustomerEmail, input.TemplateID)
	if err != nil {
		InternalServerError(c, "Failed to start photo session", err)
		return
	}

	SuccessResponse(c, http.StatusCreated, "Photo session started", session)
}
