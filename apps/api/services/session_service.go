package services

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"photobooth-api/models"
	"photobooth-api/repositories"
)

type SessionService interface {
	GetSessions(ctx context.Context, boothID string) ([]models.PhotoSession, error)
	GetSessionByID(ctx context.Context, id string) (*models.PhotoSession, error)
	StartSession(ctx context.Context, boothID, customerName, customerEmail, templateID string) (*models.PhotoSession, error)
}

type sessionService struct {
	sessionRepo repositories.SessionRepository
	boothRepo   repositories.BoothRepository
}

func NewSessionService(sessionRepo repositories.SessionRepository, boothRepo repositories.BoothRepository) SessionService {
	return &sessionService{
		sessionRepo: sessionRepo,
		boothRepo:   boothRepo,
	}
}

func (s *sessionService) GetSessions(ctx context.Context, boothID string) ([]models.PhotoSession, error) {
	return s.sessionRepo.FindAll(ctx, boothID)
}

func (s *sessionService) GetSessionByID(ctx context.Context, id string) (*models.PhotoSession, error) {
	return s.sessionRepo.FindByID(ctx, id)
}

func (s *sessionService) StartSession(ctx context.Context, boothID, customerName, customerEmail, templateID string) (*models.PhotoSession, error) {
	now := time.Now().UTC()
	sessionCode := fmt.Sprintf("PB-%s-%d", boothID[:4], now.Unix()%10000)

	session := &models.PhotoSession{
		BaseModel: models.BaseModel{
			ID:        uuid.New().String(),
			CreatedAt: now,
			UpdatedAt: now,
		},
		BoothID:       boothID,
		SessionCode:   sessionCode,
		CustomerName:  customerName,
		CustomerEmail: customerEmail,
		Status:        models.SessionStatusCounting,
		TotalPhotos:   4,
		PrintCopies:   2,
		TemplateID:    templateID,
		StartedAt:     &now,
	}

	if err := s.sessionRepo.Create(ctx, session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	// Update booth status to IN_SESSION
	_ = s.boothRepo.UpdateStatus(ctx, boothID, models.BoothStatusInSession)

	return session, nil
}
