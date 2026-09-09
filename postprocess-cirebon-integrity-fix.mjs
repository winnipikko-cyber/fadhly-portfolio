import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

// Kage's original curriculum durations survive the content transform unless
// explicitly removed. They are not portfolio metrics, so they must never be
// presented next to real projects as if they were measured facts.
const inheritedDurations = [...html.matchAll(/<span class="t">\d+ min<\/span>/g)];
if (inheritedDurations.length !== 5) {
  throw new Error(`Expected 5 inherited Kage duration labels, found ${inheritedDurations.length}`);
}
html = html.replace(/\s*<span class="t">\d+ min<\/span>/g, '');

// The separated photographic moon replaces the procedural Kage moon only
// after its texture is successfully decoded. Until then the procedural moon
// remains a graceful fallback; once ready, hide both procedural disc + halo so
// the scene can never double-render two moons.
const moonBefore = "ciPlane('props/full-moon.webp',{role:'moon-photo',x:8.8,y:13.5,z:-38,w:9.5,h:9.5,opacity:.58,depthWrite:false,order:2});";
const moonAfter = "ciPlane('props/full-moon.webp',{role:'moon-photo',x:8.8,y:13.5,z:-38,w:9.5,h:9.5,opacity:.58,depthWrite:false,order:2,onReady:()=>{if(WORLD.moon)WORLD.moon.visible=false;if(WORLD.moonHalo)WORLD.moonHalo.visible=false;}});";
if (!html.includes(moonBefore)) throw new Error('Photographic moon anchor missing');
html = html.replace(moonBefore, moonAfter);

// Public truthfulness / temporary project locks are release gates, not notes.
if (/ChoSSI|\/work\/chossi\//i.test(html)) throw new Error('ChoSSI temporary-hide gate failed');
if (/<b>Mausu<\/b>|>Mausu<\/a>/i.test(html)) throw new Error('Mausu Bouqet naming gate failed');
if (/\b(?:14|18|21|17|22) min\b/.test(html)) throw new Error('Inherited Kage duration metric remains');

await writeFile(file, html, 'utf8');
