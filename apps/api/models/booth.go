package models

type BoothStatus string

const (
	BoothStatusOnline      BoothStatus = "ONLINE"
	BoothStatusOffline     BoothStatus = "OFFLINE"
	BoothStatusInSession   BoothStatus = "IN_SESSION"
	BoothStatusMaintenance BoothStatus = "MAINTENANCE"
)

type Booth struct {
	BaseModel
	Code        string      `json:"code" db:"code"`
	Name        string      `json:"name" db:"name"`
	Location    string      `json:"location" db:"location"`
	Status      BoothStatus `json:"status" db:"status"`
	IPAddress   string      `json:"ip_address,omitempty" db:"ip_address"`
	PaperCount  int         `json:"paper_count" db:"paper_count"`
	MaxPaperCap int         `json:"max_paper_capacity" db:"max_paper_capacity"`
	CameraModel string      `json:"camera_model,omitempty" db:"camera_model"`
	Notes       string      `json:"notes,omitempty" db:"notes"`
}

type CreateBoothInput struct {
	Code        string `json:"code" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Location    string `json:"location"`
	PaperCount  int    `json:"paper_count"`
	MaxPaperCap int    `json:"max_paper_capacity"`
	CameraModel string `json:"camera_model"`
	Notes       string `json:"notes"`
}
