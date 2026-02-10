# Claude Parachute — Project Instructions

## Overview
This is the source-of-truth project folder for **Claude Parachute**, a context overflow protection system for Claude Code. The installed files live under `~/.claude/` — this folder is for documentation, development notes, and version tracking.

## Architecture
Parachute has 4 components:
1. **Statusline** (`~/.claude/statusline.js`) — visual EJECT warning when context exceeds threshold
2. **Slash commands** (`~/.claude/commands/parachute/`) — `/parachute`, `/parachute:set`, `/parachute:resume`, `/parachute:status`
3. **Config** (`~/.claude/parachute/config.json`) — user-configurable threshold
4. **CLAUDE.md** (`~/CLAUDE.md`) — instructs Claude to proactively warn about high context

## Installed File Locations
| Component | Path |
|-----------|------|
| Config | `~/.claude/parachute/config.json` |
| Resume state | `~/.claude/parachute/RESUME.md` (created at runtime) |
| Statusline | `~/.claude/statusline.js` |
| Deploy command | `~/.claude/commands/parachute/deploy.md` |
| Set command | `~/.claude/commands/parachute/set.md` |
| Resume command | `~/.claude/commands/parachute/resume.md` |
| Status command | `~/.claude/commands/parachute/status.md` |
| Auto-warn | `~/CLAUDE.md` |

## Key Conventions
- Threshold range: 30–95% (validated by `/parachute:set`)
- Default threshold: 70%
- RESUME.md is overwritten each time `/parachute` is deployed — only the most recent session is kept
- Statusline reads config on every refresh (no caching)
