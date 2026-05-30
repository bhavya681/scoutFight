/**
 * Build favicon + apple touch icon from ScoutFight logo.
 * Run: npm run generate:favicon
 */
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logo = join(root, "public", "scoutfight-logo.png");
const appDir = join(root, "src", "app");
const publicDir = join(root, "public");

const sizes = [
  { file: join(appDir, "icon.png"), size: 32 },
  { file: join(appDir, "apple-icon.png"), size: 180 },
  { file: join(publicDir, "favicon-32.png"), size: 32 },
  { file: join(publicDir, "favicon-192.png"), size: 192 },
];

for (const { file, size } of sizes) {
  await sharp(logo)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(file);
  console.log("Wrote", file);
}

console.log("Done — restart dev server to see the new favicon.");
