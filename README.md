# Claude Parachute

Context overflow protection for Claude Code. Get a visual warning when your session is running hot, and eject with one command to save full state for seamless resume.

## The Problem

Long Claude Code sessions degrade as the context window fills up. By the time you notice, you've lost quality and may lose work context when starting fresh.

## The Solution

Parachute gives you:
- **Visual warning** — statusline flashes bold red `[EJECT! 75% 150k/200k]` when context exceeds your threshold
- **One-command save** — `/parachute` captures your full session state (goal, decisions, files changed, progress, blockers)
- **Seamless resume** — `/parachute:resume` in a fresh chat restores everything

## Commands

| Command | Description |
|---------|-------------|
| `/parachute` | Deploy — save session state and get resume instructions |
| `/parachute:resume` | Resume — restore context from last saved session |
| `/parachute:set <N>` | Set warning threshold (30-95%, default 70%) |
| `/parachute:status` | Show current threshold and whether a resume file exists |

## How It Works

### Statusline
The statusline (`~/.claude/statusline.js`) reads your threshold from config and switches the context display:
- **Below threshold**: normal green/yellow/red context indicator
- **At or above threshold**: blinking bold red `[EJECT! XX% tokens]`

### Deploy (`/parachute`)
Gathers from the current conversation:
- Goal / task objective
- Key decisions made
- Files modified (via git diff)
- What's done vs. remaining
- Blockers and open questions
- Working directory and git branch

Writes everything to `~/.claude/parachute/RESUME.md`.

### Resume (`/parachute:resume`)
Reads RESUME.md, presents the summary, asks what to continue with, and picks up work.

## Configuration

Threshold is stored in `~/.claude/parachute/config.json`:
```json
{ "threshold": 70 }
```

Change it with `/parachute:set 60` or edit the file directly.

## Installation

All files are already installed at:
- `~/.claude/statusline.js` (modified)
- `~/.claude/commands/parachute/*.md` (4 command files)
- `~/.claude/parachute/config.json`
- `~/CLAUDE.md` (auto-warn instructions)

No dependencies. No build step. Just Claude Code.
