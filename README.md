# Claude Parachute

Context overflow and token truncation destroy your sessions. Parachute watches for both.

## The Problem

Long Claude Code sessions fail in two ways:
- **Context overflow** — quality degrades gradually as the context window fills. Claude gets dumb, starts forgetting what it's doing. By the time you notice, you've already lost coherent context.
- **Token truncation** — the window physically cuts off. Content disappears. No warning, no graceful degradation. Just gone.

## The Solution

Parachute gives you:
- **Visual warning** — statusline flashes bold red when either trigger fires. `[EJECT:ctx 75%]` for context overflow, `[EJECT:tokens 180k/200k]` for token limit. You know what hit you.
- **One-command save** — `/parachute` captures your full session state (goal, decisions, files changed, progress, blockers)
- **Seamless resume** — `/parachute:resume` in a fresh chat restores everything

## Commands

| Command | Description |
|---------|-------------|
| `/parachute` | Deploy — save session state and get resume instructions |
| `/parachute:resume` | Resume — restore context from last saved session |
| `/parachute:set <N>` | Set context threshold (30-95%, default 70%) |
| `/parachute:set maxTokens <N>` | Set token limit (default 200000, 0 to disable) |
| `/parachute:status` | Show current threshold and whether a resume file exists |

## How It Works

### Statusline
The statusline (`~/.claude/statusline.js`) reads config and watches two triggers:
- **Below both limits**: normal green/yellow/red context indicator
- **Context threshold hit**: `[EJECT:ctx 75% 150k/200k]` — quality is degrading
- **Token limit hit**: `[EJECT:tokens 180k/200k]` — content is being cut off

Token limit takes priority in the display since it's the more dangerous failure mode.

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

Both triggers are stored in `~/.claude/parachute/config.json`:
```json
{ "threshold": 70, "maxTokens": 200000 }
```

- **threshold** (30-95%) — context percentage at which quality starts degrading
- **maxTokens** — absolute token count where content gets physically truncated. Set to `0` to disable.

Change with `/parachute:set 60` or `/parachute:set maxTokens 150000`, or edit the file directly.

## Installation

```bash
git clone https://github.com/robertmonroe/Claude-Parachute.git
cd claude-parachute
node install.js
```

This copies files to:
- `~/.claude/statusline.js` — context display with EJECT warning
- `~/.claude/commands/parachute/*.md` — 4 slash commands
- `~/.claude/parachute/config.json` — threshold config
- `~/CLAUDE.md` — auto-warn instructions (appended if file already exists)

If you already have a custom `statusline.js`, the installer backs it up to `statusline.backup.js` before overwriting.

No dependencies. No build step. Just Node and Claude Code.
