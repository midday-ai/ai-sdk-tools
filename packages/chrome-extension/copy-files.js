#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

console.log("📁 Copying extension files...");

// Copy manifest and HTML files
const filesToCopy = ["manifest.json", "devtools.html"];

for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join("dist", file));
    console.log(`✅ Copied ${file}`);
  }
}

// Create icons directory and placeholder icons
if (!fs.existsSync("dist/icons")) {
  fs.mkdirSync("dist/icons", { recursive: true });
}

const iconSizes = ["16", "32", "48", "128"];
for (const size of iconSizes) {
  const iconPath = path.join("dist", "icons", `icon${size}.png`);
  // Create a minimal PNG placeholder (1x1 transparent pixel)
  const pngData = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature
    0x00,
    0x00,
    0x00,
    0x0d,
    0x49,
    0x48,
    0x44,
    0x52, // IHDR chunk
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01, // 1x1 dimensions
    0x08,
    0x06,
    0x00,
    0x00,
    0x00,
    0x1f,
    0x15,
    0xc4, // bit depth, color type, etc.
    0x89,
    0x00,
    0x00,
    0x00,
    0x0a,
    0x49,
    0x44,
    0x41, // IDAT chunk
    0x54,
    0x78,
    0x9c,
    0x63,
    0x00,
    0x01,
    0x00,
    0x00, // compressed data
    0x05,
    0x00,
    0x01,
    0x0d,
    0x0a,
    0x2d,
    0xb4,
    0x00, // CRC
    0x00,
    0x00,
    0x00,
    0x49,
    0x45,
    0x4e,
    0x44,
    0xae, // IEND chunk
    0x42,
    0x60,
    0x82,
  ]);
  fs.writeFileSync(iconPath, pngData);
  console.log(`✅ Created icon${size}.png`);
}

console.log("✅ Chrome extension files copied successfully!");
console.log("📁 Output directory: dist/");
console.log("🔧 Load the dist/ folder as an unpacked extension in Chrome");
