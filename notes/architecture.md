# Architecture

## System Diagram

```
User's Claude Code Session
|
|-- statusline.js (reads config + context_window_size, shows dual progress bars + EJECT warning)
|       |
|       +-- ~/.claude/parachute/config.json  { threshold: 70 }
|       +-- context_window.context_window_size (from Claude Code runtime — 200k, 1M, etc.)
|
|-- CLAUDE.md (proactive warning instructions)
|
|-- Slash Commands
|       |
|       +-- /parachute          (deploy.md)  --> writes .parachute/RESUME.md (per-project)
|       +-- /parachute:set N    (set.md)     --> writes config.json
|       +-- /parachute:resume   (resume.md)  --> reads .parachute/RESUME.md
|       +-- /parachute:status   (status.md)  --> reads config.json + .parachute/RESUME.md
|
+-- Runtime State (per-project)
        |
        +-- {project}/.parachute/RESUME.md           (current session state)
        +-- {project}/.parachute/RESUME-{timestamp}.md  (rotated archives)
```

## Data Flow

### Warning Flow
```
statusline.js refresh
  -> read config.json (get threshold)
  -> read context_window_size from Claude Code runtime data (dynamic — adapts to any model)
  -> compute context percentage and absolute token usage
  -> single trigger:
       EJECT:ctx — context_window.used_percentage >= threshold
  -> if triggered: blink bold red "EJECT:ctx" + context bar, token bar visible
  -> if not: dual progress bars — "Context ████░░░░ 35%  Tokens ██░░░░░░ 24k/1M"
  -> bar colors: green (<50%), yellow (50-74%), red (75%+) for context; green (<70%), yellow (70-89%), red (90%+) for tokens
```

### Deploy Flow
```
User runs /parachute
  -> Claude reads deploy.md instructions
  -> Claude reflects on conversation (goal, decisions, files, progress)
  -> Claude runs git diff for file list
  -> If .parachute/RESUME.md exists, rotate to .parachute/RESUME-{timestamp}.md
  -> Claude writes .parachute/RESUME.md in current working directory
  -> Claude confirms with resume instructions
```

### Resume Flow
```
User starts fresh chat, runs /parachute:resume
  -> Claude reads resume.md instructions
  -> Claude reads .parachute/RESUME.md from current working directory
  -> Claude presents summary
  -> Claude asks what to continue
  -> Claude restores working context (check branch, review files)
```

## File Ownership

| File | Written By | Read By |
|------|-----------|---------|
| `~/.claude/parachute/config.json` | `/parachute:set` | statusline.js, `/parachute:status` |
| `{project}/.parachute/RESUME.md` | `/parachute` (deploy) | `/parachute:resume`, `/parachute:status` |
| `{project}/.parachute/RESUME-*.md` | `/parachute` (rotation) | User (manual review) |
| `~/.claude/statusline.js` | install.js | Claude Code runtime |
| `~/.claude/commands/parachute/*.md` | install.js | Claude (as command templates) |
| `~/CLAUDE.md` | install.js (appends) | Claude (as system instructions) |
