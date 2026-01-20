# Navigation Tab

## Overview
The Navigation Tab manages all navigation resources that can be referenced by the AI assistant to guide users to specific pages, videos, help articles, and external resources.

## Key Features
- Navigation resource types: Pages, Modals, Videos, Help Articles, External URLs, Tours
- Resource metadata (title, description, URL)
- Status management (Published, Draft, Archived)
- Feature associations

## User Stories
- As an admin, I want to add navigation resources so AI can direct users appropriately
- As an admin, I want to categorize resources by type so they're organized
- As an admin, I want to control resource status so only approved content is used

## UI Components
- Navigation resource table
- Resource type filters
- Add/Edit modal
- Status toggle controls

## Data Dependencies
- Reads: Navigation resources, features for associations
- Writes: Navigation resource records

## Status
Prototype - Navigation resource management.
