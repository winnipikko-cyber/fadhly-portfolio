import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_KAGE_ATMOSPHERE -->';
if (html.includes(marker)) process.exit(0);

const block = String.raw`${marker}
<script id="faj-cirebon-kage-atmosphere">
(() => {
  const started = performance.now();
  const MAX_WAIT = 12000;

  function ready() {
    return typeof THREE !== 'undefined' && typeof ciPlane === 'function' &&
      typeof CIREBON_WORLD !== 'undefined' && CIREBON_WORLD && CIREBON_WORLD.group &&
      typeof camera !== 'undefined' && typeof TEMPLE_Z !== 'undefined' && typeof COARSE !== 'undefined';
  }

  function plane(rel, cfg) {
    const m = ciPlane(rel, cfg);
    m.userData.kageAtmosphere = true;
    return m;
  }

  function cameraPlane(rel, cfg, local) {
    const m = plane(rel, cfg);
    camera.add(m);
    m.position.set(local.x, local.y, local.z);
    m.rotation.set(local.rx || 0, local.ry || 0, local.rz || 0);
    return m;
  }

  function build() {
    if (CIREBON_WORLD.kageAtmosphere) return;
    CIREBON_WORLD.kageAtmosphere = true;

    // Cirebon identity is intentionally brought into the approach plane so it
    // cannot disappear behind the pendopo silhouette or the distance fog.
    plane('branding/cirebon-3d-wordmark.webp', {
      role:'cirebon-wordmark-3d', x:-1.8, y:10.9, z:-7.05,
      w:11.6, h:4.35, opacity:COARSE?.82:.90, depthWrite:false, fog:false, order:31
    });
    plane('branding/emblem.webp', {
      role:'cirebon-emblem-3d', x:5.35, y:10.1, z:-6.92,
      w:3.7, h:3.7, opacity:COARSE?.72:.80, depthWrite:false, fog:false, order:32
    });

    // Fabric layers frame the approach and make Mega Mendung part of the set,
    // not a faint decorative overlay.
    plane('fabric/banner.webp', {
      role:'banner-kage', x:8.5, y:9.2, z:-7.8,
      w:5.4, h:12.2, ry:-.12, sway:COARSE?0:.026, opacity:COARSE?.82:.88, order:22
    });
    plane('fabric/mega-mendung-cloth.webp', {
      role:'mega-cloth-kage', x:-8.6, y:8.7, z:-19.2,
      w:9.3, h:12.6, ry:.08, sway:COARSE?0:.034, opacity:COARSE?.72:.80, order:13
    });
    if (!COARSE) {
      plane('fabric/umbul-umbul.webp', {
        role:'umbul-kage', x:10.8, y:9.8, z:-16.4,
        w:4.2, h:11.8, ry:-.15, sway:.04, opacity:.68, order:16
      });
      plane('fabric/torn-cloth.webp', {
        role:'torn-cloth-kage', x:-10.9, y:10.5, z:-7.4,
        w:6.5, h:13.5, ry:.16, sway:.03, opacity:.44, order:21
      });
    }

    // Two rain sheets at different depths make rainfall read as motion instead
    // of a barely-visible texture. They are additive and stay with the camera.
    const fog = cameraPlane('fx/thin-fog.webp', {
      role:'camera-fog', x:0,y:0,z:0,w:12.8,h:7.6,opacity:COARSE?.18:.23,
      depthWrite:false,fog:false,order:90
    }, {x:0,y:-.18,z:-5.5});

    const rainNear = cameraPlane('fx/rain.webp', {
      role:'camera-rain-near', x:0,y:0,z:0,w:12.6,h:7.4,opacity:COARSE?.28:.34,
      depthWrite:false,fog:false,additive:true,order:96
    }, {x:.05,y:.02,z:-4.35,rz:-.02});

    const rainFar = cameraPlane('fx/rain.webp', {
      role:'camera-rain-far', x:0,y:0,z:0,w:13.4,h:7.9,opacity:COARSE?.18:.22,
      depthWrite:false,fog:false,additive:true,order:95
    }, {x:-.18,y:.18,z:-5.25,rz:.018});

    // Keep a light particle family even on phones; desktop gets the richer mix.
    const fireflies = cameraPlane('fx/fireflies.webp', {
      role:'camera-fireflies',x:0,y:0,z:0,w:11.2,h:6.4,opacity:COARSE?.07:.14,
      depthWrite:false,fog:false,additive:true,order:94
    }, {x:.25,y:.05,z:-4.65});

    const embers = cameraPlane('fx/embers.webp', {
      role:'camera-embers',x:0,y:0,z:0,w:10.8,h:6.1,opacity:COARSE?.04:.085,
      depthWrite:false,fog:false,additive:true,order:93
    }, {x:-.2,y:-.25,z:-4.72});

    if (!COARSE) {
      plane('fx/smoke.webp', {
        role:'smoke-kage',x:5.8,y:3.4,z:-13.8,w:9.5,h:7.4,opacity:.16,
        depthWrite:false,fog:false,order:23
      });
      plane('fx/godrays.webp', {
        role:'godrays-kage',x:-2.2,y:10.6,z:TEMPLE_Z-4.5,w:18,h:14,opacity:.13,
        depthWrite:false,fog:false,additive:true,order:17
      });
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t0 = performance.now();
    function animate(now) {
      const t = (now - t0) * .001;
      fog.position.x = Math.sin(t*.16)*.24;
      fog.position.y = -.18 + Math.sin(t*.11)*.08;

      // Different fall rates prevent the rain texture from looking like one
      // card sliding down the screen.
      rainNear.position.x = .05 + Math.sin(t*.43)*.09;
      rainNear.position.y = .02 - ((t*.72)%1)*.46;
      rainFar.position.x = -.18 + Math.sin(t*.27)*.06;
      rainFar.position.y = .18 - ((t*.43)%1)*.32;

      fireflies.position.x = .25 + Math.sin(t*.24)*.17;
      fireflies.position.y = .05 + Math.cos(t*.19)*.12;
      embers.position.y = -.25 + ((t*.08)%1)*.26;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  function tick() {
    if (ready()) return build();
    if (performance.now() - started < MAX_WAIT) requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon atmosphere body anchor missing');
html = html.replace('</body>', block + '\n</body>');

for (const token of [
  'branding/cirebon-3d-wordmark.webp', 'branding/emblem.webp', 'fabric/banner.webp',
  'fabric/mega-mendung-cloth.webp', 'fx/rain.webp', 'fx/thin-fog.webp',
  'fx/fireflies.webp', 'fx/embers.webp'
]) {
  if (!html.includes(token)) throw new Error(`Cirebon atmosphere gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
console.log('Cirebon Kage atmosphere pass applied.');
