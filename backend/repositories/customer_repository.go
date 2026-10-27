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

type CustomerRepository interface {
	FindAll(ctx context.Context, search string, limit int, offset int) ([]models.Customer, int, error)
	FindByID(ctx context.Context, id string) (*models.Customer, error)
	FindByPhoneOrEmail(ctx context.Context, phone, email string) (*models.Customer, error)
	Create(ctx context.Context, input models.CreateCustomerInput) (*models.Customer, error)
	RecordVisit(ctx context.Context, phone, email, name, boothID, templateID string, spent float64) (*models.Customer, error)
	Delete(ctx context.Context, id string) error
}

type customerRepository struct {
	db *sql.DB
}

func NewCustomerRepository(db *sql.DB) CustomerRepository {
	return &customerRepository{db: db}
}

func scanCustomer(row interface {
	Scan(dest ...interface{}) error
}) (*models.Customer, error) {
	var c models.Customer
	var domicile, favBooth, favTemplate sql.NullString

	err := row.Scan(
		&c.ID, &c.Name, &c.Email, &c.Phone, &domicile,
		&c.TotalSessions, &c.TotalSpent, &favBooth, &favTemplate,
		&c.LastVisitAt, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	c.Domicile = domicile.String
	c.FavoriteBoothID = favBooth.String
	c.FavoriteTemplateID = favTemplate.String

	return &c, nil
}

func (r *customerRepository) FindAll(ctx context.Context, search string, limit int, offset int) ([]models.Customer, int, error) {
	if r.db == nil {
		return nil, 0, errors.New("database not initialized")
	}

	if limit <= 0 {
		limit = 20
	}
	if offset < 0 {
		offset = 0
	}

	countQuery := `
		SELECT COUNT(*)
		FROM customers
		WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%' OR phone ILIKE '%' || $1 || '%')
	`
	var total int
	err := r.db.QueryRowContext(ctx, countQuery, search).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count customers: %w", err)
	}

	query := `
		SELECT 
			id, name, email, phone, domicile, total_sessions, total_spent,
			favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
		FROM customers
		WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%' OR phone ILIKE '%' || $1 || '%')
		ORDER BY last_visit_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.db.QueryContext(ctx, query, search, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query customers: %w", err)
	}
	defer rows.Close()

	var customers []models.Customer
	for rows.Next() {
		c, err := scanCustomer(rows)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan customer: %w", err)
		}
		customers = append(customers, *c)
	}

	if customers == nil {
		customers = []models.Customer{}
	}

	return customers, total, nil
}

func (r *customerRepository) FindByID(ctx context.Context, id string) (*models.Customer, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, name, email, phone, domicile, total_sessions, total_spent,
			favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
		FROM customers
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)
	c, err := scanCustomer(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return c, nil
}

func (r *customerRepository) FindByPhoneOrEmail(ctx context.Context, phone, email string) (*models.Customer, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	query := `
		SELECT 
			id, name, email, phone, domicile, total_sessions, total_spent,
			favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
		FROM customers
		WHERE (phone = $1 AND phone <> '') OR (email = $2 AND email <> '')
		LIMIT 1
	`
	row := r.db.QueryRowContext(ctx, query, phone, email)
	c, err := scanCustomer(row)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return c, nil
}

func (r *customerRepository) Create(ctx context.Context, input models.CreateCustomerInput) (*models.Customer, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	id := "cust-" + uuid.New().String()[:8]
	now := time.Now()

	query := `
		INSERT INTO customers (
			id, name, email, phone, domicile, total_sessions, total_spent,
			favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, 1, $6, $7, $8, $9, $9, $9
		)
		RETURNING id, name, email, phone, domicile, total_sessions, total_spent,
		          favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
	`

	row := r.db.QueryRowContext(ctx, query,
		id, input.Name, input.Email, input.Phone, input.Domicile,
		input.TotalSpent, input.FavoriteBoothID, input.FavoriteTemplateID, now,
	)

	return scanCustomer(row)
}

func (r *customerRepository) RecordVisit(ctx context.Context, phone, email, name, boothID, templateID string, spent float64) (*models.Customer, error) {
	if r.db == nil {
		return nil, errors.New("database not initialized")
	}

	existing, err := r.FindByPhoneOrEmail(ctx, phone, email)
	if err != nil {
		return nil, err
	}

	now := time.Now()

	if existing != nil {
		favBooth := existing.FavoriteBoothID
		if boothID != "" {
			favBooth = boothID
		}
		favTmpl := existing.FavoriteTemplateID
		if templateID != "" {
			favTmpl = templateID
		}

		query := `
			UPDATE customers SET
				name = COALESCE(NULLIF($1, ''), name),
				email = COALESCE(NULLIF($2, ''), email),
				total_sessions = total_sessions + 1,
				total_spent = total_spent + $3,
				favorite_booth_id = $4,
				favorite_template_id = $5,
				last_visit_at = $6,
				updated_at = $6
			WHERE id = $7
			RETURNING id, name, email, phone, domicile, total_sessions, total_spent,
			          favorite_booth_id, favorite_template_id, last_visit_at, created_at, updated_at
		`
		row := r.db.QueryRowContext(ctx, query, name, email, spent, favBooth, favTmpl, now, existing.ID)
		return scanCustomer(row)
	}

	// Create new customer
	return r.Create(ctx, models.CreateCustomerInput{
		Name:               name,
		Email:              email,
		Phone:              phone,
		FavoriteBoothID:    boothID,
		FavoriteTemplateID: templateID,
		TotalSpent:         spent,
	})
}

func (r *customerRepository) Delete(ctx context.Context, id string) error {
	if r.db == nil {
		return errors.New("database not initialized")
	}

	_, err := r.db.ExecContext(ctx, `DELETE FROM customers WHERE id = $1`, id)
	return err
}
