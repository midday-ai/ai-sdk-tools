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

// Define which packages depend on which other packages
const packageDependencies = {
  artifacts: ["store"],
  devtools: ["store"],
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
  packages.forEach((pkg) => updatePackageJson(pkg.name, pkg.dependencies));
} else if (command === "restore") {
  console.log("🔄 Restoring packages to development mode...");
  packages.forEach((pkg) => restorePackageJson(pkg.name, pkg.dependencies));
} else {
  console.log("Usage: node pre-publish.js [prepare|restore]");
  process.exit(1);
}
