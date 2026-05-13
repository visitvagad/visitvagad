/**
 * Environment setup automation.
 * Run: npm run setup
 *
 * - Creates .env.local from .env.example if missing
 * - Detects missing vars and auto-appends them
 * - Preserves existing values
 * - Warns about missing required secrets
 */
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');
const ENV_LOCAL = resolve(ROOT, '.env.local');
const ENV_EXAMPLE = resolve(ROOT, '.env.example');

const REQUIRED_SECRETS = ['APPWRITE_API_KEY'] as const;
const OPTIONAL_SECRETS = ['SESSION_SECRET', 'SENTRY_AUTH_TOKEN'] as const;

function main() {
  console.log('🔧 VisitVagad Environment Setup\n');

  // Step 1: Create .env.local if missing
  if (!existsSync(ENV_LOCAL)) {
    if (!existsSync(ENV_EXAMPLE)) {
      console.error('✗ .env.example not found.');
      process.exit(1);
    }
    copyFileSync(ENV_EXAMPLE, ENV_LOCAL);
    console.log('✓ Created .env.local from .env.example');
    console.log('  → Fill in your Appwrite credentials before running the app.\n');
    warnSecrets({});
    return;
  }

  console.log('✓ .env.local exists\n');

  // Step 2: Detect and append missing vars
  const localVars = parseEnv(readFileSync(ENV_LOCAL, 'utf-8'));
  const exampleVars = parseEnv(readFileSync(ENV_EXAMPLE, 'utf-8'));

  const missing: Array<{ key: string; value: string }> = [];
  for (const [key, value] of Object.entries(exampleVars)) {
    if (!(key in localVars)) {
      missing.push({ key, value });
    }
  }

  if (missing.length > 0) {
    console.log(`Found ${missing.length} missing variable(s). Appending:\n`);
    const appendLines = ['\n# ─── Auto-appended by setup ──────────────────'];
    for (const { key, value } of missing) {
      appendLines.push(`${key}=${value}`);
      console.log(`  + ${key}=${value || '(empty)'}`);
    }
    const currentContent = readFileSync(ENV_LOCAL, 'utf-8');
    writeFileSync(ENV_LOCAL, currentContent.trimEnd() + '\n' + appendLines.join('\n') + '\n');
    console.log('\n✓ Missing vars appended to .env.local');
  } else {
    console.log('✓ All vars present in .env.local');
  }

  // Step 3: Warn about secrets
  const finalVars = parseEnv(readFileSync(ENV_LOCAL, 'utf-8'));
  warnSecrets(finalVars);
}

function warnSecrets(vars: Record<string, string>) {
  console.log('\nRequired secrets:');
  let hasError = false;
  for (const key of REQUIRED_SECRETS) {
    if (vars[key]) {
      console.log(`  ✓ ${key} — set`);
    } else {
      console.log(`  ✗ ${key} — MISSING (app will not function)`);
      hasError = true;
    }
  }

  console.log('\nOptional secrets:');
  for (const key of OPTIONAL_SECRETS) {
    if (vars[key]) {
      console.log(`  ✓ ${key} — set`);
    } else {
      console.log(`  ⚠ ${key} — not set (some features disabled)`);
    }
  }

  if (hasError) {
    console.log('\n⚠ Fill in required secrets before running the app.');
  } else {
    console.log('\n✅ Environment ready.');
  }
}

function parseEnv(content: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    vars[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return vars;
}

main();
