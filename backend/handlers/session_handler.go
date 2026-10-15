package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"photobooth-api/models"
	"photobooth-api/services"
)

type SessionHandler struct {
	sessionService services.SessionService
}

func NewSessionHandler(sessionService services.SessionService) *SessionHandler {
	return &SessionHandler{sessionService: sessionService}
}

func (h *SessionHandler) ListSessions(c *gin.Context) {
	boothID := c.Query("booth_id")
	status := c.Query("status")

	sessions, err := h.sessionService.GetSessions(c.Request.Context(), boothID, status)
	if err != nil {
		InternalServerError(c, "Failed to retrieve sessions", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Photo sessions retrieved", sessions)
}

func (h *SessionHandler) GetSession(c *gin.Context) {
	id := c.Param("id")
	session, err := h.sessionService.GetSessionByID(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to retrieve session", err)
		return
	}
	if session == nil {
		ErrorResponse(c, http.StatusNotFound, "Session not found", "Session with given ID does not exist")
		return
	}
	SuccessResponse(c, http.StatusOK, "Session details retrieved", session)
}

func (h *SessionHandler) GetActiveSession(c *gin.Context) {
	boothID := c.Param("booth_id")
	if boothID == "" {
		boothID = "bth-001"
	}
	session, err := h.sessionService.GetActiveSession(c.Request.Context(), boothID)
	if err != nil {
		InternalServerError(c, "Failed to retrieve active session", err)
		return
	}
	if session == nil {
		SuccessResponse(c, http.StatusOK, "No active session in progress", nil)
		return
	}
	SuccessResponse(c, http.StatusOK, "Active session retrieved for recovery", session)
}

func (h *SessionHandler) StartSession(c *gin.Context) {
	var input models.StartSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid session start payload", err.Error())
		return
	}

	session, err := h.sessionService.StartSession(c.Request.Context(), input)
	if err != nil {
		InternalServerError(c, "Failed to start photo session", err)
		return
	}

	SuccessResponse(c, http.StatusCreated, "Photo session started successfully", session)
}

func (h *SessionHandler) CapturePhoto(c *gin.Context) {
	id := c.Param("id")
	var input models.CapturePhotoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid photo capture payload", err.Error())
		return
	}

	session, err := h.sessionService.CapturePhoto(c.Request.Context(), id, input)
	if err != nil {
		InternalServerError(c, "Failed to record captured photo", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Photo captured and recorded", session)
}

func (h *SessionHandler) RetakePhoto(c *gin.Context) {
	id := c.Param("id")
	var input models.RetakePhotoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		// Default to retake all if no body provided
		input = models.RetakePhotoInput{RetakeAll: true}
	}

	session, err := h.sessionService.RetakePhoto(c.Request.Context(), id, input)
	if err != nil {
		InternalServerError(c, "Failed to perform retake", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Retake initiated successfully", session)
}

func (h *SessionHandler) ConfirmSession(c *gin.Context) {
	id := c.Param("id")
	var input models.ConfirmSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid confirmation payload", err.Error())
		return
	}

	session, err := h.sessionService.ConfirmSession(c.Request.Context(), id, input)
	if err != nil {
		InternalServerError(c, "Failed to confirm and finalize session", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Photo session confirmed and saved", session)
}

type CancelInput struct {
	Notes string `json:"notes"`
}

func (h *SessionHandler) CancelSession(c *gin.Context) {
	id := c.Param("id")
	var input CancelInput
	_ = c.ShouldBindJSON(&input)

	session, err := h.sessionService.CancelSession(c.Request.Context(), id, input.Notes)
	if err != nil {
		InternalServerError(c, "Failed to cancel session", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Photo session cancelled", session)
}

func (h *SessionHandler) DeleteSession(c *gin.Context) {
	id := c.Param("id")
	err := h.sessionService.DeleteSession(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to delete session", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Session deleted successfully", nil)
}
