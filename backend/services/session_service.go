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
	GetSessions(ctx context.Context, boothID string, status string) ([]models.PhotoSession, error)
	GetSessionByID(ctx context.Context, id string) (*models.PhotoSession, error)
	GetActiveSession(ctx context.Context, boothID string) (*models.PhotoSession, error)
	StartSession(ctx context.Context, input models.StartSessionInput) (*models.PhotoSession, error)
	CapturePhoto(ctx context.Context, id string, input models.CapturePhotoInput) (*models.PhotoSession, error)
	RetakePhoto(ctx context.Context, id string, input models.RetakePhotoInput) (*models.PhotoSession, error)
	ConfirmSession(ctx context.Context, id string, input models.ConfirmSessionInput) (*models.PhotoSession, error)
	CancelSession(ctx context.Context, id string, notes string) (*models.PhotoSession, error)
	DeleteSession(ctx context.Context, id string) error
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

func (s *sessionService) GetSessions(ctx context.Context, boothID string, status string) ([]models.PhotoSession, error) {
	return s.sessionRepo.FindAll(ctx, boothID, status)
}

func (s *sessionService) GetSessionByID(ctx context.Context, id string) (*models.PhotoSession, error) {
	return s.sessionRepo.FindByID(ctx, id)
}

func (s *sessionService) GetActiveSession(ctx context.Context, boothID string) (*models.PhotoSession, error) {
	return s.sessionRepo.FindActiveByBoothID(ctx, boothID)
}

func (s *sessionService) StartSession(ctx context.Context, input models.StartSessionInput) (*models.PhotoSession, error) {
	now := time.Now().UTC()
	datePrefix := now.Format("20060102")
	randomSuffix := uuid.New().String()[:4]
	sessionCode := fmt.Sprintf("SES-%s-%s", datePrefix, randomSuffix)

	totalPhotos := input.TotalPhotos
	if totalPhotos <= 0 {
		totalPhotos = 4
	}

	countdown := input.CountdownSeconds
	if countdown <= 0 {
		countdown = 5
	}

	printCopies := input.PrintCopies
	if printCopies <= 0 {
		printCopies = 2
	}

	session := &models.PhotoSession{
		BaseModel: models.BaseModel{
			ID:        fmt.Sprintf("ses-%s", uuid.New().String()[:8]),
			CreatedAt: now,
			UpdatedAt: now,
		},
		BoothID:          input.BoothID,
		SessionCode:      sessionCode,
		CustomerName:     input.CustomerName,
		CustomerEmail:    input.CustomerEmail,
		Status:           models.SessionStatusCountdown,
		TotalPhotos:      totalPhotos,
		PrintCopies:      printCopies,
		TemplateID:       input.TemplateID,
		CountdownSeconds: countdown,
		RetakeCount:      0,
		FilterPreset:     "ORIGINAL",
		CapturedPhotos:   "[]",
		StartedAt:        &now,
	}

	if err := s.sessionRepo.Create(ctx, session); err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	// Update booth status to IN_SESSION
	_ = s.boothRepo.UpdateStatus(ctx, input.BoothID, models.BoothStatusInSession)

	return session, nil
}

func (s *sessionService) CapturePhoto(ctx context.Context, id string, input models.CapturePhotoInput) (*models.PhotoSession, error) {
	return s.sessionRepo.SaveCapturedPhoto(ctx, id, input.SlotIndex, input.PhotoURL)
}

func (s *sessionService) RetakePhoto(ctx context.Context, id string, input models.RetakePhotoInput) (*models.PhotoSession, error) {
	return s.sessionRepo.Retake(ctx, id, input.SlotIndex, input.RetakeAll)
}

func (s *sessionService) ConfirmSession(ctx context.Context, id string, input models.ConfirmSessionInput) (*models.PhotoSession, error) {
	return s.sessionRepo.ConfirmAndComplete(ctx, id, input)
}

func (s *sessionService) CancelSession(ctx context.Context, id string, notes string) (*models.PhotoSession, error) {
	session, err := s.sessionRepo.FindByID(ctx, id)
	if err != nil || session == nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	now := time.Now().UTC()
	session.Status = models.SessionStatusCancelled
	session.Notes = notes
	session.EndedAt = &now

	if err := s.sessionRepo.Update(ctx, session); err != nil {
		return nil, err
	}

	// Restore booth status to ONLINE
	_ = s.boothRepo.UpdateStatus(ctx, session.BoothID, models.BoothStatusOnline)

	return session, nil
}

func (s *sessionService) DeleteSession(ctx context.Context, id string) error {
	return s.sessionRepo.Delete(ctx, id)
}
