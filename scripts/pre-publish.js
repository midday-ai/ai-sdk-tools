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
  // Core packages (also publish individually)
  debug: [],
  store: [],

  // Packages with internal dependencies
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
// NOTE: This function regenerates packages array with current versions
function generatePackages() {
  return Object.entries(packageDependencies).map(([packageName, deps]) => {
    const dependencies = {};
    deps.forEach((dep) => {
      dependencies[`@ai-sdk-tools/${dep}`] = `^${getPackageVersion(dep)}`;
    });
    return { name: packageName, dependencies };
  });
}

// Initial packages array (will be regenerated after version bump)
let packages = generatePackages();

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

// Store original prepublishOnly scripts
const originalPrepublishOnly = {};

function disableCleanInPrepublishOnly(packageName) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  if (packageJson.scripts?.prepublishOnly) {
    originalPrepublishOnly[packageName] = packageJson.scripts.prepublishOnly;
    // Replace clean+build with just build since dist already exists
    packageJson.scripts.prepublishOnly = "bun run build";
    fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
    console.log(
      `  🔧 Modified prepublishOnly for ${packageName} to skip clean`,
    );
  }
}

function restorePrepublishOnly(packageName) {
  const packagePath = path.join(
    __dirname,
    "..",
    "packages",
    packageName,
    "package.json",
  );
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  if (originalPrepublishOnly[packageName] !== undefined) {
    packageJson.scripts.prepublishOnly = originalPrepublishOnly[packageName];
    fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
    console.log(`  🔧 Restored prepublishOnly for ${packageName}`);
  }
}

function buildPackage(packageName) {
  const packagePath = path.join(__dirname, "..", "packages", packageName);
  const packageJsonPath = path.join(packagePath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const { execSync } = require("node:child_process");

  console.log(`  🔨 Building ${packageName}...`);

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

// Build order respecting dependencies
const buildOrder = [
  "debug",
  "store",
  "memory",
  "artifacts",
  "devtools",
  "cache",
  "agents",
  "ai-sdk-tools",
];

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

  // Regenerate packages array with bumped versions
  packages = generatePackages();

  // Build all packages FIRST (while still using workspace dependencies)
  console.log("\n🔨 Building all packages in dependency order...");
  buildOrder.forEach((pkgName) => {
    if (allPackages.includes(pkgName)) {
      buildPackage(pkgName);
    }
  });

  // THEN update dependencies with the new versions (after build completes)
  console.log("\n📦 Updating dependencies...");
  packages.forEach((pkg) => {
    updatePackageJson(pkg.name, pkg.dependencies);
  });

  // Modify prepublishOnly to skip clean (since dist already exists)
  console.log("\n🔧 Modifying prepublishOnly scripts to preserve dist...");
  buildOrder.forEach((pkgName) => {
    if (allPackages.includes(pkgName)) {
      disableCleanInPrepublishOnly(pkgName);
    }
  });
} else if (command === "restore") {
  console.log("🔄 Restoring packages to development mode...");

  // First restore prepublishOnly scripts
  console.log("🔧 Restoring prepublishOnly scripts...");
  const allPackages = Object.keys(packageDependencies);
  buildOrder.forEach((pkgName) => {
    if (allPackages.includes(pkgName)) {
      restorePrepublishOnly(pkgName);
    }
  });

  // Then restore dependencies
  console.log("📦 Restoring dependencies...");
  packages.forEach((pkg) => {
    restorePackageJson(pkg.name, pkg.dependencies);
  });

  // Finally restore original versions
  console.log("🔄 Restoring original versions...");
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
