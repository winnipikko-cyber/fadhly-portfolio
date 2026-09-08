import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'dist', 'cirebon', 'index.html');
const fontsFile = path.join(root, 'dist', 'cirebon', 'secret-pathways-assets', 'fonts.css');
let html = await readFile(file, 'utf8');

function mustReplace(from, to) {
  if (!html.includes(from)) throw new Error(`Cirebon optimization anchor missing: ${from.slice(0, 100)}`);
  html = html.split(from).join(to);
}

// Remove the remaining visible Kage/Japanese copy from the derivative route.
mustReplace('<div class="pre-jp jp">影の道</div>', '<div class="pre-jp">CIREBON</div>');
mustReplace('<span>Raising the mountain temple</span>', '<span>Menyiapkan ruang Cirebon</span>');
mustReplace('aria-label="Preview: Sanmon, before the bell"', 'aria-label="Preview: Kasepuhan spatial study"');
mustReplace('<div class="word-fb" aria-hidden="true">KAGE</div>', '<div class="word-fb" aria-hidden="true">CIREBON</div>');
mustReplace('<li><a href="#gate" data-cursor>The Sanmon</a></li>', '<li><a href="#gate" data-cursor>Siti Inggil</a></li>');
mustReplace('<li><a href="#pathways" data-cursor>Still Gardens</a></li>', '<li><a href="#pathways" data-cursor>Mega Mendung</a></li>');
mustReplace('<li><a href="#lessons" data-cursor>Sacred Craft</a></li>', '<li><a href="#lessons" data-cursor>Pusaka & Lapisan</a></li>');
mustReplace('<li><a href="#eternity" data-cursor>Afterlight</a></li>', '<li><a href="#eternity" data-cursor>Pantura</a></li>');
mustReplace('<h4>Practice</h4><ul>', '<h4>Elements</h4><ul>');
mustReplace('<li><a href="#lessons" data-cursor>Borrowed scenery</a></li>', '<li><a href="#lessons" data-cursor>Bata merah</a></li>');
mustReplace('<li><a href="#lessons" data-cursor>Lantern light</a></li>', '<li><a href="#lessons" data-cursor>Mega Mendung</a></li>');
mustReplace('<li><a href="#lessons" data-cursor>Charred cypress</a></li>', '<li><a href="#lessons" data-cursor>Wadasan</a></li>');
mustReplace('<li><a href="#lessons" data-cursor>Raked gravel</a></li>', '<li><a href="#lessons" data-cursor>Singa Barong</a></li>');
mustReplace("console.error('[kage] job \\\"'", "console.error('[cirebon] job \\\"'");

// Fast-first defaults. Full effects stay available through explicit query flags.
mustReplace("const HI = qs('q', COARSE ? 'low' : 'high');", "const HI = qs('q', 'low');");
mustReplace("const WANT_POST    = qs('post', '1') !== '0';", "const WANT_POST    = qs('post', '0') !== '0';");
mustReplace("const DPR_CAP      = qn('dpr', LOW ? 1.4 : 1.8);", "const DPR_CAP      = qn('dpr', LOW ? 1.15 : 1.5);");
mustReplace("function buildCardCloth() {\n  if (COARSE) return;", "function buildCardCloth() {\n  if (COARSE || qs('cloth', '0') !== '1') return;");
mustReplace("function buildWisps() {\n  if (COARSE) return;", "function buildWisps() {\n  if (COARSE || qs('wisps', '0') !== '1') return;");

// Never block the preloader at 0% waiting for a display font. The font can finish
// loading while the remaining world jobs are prepared.
mustReplace("['Reading the type', () => document.fonts && document.fonts.load('600 320px Wordmark')]", "['Preparing the type', () => {}]");

// The authored procedural material generators were sized for a showcase demo.
// Reduce their CPU/memory footprint for a portfolio route where the materials
// are mostly dark, fogged, and moving behind typography.
mustReplace('const W = 1024, H = 1024;', 'const W = 512, H = 512;');
mustReplace('const W = 512, H = 512;', 'const W = 320, H = 320;');
mustReplace('const S = 512, c = cvs(S, S), x = c.getContext(\'2d\');', 'const S = 320, c = cvs(S, S), x = c.getContext(\'2d\');');

// Give the browser a paint opportunity between world-construction jobs.
mustReplace('if (i < JOBS.length) setTimeout(step, 16); else setTimeout(start, 220);', 'if (i < JOBS.length) setTimeout(step, 28); else setTimeout(start, 120);');

// Make the low-cost mode explicit for debugging and future QA.
html = html.replace('</body>', `\n<!-- Default: fast-first WebGL. Optional review flags: ?post=1&cloth=1&wisps=1&q=high&dpr=1.5 -->\n</body>`);

await writeFile(file, html, 'utf8');

// ThreeUI's authored font sheet intentionally uses a blocking font display for
// the showcase. On a portfolio route that can make the loading state feel frozen.
// Keep the exact font bytes, but let fallback text paint immediately.
let fonts = await readFile(fontsFile, 'utf8');
if (!fonts.includes('font-display:block')) throw new Error('Cirebon font optimization anchor missing');
fonts = fonts.split('font-display:block').join('font-display:swap');
await writeFile(fontsFile, fonts, 'utf8');

console.log('Cirebon fast-first optimization applied.');
