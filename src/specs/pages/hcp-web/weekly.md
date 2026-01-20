# Weekly Planning View

## Overview
The Weekly Planning View provides a focused, week-by-week approach to onboarding. It shows the current week's tasks prominently while also surfacing any incomplete items from previous weeks in a "catch up" section.

## Key Features
- Current week focus with task list
- Catch-up section for incomplete prior week items
- Week progress indicator (dots showing week 1-4)
- Progress bar for current week completion
- Next week preview
- Task completion with point rewards

## User Stories
- As a pro, I want to focus on this week's tasks so I'm not overwhelmed
- As a pro, I want to see incomplete tasks from prior weeks so nothing falls through the cracks
- As a pro, I want to preview upcoming weeks so I can plan ahead
- As a pro, I want to complete tasks easily with a single click

## UI Components
- Week status header with avatar and description
- Week indicator dots (completed/current/upcoming)
- Task list with checkboxes
- Catch-up card (when applicable) with week badges
- Next week preview card
- Progress bar with task count

## Data Dependencies
- Reads: Weekly plan configuration, completed task IDs, onboarding item definitions
- Writes: Task completion status

## Status
Prototype - Weekly planning interface with catch-up functionality.
