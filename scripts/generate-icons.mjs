import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, '../static/icons');
const svgBuffer = readFileSync(resolve(iconsDir, 'icon.svg'));

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 },
];

for (const { name, size } of sizes) {
  let pipeline = sharp(svgBuffer).resize(size, size);

  // Maskable icons need extra padding (safe zone is inner 80%)
  if (name.includes('maskable')) {
    const innerSize = Math.round(size * 0.8);
    const padding = Math.round((size - innerSize) / 2);
    pipeline = sharp(svgBuffer)
      .resize(innerSize, innerSize)
      .extend({
        top: padding, bottom: padding, left: padding, right: padding,
        background: { r: 139, g: 0, b: 0, alpha: 1 }
      });
  }

  await pipeline.png().toFile(resolve(iconsDir, name));
  console.log(`Generated ${name} (${size}x${size})`);
}

console.log('Done!');
