---
name: issuecreate
description: Create a GitHub issue from a reported bug, feature request, or change, label it, and create a branch.
user_invocable: true
---

When the user reports an issue, feature request, or change, follow these steps:

1. **Determine the issue type** from the user's description:
   - `bug` -- something is broken or not working correctly
   - `enhancement` -- improvement to existing functionality
   - `documentation` -- docs need updating
   - `good first issue` -- small, well-scoped task
   - If unclear, ask the user.

2. **Draft a short, descriptive title** in imperative mood (e.g. "Fix sponsor logos not displaying on mobile", "Add dark mode toggle to header"). Keep it under 70 characters.

3. **Write the issue body** using this template:
   ```
   ## Description
   <Clear description of the issue, feature, or change needed>

   ## Context
   <Why this matters, what triggered the report>

   ## Acceptance Criteria
   - [ ] <What "done" looks like, as checkboxes>
   ```

4. **Create the issue on GitHub** using `gh issue create` with:
   - The title and body from above
   - The appropriate label(s) from: `bug`, `enhancement`, `documentation`, `good first issue`

5. **Create a branch** from `main` named after the issue:
   - Format: `<type>/<short-kebab-description>` (e.g. `fix/sponsor-logo-mobile`, `feature/dark-mode-toggle`)
   - Checkout the branch

6. **Report back** to the user with the issue URL and branch name.

**Important:**
- Always ensure you are on `main` and up to date before creating the branch (`git checkout main && git pull`)
- Never guess at labels -- only use the ones that exist in the repo
- Keep the issue body concise but complete enough for someone else to pick up
