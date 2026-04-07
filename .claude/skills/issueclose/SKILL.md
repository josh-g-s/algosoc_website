---
name: issueclose
description: Commit, push, create a PR, and optionally merge it to trigger deployment. Closes linked GitHub issues on merge.
user_invocable: true
---

When the user wants to wrap up work on the current branch, follow these steps:

1. **Check the current state:**
   - Run `git status` to see changes
   - Run `git diff --stat` to summarise what changed
   - If there are no changes, tell the user and stop

2. **Commit:**
   - Stage the relevant files (not `.env`, credentials, or generated files)
   - Write a concise commit message in imperative mood describing the "why"
   - Use a HEREDOC for the message

3. **Push:**
   - Push the branch to origin with `-u` if not yet tracked

4. **Create a PR:**
   - Derive the PR title from the branch name or commit message (under 70 characters)
   - Write a body with `## Summary` (bullet points) and `## Test plan` (checkboxes)
   - If a GitHub issue is linked to this work, add `Closes #<number>` in the PR body so it auto-closes on merge
   - To find the linked issue: check the branch name for an issue number, or search open issues with `gh issue list` for a match

5. **Ask the user** whether to merge the PR now:
   - Explain that merging to `main` triggers a build and deployment to the live site
   - If the user says **yes**: merge with `gh pr merge <number> --merge`, then `git checkout main && git pull`
   - If the user says **no** or wants to review first: stop here and give them the PR URL

**Important:**
- Never force push
- Never skip hooks
- Always confirm before merging -- deployment to production is irreversible
- If the build/CI fails after merge, alert the user immediately
