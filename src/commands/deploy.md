# Parachute Deploy

Save full session state so anyone can resume seamlessly in a fresh chat.

State is saved to `.parachute/RESUME.md` in the current working directory — per-project, shareable, and committable.

## Instructions

You MUST do all of the following steps:

1. **Gather session state** by reflecting on the current conversation:
   - **Goal**: What is the user's current task or objective?
   - **Decisions**: Key decisions, preferences, or constraints established during this session
   - **Files modified/created**: Run `git diff --name-only` and `git diff --cached --name-only` in the active working directory to list changed files. If not in a git repo, list files you remember modifying.
   - **Progress**: What has been completed so far, and what remains to be done
   - **Blockers**: Any unresolved issues, errors, or open questions
   - **Working directory**: The current working directory path
   - **Branch**: Current git branch if applicable
   - **Important context**: Any other critical information needed to continue (API keys locations, architecture decisions, patterns established, etc.)

2. **Rotate existing resume** — Before writing, check if `.parachute/RESUME.md` already exists in the current working directory. If it does, copy it to `.parachute/RESUME-{YYYY-MM-DD-HHmmss}.md` (using the current timestamp) so previous state isn't lost.

3. **Write the resume file** — Create the `.parachute/` directory if needed, then write `.parachute/RESUME.md` in the current working directory with this structure:

```
# Parachute Resume — [TIMESTAMP]

## Goal
[What the user is working on]

## Working Directory
[Path]

## Git Branch
[Branch name or N/A]

## Key Decisions
- [Decision 1]
- [Decision 2]

## Files Modified
- [file1]
- [file2]

## Progress
### Done
- [Completed item 1]
- [Completed item 2]

### Remaining
- [TODO item 1]
- [TODO item 2]

## Blockers / Open Questions
- [Any blockers or none]

## Important Context
[Any other critical context needed to resume work]
```

4. **Confirm to the user**:
   > Parachute deployed! Session state saved to `.parachute/RESUME.md`.
   >
   > To continue in a fresh chat, say **"resume"** or run `/parachute:resume`.
   > To hand off to another developer, commit the `.parachute/` folder.
