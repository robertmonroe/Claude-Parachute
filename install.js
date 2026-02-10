#!/usr/bin/env node
/**
 * Claude Parachute Installer
 * Copies source files to their installed locations under ~/.claude/
 */

const fs = require("fs");
const path = require("path");

const home = process.env.USERPROFILE || process.env.HOME;
if (!home) {
  console.error("Error: Could not determine home directory.");
  process.exit(1);
}

const claudeDir = path.join(home, ".claude");
const srcDir = path.join(__dirname, "src");

console.log("Installing Claude Parachute...\n");

// Files to copy (order matters — CLAUDE.md handled separately)
const copies = [
  { src: "statusline.js", dest: path.join(claudeDir, "statusline.js") },
  { src: "config.json", dest: path.join(claudeDir, "parachute", "config.json") },
  { src: "commands/deploy.md", dest: path.join(claudeDir, "commands", "parachute", "deploy.md") },
  { src: "commands/set.md", dest: path.join(claudeDir, "commands", "parachute", "set.md") },
  { src: "commands/resume.md", dest: path.join(claudeDir, "commands", "parachute", "resume.md") },
  { src: "commands/status.md", dest: path.join(claudeDir, "commands", "parachute", "status.md") },
];

// Back up existing statusline.js if it exists and differs
const statuslineDest = path.join(claudeDir, "statusline.js");
if (fs.existsSync(statuslineDest)) {
  const existing = fs.readFileSync(statuslineDest, "utf8");
  const incoming = fs.readFileSync(path.join(srcDir, "statusline.js"), "utf8");
  if (existing !== incoming) {
    const backup = path.join(claudeDir, "statusline.backup.js");
    fs.copyFileSync(statuslineDest, backup);
    console.log(`  Backed up existing statusline to ${backup}`);
  }
}

// Copy all files
for (const { src, dest } of copies) {
  const srcPath = path.join(srcDir, src);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(srcPath, dest);
  console.log(`  ${dest}`);
}

// Handle ~/CLAUDE.md — append if it exists, create if it doesn't
const claudeMdDest = path.join(home, "CLAUDE.md");
const parachuteBlock = fs.readFileSync(path.join(srcDir, "CLAUDE.md"), "utf8");
const marker = "## Parachute — Context Overflow Protection";

if (fs.existsSync(claudeMdDest)) {
  const existing = fs.readFileSync(claudeMdDest, "utf8");
  if (existing.includes(marker)) {
    console.log(`  ${claudeMdDest} (already has parachute instructions, skipped)`);
  } else {
    fs.appendFileSync(claudeMdDest, "\n" + parachuteBlock);
    console.log(`  ${claudeMdDest} (appended parachute instructions)`);
  }
} else {
  fs.writeFileSync(claudeMdDest, parachuteBlock);
  console.log(`  ${claudeMdDest} (created)`);
}

console.log("\nParachute installed. Run /parachute:status in Claude Code to verify.");
