/**
 * Environment health check.
 * Run: npm run env:check
 *
 * Validates required vars, detects secret leaks, checks URL formatting.
 */
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const ENV_LOCAL = resolve(ROOT, '.env.local');

// Required for the app to function
const REQUIRED = [
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
  'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
  'APPWRITE_API_KEY',
] as const;

// Must be valid URLs
const URL_VARS = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APPWRITE_ENDPOINT',
] as const;

// Server secrets that must NEVER be NEXT_PUBLIC_
const SECRET_PATTERNS = ['API_KEY', 'SECRET', 'AUTH_TOKEN', 'PASSWORD', 'PRIVATE'];

function main() {
  console.log('🔍 VisitVagad Environment Health Check\n');

  if (!existsSync(ENV_LOCAL)) {
    console.log('✗ .env.local not found. Run: npm run setup\n');
    process.exit(1);
  }

  const vars = parseEnv(readFileSync(ENV_LOCAL, 'utf-8'));
  let errors = 0;
  let warnings = 0;

  // 1. Required vars
  console.log('Required variables:');
  for (const key of REQUIRED) {
    if (vars[key]) {
      console.log(`  ✓ ${key}`);
    } else {
      console.log(`  ✗ ${key} — MISSING`);
      errors++;
    }
  }

  // 2. URL validation
  console.log('\nURL validation:');
  for (const key of URL_VARS) {
    const val = vars[key];
    if (!val) continue;
    try {
      new URL(val);
      console.log(`  ✓ ${key} — valid`);
    } catch {
      console.log(`  ✗ ${key} — invalid URL: "${val}"`);
      errors++;
    }
  }

  // 3. Secret leak detection
  console.log('\nSecret leak detection:');
  const leaks: string[] = [];
  for (const [key, value] of Object.entries(vars)) {
    if (!key.startsWith('NEXT_PUBLIC_')) continue;
    const isSecret = SECRET_PATTERNS.some((p) => key.includes(p));
    if (isSecret && value) {
      leaks.push(key);
    }
  }
  if (leaks.length > 0) {
    for (const leak of leaks) {
      console.log(`  ✗ ${leak} — server secret exposed as NEXT_PUBLIC_!`);
    }
    errors += leaks.length;
  } else {
    console.log('  ✓ No secrets exposed to client bundle');
  }

  // 4. NODE_ENV validation
  console.log('\nNODE_ENV:');
  const nodeEnv = vars['NODE_ENV'] || process.env.NODE_ENV || 'development';
  if (['development', 'test', 'production'].includes(nodeEnv)) {
    console.log(`  ✓ ${nodeEnv}`);
  } else {
    console.log(`  ✗ Invalid NODE_ENV: "${nodeEnv}"`);
    errors++;
  }

  // 5. Optional warnings
  console.log('\nOptional services:');
  const optional = ['NEXT_PUBLIC_SENTRY_DSN', 'SESSION_SECRET', 'SENTRY_AUTH_TOKEN'];
  for (const key of optional) {
    if (vars[key]) {
      console.log(`  ✓ ${key} — configured`);
    } else {
      console.log(`  ⚠ ${key} — not set`);
      warnings++;
    }
  }

  // Summary
  console.log(`\n${'─'.repeat(40)}`);
  if (errors > 0) {
    console.log(`✗ ${errors} error(s), ${warnings} warning(s)`);
    process.exit(1);
  } else {
    console.log(`✓ All checks passed (${warnings} warning(s))`);
  }
}

function parseEnv(content: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (val) vars[key] = val;
  }
  return vars;
}

main();
