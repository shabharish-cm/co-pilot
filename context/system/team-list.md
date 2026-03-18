# Team List

This file is the canonical source for team membership. It is read by the task routing logic to determine which Todoist section a task belongs to.

---

## Customer Success (CS)

Routing target: **CS Requests** (`section_id: 6g8x4HVHxpWVfVHQ`)

| Name | Aliases / Short Forms |
|------|-----------------------|
| KN | KN |
| Karthik Rao | Karthik |
| Gowtham | Gowtham |
| Yugi | Yugi |

---

## Engineering (Engg)

Routing target: **Engg asks** (`section_id: 6g8x4MgXR2q68fgQ`)

| Name | Aliases / Short Forms |
|------|-----------------------|
| Dhamo | Dhamo |
| Sam | Sam |
| Saran | Saran |
| Nandha | Nandha |
| Krishna | Krishna |

---

## Effy

Routing target: **effy** (`section_id: 6g9QcvpjJw2cFmCx`)

Any task mentioning "effy" anywhere in the title or notes routes here, regardless of other signals.

---

## Notes

- Matching is case-insensitive.
- Partial name matches count (e.g. "Karthik" matches "Karthik Rao").
- If both CS and Engg signals are present, CS wins (higher priority). Log the losing match in diagnostics.
- If no team signal is found, default to **Features** (`section_id: 6g8x4JxwH876pgGQ`).
