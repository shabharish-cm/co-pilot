# WHML

**Source:** TAM-shared request (2026-03-19)

## Feature Requests / Signals

### Employee ID Formatting / Validation
- Employee IDs are 20 characters — employees entering 20 characters are hitting errors
- Likely cause: trailing spaces, encoding characters, or strict length validation rejecting valid IDs
- **Requested:** Trim + normalise employee ID input before validation (strip leading/trailing whitespace)

### Phone Number Formatting
- Employees entering phone numbers with spaces in country code prefix (e.g. `91 9888435654` instead of `919888435654`)
- Causes validation failure or delivery failure
- **Requested:** Phone number input should auto-strip spaces and normalise format before storage/use

**Pattern:** Both are input normalisation problems — the platform is strict about format but employees enter data naturally. Fix: sanitise inputs (trim whitespace, strip spaces from phone numbers) before validation, not after.
