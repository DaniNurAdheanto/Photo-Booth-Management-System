package models

import "time"

type SessionStatus string

const (
	SessionStatusPending    SessionStatus = "PENDING"
	SessionStatusCountdown  SessionStatus = "COUNTDOWN"
	SessionStatusCapturing  SessionStatus = "CAPTURING"
	SessionStatusReviewing  SessionStatus = "REVIEWING"
	SessionStatusProcessing SessionStatus = "PROCESSING"
	SessionStatusCompleted  SessionStatus = "COMPLETED"
	SessionStatusCancelled  SessionStatus = "CANCELLED"
	SessionStatusFailed     SessionStatus = "FAILED"
)

type CapturedPhotoItem struct {
	Slot      int       `json:"slot"`
	URL       string    `json:"url"`
	Timestamp time.Time `json:"timestamp,omitempty"`
}

type PhotoSession struct {
	BaseModel
	BoothID           string        `json:"booth_id" db:"booth_id"`
	SessionCode       string        `json:"session_code" db:"session_code"`
	CustomerName      string        `json:"customer_name,omitempty" db:"customer_name"`
	CustomerEmail     string        `json:"customer_email,omitempty" db:"customer_email"`
	CustomerPhone     string        `json:"customer_phone,omitempty" db:"customer_phone"`
	QueueNumber       string        `json:"queue_number,omitempty" db:"queue_number"`
	Status            SessionStatus `json:"status" db:"status"`
	TotalPhotos       int           `json:"total_photos" db:"total_photos"`
	PrintCopies       int           `json:"print_copies" db:"print_copies"`
	TemplateID        string        `json:"template_id,omitempty" db:"template_id"`
	CountdownSeconds  int           `json:"countdown_seconds" db:"countdown_seconds"`
	RetakeCount       int           `json:"retake_count" db:"retake_count"`
	FilterPreset      string        `json:"filter_preset" db:"filter_preset"`
	IdempotencyKey    string        `json:"idempotency_key,omitempty" db:"idempotency_key"`
	CapturedPhotos    string        `json:"captured_photos" db:"captured_photos"`
	FinalCompositeURL string        `json:"final_composite_url,omitempty" db:"final_composite_url"`
	QRCodeURL         string        `json:"qr_code_url,omitempty" db:"qr_code_url"`
	Notes             string        `json:"notes,omitempty" db:"notes"`
	StartedAt         *time.Time    `json:"started_at,omitempty" db:"started_at"`
	EndedAt           *time.Time    `json:"ended_at,omitempty" db:"ended_at"`
}

type StartSessionInput struct {
	BoothID          string `json:"booth_id" binding:"required"`
	CustomerName     string `json:"customer_name"`
	CustomerEmail    string `json:"customer_email"`
	CustomerPhone    string `json:"customer_phone"`
	QueueNumber      string `json:"queue_number"`
	TemplateID       string `json:"template_id"`
	TotalPhotos      int    `json:"total_photos"`
	PrintCopies      int    `json:"print_copies"`
	CountdownSeconds int    `json:"countdown_seconds"`
}

type CapturePhotoInput struct {
	SlotIndex int    `json:"slot_index"`
	PhotoURL  string `json:"photo_url" binding:"required"`
}

type RetakePhotoInput struct {
	SlotIndex int  `json:"slot_index"` // -1 for retake all
	RetakeAll bool `json:"retake_all"`
}

type ConfirmSessionInput struct {
	IdempotencyKey    string `json:"idempotency_key" binding:"required"`
	PrintCopies       int    `json:"print_copies"`
	FinalCompositeURL string `json:"final_composite_url"`
	QRCodeURL         string `json:"qr_code_url"`
	FilterPreset      string `json:"filter_preset"`
}

type UpdateSessionInput struct {
	Status            SessionStatus `json:"status"`
	CapturedPhotos    string        `json:"captured_photos"`
	FinalCompositeURL string        `json:"final_composite_url"`
	QRCodeURL         string        `json:"qr_code_url"`
	FilterPreset      string        `json:"filter_preset"`
	RetakeCount       int           `json:"retake_count"`
	PrintCopies       int           `json:"print_copies"`
	Notes             string        `json:"notes"`
}
