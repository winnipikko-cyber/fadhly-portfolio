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

// Kage already falls back when renderer creation throws. Add a second safety net
// for the harder failure mode: a boot job/promise that never settles. After a
// bounded wait, unlock the readable portfolio and hide the WebGL canvas rather
// than leaving visitors trapped behind a 0%/partial loader forever.
const bootWatchdog = `\n<script id="faj-cirebon-boot-watchdog">\n(() => {\n  const TIMEOUT = 9000;\n  setTimeout(() => {\n    const pre = document.getElementById('pre');\n    if (!pre || pre.classList.contains('done')) return;\n    console.warn('[cirebon] boot watchdog released a stalled loader');\n    document.documentElement.classList.add('no-webgl');\n    document.body.classList.add('no-webgl');\n    document.body.classList.remove('is-locked');\n    pre.classList.add('done');\n    const gl = document.getElementById('gl');\n    if (gl) gl.style.display = 'none';\n    document.querySelectorAll('[data-rv], .mask-line').forEach((el) => el.classList.add('rv-in'));\n  }, TIMEOUT);\n})();\n</script>\n`;
if (!html.includes('id="faj-cirebon-boot-watchdog"')) {
  if (!html.includes('</body>')) throw new Error('Cirebon boot-watchdog body anchor missing');
  html = html.replace('</body>', bootWatchdog + '</body>');
}

// Build-time invariants for the current public lock.
if (/ChoSSI|\/work\/chossi\//i.test(html)) {
  throw new Error('Cirebon speed/perf gate failed: ChoSSI reappeared in public output');
}
if (/>Mausu</i.test(html) || /<b>Mausu<\/b>/i.test(html)) {
  throw new Error('Cirebon speed/perf gate failed: Mausu Bouqet was shortened');
}
for (const token of ['faj-cirebon-boot-watchdog', 'const TIMEOUT = 9000', "document.body.classList.remove('is-locked')"]) {
  if (!html.includes(token)) throw new Error(`Cirebon boot-watchdog gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
