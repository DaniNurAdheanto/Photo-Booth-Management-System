package models

type UserRole string

const (
	RoleAdmin    UserRole = "ADMIN"
	RoleOperator UserRole = "OPERATOR"
	RoleViewer   UserRole = "VIEWER"
)

type User struct {
	BaseModel
	Email    string   `json:"email" db:"email"`
	Name     string   `json:"name" db:"name"`
	Role     UserRole `json:"role" db:"role"`
	Password string   `json:"-" db:"password_hash"`
	IsActive bool     `json:"is_active" db:"is_active"`
}
