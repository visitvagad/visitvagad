/**
 * Generate all branding assets from the source logo.
 * Run: npx tsx scripts/generate-icons.ts
 */
import sharp from 'sharp';
import { mkdirSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'src/assests/visit vagad logo.png');
const LOGO_DIR = resolve(ROOT, 'src/assets/logo');
const APP_DIR = resolve(ROOT, 'src/app');
const PUBLIC_DIR = resolve(ROOT, 'public');

const SIZES = {
  'favicon-16.png': 16,
  'favicon-32.png': 32,
  'apple-touch-icon.png': 180,
  'icon-192.png': 192,
  'icon-512.png': 512,
} as const;

async function main() {
  // Create directories
  mkdirSync(LOGO_DIR, { recursive: true });
  mkdirSync(PUBLIC_DIR, { recursive: true });

  // Copy source as canonical PNG
  copyFileSync(SOURCE, resolve(LOGO_DIR, 'visit-vagad-logo.png'));
  console.log('✓ Copied source logo to src/assets/logo/');

  // Generate sized PNGs
  for (const [name, size] of Object.entries(SIZES)) {
    await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ quality: 90 })
      .toFile(resolve(LOGO_DIR, name));
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  // Generate favicon.ico (32x32 PNG wrapped — browsers accept PNG favicons)
  await sharp(SOURCE)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(resolve(LOGO_DIR, 'favicon.ico'));
  console.log('✓ Generated favicon.ico');

  // Copy to Next.js App Router locations
  copyFileSync(resolve(LOGO_DIR, 'icon-192.png'), resolve(APP_DIR, 'icon.png'));
  copyFileSync(resolve(LOGO_DIR, 'favicon.ico'), resolve(APP_DIR, 'favicon.ico'));
  copyFileSync(resolve(LOGO_DIR, 'apple-touch-icon.png'), resolve(APP_DIR, 'apple-icon.png'));
  console.log('✓ Copied icons to src/app/ (Next.js App Router)');

  // Copy to public for manifest references
  copyFileSync(resolve(LOGO_DIR, 'icon-192.png'), resolve(PUBLIC_DIR, 'icon-192.png'));
  copyFileSync(resolve(LOGO_DIR, 'icon-512.png'), resolve(PUBLIC_DIR, 'icon-512.png'));
  copyFileSync(resolve(LOGO_DIR, 'apple-touch-icon.png'), resolve(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✓ Copied icons to public/');

  console.log('\n✅ All branding assets generated successfully.');
}

main().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
