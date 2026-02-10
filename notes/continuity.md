# Continuity Notes

Session-to-session context for working on Claude Parachute.

## Current State (2026-02-10)
- **v1.0 complete** — all components implemented and installed
- All 4 slash commands registered and functional
- Statusline enhanced with EJECT warning
- CLAUDE.md created with proactive warning instructions

## Implementation Decisions

### Threshold range: 30-95%
- 30% minimum: below this is too aggressive, would trigger on short sessions
- 95% maximum: above this defeats the purpose — no time to eject
- Default 70%: leaves ~30% headroom for the deploy command itself + user response

### Single RESUME.md (overwrite, not append)
- Simplicity over history — you only need the most recent session
- Avoids file bloat from accumulating old sessions
- If history is wanted later, could add timestamped archive

### Statusline reads config every refresh
- No caching mechanism needed — config file is tiny (one JSON field)
- Means `/parachute:set` changes take effect immediately
- Negligible performance impact (single small file read)

### Blink + bold red for EJECT
- Maximum visibility — this is an urgent warning
- Uses ANSI codes `\x1b[5m` (blink) + `\x1b[1;31m` (bold red)
- Note: blink support varies by terminal — some ignore it, which is fine (bold red alone is still very visible)

### CLAUDE.md auto-warn approach
- Instruction-based, not code-based — relies on Claude reading the CLAUDE.md
- Simple and effective — Claude naturally monitors conversation state
- Triggers on subjective "conversation is long" heuristic, complementing the precise statusline threshold

## Potential Future Enhancements
- **Archive**: save numbered RESUME files instead of overwriting
- **Auto-deploy**: hook that auto-deploys parachute at threshold (risky — could interrupt flow)
- **Include clipboard/selection**: capture what the user had selected
- **Multi-project**: per-project thresholds and resume files
- **Token-count based threshold**: use absolute token counts instead of percentages

## Known Limitations
- ANSI blink (`\x1b[5m`) not supported in all terminals
- RESUME.md only captures what Claude can reflect on — may miss implicit context
- Auto-warn in CLAUDE.md is heuristic — Claude may warn too early or too late
- `/parachute:set` requires the user to know valid range (30-95) — error message guides them
