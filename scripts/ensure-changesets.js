#!/usr/bin/env node

/**
 * Check if changesets exist, create empty one if needed for stable release
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

function hasChangesets() {
  const changesetDir = path.join(__dirname, "..", ".changeset");
  if (!fs.existsSync(changesetDir)) {
    return false;
  }

  const files = fs.readdirSync(changesetDir);
  // Check if there are any .md files that aren't README.md
  const changesetFiles = files.filter(
    (file) => file.endsWith(".md") && file !== "README.md",
  );

  return changesetFiles.length > 0;
}

if (require.main === module) {
  if (!hasChangesets()) {
    console.log(
      "📝 No changesets found. Creating empty changeset for stable release...",
    );
    try {
      execSync("changeset --empty", {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      });
      console.log("✅ Empty changeset created");
    } catch (error) {
      console.error("❌ Failed to create empty changeset:", error.message);
      process.exit(1);
    }
  } else {
    console.log("✅ Changesets found, proceeding with release");
  }
}

module.exports = { hasChangesets };
