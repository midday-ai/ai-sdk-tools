#!/usr/bin/env node

/**
 * Sequential publish script that builds all packages first,
 * then publishes them in dependency order so dependencies are available
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

// Define dependency order (leaf packages first)
const publishOrder = [
  "debug", // No dependencies
  "store", // No dependencies
  "memory", // Depends on debug
  "artifacts", // Depends on store
  "devtools", // Depends on store
  "cache", // Depends on artifacts
  "agents", // Depends on debug, memory
  "ai-sdk-tools", // Depends on everything
];

function getPackagePath(packageName) {
  return path.join(__dirname, "..", "packages", packageName);
}

function getPackageJsonPath(packageName) {
  return path.join(getPackagePath(packageName), "package.json");
}

function readPackageJson(packageName) {
  const filePath = getPackageJsonPath(packageName);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writePackageJson(packageName, packageJson) {
  const filePath = getPackageJsonPath(packageName);
  fs.writeFileSync(filePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

// Store original prepublishOnly scripts
const originalPrepublishOnly = {};

function disablePrepublishOnly(packageName) {
  const packageJson = readPackageJson(packageName);
  if (packageJson.scripts?.prepublishOnly) {
    originalPrepublishOnly[packageName] = packageJson.scripts.prepublishOnly;
    // Replace with just build (no clean) since dist already exists
    packageJson.scripts.prepublishOnly = "bun run build";
    writePackageJson(packageName, packageJson);
  }
}

function restorePrepublishOnly(packageName) {
  const packageJson = readPackageJson(packageName);
  if (originalPrepublishOnly[packageName] !== undefined) {
    packageJson.scripts.prepublishOnly = originalPrepublishOnly[packageName];
    writePackageJson(packageName, packageJson);
  }
}

function buildPackage(packageName) {
  console.log(`\n🔨 Building ${packageName}...`);
  const packagePath = getPackagePath(packageName);
  const packageJson = readPackageJson(packageName);

  // Check if clean script exists, otherwise just build
  const hasCleanScript = packageJson.scripts?.clean;
  if (hasCleanScript) {
    execSync("bun run clean && bun run build", {
      cwd: packagePath,
      stdio: "inherit",
    });
  } else {
    execSync("bun run build", {
      cwd: packagePath,
      stdio: "inherit",
    });
  }
}

function publishPackage(packageName) {
  console.log(`\n📦 Publishing ${packageName}...`);
  const packagePath = getPackagePath(packageName);
  // Temporarily disable clean in prepublishOnly
  disablePrepublishOnly(packageName);

  try {
    execSync("npm publish", {
      cwd: packagePath,
      stdio: "inherit",
    });
    console.log(`✅ Published ${packageName}`);
  } finally {
    // Restore original prepublishOnly
    restorePrepublishOnly(packageName);
  }
}

async function main() {
  console.log("🚀 Building all packages first...\n");

  // Build all packages in dependency order
  for (const packageName of publishOrder) {
    buildPackage(packageName);
  }

  console.log("\n✅ All packages built successfully!\n");
  console.log("📦 Publishing packages sequentially...\n");

  // Publish packages sequentially
  for (const packageName of publishOrder) {
    publishPackage(packageName);
  }

  console.log("\n🎉 All packages published successfully!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
