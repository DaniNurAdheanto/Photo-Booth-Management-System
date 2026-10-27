package services

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"photobooth-api/models"
	"photobooth-api/repositories"
)

type QueueService interface {
	GetAllQueues(ctx context.Context, boothID string, status string) ([]models.QueueItem, error)
	GetQueueByID(ctx context.Context, id string) (*models.QueueItem, error)
	GetQueueByNumber(ctx context.Context, qNum string) (*models.QueueItem, error)
	EnqueueCustomer(ctx context.Context, input models.CreateQueueInput) (*models.QueueItem, error)
	UpdateQueueStatus(ctx context.Context, id string, status models.QueueStatus) error
	CallNextInQueue(ctx context.Context, boothID string) (*models.QueueItem, error)
	CancelQueue(ctx context.Context, id string) error
}

type queueService struct {
	queueRepo    repositories.QueueRepository
	customerRepo repositories.CustomerRepository
}

func NewQueueService(queueRepo repositories.QueueRepository, customerRepo repositories.CustomerRepository) QueueService {
	return &queueService{
		queueRepo:    queueRepo,
		customerRepo: customerRepo,
	}
}

func (s *queueService) GetAllQueues(ctx context.Context, boothID string, status string) ([]models.QueueItem, error) {
	return s.queueRepo.FindAll(ctx, boothID, status)
}

func (s *queueService) GetQueueByID(ctx context.Context, id string) (*models.QueueItem, error) {
	if id == "" {
		return nil, errors.New("queue ID cannot be empty")
	}
	return s.queueRepo.FindByID(ctx, id)
}

func (s *queueService) GetQueueByNumber(ctx context.Context, qNum string) (*models.QueueItem, error) {
	qNum = strings.TrimSpace(qNum)
	if qNum == "" {
		return nil, errors.New("queue number cannot be empty")
	}
	return s.queueRepo.FindByQueueNumber(ctx, qNum)
}

func (s *queueService) EnqueueCustomer(ctx context.Context, input models.CreateQueueInput) (*models.QueueItem, error) {
	input.CustomerName = strings.TrimSpace(input.CustomerName)
	input.CustomerEmail = strings.TrimSpace(input.CustomerEmail)
	input.CustomerPhone = strings.TrimSpace(input.CustomerPhone)
	input.BoothID = strings.TrimSpace(input.BoothID)

	if input.BoothID == "" {
		return nil, errors.New("booth ID is required")
	}
	if input.CustomerName == "" {
		return nil, errors.New("customer name is required")
	}
	if input.CustomerPhone == "" && input.CustomerEmail == "" {
		return nil, errors.New("customer phone or email is required")
	}

	// 1. Create Queue Item
	queueItem, err := s.queueRepo.Create(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("failed to enqueue customer: %w", err)
	}

	// 2. Synchronize or record customer in CRM (Walk-in customer directory)
	if s.customerRepo != nil {
		_, _ = s.customerRepo.RecordVisit(
			ctx,
			input.CustomerPhone,
			input.CustomerEmail,
			input.CustomerName,
			input.BoothID,
			input.TemplateID,
			50000.0, // standard default package estimation
		)
	}

	return queueItem, nil
}

func (s *queueService) UpdateQueueStatus(ctx context.Context, id string, status models.QueueStatus) error {
	if id == "" {
		return errors.New("queue ID cannot be empty")
	}
	return s.queueRepo.UpdateStatus(ctx, id, status)
}

func (s *queueService) CallNextInQueue(ctx context.Context, boothID string) (*models.QueueItem, error) {
	if boothID == "" {
		return nil, errors.New("booth ID is required")
	}

	next, err := s.queueRepo.GetNextWaiting(ctx, boothID)
	if err != nil {
		return nil, fmt.Errorf("failed to find next queue: %w", err)
	}
	if next == nil {
		return nil, nil
	}

	if err := s.queueRepo.UpdateStatus(ctx, next.ID, models.QueueStatusCalled); err != nil {
		return nil, fmt.Errorf("failed to update queue status to CALLED: %w", err)
	}

	next.Status = models.QueueStatusCalled
	return next, nil
}

func (s *queueService) CancelQueue(ctx context.Context, id string) error {
	if id == "" {
		return errors.New("queue ID cannot be empty")
	}
	return s.queueRepo.UpdateStatus(ctx, id, models.QueueStatusCancelled)
}
