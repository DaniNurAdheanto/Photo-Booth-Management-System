package services

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"photobooth-api/models"
	"photobooth-api/repositories"
)

type TemplateService interface {
	GetTemplates(ctx context.Context, boothID string, category string, includeArchived bool) ([]models.Template, error)
	GetTemplateByID(ctx context.Context, id string) (*models.Template, error)
	CreateTemplate(ctx context.Context, input models.CreateTemplateInput) (*models.Template, error)
	UpdateTemplate(ctx context.Context, id string, input models.UpdateTemplateInput) (*models.Template, error)
	DeleteTemplate(ctx context.Context, id string) error
	ToggleActive(ctx context.Context, id string) (bool, error)
	ToggleArchive(ctx context.Context, id string) (bool, error)
	DuplicateTemplate(ctx context.Context, id string) (*models.Template, error)
}

type templateService struct {
	repo repositories.TemplateRepository
}

func NewTemplateService(repo repositories.TemplateRepository) TemplateService {
	return &templateService{repo: repo}
}

func (s *templateService) GetTemplates(ctx context.Context, boothID string, category string, includeArchived bool) ([]models.Template, error) {
	return s.repo.FindAll(ctx, boothID, category, includeArchived)
}

func (s *templateService) GetTemplateByID(ctx context.Context, id string) (*models.Template, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *templateService) CreateTemplate(ctx context.Context, input models.CreateTemplateInput) (*models.Template, error) {
	slotsCount := input.SlotsCount
	if slotsCount <= 0 {
		slotsCount = 4
	}

	width := input.Width
	height := input.Height
	if width <= 0 || height <= 0 {
		switch input.Layout {
		case "4x6_postcard":
			width = 1800
			height = 1200
		case "grid_2x2", "collage":
			width = 1200
			height = 1200
		case "polaroid":
			width = 1000
			height = 1200
		case "single_photo":
			width = 1200
			height = 1800
		default: // 2x6_strip, photo_strip
			width = 600
			height = 1800
		}
	}

	bgColor := input.BackgroundColor
	if bgColor == "" {
		bgColor = "#C1E3D0" // Default brand pastel sage green
	}

	category := input.Category
	if category == "" {
		category = "GENERAL"
	}

	orientation := input.Orientation
	if orientation == "" {
		if width > height {
			orientation = "LANDSCAPE"
		} else {
			orientation = "PORTRAIT"
		}
	}

	printSize := input.PrintSize
	if printSize == "" {
		printSize = "2x6 in"
	}

	padding := input.Padding
	if padding <= 0 {
		padding = 30
	}

	gap := input.Gap
	if gap <= 0 {
		gap = 20
	}

	borderRadius := input.BorderRadius
	if borderRadius <= 0 {
		borderRadius = 8
	}

	assignedBooth := input.AssignedBoothID
	if assignedBooth == "" {
		assignedBooth = "ALL"
	}

	isActive := true
	if input.IsActive != nil {
		isActive = *input.IsActive
	}

	showDate := true
	if input.ShowDate != nil {
		showDate = *input.ShowDate
	}

	template := &models.Template{
		ID:                 fmt.Sprintf("tmpl-%s", uuid.New().String()[:8]),
		Name:               input.Name,
		Layout:             input.Layout,
		Category:           category,
		SlotsCount:         slotsCount,
		Width:              width,
		Height:             height,
		BackgroundColor:    bgColor,
		BackgroundGradient: input.BackgroundGradient,
		BackgroundImageURL: input.BackgroundImageURL,
		OverlayPNGUrl:      input.OverlayPNGUrl,
		OverlaySVGUrl:      input.OverlaySVGUrl,
		Orientation:        orientation,
		PrintSize:          printSize,
		AspectRatio:        input.AspectRatio,
		Padding:            padding,
		Gap:                gap,
		BorderRadius:       borderRadius,
		SlotsConfig:        input.SlotsConfig,
		TextElements:       input.TextElements,
		LogoURL:            input.LogoURL,
		ShowDate:           showDate,
		EventName:          input.EventName,
		AssignedBoothID:    assignedBooth,
		Description:        input.Description,
		IsActive:           isActive,
		IsArchived:         false,
		Version:            1,
	}

	if err := s.repo.Create(ctx, template); err != nil {
		return nil, err
	}

	return template, nil
}

func (s *templateService) UpdateTemplate(ctx context.Context, id string, input models.UpdateTemplateInput) (*models.Template, error) {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil || existing == nil {
		return nil, fmt.Errorf("template not found: %w", err)
	}

	if input.Name != nil {
		existing.Name = *input.Name
	}
	if input.Layout != nil {
		existing.Layout = *input.Layout
	}
	if input.Category != nil {
		existing.Category = *input.Category
	}
	if input.SlotsCount != nil && *input.SlotsCount > 0 {
		existing.SlotsCount = *input.SlotsCount
	}
	if input.Width != nil && *input.Width > 0 {
		existing.Width = *input.Width
	}
	if input.Height != nil && *input.Height > 0 {
		existing.Height = *input.Height
	}
	if input.BackgroundColor != nil {
		existing.BackgroundColor = *input.BackgroundColor
	}
	if input.BackgroundGradient != nil {
		existing.BackgroundGradient = *input.BackgroundGradient
	}
	if input.BackgroundImageURL != nil {
		existing.BackgroundImageURL = *input.BackgroundImageURL
	}
	if input.OverlayPNGUrl != nil {
		existing.OverlayPNGUrl = *input.OverlayPNGUrl
	}
	if input.OverlaySVGUrl != nil {
		existing.OverlaySVGUrl = input.OverlaySVGUrl
	}
	if input.Orientation != nil {
		existing.Orientation = *input.Orientation
	}
	if input.PrintSize != nil {
		existing.PrintSize = *input.PrintSize
	}
	if input.AspectRatio != nil {
		existing.AspectRatio = *input.AspectRatio
	}
	if input.Padding != nil {
		existing.Padding = *input.Padding
	}
	if input.Gap != nil {
		existing.Gap = *input.Gap
	}
	if input.BorderRadius != nil {
		existing.BorderRadius = *input.BorderRadius
	}
	if input.SlotsConfig != nil {
		existing.SlotsConfig = *input.SlotsConfig
	}
	if input.TextElements != nil {
		existing.TextElements = *input.TextElements
	}
	if input.LogoURL != nil {
		existing.LogoURL = *input.LogoURL
	}
	if input.ShowDate != nil {
		existing.ShowDate = *input.ShowDate
	}
	if input.EventName != nil {
		existing.EventName = *input.EventName
	}
	if input.AssignedBoothID != nil {
		existing.AssignedBoothID = *input.AssignedBoothID
	}
	if input.Description != nil {
		existing.Description = *input.Description
	}
	if input.IsActive != nil {
		existing.IsActive = *input.IsActive
	}
	if input.IsArchived != nil {
		existing.IsArchived = *input.IsArchived
	}

	if err := s.repo.Update(ctx, existing); err != nil {
		return nil, err
	}

	return existing, nil
}

func (s *templateService) DeleteTemplate(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *templateService) ToggleActive(ctx context.Context, id string) (bool, error) {
	return s.repo.ToggleActive(ctx, id)
}

func (s *templateService) ToggleArchive(ctx context.Context, id string) (bool, error) {
	return s.repo.ToggleArchive(ctx, id)
}

func (s *templateService) DuplicateTemplate(ctx context.Context, id string) (*models.Template, error) {
	return s.repo.Duplicate(ctx, id)
}
