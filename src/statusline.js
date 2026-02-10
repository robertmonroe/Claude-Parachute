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

  // Read parachute config
  let threshold = 70;
  let maxTokens = 0;
  try {
    const configPath = path.join(process.env.USERPROFILE || process.env.HOME, ".claude", "parachute", "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (config.threshold >= 30 && config.threshold <= 95) threshold = config.threshold;
    if (config.maxTokens > 0) maxTokens = config.maxTokens;
  } catch {}

  // Shorten directory to last 2 components
  let shortCwd = "";
  if (cwd) {
    const parts = cwd.replace(/\\/g, "/").split("/").filter(Boolean);
    shortCwd = parts.length <= 2 ? parts.join("/") : parts.slice(-2).join("/");
  }

  // Format token count (e.g., 45.2k / 200k)
  const fmtTokens = (n) => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n);

  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";
  const boldRed = "\x1b[1;31m";
  const blink = "\x1b[5m";
  const dim = "\x1b[2m";

  const used = totalInput + totalOutput;

  // Build a bar: █ filled, ░ empty, 10 chars wide
  const mkBar = (pct) => {
    const w = 10;
    const f = Math.round((Math.min(pct, 100) / 100) * w);
    return "\u2588".repeat(f) + "\u2591".repeat(w - f);
  };

  // Context bar — percentage of context window used
  const ctxBar = mkBar(usedPct);
  const ctxColor = usedPct >= 75 ? "31" : usedPct >= 50 ? "33" : "32";

  // Token bar — absolute tokens vs limit (maxTokens or ctxSize as fallback)
  const tokLimit = maxTokens > 0 ? maxTokens : ctxSize;
  const tokPct = tokLimit > 0 ? Math.round((used / tokLimit) * 100) : 0;
  const tokBar = mkBar(tokPct);
  const tokColor = tokPct >= 90 ? "31" : tokPct >= 70 ? "33" : "32";
  const tokLabel = `${fmtTokens(used)}/${fmtTokens(tokLimit)}`;

  // Two triggers, one alarm:
  //   Context overflow — quality degrades (percentage threshold)
  //   Token truncation — content physically cut off (absolute token limit)
  const ctxTriggered = usedPct >= threshold;
  const tokTriggered = maxTokens > 0 && used >= maxTokens;

  let display;
  if (tokTriggered) {
    display = `${blink}${boldRed}EJECT:tokens ${tokBar} ${tokLabel}${reset}  Context ${ctxBar} ${usedPct}%`;
  } else if (ctxTriggered) {
    display = `${blink}${boldRed}EJECT:ctx ${ctxBar} ${usedPct}%${reset}  Tokens ${tokBar} ${tokLabel}`;
  } else {
    display = `Context \x1b[${ctxColor}m${ctxBar}${reset} ${usedPct}%  Tokens \x1b[${tokColor}m${tokBar}${reset} ${tokLabel}`;
  }

  process.stdout.write(
    `${green}${model}${reset} ${yellow}${shortCwd}${reset} ${display}`
  );
});
