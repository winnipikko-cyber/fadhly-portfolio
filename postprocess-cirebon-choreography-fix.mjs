import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

function must(from, to) {
  if (!html.includes(from)) throw new Error(`Cirebon choreography-fix anchor missing: ${from.slice(0, 120)}`);
  html = html.split(from).join(to);
}

// RIG.smooth is a chapter-index value (~0..4), not normalized 0..1 progress.
// The original asset staging thresholds below were inherited from normalized
// progress assumptions, which caused the gate/character/cloth/relic layers to
// finish their transitions during the opening chapter. Re-time them to the
// actual camera chapter scale so the visitor approaches, passes through, then
// discovers the deeper layers in sequence.
must(
  "if(u.role==='gate-front'||u.role==='gate-side-l'||u.role==='gate-side-r'||u.role==='gate-back'){const vis=1-ciEase(.19,.34,p);if(m.material.map)m.material.opacity=u.target*vis;}",
  "if(u.role==='gate-front'||u.role==='gate-side-l'||u.role==='gate-side-r'||u.role==='gate-back'){const vis=1-ciEase(1.38,2.10,p);if(m.material.map)m.material.opacity=u.target*vis;}"
);
must(
  "if(u.role==='character'){const vis=ciEase(.48,.58,p)*(1-ciEase(.82,.91,p));if(m.material.map)m.material.opacity=.88*vis;m.position.y=u.baseY+Math.sin(clock*.42)*.025;}",
  "if(u.role==='character'){const vis=ciEase(1.42,1.82,p)*(1-ciEase(3.02,3.58,p));if(m.material.map)m.material.opacity=.88*vis;m.position.y=u.baseY+Math.sin(clock*.42)*.025;}"
);
must(
  "if(u.role==='cloth'){const vis=ciEase(.22,.35,p)*(1-ciEase(.62,.78,p));if(m.material.map)m.material.opacity=u.target*(.28+.72*vis);}",
  "if(u.role==='cloth'){const vis=ciEase(.72,1.24,p)*(1-ciEase(2.72,3.34,p));if(m.material.map)m.material.opacity=u.target*(.22+.78*vis);}"
);
must(
  "if(u.role==='relic'){const vis=ciEase(.42,.55,p)*(1-ciEase(.82,.94,p));if(m.material.map)m.material.opacity=u.target*(.30+.70*vis);}",
  "if(u.role==='relic'){const vis=ciEase(1.72,2.12,p)*(1-ciEase(3.28,3.82,p));if(m.material.map)m.material.opacity=u.target*(.24+.76*vis);}"
);

// Release invariants: this late-stage pass must not undo the temporary project
// lock or public naming rules.
if (/ChoSSI|\/work\/chossi\//i.test(html)) throw new Error('Choreography fix reintroduced ChoSSI');
if (/<b>Mausu<\/b>|>Mausu</i.test(html)) throw new Error('Choreography fix found shortened Mausu Bouqet');

await writeFile(file, html, 'utf8');
console.log('Cirebon asset staging now follows the real 0..4 camera chapter scale.');
