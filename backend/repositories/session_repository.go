package repositories

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"photobooth-api/models"
)

type SessionRepository interface {
	FindAll(ctx context.Context, boothID string, status string) ([]models.PhotoSession, error)
	FindByID(ctx context.Context, id string) (*models.PhotoSession, error)
	FindActiveByBoothID(ctx context.Context, boothID string) (*models.PhotoSession, error)
	Create(ctx context.Context, session *models.PhotoSession) error
	Update(ctx context.Context, session *models.PhotoSession) error
	UpdateStatus(ctx context.Context, id string, status models.SessionStatus) error
	SaveCapturedPhoto(ctx context.Context, id string, slot int, photoURL string) (*models.PhotoSession, error)
	Retake(ctx context.Context, id string, slotIndex int, retakeAll bool) (*models.PhotoSession, error)
	ConfirmAndComplete(ctx context.Context, id string, input models.ConfirmSessionInput) (*models.PhotoSession, error)
	Delete(ctx context.Context, id string) error
}

type sessionRepository struct {
	db *sql.DB
}

func NewSessionRepository(db *sql.DB) SessionRepository {
	return &sessionRepository{db: db}
}

func scanSession(row interface {
	Scan(dest ...interface{}) error
}) (*models.PhotoSession, error) {
	var s models.PhotoSession
	var cName, cEmail, cPhone, qNumber, tID, fComp, qrCode, notes, idemp sql.NullString
	var startedAt, endedAt sql.NullTime

	err := row.Scan(
		&s.ID, &s.BoothID, &s.SessionCode, &cName, &cEmail, &cPhone, &qNumber, &s.Status,
		&s.TotalPhotos, &s.PrintCopies, &tID, &s.CountdownSeconds, &s.RetakeCount,
		&s.FilterPreset, &idemp, &s.CapturedPhotos, &fComp, &qrCode, &notes,
		&startedAt, &endedAt, &s.CreatedAt, &s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	s.CustomerName = cName.String
	s.CustomerEmail = cEmail.String
	s.CustomerPhone = cPhone.String
	s.QueueNumber = qNumber.String
	s.TemplateID = tID.String
	s.FinalCompositeURL = fComp.String
	s.QRCodeURL = qrCode.String
	s.Notes = notes.String
	s.IdempotencyKey = idemp.String

	if startedAt.Valid {
		s.StartedAt = &startedAt.Time
	}
	if endedAt.Valid {
		s.EndedAt = &endedAt.Time
	}

	if s.CapturedPhotos == "" {
		s.CapturedPhotos = "[]"
	}

	return &s, nil
}

func (r *sessionRepository) FindAll(ctx context.Context, boothID string, status string) ([]models.PhotoSession, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, booth_id, session_code, customer_name, customer_email, customer_phone, queue_number, status,
			total_photos, print_copies, template_id, countdown_seconds, retake_count,
			filter_preset, idempotency_key, captured_photos, final_composite_url, qr_code_url, notes,
			started_at, ended_at, created_at, updated_at
		FROM photo_sessions
		WHERE ($1 = '' OR booth_id = $1)
		  AND ($2 = '' OR status = $2)
		ORDER BY created_at DESC
		LIMIT 100
	`

	rows, err := r.db.QueryContext(ctx, query, boothID, status)
	if err != nil {
		return nil, fmt.Errorf("failed to query photo sessions: %w", err)
	}
	defer rows.Close()

	var sessions []models.PhotoSession
	for rows.Next() {
		s, err := scanSession(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan session: %w", err)
		}
		sessions = append(sessions, *s)
	}

	return sessions, nil
}

func (r *sessionRepository) FindByID(ctx context.Context, id string) (*models.PhotoSession, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, booth_id, session_code, customer_name, customer_email, customer_phone, queue_number, status,
			total_photos, print_copies, template_id, countdown_seconds, retake_count,
			filter_preset, idempotency_key, captured_photos, final_composite_url, qr_code_url, notes,
			started_at, ended_at, created_at, updated_at
		FROM photo_sessions
		WHERE id = $1 OR session_code = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	s, err := scanSession(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return s, nil
}

func (r *sessionRepository) FindActiveByBoothID(ctx context.Context, boothID string) (*models.PhotoSession, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, booth_id, session_code, customer_name, customer_email, customer_phone, queue_number, status,
			total_photos, print_copies, template_id, countdown_seconds, retake_count,
			filter_preset, idempotency_key, captured_photos, final_composite_url, qr_code_url, notes,
			started_at, ended_at, created_at, updated_at
		FROM photo_sessions
		WHERE booth_id = $1 AND status IN ('PENDING', 'COUNTDOWN', 'CAPTURING', 'REVIEWING', 'PROCESSING')
		ORDER BY created_at DESC
		LIMIT 1
	`
	row := r.db.QueryRowContext(ctx, query, boothID)
	s, err := scanSession(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return s, nil
}

func (r *sessionRepository) Create(ctx context.Context, session *models.PhotoSession) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	if session.CapturedPhotos == "" {
		session.CapturedPhotos = "[]"
	}
	if session.FilterPreset == "" {
		session.FilterPreset = "ORIGINAL"
	}

	query := `
		INSERT INTO photo_sessions (
			id, booth_id, session_code, customer_name, customer_email, customer_phone, queue_number, status,
			total_photos, print_copies, template_id, countdown_seconds, retake_count,
			filter_preset, idempotency_key, captured_photos, final_composite_url, qr_code_url, notes,
			started_at, ended_at, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
		)
	`
	_, err := r.db.ExecContext(ctx, query,
		session.ID, session.BoothID, session.SessionCode, session.CustomerName, session.CustomerEmail,
		session.CustomerPhone, session.QueueNumber,
		session.Status, session.TotalPhotos, session.PrintCopies, session.TemplateID, session.CountdownSeconds,
		session.RetakeCount, session.FilterPreset, session.IdempotencyKey, session.CapturedPhotos,
		session.FinalCompositeURL, session.QRCodeURL, session.Notes, session.StartedAt, session.EndedAt,
		session.CreatedAt, session.UpdatedAt,
	)
	return err
}

func (r *sessionRepository) Update(ctx context.Context, session *models.PhotoSession) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `
		UPDATE photo_sessions SET
			status = $1, total_photos = $2, print_copies = $3, template_id = $4,
			countdown_seconds = $5, retake_count = $6, filter_preset = $7,
			captured_photos = $8, final_composite_url = $9, qr_code_url = $10,
			notes = $11, ended_at = $12, customer_phone = $13, queue_number = $14, updated_at = NOW()
		WHERE id = $15
	`
	_, err := r.db.ExecContext(ctx, query,
		session.Status, session.TotalPhotos, session.PrintCopies, session.TemplateID,
		session.CountdownSeconds, session.RetakeCount, session.FilterPreset,
		session.CapturedPhotos, session.FinalCompositeURL, session.QRCodeURL,
		session.Notes, session.EndedAt, session.CustomerPhone, session.QueueNumber, session.ID,
	)
	return err
}

