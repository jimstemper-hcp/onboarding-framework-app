# Customers Page Navigation

## Problem
Pros need quick access to their customer list to manage customer information, view history, and start new jobs or invoices.

## Solution
An in-app navigation resource that directs users to the Customers page within Housecall Pro.

## Scope
**Included:**
- Direct navigation to `/customers`
- Customer list view
- Access to individual customer profiles

**Excluded:**
- Customer creation (separate action)
- Bulk operations

## Dependencies
- **Depends on:** User authentication, basic account setup
- **Depended on by:** Features that reference customer management

## Success Criteria
- Navigation link correctly routes to Customers page
- Page loads with customer list
- Pro can view and manage customers

## Functional Requirements

### FR1: Navigation Action

#### User Story
As a pro, I want to quickly navigate to my customer list so that I can manage customer information.

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| Navigation type | `hcp_navigate` |
| URL | `/customers` |
| Trigger | Click/tap on navigation item |
| Result | Customers page opens with customer list |

#### Related Prompts
- [Initial]: "Added navigation to customers page for invoicing feature"

## Open Questions/Unknowns
- Should we support deep linking to specific customer views?
