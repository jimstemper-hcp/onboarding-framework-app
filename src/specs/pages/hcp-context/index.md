# @HCP Context Manager

## Overview
The @HCP Context Manager is the internal admin tool for managing all onboarding content and configuration. It provides a centralized interface for defining features, navigation resources, call types, onboarding items, and AI tools.

## Key Features
- Features tab: Define and manage product features with stage contexts
- Navigation tab: Manage navigation resources (pages, videos, help articles)
- Calls tab: Configure Calendly call types and booking links
- Onboarding Items tab: Define centralized onboarding item library
- Tools tab: Configure MCP tools for AI assistance

## User Stories
- As an admin, I want to define features so the onboarding system knows what to track
- As an admin, I want to manage navigation resources so AI can guide users
- As an admin, I want to configure call types so reps can schedule easily
- As an admin, I want to define onboarding items so they're consistent across the system

## UI Components
- Tab navigation (Features, Navigation, Calls, Onboarding Items, Tools)
- Data tables with CRUD operations
- Modal editors for detailed editing
- Search and filter capabilities

## Data Dependencies
- Reads: All context data (features, navigation, calls, items, tools)
- Writes: All context data modifications

## Status
Prototype - Core admin functionality for content management.
