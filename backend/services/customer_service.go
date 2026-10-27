package services

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"photobooth-api/models"
	"photobooth-api/repositories"
)

type CustomerListResult struct {
	Items  []models.Customer `json:"items"`
	Total  int               `json:"total"`
	Limit  int               `json:"limit"`
	Offset int               `json:"offset"`
}

type CustomerService interface {
	GetAllCustomers(ctx context.Context, search string, limit, offset int) (*CustomerListResult, error)
	GetCustomerByID(ctx context.Context, id string) (*models.Customer, error)
	GetCustomerByPhoneOrEmail(ctx context.Context, phone, email string) (*models.Customer, error)
	CreateCustomer(ctx context.Context, input models.CreateCustomerInput) (*models.Customer, error)
	RecordCustomerVisit(ctx context.Context, phone, email, name, boothID, templateID string, spent float64) (*models.Customer, error)
	DeleteCustomer(ctx context.Context, id string) error
}

type customerService struct {
	repo repositories.CustomerRepository
}

func NewCustomerService(repo repositories.CustomerRepository) CustomerService {
	return &customerService{repo: repo}
}

func (s *customerService) GetAllCustomers(ctx context.Context, search string, limit, offset int) (*CustomerListResult, error) {
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}
	if offset < 0 {
		offset = 0
	}

	search = strings.TrimSpace(search)
	items, total, err := s.repo.FindAll(ctx, search, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve customers: %w", err)
	}

	return &CustomerListResult{
		Items:  items,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}, nil
}

func (s *customerService) GetCustomerByID(ctx context.Context, id string) (*models.Customer, error) {
	if id == "" {
		return nil, errors.New("customer ID cannot be empty")
	}
	return s.repo.FindByID(ctx, id)
}

func (s *customerService) GetCustomerByPhoneOrEmail(ctx context.Context, phone, email string) (*models.Customer, error) {
	phone = strings.TrimSpace(phone)
	email = strings.TrimSpace(email)
	if phone == "" && email == "" {
		return nil, errors.New("phone or email must be provided")
	}
	return s.repo.FindByPhoneOrEmail(ctx, phone, email)
}

func (s *customerService) CreateCustomer(ctx context.Context, input models.CreateCustomerInput) (*models.Customer, error) {
	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Phone = strings.TrimSpace(input.Phone)

	if input.Phone == "" && input.Email == "" {
		return nil, errors.New("phone or email is required")
	}
	if input.Name == "" {
		return nil, errors.New("customer name is required")
	}

	return s.repo.Create(ctx, input)
}

func (s *customerService) RecordCustomerVisit(ctx context.Context, phone, email, name, boothID, templateID string, spent float64) (*models.Customer, error) {
	phone = strings.TrimSpace(phone)
	email = strings.TrimSpace(email)
	name = strings.TrimSpace(name)

	if phone == "" && email == "" {
		return nil, errors.New("phone or email must be provided to record visit")
	}

	return s.repo.RecordVisit(ctx, phone, email, name, boothID, templateID, spent)
}

func (s *customerService) DeleteCustomer(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("customer ID cannot be empty")
	}
	return s.repo.Delete(ctx, id)
}
