#!/usr/bin/env bun

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// Check for workspace:* dependencies in publishable packages
function checkPublishedPackages(): void {
  const packagesDir = join(import.meta.dir, "../packages");
  let hasWorkspaceDeps = false;

  try {
    readdirSync(packagesDir).forEach((dir) => {
      const pkgPath = join(packagesDir, dir, "package.json");
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

        // Skip private packages
        if (pkg.private === true) {
          return;
        }

        // Check if package has publishConfig (indicating it should be published)
        const isPublishable = pkg.publishConfig || pkg.private === false;

        if (isPublishable) {
          (
            ["dependencies", "devDependencies", "peerDependencies"] as const
          ).forEach((depType) => {
            if (pkg[depType]) {
              Object.entries(pkg[depType]).forEach(([depName, version]) => {
                if (version === "workspace:*") {
                  console.error(
                    `❌ Found workspace:* dependency in publishable package`,
                  );
                  console.error(`   Package: ${pkg.name}`);
                  console.error(`   Dependency: ${depName}: ${version}`);
                  console.error(`   This will break external installation!`);
                  hasWorkspaceDeps = true;
                }
              });
            }
          });
        }
      }
    });

    if (!hasWorkspaceDeps) {
      console.log(
        "✅ No workspace:* dependencies found in publishable packages",
      );
    }
  } catch (error) {
    console.error("Error checking packages:", error);
    process.exit(1);
  }

  if (hasWorkspaceDeps) {
    process.exit(1);
  }
}

// Main execution
if (import.meta.main) {
  console.log(
    "🔍 Checking for workspace:* dependencies in publishable packages...",
  );
  checkPublishedPackages();
}
