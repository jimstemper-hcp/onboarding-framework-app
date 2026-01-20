# AI Chat Assistant

## Overview
The AI Chat Assistant provides contextual help to pros during their onboarding journey. It leverages the centralized onboarding context to provide personalized, relevant assistance based on the pro's current stage and goals.

## Key Features
- Conversational AI interface
- Context-aware responses using onboarding data
- Markdown rendering for formatted responses
- Message history within session
- Quick action suggestions

## User Stories
- As a pro, I want to ask questions about features so I can learn how to use them
- As a pro, I want contextual help based on my current progress so answers are relevant
- As a pro, I want to see formatted responses so information is easy to read
- As a pro, I want quick suggestions so I can get started without typing

## UI Components
- Chat header with title and description
- Message list with user/assistant bubbles
- Input area with send button
- Markdown-rendered assistant messages
- Loading indicators for pending responses

## Data Dependencies
- Reads: Pro account, feature status, onboarding context, stage contexts
- Writes: None (session-based chat history)

## Status
Prototype - Basic chat interface with context-aware responses.
