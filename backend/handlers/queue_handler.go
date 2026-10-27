package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"photobooth-api/models"
	"photobooth-api/services"
)

type QueueHandler struct {
	queueService services.QueueService
}

func NewQueueHandler(queueService services.QueueService) *QueueHandler {
	return &QueueHandler{queueService: queueService}
}

func (h *QueueHandler) ListQueues(c *gin.Context) {
	boothID := c.Query("booth_id")
	status := c.Query("status")

	queues, err := h.queueService.GetAllQueues(c.Request.Context(), boothID, status)
	if err != nil {
		InternalServerError(c, "Failed to retrieve queues", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Queues retrieved successfully", queues)
}

func (h *QueueHandler) GetQueue(c *gin.Context) {
	id := c.Param("id")
	queue, err := h.queueService.GetQueueByID(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to retrieve queue item", err)
		return
	}
	if queue == nil {
		ErrorResponse(c, http.StatusNotFound, "Queue item not found", nil)
		return
	}

	SuccessResponse(c, http.StatusOK, "Queue item found", queue)
}

func (h *QueueHandler) CreateQueue(c *gin.Context) {
	var input models.CreateQueueInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid input data", err.Error())
		return
	}

	queue, err := h.queueService.EnqueueCustomer(c.Request.Context(), input)
	if err != nil {
		InternalServerError(c, "Failed to register queue", err)
		return
	}

	SuccessResponse(c, http.StatusCreated, "Customer added to queue successfully", queue)
}

type UpdateQueueStatusInput struct {
	Status models.QueueStatus `json:"status" binding:"required"`
}

func (h *QueueHandler) UpdateStatus(c *gin.Context) {
	id := c.Param("id")
	var input UpdateQueueStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid status input", err.Error())
		return
	}

	if err := h.queueService.UpdateQueueStatus(c.Request.Context(), id, input.Status); err != nil {
		InternalServerError(c, "Failed to update queue status", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Queue status updated successfully", gin.H{"id": id, "status": input.Status})
}

type CallNextInput struct {
	BoothID string `json:"booth_id" binding:"required"`
}

func (h *QueueHandler) CallNext(c *gin.Context) {
	var input CallNextInput
	if err := c.ShouldBindJSON(&input); err != nil {
		// Fallback check query param
		boothID := c.Query("booth_id")
		if boothID == "" {
			ErrorResponse(c, http.StatusBadRequest, "booth_id is required", nil)
			return
		}
		input.BoothID = boothID
	}

	next, err := h.queueService.CallNextInQueue(c.Request.Context(), input.BoothID)
	if err != nil {
		InternalServerError(c, "Failed to call next customer", err)
		return
	}
	if next == nil {
		SuccessResponse(c, http.StatusOK, "No waiting customers in queue", nil)
		return
	}

	SuccessResponse(c, http.StatusOK, "Next customer called successfully", next)
}

func (h *QueueHandler) CancelQueue(c *gin.Context) {
	id := c.Param("id")
	if err := h.queueService.CancelQueue(c.Request.Context(), id); err != nil {
		InternalServerError(c, "Failed to cancel queue", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Queue item cancelled successfully", gin.H{"id": id, "status": models.QueueStatusCancelled})
}
