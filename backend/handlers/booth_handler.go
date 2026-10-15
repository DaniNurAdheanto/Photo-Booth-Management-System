package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"photobooth-api/models"
	"photobooth-api/services"
)

type BoothHandler struct {
	boothService services.BoothService
}

func NewBoothHandler(boothService services.BoothService) *BoothHandler {
	return &BoothHandler{boothService: boothService}
}

func (h *BoothHandler) ListBooths(c *gin.Context) {
	booths, err := h.boothService.GetAllBooths(c.Request.Context())
	if err != nil {
		InternalServerError(c, "Failed to retrieve booths", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Booths retrieved successfully", booths)
}

func (h *BoothHandler) GetBooth(c *gin.Context) {
	id := c.Param("id")
	booth, err := h.boothService.GetBoothByID(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to retrieve booth", err)
		return
	}
	if booth == nil {
		ErrorResponse(c, http.StatusNotFound, "Booth not found", nil)
		return
	}
	SuccessResponse(c, http.StatusOK, "Booth found", booth)
}

func (h *BoothHandler) CreateBooth(c *gin.Context) {
	var input models.CreateBoothInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid input data", err.Error())
		return
	}

	booth, err := h.boothService.CreateBooth(c.Request.Context(), input)
	if err != nil {
		InternalServerError(c, "Failed to create booth", err)
		return
	}

	SuccessResponse(c, http.StatusCreated, "Booth registered successfully", booth)
}
