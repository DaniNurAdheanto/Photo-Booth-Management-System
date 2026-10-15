package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"photobooth-api/models"
	"photobooth-api/repositories"
)

type BoothService interface {
	GetAllBooths(ctx context.Context) ([]models.Booth, error)
	GetBoothByID(ctx context.Context, id string) (*models.Booth, error)
	CreateBooth(ctx context.Context, input models.CreateBoothInput) (*models.Booth, error)
	UpdateBoothStatus(ctx context.Context, id string, status models.BoothStatus) error
}

type boothService struct {
	repo repositories.BoothRepository
}

func NewBoothService(repo repositories.BoothRepository) BoothService {
	return &boothService{repo: repo}
}

func (s *boothService) GetAllBooths(ctx context.Context) ([]models.Booth, error) {
	return s.repo.FindAll(ctx)
}

func (s *boothService) GetBoothByID(ctx context.Context, id string) (*models.Booth, error) {
	if id == "" {
		return nil, errors.New("booth ID cannot be empty")
	}
	return s.repo.FindByID(ctx, id)
}

func (s *boothService) CreateBooth(ctx context.Context, input models.CreateBoothInput) (*models.Booth, error) {
	if input.Code == "" || input.Name == "" {
		return nil, errors.New("booth code and name are required")
	}

	booth := &models.Booth{
		BaseModel: models.BaseModel{
			ID: uuid.New().String(),
		},
		Code:        input.Code,
		Name:        input.Name,
		Location:    input.Location,
		Status:      models.BoothStatusOffline,
		PaperCount:  input.PaperCount,
		MaxPaperCap: input.MaxPaperCap,
		CameraModel: input.CameraModel,
		Notes:       input.Notes,
	}

	if booth.MaxPaperCap <= 0 {
		booth.MaxPaperCap = 700 // standard photo roll
	}

	if err := s.repo.Create(ctx, booth); err != nil {
		return nil, fmt.Errorf("failed to create booth: %w", err)
	}

	return booth, nil
}

func (s *boothService) UpdateBoothStatus(ctx context.Context, id string, status models.BoothStatus) error {
	return s.repo.UpdateStatus(ctx, id, status)
}
