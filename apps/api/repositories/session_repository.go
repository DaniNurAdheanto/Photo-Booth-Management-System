package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"photobooth-api/models"
)

type SessionRepository interface {
	FindAll(ctx context.Context, boothID string) ([]models.PhotoSession, error)
	FindByID(ctx context.Context, id string) (*models.PhotoSession, error)
	Create(ctx context.Context, session *models.PhotoSession) error
}

type sessionRepository struct {
	db *sql.DB
}

func NewSessionRepository(db *sql.DB) SessionRepository {
	return &sessionRepository{db: db}
}

func (r *sessionRepository) FindAll(ctx context.Context, boothID string) ([]models.PhotoSession, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT id, booth_id, session_code, customer_name, customer_email, status, total_photos, print_copies, template_id, started_at, ended_at, created_at, updated_at
		FROM photo_sessions
		WHERE ($1 = '' OR booth_id = $1)
		ORDER BY created_at DESC
		LIMIT 50
	`

	rows, err := r.db.QueryContext(ctx, query, boothID)
	if err != nil {
		return nil, fmt.Errorf("failed to query photo sessions: %w", err)
	}
	defer rows.Close()

	var sessions []models.PhotoSession
	for rows.Next() {
		var s models.PhotoSession
		var cName, cEmail, tID sql.NullString
		err := rows.Scan(
			&s.ID, &s.BoothID, &s.SessionCode, &cName, &cEmail, &s.Status,
			&s.TotalPhotos, &s.PrintCopies, &tID, &s.StartedAt, &s.EndedAt,
			&s.CreatedAt, &s.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan session: %w", err)
		}
		s.CustomerName = cName.String
		s.CustomerEmail = cEmail.String
		s.TemplateID = tID.String
		sessions = append(sessions, s)
	}

	return sessions, nil
}

func (r *sessionRepository) FindByID(ctx context.Context, id string) (*models.PhotoSession, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT id, booth_id, session_code, customer_name, customer_email, status, total_photos, print_copies, template_id, started_at, ended_at, created_at, updated_at
		FROM photo_sessions
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)

	var s models.PhotoSession
	var cName, cEmail, tID sql.NullString
	err := row.Scan(
		&s.ID, &s.BoothID, &s.SessionCode, &cName, &cEmail, &s.Status,
		&s.TotalPhotos, &s.PrintCopies, &tID, &s.StartedAt, &s.EndedAt,
		&s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	s.CustomerName = cName.String
	s.CustomerEmail = cEmail.String
	s.TemplateID = tID.String

	return &s, nil
}

func (r *sessionRepository) Create(ctx context.Context, session *models.PhotoSession) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `
		INSERT INTO photo_sessions (id, booth_id, session_code, customer_name, customer_email, status, total_photos, print_copies, template_id, started_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`
	_, err := r.db.ExecContext(ctx, query,
		session.ID, session.BoothID, session.SessionCode, session.CustomerName, session.CustomerEmail,
		session.Status, session.TotalPhotos, session.PrintCopies, session.TemplateID, session.StartedAt,
		session.CreatedAt, session.UpdatedAt,
	)
	return err
}
