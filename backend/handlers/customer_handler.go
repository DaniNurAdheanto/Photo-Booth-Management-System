package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"photobooth-api/models"
	"photobooth-api/services"
)

type CustomerHandler struct {
	customerService services.CustomerService
}

func NewCustomerHandler(customerService services.CustomerService) *CustomerHandler {
	return &CustomerHandler{customerService: customerService}
}

func (h *CustomerHandler) ListCustomers(c *gin.Context) {
	search := c.Query("search")
	limitStr := c.DefaultQuery("limit", "20")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 20
	}
	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	result, err := h.customerService.GetAllCustomers(c.Request.Context(), search, limit, offset)
	if err != nil {
		InternalServerError(c, "Failed to retrieve customers", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Customers retrieved successfully", result)
}

func (h *CustomerHandler) GetCustomer(c *gin.Context) {
	id := c.Param("id")
	customer, err := h.customerService.GetCustomerByID(c.Request.Context(), id)
	if err != nil {
		InternalServerError(c, "Failed to retrieve customer", err)
		return
	}
	if customer == nil {
		ErrorResponse(c, http.StatusNotFound, "Customer not found", nil)
		return
	}

	SuccessResponse(c, http.StatusOK, "Customer found", customer)
}

func (h *CustomerHandler) CreateCustomer(c *gin.Context) {
	var input models.CreateCustomerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		ErrorResponse(c, http.StatusBadRequest, "Invalid input data", err.Error())
		return
	}

	customer, err := h.customerService.CreateCustomer(c.Request.Context(), input)
	if err != nil {
		InternalServerError(c, "Failed to create customer", err)
		return
	}

	SuccessResponse(c, http.StatusCreated, "Customer created successfully", customer)
}

func (h *CustomerHandler) DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	if err := h.customerService.DeleteCustomer(c.Request.Context(), id); err != nil {
		InternalServerError(c, "Failed to delete customer", err)
		return
	}

	SuccessResponse(c, http.StatusOK, "Customer deleted successfully", nil)
}
