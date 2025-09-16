#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// Read workspace packages to get package names
function getWorkspacePackageNames(): Set<string> {
  const packages = new Set<string>();
  const packagesDir = join(import.meta.dir, "../packages");

  try {
    readdirSync(packagesDir).forEach((dir) => {
      const pkgPath = join(packagesDir, dir, "package.json");
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.name) {
          packages.add(pkg.name);
        }
      }
    });
  } catch (error) {
    console.error("Error reading workspace packages:", error);
    process.exit(1);
  }

  return packages;
}

// Restore workspace:* deps in current package.json
function restoreDeps(): void {
  const pkgPath = join(process.cwd(), "package.json");

  if (!existsSync(pkgPath)) {
    console.error("No package.json found in current directory");
    process.exit(1);
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const workspacePackages = getWorkspacePackageNames();

    let changed = false;

    (["dependencies", "devDependencies", "peerDependencies"] as const).forEach(
      (depType) => {
        if (pkg[depType]) {
          Object.keys(pkg[depType]).forEach((depName) => {
            if (
              workspacePackages.has(depName) &&
              pkg[depType][depName] !== "workspace:*"
            ) {
              const oldVersion = pkg[depType][depName];
              pkg[depType][depName] = "workspace:*";
              changed = true;
              console.log(`✓ Restored ${depName}: ${oldVersion} → workspace:*`);
            }
          });
        }
      },
    );

    if (changed) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log(`✓ Updated ${pkgPath}`);
    } else {
      console.log("ℹ No workspace dependencies found to restore");
    }
  } catch (error) {
    console.error("Error restoring dependencies:", error);
    process.exit(1);
  }
}

// Main execution
if (import.meta.main) {
  console.log("🔄 Restoring workspace dependencies...");
  restoreDeps();
  console.log("✅ Workspace dependency restoration complete");
}
