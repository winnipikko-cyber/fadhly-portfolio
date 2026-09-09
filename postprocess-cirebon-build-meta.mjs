import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local';
const out = path.join(process.cwd(), 'dist', 'cirebon');
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'build-meta.txt'), `${sha}\n`, 'utf8');
console.log(`Cirebon build metadata stamped: ${sha}`);
