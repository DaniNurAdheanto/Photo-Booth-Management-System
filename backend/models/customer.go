package models

import "time"

type Customer struct {
	ID                 string    `json:"id" db:"id"`
	Name               string    `json:"name" db:"name"`
	Email              string    `json:"email" db:"email"`
	Phone              string    `json:"phone" db:"phone"`
	Domicile           string    `json:"domicile" db:"domicile"`
	TotalSessions      int       `json:"total_sessions" db:"total_sessions"`
	TotalSpent         float64   `json:"total_spent" db:"total_spent"`
	FavoriteBoothID    string    `json:"favorite_booth_id" db:"favorite_booth_id"`
	FavoriteTemplateID string    `json:"favorite_template_id" db:"favorite_template_id"`
	LastVisitAt        time.Time `json:"last_visit_at" db:"last_visit_at"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}

type CreateCustomerInput struct {
	Name               string  `json:"name" binding:"required"`
	Email              string  `json:"email" binding:"required,email"`
	Phone              string  `json:"phone" binding:"required"`
	Domicile           string  `json:"domicile"`
	FavoriteBoothID    string  `json:"favorite_booth_id"`
	FavoriteTemplateID string  `json:"favorite_template_id"`
	TotalSpent         float64 `json:"total_spent"`
}
