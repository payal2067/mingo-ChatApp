import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

function checkDir(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += checkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".js") && entry.name !== "lint.js") {
      execFileSync(process.execPath, ["--check", fullPath], { stdio: "pipe" });
      count++;
    }
  }
  return count;
}

try {
  const total = checkDir(".");
  console.log(`✓ Server lint passed: ${total} files verified with 0 errors`);
} catch (err) {
  console.error("Lint error:", err.message);
  process.exit(1);
}

