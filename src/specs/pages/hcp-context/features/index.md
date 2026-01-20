# Features Tab

## Overview
The Features Tab provides a comprehensive interface for managing product feature definitions. Each feature includes stage-specific contexts that define behavior and content for Not Attached, Attached, Activated, and Engaged stages.

## Key Features
- Feature list with filtering and search
- Stage context editing (all 4 stages)
- Onboarding item assignments per stage
- Navigation resource assignments
- Feature icon and metadata configuration

## User Stories
- As an admin, I want to create features so the system tracks them
- As an admin, I want to define stage contexts so content varies by adoption level
- As an admin, I want to assign onboarding items to stages so pros get relevant tasks
- As an admin, I want to assign navigation resources so AI can provide contextual links

## UI Components
- Feature data table
- Feature edit modal with tabbed stage contexts
- Stage context editors (description, prompts, items, navigation)
- Icon selector
- Item assignment interface

## Data Dependencies
- Reads: Features, onboarding items, navigation resources
- Writes: Feature definitions, stage contexts, assignments

## Status
Prototype - Full feature management with stage contexts.
