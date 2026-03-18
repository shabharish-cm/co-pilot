# Routing And Scoring Logic

## Todoist Routing

Priority order:

1. Route to `Effy` when `effy` appears anywhere in the request.
2. Route to `CS Requests` when a CS team member appears in the requestor or title.
3. Route to `Engg asks` when an engineering team member appears in the requestor or title.
4. Route to `Features` when feature keywords appear.
5. Route using labels as fallback: `follow-up` to `CS Requests`, `engineering` to `Engg asks`.
6. Default to `Features` with `defaulted` confidence.

If CS and engineering signals are both present, keep the higher-priority winner and record the losing match in diagnostics.

## Value-Effort Scoring

Value dimensions:
- revenue influence
- account importance
- frequency across calls
- retention impact
- strategic alignment

Effort dimensions:
- implementation complexity
- cross-team dependency
- architecture impact
- data or model dependency
- UI or UX complexity

Effort is always marked as estimated until explicitly validated.