func (r *sessionRepository) UpdateStatus(ctx context.Context, id string, status models.SessionStatus) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `UPDATE photo_sessions SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, status, id)
	return err
}

func (r *sessionRepository) SaveCapturedPhoto(ctx context.Context, id string, slot int, photoURL string) (*models.PhotoSession, error) {
	session, err := r.FindByID(ctx, id)
	if err != nil || session == nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	var photos []models.CapturedPhotoItem
	if session.CapturedPhotos != "" && session.CapturedPhotos != "[]" {
		_ = json.Unmarshal([]byte(session.CapturedPhotos), &photos)
	}

	// Update existing slot or append
	found := false
	for i := range photos {
		if photos[i].Slot == slot {
			photos[i].URL = photoURL
			photos[i].Timestamp = time.Now().UTC()
			found = true
			break
		}
	}
	if !found {
		photos = append(photos, models.CapturedPhotoItem{
			Slot:      slot,
			URL:       photoURL,
			Timestamp: time.Now().UTC(),
		})
	}

	updatedBytes, _ := json.Marshal(photos)
	session.CapturedPhotos = string(updatedBytes)

	// If all photos captured, advance status to REVIEWING
	if len(photos) >= session.TotalPhotos {
		session.Status = models.SessionStatusReviewing
	} else {
		session.Status = models.SessionStatusCapturing
	}

	query := `UPDATE photo_sessions SET captured_photos = $1, status = $2, updated_at = NOW() WHERE id = $3`
	_, err = r.db.ExecContext(ctx, query, session.CapturedPhotos, session.Status, id)
	if err != nil {
		return nil, fmt.Errorf("failed to save captured photo: %w", err)
	}

	return session, nil
}

func (r *sessionRepository) Retake(ctx context.Context, id string, slotIndex int, retakeAll bool) (*models.PhotoSession, error) {
	session, err := r.FindByID(ctx, id)
	if err != nil || session == nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	var photos []models.CapturedPhotoItem
	if session.CapturedPhotos != "" && session.CapturedPhotos != "[]" {
		_ = json.Unmarshal([]byte(session.CapturedPhotos), &photos)
	}

	session.RetakeCount++

	if retakeAll || slotIndex < 0 {
		session.CapturedPhotos = "[]"
		session.Status = models.SessionStatusCountdown
	} else {
		var newPhotos []models.CapturedPhotoItem
		for _, p := range photos {
			if p.Slot != slotIndex {
				newPhotos = append(newPhotos, p)
			}
		}
		updatedBytes, _ := json.Marshal(newPhotos)
		session.CapturedPhotos = string(updatedBytes)
		session.Status = models.SessionStatusCapturing
	}

	query := `
		UPDATE photo_sessions 
		SET captured_photos = $1, status = $2, retake_count = $3, updated_at = NOW() 
		WHERE id = $4
	`
	_, err = r.db.ExecContext(ctx, query, session.CapturedPhotos, session.Status, session.RetakeCount, id)
	if err != nil {
		return nil, fmt.Errorf("failed to update retake state: %w", err)
	}

	return session, nil
}

func (r *sessionRepository) ConfirmAndComplete(ctx context.Context, id string, input models.ConfirmSessionInput) (*models.PhotoSession, error) {
	session, err := r.FindByID(ctx, id)
	if err != nil || session == nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	// Idempotency check: if already completed with this idempotency key, return existing without re-printing
	if session.Status == models.SessionStatusCompleted && session.IdempotencyKey == input.IdempotencyKey {
		return session, nil
	}

	now := time.Now().UTC()
	session.Status = models.SessionStatusCompleted
	session.IdempotencyKey = input.IdempotencyKey
	session.EndedAt = &now

	if input.PrintCopies > 0 {
		session.PrintCopies = input.PrintCopies
	}
	if input.FinalCompositeURL != "" {
		session.FinalCompositeURL = input.FinalCompositeURL
	}
	if input.QRCodeURL != "" {
		session.QRCodeURL = input.QRCodeURL
	}
	if input.FilterPreset != "" {
		session.FilterPreset = input.FilterPreset
	}

	query := `
		UPDATE photo_sessions SET
			status = $1, idempotency_key = $2, print_copies = $3,
			final_composite_url = $4, qr_code_url = $5, filter_preset = $6,
			ended_at = $7, updated_at = NOW()
		WHERE id = $8
	`
	_, err = r.db.ExecContext(ctx, query,
		session.Status, session.IdempotencyKey, session.PrintCopies,
		session.FinalCompositeURL, session.QRCodeURL, session.FilterPreset,
		session.EndedAt, id,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to confirm session: %w", err)
	}

	// Update booth status back to ONLINE and decrease paper count
	if input.PrintCopies > 0 {
		paperQuery := `UPDATE booths SET paper_count = GREATEST(0, paper_count - $1), status = 'ONLINE', updated_at = NOW() WHERE id = $2`
		_, _ = r.db.ExecContext(ctx, paperQuery, input.PrintCopies, session.BoothID)
	}

	return session, nil
}

func (r *sessionRepository) Delete(ctx context.Context, id string) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `DELETE FROM photo_sessions WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
