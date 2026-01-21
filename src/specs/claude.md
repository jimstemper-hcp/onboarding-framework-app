# Spec Documentation Rules

## Spec Format Template

All spec documents must follow this format:

```markdown
# [Page/Feature Name]

## Problem
[What problem does this page/feature solve?]

## Solution
[How does this page/feature solve the problem?]

## Scope
[What is included/excluded in this page/feature?]

## Dependencies
[What does this depend on? What depends on this?]

## Success Criteria
[How do we know this is working correctly?]

## Functional Requirements

### FR1: [Requirement Name]

#### User Story
As a [user type], I want to [action] so that [benefit].

#### Acceptance Criteria
| Condition | Expected Behavior |
|-----------|-------------------|
| ... | ... |

#### Related Prompts
- "[verbatim prompt from conversation]"

## Open Questions/Unknowns
- Question 1?
```

## Section Guidelines

### Problem
- Describe the core problem being solved
- Be specific about who experiences this problem
- Explain why solving this problem matters

### Solution
- Describe how this page/feature solves the problem
- Focus on the approach, not implementation details
- Reference backend data sources when applicable (see data flow rule in root claude.md)

### Scope
- List what IS included in this feature
- List what is explicitly EXCLUDED
- Define boundaries clearly

### Dependencies
- List pages/features this depends on
- List what depends on this page/feature
- Note any external system dependencies

### Success Criteria
- Measurable outcomes that indicate success
- Observable behaviors that confirm correct implementation
- Testable conditions

### Functional Requirements

Each requirement should include:

1. **User Story**: Follow the format "As a [user type], I want to [action] so that [benefit]."

2. **Acceptance Criteria**: Use tables wherever possible:
   | Condition | Expected Behavior |
   |-----------|-------------------|
   | When X | Then Y |
   | If A | Display B |

3. **Related Prompts**: List verbatim prompts from conversations that contributed to this requirement:
   - If from current conversation, quote exactly
   - If from historical conversations, prefix with `[Historical]`
   - If inferred from implementation, prefix with `[Inferred]`

### Open Questions/Unknowns
- Questions that need answers
- Decisions that haven't been made
- Areas of uncertainty
