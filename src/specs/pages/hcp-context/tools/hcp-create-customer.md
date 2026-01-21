# hcp_create_customer Tool

## Problem
The AI chat assistant needs to create customer records in Housecall Pro on behalf of the pro during conversational workflows like invoice creation.

## Solution
An MCP tool that allows the AI to programmatically create customer records with full contact and address information.

## Scope
**Included:**
- Customer record creation
- Contact information (name, email, phone)
- Address information (street, city, state, zip)
- Company name for business customers
- Notification preferences

**Excluded:**
- Customer updates (use separate tool)
- Customer deletion
- Bulk operations

## Dependencies
- **Depends on:** Housecall Pro API access, valid pro authentication
- **Depended on by:** `hcp_create_job`, invoice workflows

## Success Criteria
- Tool successfully creates customer records
- Returns customer ID for subsequent operations
- Handles validation errors gracefully
- Respects pro's account permissions

## Functional Requirements

### FR1: Customer Creation

#### User Story
As an AI assistant, I need to create customers in Housecall Pro so that I can help pros complete invoice and job workflows conversationally.

#### Acceptance Criteria
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| first_name | string | Yes | Customer first name |
| last_name | string | Yes | Customer last name |
| email | string | No | Customer email address |
| mobile_number | string | No | Customer phone number |
| company | string | No | Company name if business |
| street | string | No | Street address |
| city | string | No | City |
| state | string | No | State abbreviation |
| zip | string | No | ZIP code |
| notifications_enabled | boolean | No | Enable SMS/email notifications |

#### Related Prompts
- [Initial]: "AI needs to create customers during invoice image upload workflow"

## Open Questions/Unknowns
- What happens if duplicate customer detected?
- Should we support address autocomplete?
