# Claude Code Parachute

![Claude Code Parachute — Deploy Before You Crash](images/claude-code-parachute.jpg)

Context overflow destroys your sessions. Parachute watches and warns you before it's too late.

## The Problem

Long Claude Code sessions fail when the context window fills up — quality degrades gradually as Claude gets dumb, starts forgetting what it's doing. By the time you notice, you've already lost coherent context.

## The Solution

Parachute gives you:
- **Visual warning** — statusline flashes bold red `[EJECT:ctx 75%]` when context usage exceeds your threshold
- **Dynamic token display** — always shows actual tokens used vs the model's real context window (works with 200k, 1M, or any future size)
- **One-command save** — `/parachute` captures your full session state (goal, decisions, files changed, progress, blockers)
- **Seamless resume** — `/parachute:resume` in a fresh chat restores everything

## Commands

| Command | Description |
|---------|-------------|
| `/parachute` | Deploy — save session state and get resume instructions |
| `/parachute:resume` | Resume — restore context from last saved session |
| `/parachute:set <N>` | Set context threshold (30-95%, default 70%) |
| `/parachute:status` | Show current threshold and whether a resume file exists |

## How It Works

### Statusline
The statusline (`~/.claude/statusline.js`) reads your threshold config and the model's actual context window size:
- **Below threshold**: normal green/yellow/red dual progress bars — `Context ████░░░░ 35%  Tokens ██░░░░░░ 24k/1M`
- **Threshold hit**: `[EJECT:ctx 75%]` — bold red blink warning, time to deploy

The token limit is always the real `context_window_size` reported by Claude Code — no hardcoded values. Switch between 200k and 1M models and the display adapts automatically.

### Deploy (`/parachute`)
Gathers from the current conversation:
- Goal / task objective
- Key decisions made
- Files modified (via git diff)
- What's done vs. remaining
- Blockers and open questions
- Working directory and git branch

Writes everything to `.parachute/RESUME.md` in the current project directory. Previous resumes are rotated to timestamped archives before overwriting.

### Resume (`/parachute:resume`)
Reads `.parachute/RESUME.md` from the current project, presents the summary, asks what to continue with, and picks up work.

### Per-Project State
Resume files live in the project, not globally. This means:
- **Multiple projects** — parachute from Project A, switch to Project B, parachute that, come back to A. Each project keeps its own state.
- **Developer handoff** — commit the `.parachute/` folder and another developer with Parachute installed can run `/parachute:resume` to pick up exactly where you left off.

## Configuration

Stored in `~/.claude/parachute/config.json`:
```json
{ "threshold": 70 }
```

- **threshold** (30-95%) — context percentage at which the EJECT warning fires

Change with `/parachute:set 60` or edit the file directly.

The token limit is detected automatically from the model's context window — no configuration needed.

## Installation

```bash
git clone https://github.com/robertmonroe/Claude-Parachute.git
cd claude-parachute
node install.js
```

This copies files to:
- `~/.claude/statusline.js` — context display with EJECT warning
- `~/.claude/commands/parachute/*.md` — slash commands
- `~/.claude/parachute/config.json` — threshold config
- `~/CLAUDE.md` — auto-warn instructions (appended if file already exists)

If you already have a custom `statusline.js`, the installer backs it up to `statusline.backup.js` before overwriting.

No dependencies. No build step. Just Node and Claude Code.
