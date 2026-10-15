package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
	Error   any    `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, statusCode int, message string, data any) {
	c.JSON(statusCode, APIResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, statusCode int, message string, err any) {
	c.JSON(statusCode, APIResponse{
		Success: false,
		Message: message,
		Error:   err,
	})
}

func InternalServerError(c *gin.Context, message string, err error) {
	var errDetails any
	if err != nil {
		errDetails = err.Error()
	}
	c.JSON(http.StatusInternalServerError, APIResponse{
		Success: false,
		Message: message,
		Error:   errDetails,
	})
}
