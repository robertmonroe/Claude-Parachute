# Architecture

## System Diagram

```
User's Claude Code Session
|
|-- statusline.js (reads config, shows EJECT warning)
|       |
|       +-- ~/.claude/parachute/config.json  { threshold: 70 }
|
|-- CLAUDE.md (proactive warning instructions)
|
|-- Slash Commands
|       |
|       +-- /parachute          (deploy.md)  --> writes RESUME.md
|       +-- /parachute:set N    (set.md)     --> writes config.json
|       +-- /parachute:resume   (resume.md)  --> reads RESUME.md
|       +-- /parachute:status   (status.md)  --> reads config.json + RESUME.md
|
+-- Runtime State
        |
        +-- ~/.claude/parachute/RESUME.md  (created by /parachute)
```

## Data Flow

### Warning Flow
```
statusline.js refresh
  -> read config.json (get threshold)
  -> compare context_window.used_percentage vs threshold
  -> if >= threshold: render [EJECT! XX% tokens] in bold red blink
  -> if < threshold: render normal [XX% tokens] in green/yellow/red
```

### Deploy Flow
```
User runs /parachute
  -> Claude reads deploy.md instructions
  -> Claude reflects on conversation (goal, decisions, files, progress)
  -> Claude runs git diff for file list
  -> Claude writes RESUME.md with structured state
  -> Claude confirms with resume instructions
```

### Resume Flow
```
User starts fresh chat, runs /parachute:resume
  -> Claude reads resume.md instructions
  -> Claude reads RESUME.md
  -> Claude presents summary
  -> Claude asks what to continue
  -> Claude restores working context (cd, check branch, review files)
```

## File Ownership

| File | Written By | Read By |
|------|-----------|---------|
| config.json | `/parachute:set` | statusline.js, `/parachute:status` |
| RESUME.md | `/parachute` (deploy) | `/parachute:resume`, `/parachute:status` |
| statusline.js | Manual / setup | Claude Code runtime |
| deploy.md | Manual / setup | Claude (as command template) |
| CLAUDE.md | Manual / setup | Claude (as system instructions) |
