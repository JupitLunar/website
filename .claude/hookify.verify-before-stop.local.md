---
name: verify-before-stop
enabled: true
event: stop
pattern: .*
---

# 🛑 Mandatory Verification Check

According to **.agent/rules/primary-rules.md**:

> **Rule #2: Test is mandatory at the end.**
> **Rule #4: Verify EVERY change via Browser, Database, or Tests.**

Before completing this task, you MUST verify your changes.

## Verification Checklist
- [ ] **Browser**: Did you check the functionality in the browser (e.g. localhost)?
- [ ] **Database**: Did you verify data persistence/changes (if applicable)?
- [ ] **Tests**: Did you run relevant unit/integration tests?
- [ ] **Loop**: If verification failed, did you fix it?

**Do not stop until you have CONFIRMED functionality.**
