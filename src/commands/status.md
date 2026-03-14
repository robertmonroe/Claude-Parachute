# Parachute Status

Show current parachute configuration and resume state.

## Instructions

1. **Read** `~/.claude/parachute/config.json` and report:
   - **threshold**: context percentage trigger (default 70%)
   - **token limit**: automatically detected from the model's context window size (no manual config needed)

2. **Check** if `.parachute/RESUME.md` exists in the current working directory.
   - If yes: report that a resume file exists, show its timestamp (from the first heading line), and show the Goal section.
   - If no: report "No saved session in this project."

3. **Show** a brief summary like:
   > **Parachute Status**
   > - Context threshold: 70%
   > - Token limit: auto (from model context window)
   > - Resume file: [exists — saved at TIMESTAMP / none]
