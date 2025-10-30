#!/usr/bin/env node

/**
 * Pre-publish script that updates workspace dependencies to published versions
 * This ensures packages can be published with correct dependency versions
 */

const fs = require("node:fs");
const path = require("node:path");

// Read the current version of a package
function getPackageVersion(packageName) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  return packageJson.version;
}

function bumpPackageVersion(packageName) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  const versionParts = packageJson.version.split(".");
  const major = parseInt(versionParts[0], 10);
  const minor = parseInt(versionParts[1], 10);

  // Bump minor version, reset patch to 0
  const newVersion = `${major}.${minor + 1}.0`;
  packageJson.version = newVersion;

  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(
    `📈 Bumped ${packageName} from ${versionParts.join(".")} to ${newVersion}`,
  );

  return newVersion;
}

// Store original versions for potential rollback
const originalVersions = {};

// Store original version before bumping
function storeOriginalVersion(packageName) {
  originalVersions[packageName] = getPackageVersion(packageName);
}

// Restore original version
function restoreOriginalVersion(packageName) {
  if (!originalVersions[packageName]) return;

  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  packageJson.version = originalVersions[packageName];
  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(
    `🔄 Restored ${packageName} to version ${originalVersions[packageName]}`,
  );
}

// Define which packages depend on which other packages
const packageDependencies = {
  agents: ["debug", "memory"],
  "ai-sdk-tools": [
    "agents",
    "artifacts",
    "cache",
    "devtools",
    "memory",
    "store",
  ],
  artifacts: ["store"],
  cache: ["artifacts"],
  devtools: ["store"],
  memory: ["debug"],
};

// Generate dynamic package configurations
const packages = Object.entries(packageDependencies).map(
  ([packageName, deps]) => {
    const dependencies = {};
    deps.forEach((dep) => {
      dependencies[`@ai-sdk-tools/${dep}`] = `^${getPackageVersion(dep)}`;
    });
    return { name: packageName, dependencies };
  },
);

function updatePackageJson(packageName, dependencies) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );

  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  // Move workspace dependencies from devDependencies to dependencies
  for (const [depName, version] of Object.entries(dependencies)) {
    if (packageJson.devDependencies?.[depName]) {
      delete packageJson.devDependencies[depName];
      console.log(`  📦 Moved ${depName} from devDependencies to dependencies`);
    }
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.dependencies[depName] = version;
    console.log(`  📦 Set ${depName} to version ${version}`);
  }

  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(`✅ Updated ${packageName} dependencies for publishing`);
}

function restorePackageJson(packageName, dependencies) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  // Move dependencies back to devDependencies as workspace dependencies
  for (const [depName] of Object.entries(dependencies)) {
    if (packageJson.dependencies?.[depName]) {
      delete packageJson.dependencies[depName];
      console.log(`  📦 Moved ${depName} from dependencies to devDependencies`);
    }
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies[depName] = "workspace:*";
    console.log(`  📦 Set ${depName} to workspace:*`);
  }

  fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(`✅ Restored ${packageName} to development mode`);
}

const command = process.argv[2];

if (command === "prepare") {
  console.log("🚀 Preparing packages for publishing...");

  // First, store original versions
  console.log("💾 Storing original versions...");
  const allPackages = Object.keys(packageDependencies);
  allPackages.forEach((pkgName) => {
    storeOriginalVersion(pkgName);
  });

  // Then bump all package versions
  console.log("📈 Bumping package versions...");
  allPackages.forEach((pkgName) => {
    bumpPackageVersion(pkgName);
  });

  // Finally update dependencies with the new versions
  console.log("📦 Updating dependencies...");
  packages.forEach((pkg) => {
    updatePackageJson(pkg.name, pkg.dependencies);
  });
} else if (command === "restore") {
  console.log("🔄 Restoring packages to development mode...");

  // First restore dependencies
  packages.forEach((pkg) => {
    restorePackageJson(pkg.name, pkg.dependencies);
  });

  // Then restore original versions
  console.log("🔄 Restoring original versions...");
  const allPackages = Object.keys(packageDependencies);
  allPackages.forEach((pkgName) => {
    restoreOriginalVersion(pkgName);
  });
} else if (command === "bump") {
  console.log("📈 Bumping package versions only...");

  // Store original versions
  console.log("💾 Storing original versions...");
  const allPackages = Object.keys(packageDependencies);
  allPackages.forEach((pkgName) => {
    storeOriginalVersion(pkgName);
  });

  // Bump versions
  allPackages.forEach((pkgName) => {
    bumpPackageVersion(pkgName);
  });
} else {
  console.log("Usage: node pre-publish.js [prepare|restore|bump]");
  console.log(
    "  prepare - Store versions, bump versions, update dependencies for publishing",
  );
  console.log(
    "  restore - Restore dependencies and versions to development mode",
  );
  console.log("  bump    - Bump versions only (for testing)");
  process.exit(1);
}
