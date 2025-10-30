#!/usr/bin/env node

/**
 * Check if we're in beta mode and exit if needed for stable releases
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const preJsonPath = path.join(__dirname, "..", ".changeset", "pre.json");

function isInBetaMode() {
  return fs.existsSync(preJsonPath);
}

function exitBetaMode() {
  console.log("⚠️  Detected beta mode. Exiting beta mode for stable release...");
  try {
    execSync("bun run changeset:exit-beta", {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    console.log("✅ Successfully exited beta mode");
    return true;
  } catch (error) {
    console.error("❌ Failed to exit beta mode:", error.message);
    return false;
  }
}

if (require.main === module) {
  const mode = process.argv[2];

  if (mode === "check") {
    if (isInBetaMode()) {
      console.log("⚠️  Warning: Currently in beta mode!");
      console.log(
        "   To create a stable release, beta mode will be exited first.",
      );
      console.log(
        "   If you want to create a beta release instead, use: bun run release:beta",
      );
      process.exit(1);
    } else {
      console.log("✅ Not in beta mode - ready for stable release");
      process.exit(0);
    }
  } else if (mode === "exit-if-beta") {
    if (isInBetaMode()) {
      const success = exitBetaMode();
      if (!success) {
        process.exit(1);
      }
    } else {
      console.log("✅ Not in beta mode - proceeding with stable release");
    }
  } else {
    console.log("Usage: node check-beta-mode.js [check|exit-if-beta]");
    process.exit(1);
  }
}

module.exports = { isInBetaMode, exitBetaMode };
