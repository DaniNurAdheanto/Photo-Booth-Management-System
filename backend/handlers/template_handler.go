package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"photobooth-api/models"
	"photobooth-api/services"
)

type TemplateHandler struct {
	templateService services.TemplateService
}

func NewTemplateHandler(templateService services.TemplateService) *TemplateHandler {
	return &TemplateHandler{templateService: templateService}
}

func (h *TemplateHandler) ListTemplates(c *gin.Context) {
	boothID := c.Query("booth_id")
	category := c.Query("category")
	includeArchived := c.Query("include_archived") == "true"

	templates, err := h.templateService.GetTemplates(c.Request.Context(), boothID, category, includeArchived)
	if err != nil {
		InternalServerError(c, "Failed to retrieve templates", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Templates retrieved successfully", templates)
}

func (h *TemplateHandler) GetTemplate(c *gin.Context) {
	id := c.Param("id")
	template, err := h.templateService.GetTemplateByID(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to retrieve template", err)
		return
	}
	if template == nil {
		ErrorResponse(c, http.StatusNotFound, "Template not found", "No template found with the given ID")
		return
	}
	SuccessResponse(c, http.StatusOK, "Template retrieved successfully", template)
}

func (h *TemplateHandler) CreateTemplate(c *gin.Context) {
	var input models.CreateTemplateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid template input", err.Error())
		return
	}

	template, err := h.templateService.CreateTemplate(c.Request.Context(), input)
	if err != nil {
		InternalServerError(c, "Failed to create template", err)
		return
	}
	SuccessResponse(c, http.StatusCreated, "Template created successfully", template)
}

func (h *TemplateHandler) UpdateTemplate(c *gin.Context) {
	id := c.Param("id")
	var input models.UpdateTemplateInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid template update input", err.Error())
		return
	}

	template, err := h.templateService.UpdateTemplate(c.Request.Context(), id, input)
	if err != nil {
		InternalServerError(c, "Failed to update template", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Template updated successfully", template)
}

func (h *TemplateHandler) DeleteTemplate(c *gin.Context) {
	id := c.Param("id")
	err := h.templateService.DeleteTemplate(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to delete template", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Template deleted successfully", nil)
}

func (h *TemplateHandler) ToggleActive(c *gin.Context) {
	id := c.Param("id")
	newStatus, err := h.templateService.ToggleActive(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to toggle template status", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Template status toggled successfully", gin.H{"is_active": newStatus})
}

func (h *TemplateHandler) ToggleArchive(c *gin.Context) {
	id := c.Param("id")
	newArchived, err := h.templateService.ToggleArchive(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to toggle archive status", err)
		return
	}
	SuccessResponse(c, http.StatusOK, "Template archive status toggled successfully", gin.H{"is_archived": newArchived})
}

func (h *TemplateHandler) DuplicateTemplate(c *gin.Context) {
	id := c.Param("id")
	duplicated, err := h.templateService.DuplicateTemplate(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to duplicate template", err)
		return
	}
	SuccessResponse(c, http.StatusCreated, "Template duplicated successfully", duplicated)
}
