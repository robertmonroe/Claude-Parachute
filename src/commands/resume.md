# Parachute Resume

Restore context from a previous session that was saved with `/parachute`.

## Instructions

1. **Read** the resume file at `C:/Users/3dmax/.claude/parachute/RESUME.md`.
   - If it doesn't exist, tell the user: "No resume file found. Run `/parachute` in a session to save state first."

2. **Present** the saved session state to the user in a clear summary.

3. **Ask** the user what they'd like to continue working on. They may want to:
   - Pick up exactly where they left off
   - Continue with a specific remaining task
   - Adjust the plan before continuing

4. **Restore context**: Navigate to the working directory, check the git branch, review the mentioned files, and begin assisting with the chosen task.
