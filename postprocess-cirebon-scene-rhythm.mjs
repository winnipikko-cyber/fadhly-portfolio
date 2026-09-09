import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_SCENE_RHYTHM -->';
if (html.includes(marker)) process.exit(0);

const script = String.raw`${marker}
<script id="faj-cirebon-scene-rhythm">
(() => {
  const MAX_WAIT = 12000;
  const started = performance.now();

  function ready() {
    return typeof updateCirebonAssetWorld === 'function' &&
      typeof CIREBON_WORLD !== 'undefined' && CIREBON_WORLD &&
      typeof RIG !== 'undefined' && typeof ciEase === 'function';
  }

  function install() {
    if (updateCirebonAssetWorld.__fajSceneRhythm) return;
    const baseUpdate = updateCirebonAssetWorld;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionScale = reduced ? 0 : (typeof COARSE !== 'undefined' && COARSE ? .34 : 1);

    function stage(mesh, opacity) {
      if (mesh.material && mesh.material.map) mesh.material.opacity = Math.max(0, Math.min(1, opacity));
    }

    function enhancedUpdate(dt) {
      baseUpdate(dt);
      const p = Math.max(0, Math.min(1, Number.isFinite(RIG.smooth) ? RIG.smooth / 4 : 0));
      const layers = CIREBON_WORLD.layers || [];

      for (const mesh of layers) {
        const u = mesh.userData || {};
        if (!u.depthV2) continue;
        const target = Number.isFinite(u.target) ? u.target : 1;

        if (u.role === 'sky-v2') {
          stage(mesh, target * (.72 + .28 * ciEase(0, .28, p)));
          mesh.position.x = u.baseX - p * .8 * motionScale;
        } else if (u.role === 'horizon-v2') {
          stage(mesh, target * (.48 + .52 * ciEase(.05, .34, p)));
          mesh.position.x = u.baseX + p * .55 * motionScale;
        } else if (u.role && u.role.startsWith('pendopo-')) {
          const reveal = .16 + .84 * ciEase(.12, .52, p);
          stage(mesh, target * reveal);
          mesh.position.z = u.baseZ - (1 - reveal) * 1.35 * motionScale;
          mesh.position.y = u.baseY + (1 - reveal) * .22 * motionScale;
        } else if (u.role === 'ground-v2') {
          const reveal = .18 + .82 * ciEase(.08, .42, p);
          stage(mesh, target * reveal);
          mesh.position.z = u.baseZ + (1 - reveal) * 1.2 * motionScale;
        } else if (u.role === 'reflection-v2') {
          const reveal = ciEase(.31, .62, p);
          stage(mesh, target * (.08 + .92 * reveal));
          mesh.position.x = u.baseX + Math.sin(p * Math.PI) * .18 * motionScale;
        } else if (u.role === 'fg-v2') {
          const enter = ciEase(.12, .30, p);
          const leave = 1 - ciEase(.72, .93, p);
          stage(mesh, target * (.22 + .78 * enter * leave));
          mesh.position.x = u.baseX - p * .62 * motionScale;
          mesh.rotation.z = Math.sin(p * Math.PI * 1.35) * .018 * motionScale;
        }
      }
    }

    enhancedUpdate.__fajSceneRhythm = true;
    updateCirebonAssetWorld = enhancedUpdate;
  }

  function tick() {
    if (ready()) return install();
    if (performance.now() - started < MAX_WAIT) requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon scene-rhythm body anchor missing');
html = html.replace('</body>', script + '\n</body>');

if (/ChoSSI|\/work\/chossi\//i.test(html)) throw new Error('Scene rhythm reintroduced ChoSSI');
if (/<b>Mausu<\/b>|>Mausu</i.test(html)) throw new Error('Scene rhythm found shortened Mausu Bouqet');

await writeFile(file, html, 'utf8');
