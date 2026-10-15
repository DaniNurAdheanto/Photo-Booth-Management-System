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

type TemplateRepository interface {
	FindAll(ctx context.Context, boothID string, category string, includeArchived bool) ([]models.Template, error)
	FindByID(ctx context.Context, id string) (*models.Template, error)
	Create(ctx context.Context, template *models.Template) error
	Update(ctx context.Context, template *models.Template) error
	Delete(ctx context.Context, id string) error
	ToggleActive(ctx context.Context, id string) (bool, error)
	ToggleArchive(ctx context.Context, id string) (bool, error)
	Duplicate(ctx context.Context, id string) (*models.Template, error)
}

type templateRepository struct {
	db *sql.DB
}

func NewTemplateRepository(db *sql.DB) TemplateRepository {
	return &templateRepository{db: db}
}

func scanTemplate(row interface {
	Scan(dest ...interface{}) error
}) (*models.Template, error) {
	var t models.Template
	var bgGrad, bgImg, overlayPNG, overlaySVG, desc, slotsCfg, textElem, logo, event, booth sql.NullString

	err := row.Scan(
		&t.ID, &t.Name, &t.Layout, &t.Category, &t.SlotsCount, &t.Width, &t.Height,
		&t.BackgroundColor, &bgGrad, &bgImg, &overlayPNG, &overlaySVG,
		&t.Orientation, &t.PrintSize, &t.AspectRatio, &t.Padding, &t.Gap, &t.BorderRadius,
		&slotsCfg, &textElem, &logo, &t.ShowDate, &event, &booth,
		&desc, &t.IsActive, &t.IsArchived, &t.Version, &t.CreatedAt, &t.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	t.BackgroundGradient = bgGrad.String
	t.BackgroundImageURL = bgImg.String
	t.OverlayPNGUrl = overlayPNG.String
	if overlaySVG.Valid {
		t.OverlaySVGUrl = &overlaySVG.String
	}
	t.SlotsConfig = slotsCfg.String
	t.TextElements = textElem.String
	t.LogoURL = logo.String
	t.EventName = event.String
	t.AssignedBoothID = booth.String
	t.Description = desc.String

	return &t, nil
}

func (r *templateRepository) FindAll(ctx context.Context, boothID string, category string, includeArchived bool) ([]models.Template, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, name, layout, category, slots_count, width, height,
			background_color, background_gradient, background_image_url, overlay_png_url, overlay_svg_url,
			orientation, print_size, aspect_ratio, padding, gap, border_radius,
			slots_config, text_elements, logo_url, show_date, event_name, assigned_booth_id,
			description, is_active, is_archived, version, created_at, updated_at
		FROM templates
		WHERE ($1 = '' OR assigned_booth_id = 'ALL' OR assigned_booth_id = $1)
		  AND ($2 = '' OR category = $2)
		  AND ($3 = true OR is_archived = false)
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query, boothID, category, includeArchived)
	if err != nil {
		return nil, fmt.Errorf("failed to query templates: %w", err)
	}
	defer rows.Close()

	var templates []models.Template
	for rows.Next() {
		t, err := scanTemplate(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan template: %w", err)
		}
		templates = append(templates, *t)
	}

	if templates == nil {
		templates = []models.Template{}
	}
	return templates, nil
}

func (r *templateRepository) FindByID(ctx context.Context, id string) (*models.Template, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, name, layout, category, slots_count, width, height,
			background_color, background_gradient, background_image_url, overlay_png_url, overlay_svg_url,
			orientation, print_size, aspect_ratio, padding, gap, border_radius,
			slots_config, text_elements, logo_url, show_date, event_name, assigned_booth_id,
			description, is_active, is_archived, version, created_at, updated_at
		FROM templates
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	t, err := scanTemplate(row)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find template by id: %w", err)
	}

	return t, nil
}

