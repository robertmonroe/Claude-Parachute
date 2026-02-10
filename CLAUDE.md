# Claude Parachute — Project Instructions

## Overview
This is the source-of-truth project folder for **Claude Parachute**, a context overflow and token truncation protection system for Claude Code. The installed files live under `~/.claude/` — this folder is for documentation, development notes, and version tracking.

## Architecture
Parachute has 4 components:
1. **Statusline** (`~/.claude/statusline.js`) — visual EJECT warning with two triggers: context overflow (`EJECT:ctx`) and token truncation (`EJECT:tokens`)
2. **Slash commands** (`~/.claude/commands/parachute/`) — `/parachute`, `/parachute:set`, `/parachute:resume`, `/parachute:status`
3. **Config** (`~/.claude/parachute/config.json`) — threshold and maxTokens settings
4. **CLAUDE.md** (`~/CLAUDE.md`) — instructs Claude to proactively warn about high context

## Installed File Locations
| Component | Path |
|-----------|------|
| Config | `~/.claude/parachute/config.json` |
| Resume state | `{project}/.parachute/RESUME.md` (per-project, created at runtime) |
| Statusline | `~/.claude/statusline.js` |
| Deploy command | `~/.claude/commands/parachute/deploy.md` |
| Set command | `~/.claude/commands/parachute/set.md` |
| Resume command | `~/.claude/commands/parachute/resume.md` |
| Status command | `~/.claude/commands/parachute/status.md` |
| Auto-warn | `~/CLAUDE.md` |

## Key Conventions
- Threshold range: 30–95% (validated by `/parachute:set`)
- Default threshold: 70%, default maxTokens: 200000
- Resume files are per-project (`.parachute/RESUME.md` in the working directory)
- Existing RESUME.md is rotated to timestamped archive before overwriting
- Resume files can be committed and shared for developer handoff
- Statusline reads config on every refresh (no caching)
