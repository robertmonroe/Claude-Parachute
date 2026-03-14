# Parachute Set

Configure the parachute warning threshold.

- `/parachute:set 80` — set context threshold percentage

## Instructions

The argument is: $ARGUMENTS

1. **Parse the argument**:
   - If the argument is a single number (e.g. `80`): this sets the **threshold** (context percentage).
   - Otherwise, tell the user: "Usage: `/parachute:set 80` (threshold %)"

2. **Validate**:
   - **threshold**: must be an integer between 30 and 95 (inclusive). If invalid: "Threshold must be between 30 and 95."

3. **Update** `~/.claude/parachute/config.json` — read the existing config first, merge in the changed value, and write back.

4. **Confirm**: "Parachute threshold set to **<VALUE>%**. EJECT warning fires when context exceeds this."
