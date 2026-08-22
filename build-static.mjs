import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
const excluded = new Set([
  '.git',
  '.github',
  '.vercel',
  'dist',
  'node_modules',
  'package.json',
  'package-lock.json',
  'vercel.json',
  'build-static.mjs',
  '.vercel-redeploy',
  'README.md'
]);

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (excluded.has(entry.name) || entry.name.startsWith('.')) continue;
  await cp(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
}

// Files placed in /public are intended to be reachable from the site root.
const publicDir = path.join(root, 'public');
try {
  for (const entry of await readdir(publicDir, { withFileTypes: true })) {
    await cp(path.join(publicDir, entry.name), path.join(out, entry.name), { recursive: true, force: true });
  }
} catch {
  // No public directory is fine.
}

console.log('Static portfolio prepared in dist/');
