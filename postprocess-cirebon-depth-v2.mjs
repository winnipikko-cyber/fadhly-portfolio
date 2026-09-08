import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_DEPTH_V2 -->';
if (html.includes(marker)) process.exit(0);

const depthV2 = String.raw`${marker}
<script id="faj-cirebon-depth-v2">
(() => {
  const MAX_WAIT = 12000;
  const started = performance.now();
  let composeQueued = false;

  function ready() {
    return typeof THREE !== 'undefined' &&
      typeof ciPlane === 'function' &&
      typeof CIREBON_WORLD !== 'undefined' &&
      CIREBON_WORLD && CIREBON_WORLD.group &&
      typeof TEMPLE_Z !== 'undefined';
  }

  function add(rel, cfg) {
    const m = ciPlane(rel, cfg);
    m.userData.depthV2 = true;
    return m;
  }

  function compose() {
    if (CIREBON_WORLD.depthV2) return;
    CIREBON_WORLD.depthV2 = true;

    // Distant atmosphere: deliberately sparse on coarse/mobile devices.
    // The base world already owns the photographic moon, so V2 adds only
    // complementary sky/horizon layers to avoid translucent double exposure.
    add('backgrounds/mega-mendung-cloudscape.webp', {
      role:'sky-v2', x:-7.5, y:13.6, z:TEMPLE_Z-18,
      w:31, h:17.4, opacity:.19, depthWrite:false, fog:false, order:2
    });

    if (!COARSE) {
      add('backgrounds/temple-island-silhouette.webp', {
        role:'horizon-v2', x:-2, y:5.6, z:TEMPLE_Z-13.5,
        w:30, h:10, opacity:.24, depthWrite:false, order:3
      });
    }

    // Pendopo breakup: the night silhouette remains the readable mass while
    // independent architectural planes create parallax and camera-readable depth.
    add('architecture/pendopo-base.webp', {
      role:'pendopo-base-v2', x:0, y:2.2, z:TEMPLE_Z+2.35,
      w:23.5, h:8.8, opacity:.68, order:9
    });
    add('architecture/pendopo-roof.webp', {
      role:'pendopo-roof-v2', x:0, y:10.0, z:TEMPLE_Z+1.75,
      w:25.5, h:10.2, opacity:.78, order:10
    });
    add('architecture/pendopo-beam.webp', {
      role:'pendopo-beam-v2', x:0, y:7.35, z:TEMPLE_Z+1.35,
      w:20.5, h:6.7, opacity:.58, order:11
    });

    if (!COARSE) {
      add('architecture/pendopo-pillar.webp', {
        role:'pendopo-pillar-v2', x:-6.6, y:6.0, z:TEMPLE_Z+.82,
        w:5.1, h:11.4, opacity:.68, ry:.05, order:12
      });
      add('architecture/pendopo-pillar.webp', {
        role:'pendopo-pillar-v2', x:6.5, y:6.0, z:TEMPLE_Z+.44,
        w:5.1, h:11.4, opacity:.64, ry:-.06, order:12
      });
      add('architecture/pendopo-ornament.webp', {
        role:'pendopo-ornament-v2', x:0, y:9.15, z:TEMPLE_Z+.15,
        w:8.6, h:8.6, opacity:.5, order:13
      });
    }

    // Ground planes are tilted into perspective so the camera actually travels
    // over a layered court instead of reading every asset as a vertical poster.
    add('ground/stone-stairs.webp', {
      role:'ground-v2', x:0, y:.25, z:-11.4,
      w:16.5, h:11.8, rx:-Math.PI*.34, opacity:.72, order:9
    });
    add('ground/wet-courtyard.webp', {
      role:'ground-v2', x:0, y:-.42, z:TEMPLE_Z+8.5,
      w:33, h:24, rx:-Math.PI*.43, opacity:.34, order:5
    });

    if (!COARSE) {
      add('ground/puddle-reflection.webp', {
        role:'reflection-v2', x:4.2, y:-.18, z:-18.5,
        w:11, h:7.8, rx:-Math.PI*.42, opacity:.25,
        depthWrite:false, additive:true, fog:false, order:10
      });
      // Keep one extra asymmetric foreground branch; the base world already
      // contains its own large tropical tree and jungle cluster.
      add('foliage/frangipani-branch.webp', {
        role:'fg-v2', x:-11.2, y:8.4, z:-3.6,
        w:10.8, h:14.2, ry:.12, opacity:.61, order:19
      });
    }
  }

  function scheduleCompose() {
    if (composeQueued || CIREBON_WORLD.depthV2) return;
    composeQueued = true;

    // Desktop can afford the complete authored scene immediately. On phones,
    // protect the first meaningful frame from competing texture uploads: let
    // the base Kage world render first, then hydrate Depth V2 on first scroll
    // or when the browser has an idle slice. The timeout guarantees the scene
    // still completes even when the visitor does not interact immediately.
    if (!COARSE) return compose();

    let completed = false;
    const run = () => {
      if (completed) return;
      completed = true;
      removeEventListener('scroll', onFirstScroll);
      compose();
    };
    const onFirstScroll = () => run();
    addEventListener('scroll', onFirstScroll, { passive:true, once:true });

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout:2200 });
    } else {
      setTimeout(run, 1400);
    }
  }

  function tick() {
    if (ready()) return scheduleCompose();
    if (performance.now() - started < MAX_WAIT) requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon depth-v2 body anchor missing');
html = html.replace('</body>', depthV2 + '\n</body>');
await writeFile(file, html, 'utf8');
