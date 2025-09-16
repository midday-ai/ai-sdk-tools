#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

// Read workspace packages to get current versions
function getWorkspaceVersions(): Record<string, string> {
  const packages: Record<string, string> = {};
  const packagesDir = join(import.meta.dir, "../packages");

  try {
    readdirSync(packagesDir).forEach((dir) => {
      const pkgPath = join(packagesDir, dir, "package.json");
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.name && pkg.version) {
          packages[pkg.name] = pkg.version;
        }
      }
    });
  } catch (error) {
    console.error("Error reading workspace packages:", error);
    process.exit(1);
  }

  return packages;
}

// Transform workspace:* deps in current package.json
function transformDeps(): void {
  const pkgPath = join(process.cwd(), "package.json");

  if (!existsSync(pkgPath)) {
    console.error("No package.json found in current directory");
    process.exit(1);
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    const versions = getWorkspaceVersions();

    let changed = false;

    (["dependencies", "devDependencies", "peerDependencies"] as const).forEach(
      (depType) => {
        if (pkg[depType]) {
          Object.keys(pkg[depType]).forEach((depName) => {
            if (pkg[depType][depName] === "workspace:*" && versions[depName]) {
              const newVersion = `^${versions[depName]}`;
              pkg[depType][depName] = newVersion;
              changed = true;
              console.log(
                `✓ Transformed ${depName}: workspace:* → ${newVersion}`,
              );
            }
          });
        }
      },
    );

    if (changed) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
      console.log(`✓ Updated ${pkgPath}`);
    } else {
      console.log("ℹ No workspace dependencies found to transform");
    }
  } catch (error) {
    console.error("Error transforming dependencies:", error);
    process.exit(1);
  }
}

// Main execution
if (import.meta.main) {
  console.log("🔄 Transforming workspace dependencies...");
  transformDeps();
  console.log("✅ Workspace dependency transformation complete");
}
