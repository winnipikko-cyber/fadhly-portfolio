import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const badUniform = String.raw`uPhase;\\n'+sh.vertexShader`;
const goodUniform = String.raw`uPhase;\n'+sh.vertexShader`;
const badBegin = String.raw`#include <begin_vertex>\\nfloat fh=uv.y;`;
const goodBegin = String.raw`#include <begin_vertex>\nfloat fh=uv.y;`;

if (!html.includes('FAJ_CIREBON_FINAL_V3')) throw new Error('Final V3 marker missing before shader fix');
if (!html.includes(badUniform) || !html.includes(badBegin)) throw new Error('Final V3 shader newline anchors missing');

html = html.replace(badUniform, goodUniform).replace(badBegin, goodBegin);
await writeFile(file, html, 'utf8');
console.log('Cirebon final V3 umbul shader newline fix applied.');
