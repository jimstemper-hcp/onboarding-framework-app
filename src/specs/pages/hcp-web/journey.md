# Journey View

## Overview
The Journey View presents onboarding as a gamified vertical timeline, with each feature represented as a milestone. This creates a visual progression that motivates pros to advance through their onboarding plan.

## Key Features
- Vertical timeline with connected milestones
- Feature-based milestone cards with status indicators
- Points system (25 pts/task, 50 pts attached, 100 pts activated, 150 pts engaged)
- Expandable task lists within each milestone
- Progress indicators per feature
- "Jump to current milestone" navigation

## User Stories
- As a pro, I want to see all my milestones in a timeline so I understand the full onboarding journey
- As a pro, I want to see which milestone I'm currently on so I know where to focus
- As a pro, I want to expand milestones to see detailed tasks so I can track my progress
- As a pro, I want to earn points for completing tasks so I feel a sense of achievement

## UI Components
- Timeline track with connectors between milestones
- Milestone nodes (completed/current/upcoming/locked states)
- Feature cards with avatar, name, description, and points
- Expandable task sections (required vs bonus)
- Progress bars per milestone
- Completion celebration UI

## Data Dependencies
- Reads: Features, feature status per pro, onboarding items, pro account
- Writes: Task completion status

## Status
Prototype - Core journey experience implemented with gamification elements.
