# Feedback Prioritisation Agent — GK Alignment Notes

**Who:** Gowtham (GK), Director of CS — account/data signals
**Context:** Pre-build alignment for the Feedback-based Prioritisation Agent (MVP due 2026-03-25)

---

## 1. Account Signals — What and How

- Which metrics to use: account size, churn risk, renewal date — confirm what GK already tracks and in what form
- Update frequency: is account health data updated weekly, monthly, or ad hoc?
- Access method: API, CSV export, shared sheet, or HubSpot? Determines whether CSV state storage can be automated or needs manual refresh

## 2. Feedback Sources GK Owns or Has Visibility Into

- Which CS-side channels capture feature requests today (Slack threads, call notes, HubSpot, manually curated lists)?
- Does GK already aggregate any of this, or is it scattered? Avoid duplicating something that's partially done

## 3. Account Prioritisation Weights

- Are there strategic accounts right now that should get higher signal weight regardless of size (renewal risk, expansion conversations, escalations)?
- Any accounts GK would flag as "if this comes up in feedback, treat it as high priority"

## 4. CS Team Buy-In on Output

- Who on the CS side consumes the prioritisation output — founders only, or does GK's team need a view too?
- What format works for them: Slack summary, dashboard, weekly PDF?

---

## Key Dependency

The **account context layer is blocked on this conversation**. Everything else (agent build, CSV storage, dashboard) can proceed independently. The core ask is:
1. Access to account signals data
2. Validation of the weighting logic
