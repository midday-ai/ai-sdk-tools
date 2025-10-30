#!/usr/bin/env node

/**
 * Strip beta suffixes from package versions before stable release
 * This ensures that when changesets versions packages, it uses stable versions
 */

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const packagesToCheck = [
  "debug",
  "store",
  "memory",
  "artifacts",
  "devtools",
  "cache",
  "agents",
  "ai-sdk-tools",
];

function stripBetaVersion(packageName) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );

  if (!fs.existsSync(packagePath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const currentVersion = packageJson.version;

  if (!currentVersion.includes("-beta.")) {
    return; // Already stable version
  }

  // Extract base version from beta version (e.g., 1.0.0-beta.4 -> 1.0.0)
  const betaMatch = currentVersion.match(/^(.+)-beta\.\d+$/);
  if (betaMatch) {
    const baseVersion = betaMatch[1];
    packageJson.version = baseVersion;
    fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
    console.log(
      `✅ Stripped beta suffix from ${packageName}: ${currentVersion} -> ${baseVersion}`,
    );
  }
}

if (require.main === module) {
  console.log("🧹 Cleaning beta versions from packages...\n");

  packagesToCheck.forEach((pkgName) => {
    stripBetaVersion(pkgName);
  });

  console.log("\n✅ Beta versions cleaned. Ready for stable release.");
}

module.exports = { stripBetaVersion };
