package models

import "time"

type SessionStatus string

const (
	SessionStatusPending   SessionStatus = "PENDING"
	SessionStatusCounting  SessionStatus = "COUNTDOWN"
	SessionStatusCapturing SessionStatus = "CAPTURING"
	SessionStatusPrinting  SessionStatus = "PRINTING"
	SessionStatusCompleted SessionStatus = "COMPLETED"
	SessionStatusCancelled SessionStatus = "CANCELLED"
)

type PhotoSession struct {
	BaseModel
	BoothID       string        `json:"booth_id" db:"booth_id"`
	SessionCode   string        `json:"session_code" db:"session_code"`
	CustomerName  string        `json:"customer_name,omitempty" db:"customer_name"`
	CustomerEmail string        `json:"customer_email,omitempty" db:"customer_email"`
	Status        SessionStatus `json:"status" db:"status"`
	TotalPhotos   int           `json:"total_photos" db:"total_photos"`
	PrintCopies   int           `json:"print_copies" db:"print_copies"`
	TemplateID    string        `json:"template_id,omitempty" db:"template_id"`
	StartedAt     *time.Time    `json:"started_at,omitempty" db:"started_at"`
	EndedAt       *time.Time    `json:"ended_at,omitempty" db:"ended_at"`
}
