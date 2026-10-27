package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"photobooth-api/models"
)

type QueueRepository interface {
	FindAll(ctx context.Context, boothID string, status string) ([]models.QueueItem, error)
	FindByID(ctx context.Context, id string) (*models.QueueItem, error)
	FindByQueueNumber(ctx context.Context, qNum string) (*models.QueueItem, error)
	Create(ctx context.Context, input models.CreateQueueInput) (*models.QueueItem, error)
	UpdateStatus(ctx context.Context, id string, status models.QueueStatus) error
	GetNextWaiting(ctx context.Context, boothID string) (*models.QueueItem, error)
	Delete(ctx context.Context, id string) error
}

type queueRepository struct {
	db *sql.DB
}

func NewQueueRepository(db *sql.DB) QueueRepository {
	return &queueRepository{db: db}
}

func scanQueue(row interface {
	Scan(dest ...interface{}) error
}) (*models.QueueItem, error) {
	var q models.QueueItem
	var tmplID sql.NullString

	err := row.Scan(
		&q.ID, &q.QueueNumber, &q.BoothID, &q.CustomerName, &q.CustomerEmail, &q.CustomerPhone,
		&tmplID, &q.Status, &q.EstimatedWaitMinutes, &q.EmailReminderSent,
		&q.CreatedAt, &q.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	q.TemplateID = tmplID.String
	return &q, nil
}

func (r *queueRepository) FindAll(ctx context.Context, boothID string, status string) ([]models.QueueItem, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, queue_number, booth_id, customer_name, customer_email, customer_phone,
			template_id, status, estimated_wait_minutes, email_reminder_sent,
			created_at, updated_at
		FROM queues
		WHERE ($1 = '' OR booth_id = $1)
		  AND ($2 = '' OR status = $2)
		ORDER BY 
			CASE 
				WHEN status = 'IN_BOOTH' THEN 1
				WHEN status = 'CALLED' THEN 2
				WHEN status = 'WAITING' THEN 3
				ELSE 4
			END,
			created_at ASC
	`

	rows, err := r.db.QueryContext(ctx, query, boothID, status)
	if err != nil {
		return nil, fmt.Errorf("failed to query queues: %w", err)
	}
	defer rows.Close()

	var items []models.QueueItem
	for rows.Next() {
		q, err := scanQueue(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan queue: %w", err)
		}
		items = append(items, *q)
	}

	if items == nil {
		items = []models.QueueItem{}
	}

	return items, nil
}

func (r *queueRepository) FindByID(ctx context.Context, id string) (*models.QueueItem, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, queue_number, booth_id, customer_name, customer_email, customer_phone,
			template_id, status, estimated_wait_minutes, email_reminder_sent,
			created_at, updated_at
		FROM queues
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	q, err := scanQueue(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return q, nil
}

func (r *queueRepository) FindByQueueNumber(ctx context.Context, qNum string) (*models.QueueItem, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, queue_number, booth_id, customer_name, customer_email, customer_phone,
			template_id, status, estimated_wait_minutes, email_reminder_sent,
			created_at, updated_at
		FROM queues
		WHERE queue_number = $1
		ORDER BY created_at DESC
		LIMIT 1
	`
	row := r.db.QueryRowContext(ctx, query, qNum)
	q, err := scanQueue(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return q, nil
}

func (r *queueRepository) Create(ctx context.Context, input models.CreateQueueInput) (*models.QueueItem, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	// Count existing queue for today to generate next number
	var count int
	_ = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM queues WHERE created_at >= CURRENT_DATE`).Scan(&count)
	queueNum := fmt.Sprintf("Q-%03d", count+1)

	id := "queue-" + uuid.New().String()[:8]
	now := time.Now()

	// Estimated wait: waiting count * 10 mins
	var waitingCount int
	_ = r.db.QueryRowContext(ctx, `SELECT COUNT(*) FROM queues WHERE booth_id = $1 AND status = 'WAITING'`, input.BoothID).Scan(&waitingCount)
	waitMins := waitingCount * 10
	if waitMins < 5 {
		waitMins = 5
	}

	query := `
		INSERT INTO queues (
			id, queue_number, booth_id, customer_name, customer_email, customer_phone,
			template_id, status, estimated_wait_minutes, email_reminder_sent,
			created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, false, $10, $10
		)
		RETURNING id, queue_number, booth_id, customer_name, customer_email, customer_phone,
		          template_id, status, estimated_wait_minutes, email_reminder_sent,
		          created_at, updated_at
	`

	row := r.db.QueryRowContext(ctx, query,
		id, queueNum, input.BoothID, input.CustomerName, input.CustomerEmail, input.CustomerPhone,
		input.TemplateID, models.QueueStatusWaiting, waitMins, now,
	)

	return scanQueue(row)
}

func (r *queueRepository) UpdateStatus(ctx context.Context, id string, status models.QueueStatus) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	_, err := r.db.ExecContext(ctx, `UPDATE queues SET status = $1, updated_at = NOW() WHERE id = $2`, status, id)
	return err
}

func (r *queueRepository) GetNextWaiting(ctx context.Context, boothID string) (*models.QueueItem, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, queue_number, booth_id, customer_name, customer_email, customer_phone,
			template_id, status, estimated_wait_minutes, email_reminder_sent,
			created_at, updated_at
		FROM queues
		WHERE booth_id = $1 AND status = 'WAITING'
		ORDER BY created_at ASC
		LIMIT 1
	`
	row := r.db.QueryRowContext(ctx, query, boothID)
	q, err := scanQueue(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return q, nil
}

func (r *queueRepository) Delete(ctx context.Context, id string) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	_, err := r.db.ExecContext(ctx, `DELETE FROM queues WHERE id = $1`, id)
	return err
}
