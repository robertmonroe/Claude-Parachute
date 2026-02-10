# Parachute Status

Show current parachute configuration and resume state.

## Instructions

1. **Read** `C:/Users/3dmax/.claude/parachute/config.json` and report the current threshold.
   - If the file doesn't exist, report "Default threshold: 70%"

2. **Check** if `C:/Users/3dmax/.claude/parachute/RESUME.md` exists.
   - If yes: report that a resume file exists, show its timestamp (from the first heading line), and show the Goal section.
   - If no: report "No saved session to resume."

3. **Show** a brief summary like:
   > **Parachute Status**
   > - Threshold: 70%
   > - Resume file: [exists — saved at TIMESTAMP / none]
