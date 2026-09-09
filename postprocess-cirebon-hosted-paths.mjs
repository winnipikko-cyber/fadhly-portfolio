import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
const html = await readFile(file, 'utf8');
const relativePrefix = 'secret-pathways-assets/';
const hostedPrefix = '/cirebon/secret-pathways-assets/';

if (!html.includes(relativePrefix) && !html.includes(hostedPrefix)) {
  throw new Error('Cirebon hosted path anchor missing: secret-pathways-assets/');
}

const next = html
  .replaceAll(hostedPrefix, relativePrefix)
  .replaceAll(relativePrefix, hostedPrefix);

if (next.includes('src="secret-pathways-assets/') || next.includes('href="secret-pathways-assets/')) {
  throw new Error('Cirebon hosted asset paths are still relative after normalization.');
}

await writeFile(file, next, 'utf8');
console.log('Cirebon ThreeUI assets normalized to /cirebon/ for cleanUrls hosting.');
