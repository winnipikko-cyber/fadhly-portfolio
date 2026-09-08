import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

function must(from, to) {
  if (!html.includes(from)) throw new Error(`Cirebon speed/perf anchor missing: ${from}`);
  html = html.split(from).join(to);
}

// optimize-cirebon.mjs already establishes a fast-first baseline before this
// pass runs. This final pass tightens the highest-risk mobile/coarse path while
// preserving explicit query overrides for desktop review.
must(
  "const WANT_POST    = qs('post', '0') !== '0';",
  "const WANT_POST    = qs('post', COARSE ? '0' : '0') !== '0';"
);
must(
  "const WANT_SHADOW  = qs('shadow', LOW ? '0' : '1') !== '0';",
  "const WANT_SHADOW  = qs('shadow', (COARSE || LOW) ? '0' : '1') !== '0';"
);
must(
  "const DPR_CAP      = qn('dpr', LOW ? 1.15 : 1.5);",
  "const DPR_CAP      = qn('dpr', COARSE ? 1.08 : (LOW ? 1.15 : 1.5));"
);

// On phones, keep the strongest Cirebon silhouettes and let the WebGL world
// provide depth; trim decorative fixed-overlay work that competes for fill-rate.
const mobileCss = `\n<style id="faj-cirebon-speed-mobile">\n@media (hover:none), (max-width:820px){\n  #mega-mendung{opacity:.09!important;filter:none!important}\n  .glow{animation:none!important}\n}\n@media (prefers-reduced-motion:reduce){\n  #mega-mendung{display:none!important}\n  .glow{animation:none!important}\n}\n</style>\n`;
if (!html.includes('id="faj-cirebon-speed-mobile"')) {
  if (!html.includes('</head>')) throw new Error('Cirebon speed/perf head anchor missing');
  html = html.replace('</head>', mobileCss + '</head>');
}

// Build-time invariants for the current public lock.
if (/ChoSSI|\/work\/chossi\//i.test(html)) {
  throw new Error('Cirebon speed/perf gate failed: ChoSSI reappeared in public output');
}
if (/>Mausu</i.test(html) || /<b>Mausu<\/b>/i.test(html)) {
  throw new Error('Cirebon speed/perf gate failed: Mausu Bouqet was shortened');
}

await writeFile(file, html, 'utf8');
