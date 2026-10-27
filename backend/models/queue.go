package models

import "time"

type QueueStatus string

const (
	QueueStatusWaiting   QueueStatus = "WAITING"
	QueueStatusCalled    QueueStatus = "CALLED"
	QueueStatusInBooth   QueueStatus = "IN_BOOTH"
	QueueStatusCompleted QueueStatus = "COMPLETED"
	QueueStatusCancelled QueueStatus = "CANCELLED"
)

type QueueItem struct {
	ID                   string      `json:"id" db:"id"`
	QueueNumber          string      `json:"queue_number" db:"queue_number"`
	BoothID              string      `json:"booth_id" db:"booth_id"`
	CustomerName         string      `json:"customer_name" db:"customer_name"`
	CustomerEmail        string      `json:"customer_email" db:"customer_email"`
	CustomerPhone        string      `json:"customer_phone" db:"customer_phone"`
	TemplateID           string      `json:"template_id" db:"template_id"`
	Status               QueueStatus `json:"status" db:"status"`
	EstimatedWaitMinutes int         `json:"estimated_wait_minutes" db:"estimated_wait_minutes"`
	EmailReminderSent    bool        `json:"email_reminder_sent" db:"email_reminder_sent"`
	CreatedAt            time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt            time.Time   `json:"updated_at" db:"updated_at"`
}

type CreateQueueInput struct {
	BoothID       string `json:"booth_id" binding:"required"`
	CustomerName  string `json:"customer_name" binding:"required"`
	CustomerEmail string `json:"customer_email" binding:"required,email"`
	CustomerPhone string `json:"customer_phone" binding:"required"`
	TemplateID    string `json:"template_id"`
}
