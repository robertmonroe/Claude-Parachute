#!/usr/bin/env node
/**
 * Claude Parachute Installer
 * Copies source files to their installed locations under ~/.claude/
 */

const fs = require("fs");
const path = require("path");

const home = process.env.USERPROFILE || process.env.HOME;
const claudeDir = path.join(home, ".claude");
const srcDir = path.join(__dirname, "src");

const copies = [
  { src: "statusline.js", dest: path.join(claudeDir, "statusline.js") },
  { src: "config.json", dest: path.join(claudeDir, "parachute", "config.json") },
  { src: "commands/deploy.md", dest: path.join(claudeDir, "commands", "parachute", "deploy.md") },
  { src: "commands/set.md", dest: path.join(claudeDir, "commands", "parachute", "set.md") },
  { src: "commands/resume.md", dest: path.join(claudeDir, "commands", "parachute", "resume.md") },
  { src: "commands/status.md", dest: path.join(claudeDir, "commands", "parachute", "status.md") },
  { src: "CLAUDE.md", dest: path.join(home, "CLAUDE.md") },
];

for (const { src, dest } of copies) {
  const srcPath = path.join(srcDir, src);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(srcPath, dest);
  console.log(`  ${dest}`);
}

console.log("\nParachute installed. Run /parachute:status in Claude Code to verify.");
