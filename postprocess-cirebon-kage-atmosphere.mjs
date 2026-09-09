import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_KAGE_ATMOSPHERE -->';
if (html.includes(marker)) process.exit(0);

const block = String.raw`${marker}
<style id="faj-cirebon-kage-visible-atmosphere">
  /* Visibility fallback on top of the WebGL scene. These layers intentionally
     use the authored GitHub assets so the atmosphere cannot disappear because
     of WebGL depth, fog, camera framing, or mobile GPU budget decisions. */
  #faj-kage-rain-near,#faj-kage-rain-far,#faj-kage-mega,#faj-kage-torn{
    position:fixed;pointer-events:none;user-select:none;-webkit-user-drag:none;
  }
  #faj-kage-rain-near,#faj-kage-rain-far{
    inset:-14vh -10vw;z-index:54;background-repeat:repeat;background-size:760px auto;
    mix-blend-mode:screen;will-change:background-position,transform;
  }
  #faj-kage-rain-near{
    background-image:url('/cirebon-assets/fx/rain.webp');opacity:.42;
    animation:fajRainNear .72s linear infinite;
  }
  #faj-kage-rain-far{
    background-image:url('/cirebon-assets/fx/rain.webp');opacity:.24;
    background-size:1040px auto;filter:blur(.35px);
    animation:fajRainFar 1.18s linear infinite;
  }
  #faj-kage-mega{
    z-index:3;left:-16vw;top:14vh;width:min(78vw,980px);opacity:.58;
    filter:saturate(1.06) contrast(1.05);transform:rotate(-3deg);
    animation:fajMegaFloat 11s ease-in-out infinite alternate;
  }
  #faj-kage-torn{
    z-index:53;right:-5vw;top:7vh;width:min(31vw,430px);opacity:.74;
    transform-origin:88% 4%;filter:drop-shadow(0 20px 40px rgba(0,0,0,.38));
    animation:fajTornSway 7.5s ease-in-out infinite alternate;
  }
  @keyframes fajRainNear{from{background-position:0 -420px}to{background-position:-36px 420px}}
  @keyframes fajRainFar{from{background-position:120px -520px}to{background-position:40px 520px}}
  @keyframes fajMegaFloat{from{transform:translate3d(-1.5%,0,0) rotate(-3deg)}to{transform:translate3d(1.5%,1.2%,0) rotate(-2deg)}}
  @keyframes fajTornSway{from{transform:rotate(-1.8deg) translate3d(0,0,0)}to{transform:rotate(2.2deg) translate3d(-1.2%,1%,0)}}
  @media(max-width:820px){
    #faj-kage-rain-near{opacity:.38;background-size:560px auto}
    #faj-kage-rain-far{opacity:.20;background-size:760px auto}
    #faj-kage-mega{left:-38vw;top:18vh;width:122vw;opacity:.52}
    #faj-kage-torn{right:-18vw;top:11vh;width:62vw;opacity:.68}
  }
  @media(prefers-reduced-motion:reduce){
    #faj-kage-rain-near,#faj-kage-rain-far,#faj-kage-mega,#faj-kage-torn{animation:none!important}
  }
</style>
<div id="faj-kage-rain-far" aria-hidden="true"></div>
<div id="faj-kage-rain-near" aria-hidden="true"></div>
<img id="faj-kage-mega" src="/cirebon-assets/fabric/mega-mendung-cloth.webp" alt="" aria-hidden="true">
<img id="faj-kage-torn" src="/cirebon-assets/fabric/torn-cloth.webp" alt="" aria-hidden="true">
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

    plane('branding/cirebon-3d-wordmark.webp', {
      role:'cirebon-wordmark-3d', x:-1.8, y:10.9, z:-7.05,
      w:11.6, h:4.35, opacity:COARSE?.82:.90, depthWrite:false, fog:false, order:31
    });
    plane('branding/emblem.webp', {
      role:'cirebon-emblem-3d', x:5.35, y:10.1, z:-6.92,
      w:3.7, h:3.7, opacity:COARSE?.72:.80, depthWrite:false, fog:false, order:32
    });

    plane('fabric/banner.webp', {
      role:'banner-kage', x:8.5, y:9.2, z:-7.8,
      w:5.4, h:12.2, ry:-.12, sway:COARSE?0:.026, opacity:COARSE?.82:.88, order:22
    });
    plane('fabric/mega-mendung-cloth.webp', {
      role:'mega-cloth-kage', x:-8.6, y:8.7, z:-19.2,
      w:9.3, h:12.6, ry:.08, sway:COARSE?0:.034, opacity:COARSE?.78:.84, order:13
    });
    plane('fabric/torn-cloth.webp', {
      role:'torn-cloth-kage', x:-10.9, y:10.5, z:-7.4,
      w:6.5, h:13.5, ry:.16, sway:COARSE?0:.03, opacity:COARSE?.60:.70, order:24
    });
    if (!COARSE) {
      plane('fabric/umbul-umbul.webp', {
        role:'umbul-kage', x:10.8, y:9.8, z:-16.4,
        w:4.2, h:11.8, ry:-.15, sway:.04, opacity:.68, order:16
      });
    }

    const fog = cameraPlane('fx/thin-fog.webp', {
      role:'camera-fog', x:0,y:0,z:0,w:12.8,h:7.6,opacity:COARSE?.18:.23,
      depthWrite:false,fog:false,order:90
    }, {x:0,y:-.18,z:-5.5});

    const rainNear = cameraPlane('fx/rain.webp', {
      role:'camera-rain-near', x:0,y:0,z:0,w:12.6,h:7.4,opacity:COARSE?.32:.38,
      depthWrite:false,fog:false,additive:true,order:96
    }, {x:.05,y:.02,z:-4.35,rz:-.02});

    const rainFar = cameraPlane('fx/rain.webp', {
      role:'camera-rain-far', x:0,y:0,z:0,w:13.4,h:7.9,opacity:COARSE?.22:.27,
      depthWrite:false,fog:false,additive:true,order:95
    }, {x:-.18,y:.18,z:-5.25,rz:.018});

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
  'fabric/mega-mendung-cloth.webp', 'fabric/torn-cloth.webp', 'fx/rain.webp',
  'fx/thin-fog.webp', 'fx/fireflies.webp', 'fx/embers.webp',
  'faj-kage-rain-near', 'faj-kage-mega', 'faj-kage-torn'
]) {
  if (!html.includes(token)) throw new Error(`Cirebon atmosphere gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
console.log('Cirebon Kage atmosphere pass applied.');
