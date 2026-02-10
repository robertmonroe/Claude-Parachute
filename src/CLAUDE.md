# Project Instructions

## Parachute — Context Overflow Protection

When the conversation is getting long (many back-and-forth exchanges, system compression messages appearing, or context usage is high), proactively warn the user:

> "Context is getting high. Consider running `/parachute` to save state and continue fresh."

Always honor the `/parachute` command immediately when invoked — gather full session state and save it without delay.
