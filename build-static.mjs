import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
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

// The approved hero artwork used to be reconstructed from many Base64 chunks in
// the visitor's browser. Rebuild those chunks once at deploy time instead, so a
// phone downloads one normal WebP and does zero Base64/Blob work at runtime.
const assetsOut = path.join(out, 'assets');
await mkdir(assetsOut, { recursive: true });

const mobileSource = path.join(root, 'assets', 'hero-mobile');
const mobileParts = (await readdir(mobileSource))
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort();
const mobileBase64 = (await Promise.all(
  mobileParts.map((name) => readFile(path.join(mobileSource, name), 'utf8'))
)).join('').replace(/\s+/g, '');
if (mobileBase64) {
  await writeFile(path.join(assetsOut, 'hero-mobile.webp'), Buffer.from(mobileBase64, 'base64'));
}

const desktopSource = path.join(root, 'assets', 'hero');
const desktopParts = (await readdir(desktopSource))
  .filter((name) => /^part-\d+\.js$/.test(name))
  .sort();
const desktopChunks = [];
for (const name of desktopParts) {
  const source = await readFile(path.join(desktopSource, name), 'utf8');
  const match = source.match(/\+'([^']+)'\s*;?\s*$/s);
  if (!match) throw new Error(`Could not parse desktop hero chunk: ${name}`);
  desktopChunks.push(match[1]);
}
if (desktopChunks.length) {
  await writeFile(path.join(assetsOut, 'hero-desktop.webp'), Buffer.from(desktopChunks.join(''), 'base64'));
}

// Chunk sources are build inputs only; don't ship them to visitors.
await rm(path.join(assetsOut, 'hero-mobile'), { recursive: true, force: true });
await rm(path.join(assetsOut, 'hero'), { recursive: true, force: true });

console.log('Static portfolio prepared in dist/ with prebuilt hero assets.');
