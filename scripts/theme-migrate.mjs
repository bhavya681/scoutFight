import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");

const replacements = [
  ["min-h-screen bg-zinc-950 text-foreground pb-28", "page-shell pb-28"],
  ["min-h-screen bg-zinc-950 text-foreground flex flex-col", "page-shell flex flex-col"],
  ["min-h-screen bg-zinc-950 text-foreground", "page-shell"],
  ["border-white/10", "border-border"],
  ["border-white/5", "border-border"],
  ["border-white/15", "border-border"],
  ["border-white/20", "border-border"],
  ["bg-zinc-900/95", "bg-card"],
  ["bg-zinc-900/90", "bg-card"],
  ["bg-zinc-900/80", "bg-card"],
  ["bg-zinc-900/50", "bg-muted/50"],
  ["bg-zinc-900/40", "bg-muted/40"],
  ["bg-zinc-900/30", "bg-muted/40"],
  ["bg-zinc-900", "bg-card"],
  ["bg-zinc-950/95", "bg-card"],
  ["bg-zinc-950/80", "bg-background/80"],
  ["bg-zinc-950/60", "bg-background/80"],
  ["bg-zinc-950/50", "bg-background/60"],
  ["bg-zinc-950/40", "bg-background/50"],
  ["bg-zinc-950/30", "bg-background/40"],
  ["bg-zinc-950", "bg-background"],
  ["text-zinc-400", "text-muted-foreground"],
  ["text-zinc-500", "text-muted-foreground"],
  ["text-zinc-300", "text-foreground/85"],
  ["bg-zinc-800", "bg-muted"],
  ["hover:bg-zinc-700", "hover:bg-surface-hover"],
  ["hover:bg-zinc-800", "hover:bg-muted"],
  ["from-zinc-800 to-zinc-950", "from-muted to-background"],
  ["from-zinc-950", "from-background"],
  ["via-zinc-950", "via-background"],
  ["to-zinc-950", "to-background"],
  ["bg-zinc-800 text-zinc-300", "bg-muted text-foreground/85"],
  ["bg-zinc-700", "bg-muted"],
  ["text-zinc-600", "text-muted-foreground"],
  ["text-zinc-700", "text-muted-foreground/70"],
  ["font-semibold text-white", "font-semibold text-foreground"],
  ["font-bold text-white", "font-bold text-foreground"],
  ["text-white tabular-nums", "text-foreground tabular-nums"],
  ["tracking-wide text-white", "tracking-wide text-foreground"],
  ["text-white uppercase", "text-foreground uppercase"],
  ["text-white leading", "text-foreground leading"],
  ["text-white line-clamp", "text-foreground line-clamp"],
  ["text-white flex", "text-foreground flex"],
  ["text-white truncate", "text-foreground truncate"],
  ["text-white mt-", "text-foreground mt-"],
  ["text-center font-medium text-white", "text-center font-medium text-foreground"],
  ["text-xs font-semibold text-white", "text-xs font-semibold text-foreground"],
  ["text-sm font-semibold text-white", "text-sm font-semibold text-foreground"],
  ["hover:text-white", "hover:text-foreground"],
  ["from-zinc-900", "from-card"],
  ["via-zinc-900", "via-card"],
  ["to-zinc-900", "to-card"],
  ["bg-gradient-to-br from-muted to-background", "bg-gradient-to-br from-muted to-background"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8");
  let next = content;
  for (const [a, b] of replacements) next = next.split(a).join(b);
  if (next !== content) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
console.log(`Updated ${changed} files`);
