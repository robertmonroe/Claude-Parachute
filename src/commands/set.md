# Parachute Set Threshold

Configure the context usage percentage at which the statusline shows an EJECT warning.

## Instructions

The user will provide a number as the argument (e.g. `/parachute:set 80`). The argument is: $ARGUMENTS

1. Parse the number from the argument.
2. **Validate**: The value must be an integer between 30 and 95 (inclusive). If invalid, tell the user: "Threshold must be between 30 and 95. Example: `/parachute:set 80`"
3. **Update** `C:/Users/3dmax/.claude/parachute/config.json` — write `{ "threshold": <VALUE> }` to the file.
4. **Confirm**: "Parachute threshold set to **<VALUE>%**. Statusline will show EJECT warning when context exceeds this."
