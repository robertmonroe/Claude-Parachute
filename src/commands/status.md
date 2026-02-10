# Parachute Status

Show current parachute configuration and resume state.

## Instructions

1. **Read** `C:/Users/3dmax/.claude/parachute/config.json` and report both settings:
   - **threshold**: context percentage trigger (default 70%)
   - **maxTokens**: absolute token limit trigger (default 200000, or 0 = disabled)

2. **Check** if `.parachute/RESUME.md` exists in the current working directory.
   - If yes: report that a resume file exists, show its timestamp (from the first heading line), and show the Goal section.
   - If no: report "No saved session in this project."

3. **Show** a brief summary like:
   > **Parachute Status**
   > - Context threshold: 70%
   > - Token limit: 200,000
   > - Resume file: [exists — saved at TIMESTAMP / none]
