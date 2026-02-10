# Parachute Set

Configure parachute warning triggers. Two modes:

- `/parachute:set 80` — set context threshold percentage
- `/parachute:set maxTokens 150000` — set token limit

## Instructions

The argument is: $ARGUMENTS

1. **Parse the argument**:
   - If the argument is a single number (e.g. `80`): this sets the **threshold** (context percentage).
   - If the argument starts with `maxTokens` followed by a number (e.g. `maxTokens 150000`): this sets the **maxTokens** (absolute token limit).
   - Otherwise, tell the user: "Usage: `/parachute:set 80` (threshold %) or `/parachute:set maxTokens 150000` (token limit)"

2. **Validate**:
   - **threshold**: must be an integer between 30 and 95 (inclusive). If invalid: "Threshold must be between 30 and 95."
   - **maxTokens**: must be a positive integer (at least 10000). Use 0 to disable. If invalid: "maxTokens must be a positive integer (minimum 10000), or 0 to disable."

3. **Update** `C:/Users/3dmax/.claude/parachute/config.json` — read the existing config first, merge in the changed value, and write back. This preserves the other setting.

4. **Confirm**:
   - For threshold: "Parachute threshold set to **<VALUE>%**. EJECT warning fires when context exceeds this."
   - For maxTokens: "Parachute token limit set to **<VALUE>**. EJECT warning fires when total tokens reach this."
