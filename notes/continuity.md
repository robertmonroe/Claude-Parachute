# Continuity Notes

Session-to-session context for working on Claude Parachute.

## Current State (2026-03-14)
- **v1.3 complete** — removed hardcoded maxTokens, token limit now dynamic from context_window_size
- All 4 slash commands registered and functional
- Statusline shows dual progress bars (context % + token count) with EJECT trigger on context threshold
- Token denominator adapts automatically to model context window (200k, 1M, etc.)
- fmtTokens updated to handle millions (displays "1M" instead of "1000k")
- Resume files are per-project (`.parachute/RESUME.md` in working directory)
- Existing resume files rotated to timestamped archives before overwriting
- Install script (`install.js`) handles setup, backs up existing statusline.js, appends to ~/CLAUDE.md
- GitHub repo: https://github.com/robertmonroe/Claude-Parachute

## Implementation Decisions

### Threshold range: 30-95%
- 30% minimum: below this is too aggressive, would trigger on short sessions
- 95% maximum: above this defeats the purpose — no time to eject
- Default 70%: leaves ~30% headroom for the deploy command itself + user response

### Dynamic token limit (v1.3)
- Removed hardcoded `maxTokens` from config — was causing 200k to show even on 1M models
- Token limit now always comes from `context_window.context_window_size` in Claude Code runtime data
- Automatically adapts when switching between model tiers (200k, 1M, future sizes)
- Simplified config to just `{ "threshold": 70 }` — one knob, not two
- Removed EJECT:tokens trigger — context percentage threshold is sufficient

### Per-project RESUME.md with rotation (v1.2)
- Resume files live at `{project}/.parachute/RESUME.md` — not global
- Enables parallel parachutes across projects and developer handoff via git
- Before overwriting, existing RESUME.md is rotated to `RESUME-{YYYY-MM-DD-HHmmss}.md`
- Keeps the most recent session prominent while preserving history

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
- **Auto-deploy**: hook that auto-deploys parachute at threshold (risky — could interrupt flow)
- **Include clipboard/selection**: capture what the user had selected
- **Per-project thresholds**: allow config overrides per project (currently global only)

## Known Limitations
- ANSI blink (`\x1b[5m`) not supported in all terminals
- RESUME.md only captures what Claude can reflect on — may miss implicit context
- Auto-warn in CLAUDE.md is heuristic — Claude may warn too early or too late
- `/parachute:set` requires the user to know valid range (30-95) — error message guides them
