package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"photobooth-api/models"
)

type BoothRepository interface {
	FindAll(ctx context.Context) ([]models.Booth, error)
	FindByID(ctx context.Context, id string) (*models.Booth, error)
	Create(ctx context.Context, booth *models.Booth) error
	UpdateStatus(ctx context.Context, id string, status models.BoothStatus) error
}

type boothRepository struct {
	db *sql.DB
}

func NewBoothRepository(db *sql.DB) BoothRepository {
	return &boothRepository{db: db}
}

func (r *boothRepository) FindAll(ctx context.Context) ([]models.Booth, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT id, code, name, location, status, ip_address, paper_count, max_paper_capacity, camera_model, notes, created_at, updated_at
		FROM booths
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query booths: %w", err)
	}
	defer rows.Close()

	var booths []models.Booth
	for rows.Next() {
		var b models.Booth
		var ip, cam, notes sql.NullString
		err := rows.Scan(
			&b.ID, &b.Code, &b.Name, &b.Location, &b.Status,
			&ip, &b.PaperCount, &b.MaxPaperCap, &cam, &notes,
			&b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan booth: %w", err)
		}
		b.IPAddress = ip.String
		b.CameraModel = cam.String
		b.Notes = notes.String
		booths = append(booths, b)
	}

	return booths, nil
}

func (r *boothRepository) FindByID(ctx context.Context, id string) (*models.Booth, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT id, code, name, location, status, ip_address, paper_count, max_paper_capacity, camera_model, notes, created_at, updated_at
		FROM booths
		WHERE id = $1 AND deleted_at IS NULL
	`

	row := r.db.QueryRowContext(ctx, query, id)

	var b models.Booth
	var ip, cam, notes sql.NullString
	err := row.Scan(
		&b.ID, &b.Code, &b.Name, &b.Location, &b.Status,
		&ip, &b.PaperCount, &b.MaxPaperCap, &cam, &notes,
		&b.CreatedAt, &b.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get booth by id: %w", err)
	}
	b.IPAddress = ip.String
	b.CameraModel = cam.String
	b.Notes = notes.String

	return &b, nil
}

func (r *boothRepository) Create(ctx context.Context, booth *models.Booth) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `
		INSERT INTO booths (id, code, name, location, status, ip_address, paper_count, max_paper_capacity, camera_model, notes, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
	`

	now := time.Now().UTC()
	booth.CreatedAt = now
	booth.UpdatedAt = now

	_, err := r.db.ExecContext(ctx, query,
		booth.ID, booth.Code, booth.Name, booth.Location, booth.Status,
		booth.IPAddress, booth.PaperCount, booth.MaxPaperCap, booth.CameraModel, booth.Notes,
		booth.CreatedAt, booth.UpdatedAt,
	)
	return err
}

func (r *boothRepository) UpdateStatus(ctx context.Context, id string, status models.BoothStatus) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `UPDATE booths SET status = $1, updated_at = $2 WHERE id = $3 AND deleted_at IS NULL`
	_, err := r.db.ExecContext(ctx, query, status, time.Now().UTC(), id)
	return err
}
