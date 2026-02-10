const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch {
    process.stdout.write("Claude");
    return;
  }

  const model = data?.model?.display_name || "Claude";
  const cwd = data?.workspace?.current_dir || "";
  const ctx = data?.context_window || {};
  const usedPct = Math.round(ctx.used_percentage || 0);
  const totalInput = ctx.total_input_tokens || 0;
  const totalOutput = ctx.total_output_tokens || 0;
  const ctxSize = ctx.context_window_size || 0;

  // Read parachute threshold
  let threshold = 70;
  try {
    const configPath = path.join(process.env.USERPROFILE || process.env.HOME, ".claude", "parachute", "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (config.threshold >= 30 && config.threshold <= 95) threshold = config.threshold;
  } catch {}

  // Shorten directory to last 2 components
  let shortCwd = "";
  if (cwd) {
    const parts = cwd.replace(/\\/g, "/").split("/").filter(Boolean);
    shortCwd = parts.length <= 2 ? parts.join("/") : parts.slice(-2).join("/");
  }

  // Git branch and dirty status
  let gitInfo = "";
  if (cwd) {
    try {
      const branch = execSync("git symbolic-ref --short HEAD 2>nul || git rev-parse --short HEAD 2>nul", {
        cwd,
        encoding: "utf8",
        timeout: 3000,
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
      if (branch) {
        let dirty = "";
        try {
          execSync("git diff --quiet 2>nul && git diff --cached --quiet 2>nul", {
            cwd,
            encoding: "utf8",
            timeout: 3000,
            stdio: ["pipe", "pipe", "pipe"],
          });
        } catch {
          dirty = "*";
        }
        gitInfo = ` (${branch}${dirty})`;
      }
    } catch {}
  }

  // Format token count (e.g., 45.2k / 200k)
  const fmtTokens = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);

  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const cyan = "\x1b[36m";
  const reset = "\x1b[0m";
  const boldRed = "\x1b[1;31m";
  const blink = "\x1b[5m";

  const used = totalInput + totalOutput;
  const tokenStr = ctxSize ? `${fmtTokens(used)}/${fmtTokens(ctxSize)}` : `${fmtTokens(used)}`;

  // EJECT warning when context exceeds parachute threshold
  let ctxDisplay;
  if (usedPct >= threshold) {
    ctxDisplay = `${blink}${boldRed}[EJECT! ${usedPct}% ${tokenStr}]${reset}`;
  } else {
    const ctxColor = usedPct >= 75 ? "31" : usedPct >= 50 ? "33" : "32";
    ctxDisplay = `\x1b[${ctxColor}m[${usedPct}% ${tokenStr}]${reset}`;
  }

  process.stdout.write(
    `${green}${model}${reset} ${yellow}${shortCwd}${reset}${cyan}${gitInfo}${reset} ${ctxDisplay}`
  );
});
