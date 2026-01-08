---
description: Automated cycle of development and review between Developer and Reviewer agents to ensure high quality and spec compliance.
---

1. **Task Identification**:
   - Read `doc/plan.md` to identify the next incomplete task (unchecked `[ ]`).
   - Identify the "Developer" instructions from `agents/03.developer.md`.

2. **Developer - Analysis & Implementation**:
   - **Context**: Act as the **Developer Agent**.
   - **Docs**: Read the relevant sections in `doc/techspec.md` for the current task.
   - **Action**: Implement the required code, configuration, or database changes.
   - **Self-Test**: Run build and basic verification commands (e.g., `./gradlew build`, `docker-compose up`).
   - **Refine**: If self-test fails, fix the issues immediately.

3. **Handover**:
   - Once the Developer is confident, transition to the Reviewer role.

4. **Reviewer - Verification**:
   - **Context**: Act as the **Reviewer Agent** (`agents/04.reviewer.md`).
   - **Docs**: Reference `doc/plan.md` "Checklist" and `doc/techspec.md`.
   - **Action**: Perform strict verification (Start app, check API responses, checking DB schema).
   - **Validation**:
     - Check if file paths match the spec.
     - Check if Naming conventions are followed.
     - Check if functionality works as expected.

5. **Decision Loop**:
   - **IF APPROVED (Pass)**:
     - Update `doc/plan.md`: Mark the task as `[x]`.
     - Update Project Progress in `doc/plan.md`.
     - **Turbo**: Automatically proceed to **Step 1** for the next task.
   - **IF REJECTED (Fail)**:
     - Log the specific reasons for failure (Issues).
     - **Turbo**: Return to **Step 2** (Developer) to fix the reported issues.
