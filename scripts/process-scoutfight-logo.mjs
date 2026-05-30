/**
 * One-off: transparent background + light-mode variant for ScoutFight logo.
 * Run: node scripts/process-scoutfight-logo.mjs
 */
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public", "scoutfight-logo.png");
const outDarkTmp = join(root, "public", "scoutfight-logo-transparent.tmp.png");
const outDark = join(root, "public", "scoutfight-logo.png");
const outLight = join(root, "public", "scoutfight-logo-light.png");

function isNearBlack(r, g, b, a) {
  return a > 8 && r < 28 && g < 28 && b < 28;
}

function isNearWhite(r, g, b, a) {
  return a > 8 && r > 210 && g > 210 && b > 210;
}

function isRed(r, g, b, a) {
  return a > 8 && r > 160 && g < 80 && b < 80;
}

async function run() {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const dark = Buffer.from(data);
  const light = Buffer.from(data);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (isNearBlack(r, g, b, a)) {
      dark[i + 3] = 0;
      light[i + 3] = 0;
      continue;
    }

    if (isNearWhite(r, g, b, a)) {
      light[i] = 24;
      light[i + 1] = 24;
      light[i + 2] = 27;
    } else if (!isRed(r, g, b, a) && r < 90 && g < 90 && b < 90) {
      light[i] = 9;
      light[i + 1] = 9;
      light[i + 2] = 11;
    }
  }

  await sharp(dark, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outDarkTmp);

  await sharp(light, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outLight);

  const fs = await import("fs/promises");
  await fs.rename(outDarkTmp, outDark);

  console.log("Wrote", outDark, "and", outLight);
}

run().catch((e) => {
  console.error(e);
  globalThis.process.exit(1);
});