func (r *templateRepository) Create(ctx context.Context, t *models.Template) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	now := time.Now()
	t.CreatedAt = now
	t.UpdatedAt = now
	if t.Version <= 0 {
		t.Version = 1
	}

	query := `
		INSERT INTO templates (
			id, name, layout, category, slots_count, width, height,
			background_color, background_gradient, background_image_url, overlay_png_url, overlay_svg_url,
			orientation, print_size, aspect_ratio, padding, gap, border_radius,
			slots_config, text_elements, logo_url, show_date, event_name, assigned_booth_id,
			description, is_active, is_archived, version, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30
		)
	`

	_, err := r.db.ExecContext(ctx, query,
		t.ID, t.Name, t.Layout, t.Category, t.SlotsCount, t.Width, t.Height,
		t.BackgroundColor, t.BackgroundGradient, t.BackgroundImageURL, t.OverlayPNGUrl, t.OverlaySVGUrl,
		t.Orientation, t.PrintSize, t.AspectRatio, t.Padding, t.Gap, t.BorderRadius,
		t.SlotsConfig, t.TextElements, t.LogoURL, t.ShowDate, t.EventName, t.AssignedBoothID,
		t.Description, t.IsActive, t.IsArchived, t.Version, t.CreatedAt, t.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert template: %w", err)
	}

	return nil
}

func (r *templateRepository) Update(ctx context.Context, t *models.Template) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	t.UpdatedAt = time.Now()
	t.Version++ // Increment version for historical session immutability

	query := `
		UPDATE templates SET
			name = $2, layout = $3, category = $4, slots_count = $5, width = $6, height = $7,
			background_color = $8, background_gradient = $9, background_image_url = $10,
			overlay_png_url = $11, overlay_svg_url = $12, orientation = $13, print_size = $14,
			aspect_ratio = $15, padding = $16, gap = $17, border_radius = $18,
			slots_config = $19, text_elements = $20, logo_url = $21, show_date = $22,
			event_name = $23, assigned_booth_id = $24, description = $25, is_active = $26,
			is_archived = $27, version = $28, updated_at = $29
		WHERE id = $1
	`

	res, err := r.db.ExecContext(ctx, query,
		t.ID, t.Name, t.Layout, t.Category, t.SlotsCount, t.Width, t.Height,
		t.BackgroundColor, t.BackgroundGradient, t.BackgroundImageURL,
		t.OverlayPNGUrl, t.OverlaySVGUrl, t.Orientation, t.PrintSize,
		t.AspectRatio, t.Padding, t.Gap, t.BorderRadius,
		t.SlotsConfig, t.TextElements, t.LogoURL, t.ShowDate,
		t.EventName, t.AssignedBoothID, t.Description, t.IsActive,
		t.IsArchived, t.Version, t.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to update template: %w", err)
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("template not found")
	}

	return nil
}

func (r *templateRepository) Delete(ctx context.Context, id string) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	query := `DELETE FROM templates WHERE id = $1`
	res, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete template: %w", err)
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("template not found")
	}

	return nil
}

func (r *templateRepository) ToggleActive(ctx context.Context, id string) (bool, error) {
	if r.db == nil {
		return false, errors.New("database not initialized")
	}

	query := `
		UPDATE templates
		SET is_active = NOT is_active, updated_at = NOW()
		WHERE id = $1
		RETURNING is_active
	`

	var newStatus bool
	err := r.db.QueryRowContext(ctx, query, id).Scan(&newStatus)
	if err != nil {
		return false, fmt.Errorf("failed to toggle template active status: %w", err)
	}

	return newStatus, nil
}

func (r *templateRepository) ToggleArchive(ctx context.Context, id string) (bool, error) {
	if r.db == nil {
		return false, errors.New("database not initialized")
	}

	query := `
		UPDATE templates
		SET is_archived = NOT is_archived, updated_at = NOW()
		WHERE id = $1
		RETURNING is_archived
	`

	var newArchived bool
	err := r.db.QueryRowContext(ctx, query, id).Scan(&newArchived)
	if err != nil {
		return false, fmt.Errorf("failed to toggle archive status: %w", err)
	}

	return newArchived, nil
}

func (r *templateRepository) Duplicate(ctx context.Context, id string) (*models.Template, error) {
	orig, err := r.FindByID(ctx, id)
	if err != nil || orig == nil {
		return nil, fmt.Errorf("original template not found: %w", err)
	}

	now := time.Now()
	cloned := *orig
	cloned.ID = fmt.Sprintf("tmpl-%s", uuid.New().String()[:8])
	cloned.Name = fmt.Sprintf("%s (Copy)", orig.Name)
	cloned.Version = 1
	cloned.CreatedAt = now
	cloned.UpdatedAt = now

	if err := r.Create(ctx, &cloned); err != nil {
		return nil, fmt.Errorf("failed to create duplicate template: %w", err)
	}

	return &cloned, nil
}
