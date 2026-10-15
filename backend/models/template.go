package models

import "time"

type Template struct {
	ID                 string    `json:"id" db:"id"`
	Name               string    `json:"name" db:"name"`
	Layout             string    `json:"layout" db:"layout"` // single_photo, photo_strip, postcard, collage, polaroid, 2x6_strip, 4x6_postcard, grid_2x2
	Category           string    `json:"category" db:"category"` // WEDDING, BIRTHDAY, CORPORATE, VINTAGE, MINIMALIST, GENERAL
	SlotsCount         int       `json:"slots_count" db:"slots_count"`
	Width              int       `json:"width" db:"width"`
	Height             int       `json:"height" db:"height"`
	BackgroundColor    string    `json:"background_color" db:"background_color"`
	BackgroundGradient string    `json:"background_gradient,omitempty" db:"background_gradient"`
	BackgroundImageURL string    `json:"background_image_url,omitempty" db:"background_image_url"`
	OverlayPNGUrl      string    `json:"overlay_png_url,omitempty" db:"overlay_png_url"`
	OverlaySVGUrl      *string   `json:"overlay_svg_url,omitempty" db:"overlay_svg_url"`
	Orientation        string    `json:"orientation" db:"orientation"` // PORTRAIT, LANDSCAPE
	PrintSize          string    `json:"print_size" db:"print_size"` // 2x6 in, 4x6 in, 5x7 in, Square
	AspectRatio        string    `json:"aspect_ratio" db:"aspect_ratio"`
	Padding            int       `json:"padding" db:"padding"`
	Gap                int       `json:"gap" db:"gap"`
	BorderRadius       int       `json:"border_radius" db:"border_radius"`
	SlotsConfig        string    `json:"slots_config,omitempty" db:"slots_config"`
	TextElements       string    `json:"text_elements,omitempty" db:"text_elements"`
	LogoURL            string    `json:"logo_url,omitempty" db:"logo_url"`
	ShowDate           bool      `json:"show_date" db:"show_date"`
	EventName          string    `json:"event_name,omitempty" db:"event_name"`
	AssignedBoothID    string    `json:"assigned_booth_id" db:"assigned_booth_id"`
	Description        string    `json:"description,omitempty" db:"description"`
	IsActive           bool      `json:"is_active" db:"is_active"`
	IsArchived         bool      `json:"is_archived" db:"is_archived"`
	Version            int       `json:"version" db:"version"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}

type CreateTemplateInput struct {
	Name               string  `json:"name" binding:"required"`
	Layout             string  `json:"layout" binding:"required"`
	Category           string  `json:"category"`
	SlotsCount         int     `json:"slots_count"`
	Width              int     `json:"width"`
	Height             int     `json:"height"`
	BackgroundColor    string  `json:"background_color"`
	BackgroundGradient string  `json:"background_gradient"`
	BackgroundImageURL string  `json:"background_image_url"`
	OverlayPNGUrl      string  `json:"overlay_png_url"`
	OverlaySVGUrl      *string `json:"overlay_svg_url"`
	Orientation        string  `json:"orientation"`
	PrintSize          string  `json:"print_size"`
	AspectRatio        string  `json:"aspect_ratio"`
	Padding            int     `json:"padding"`
	Gap                int     `json:"gap"`
	BorderRadius       int     `json:"border_radius"`
	SlotsConfig        string  `json:"slots_config"`
	TextElements       string  `json:"text_elements"`
	LogoURL            string  `json:"logo_url"`
	ShowDate           *bool   `json:"show_date"`
	EventName          string  `json:"event_name"`
	AssignedBoothID    string  `json:"assigned_booth_id"`
	Description        string  `json:"description"`
	IsActive           *bool   `json:"is_active"`
}

type UpdateTemplateInput struct {
	Name               *string `json:"name"`
	Layout             *string `json:"layout"`
	Category           *string `json:"category"`
	SlotsCount         *int    `json:"slots_count"`
	Width              *int    `json:"width"`
	Height             *int    `json:"height"`
	BackgroundColor    *string `json:"background_color"`
	BackgroundGradient *string `json:"background_gradient"`
	BackgroundImageURL *string `json:"background_image_url"`
	OverlayPNGUrl      *string `json:"overlay_png_url"`
	OverlaySVGUrl      *string `json:"overlay_svg_url"`
	Orientation        *string `json:"orientation"`
	PrintSize          *string `json:"print_size"`
	AspectRatio        *string `json:"aspect_ratio"`
	Padding            *int    `json:"padding"`
	Gap                *int    `json:"gap"`
	BorderRadius       *int    `json:"border_radius"`
	SlotsConfig        *string `json:"slots_config"`
	TextElements       *string `json:"text_elements"`
	LogoURL            *string `json:"logo_url"`
	ShowDate           *bool   `json:"show_date"`
	EventName          *string `json:"event_name"`
	AssignedBoothID    *string `json:"assigned_booth_id"`
	Description        *string `json:"description"`
	IsActive           *bool   `json:"is_active"`
	IsArchived         *bool   `json:"is_archived"`
}
