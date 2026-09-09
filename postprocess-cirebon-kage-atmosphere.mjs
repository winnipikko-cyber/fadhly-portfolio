import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_KAGE_ATMOSPHERE -->';
if (html.includes(marker)) process.exit(0);

const block = String.raw`${marker}
<style id="faj-cirebon-kage-visible-atmosphere">
  #faj-kage-rain-near,#faj-kage-rain-far,#faj-kage-mega,#faj-kage-torn{
    position:fixed;pointer-events:none;user-select:none;-webkit-user-drag:none;
  }
  #faj-kage-rain-near,#faj-kage-rain-far{
    inset:-14vh -10vw;z-index:54;background-repeat:repeat;background-size:760px auto;
    mix-blend-mode:screen;will-change:background-position,transform;opacity:.26;
  }
  #faj-kage-rain-near{background-image:url('/cirebon-assets/fx/rain.webp');opacity:.34;animation:fajRainNear .72s linear infinite}
  #faj-kage-rain-far{background-image:url('/cirebon-assets/fx/rain.webp');opacity:.18;background-size:1040px auto;filter:blur(.35px);animation:fajRainFar 1.18s linear infinite}

  /* Case-study fabrics: hidden in the architectural hero, then revealed by scroll choreography. */
  #faj-kage-mega{z-index:18;left:-10vw;top:18vh;width:min(48vw,680px);opacity:0;transform:translate3d(-8%,0,0) rotate(-3deg);filter:saturate(1.04) contrast(1.04);will-change:opacity,transform}
  #faj-kage-torn{z-index:38;right:-5vw;top:10vh;width:min(26vw,360px);opacity:0;transform:translate3d(14%,0,0) rotate(1deg);transform-origin:88% 4%;filter:drop-shadow(0 20px 40px rgba(0,0,0,.34));will-change:opacity,transform}

  @keyframes fajRainNear{from{background-position:0 -420px}to{background-position:-36px 420px}}
  @keyframes fajRainFar{from{background-position:120px -520px}to{background-position:40px 520px}}
  @media(max-width:820px){
    #faj-kage-rain-near{opacity:.31;background-size:560px auto}
    #faj-kage-rain-far{opacity:.16;background-size:760px auto}
    #faj-kage-mega{left:-34vw;top:22vh;width:82vw}
    #faj-kage-torn{right:-23vw;top:15vh;width:50vw}
  }
  @media(prefers-reduced-motion:reduce){#faj-kage-rain-near,#faj-kage-rain-far{animation:none!important}}
</style>
<div id="faj-kage-rain-far" aria-hidden="true"></div>
<div id="faj-kage-rain-near" aria-hidden="true"></div>
<img id="faj-kage-mega" src="/cirebon-assets/fabric/mega-mendung-cloth.webp" alt="" aria-hidden="true">
<img id="faj-kage-torn" src="/cirebon-assets/fabric/torn-cloth.webp" alt="" aria-hidden="true">
<script id="faj-cirebon-kage-atmosphere">
(() => {
  const started = performance.now();
  const MAX_WAIT = 12000;
  const mega = document.getElementById('faj-kage-mega');
  const torn = document.getElementById('faj-kage-torn');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v,a=0,b=1){ return Math.max(a,Math.min(b,v)); }
  function smooth(a,b,x){ const t=clamp((x-a)/Math.max(.0001,b-a)); return t*t*(3-2*t); }
  function pulse(p,a,b,c,d){ return smooth(a,b,p) * (1-smooth(c,d,p)); }

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

    /* Keep the hero architectural: gapura + pendopo remain dominant. Branding sits inside that world. */
    plane('branding/cirebon-3d-wordmark.webp', {
      role:'cirebon-wordmark-3d', x:-2.0, y:10.1, z:-9.05,
      w:9.4, h:3.5, opacity:COARSE?.56:.66, depthWrite:false, fog:true, order:18
    });
    plane('branding/emblem.webp', {
      role:'cirebon-emblem-3d', x:5.2, y:9.35, z:-8.9,
      w:2.8, h:2.8, opacity:COARSE?.48:.58, depthWrite:false, fog:true, order:19
    });

    const fog = cameraPlane('fx/thin-fog.webp', {
      role:'camera-fog',x:0,y:0,z:0,w:12.8,h:7.6,opacity:COARSE?.10:.15,
      depthWrite:false,fog:false,order:90
    }, {x:0,y:-.18,z:-5.5});

    const fireflies = cameraPlane('fx/fireflies.webp', {
      role:'camera-fireflies',x:0,y:0,z:0,w:11.2,h:6.4,opacity:COARSE?.035:.08,
      depthWrite:false,fog:false,additive:true,order:94
    }, {x:.25,y:.05,z:-4.65});

    const embers = cameraPlane('fx/embers.webp', {
      role:'camera-embers',x:0,y:0,z:0,w:10.8,h:6.1,opacity:COARSE?.02:.05,
      depthWrite:false,fog:false,additive:true,order:93
    }, {x:-.2,y:-.25,z:-4.72});

    if (!COARSE) {
      plane('fx/smoke.webp', {role:'smoke-kage',x:5.8,y:3.4,z:-13.8,w:9.5,h:7.4,opacity:.11,depthWrite:false,fog:false,order:23});
      plane('fx/godrays.webp', {role:'godrays-kage',x:-2.2,y:10.6,z:TEMPLE_Z-4.5,w:18,h:14,opacity:.09,depthWrite:false,fog:false,additive:true,order:17});
    }

    const t0 = performance.now();
    function animate(now) {
      const t = (now - t0) * .001;
      const p = (typeof RIG !== 'undefined' && Number.isFinite(RIG.smooth)) ? clamp(RIG.smooth/4) : 0;

      /* Mega Mendung belongs to the middle case-study passage, not the intro. */
      const megaA = pulse(p,.24,.34,.56,.68);
      mega.style.opacity = String((COARSE?.48:.56) * megaA);
      mega.style.transform = `translate3d(${(-8 + megaA*8).toFixed(2)}%,${(Math.sin(t*.18)*1.2).toFixed(2)}%,0) rotate(-3deg)`;

      /* Torn cloth arrives later as a framing transition for the next case-study zone. */
      const tornA = pulse(p,.48,.58,.78,.90);
      torn.style.opacity = String((COARSE?.44:.56) * tornA);
      torn.style.transform = `translate3d(${(14 - tornA*14).toFixed(2)}%,${(Math.sin(t*.21)*.9).toFixed(2)}%,0) rotate(${(1 + Math.sin(t*.16)*1.2).toFixed(2)}deg)`;

      if (!reduced) {
        fog.position.x = Math.sin(t*.16)*.18;
        fog.position.y = -.18 + Math.sin(t*.11)*.05;
        fireflies.position.x = .25 + Math.sin(t*.24)*.12;
        fireflies.position.y = .05 + Math.cos(t*.19)*.08;
        embers.position.y = -.25 + ((t*.07)%1)*.18;
      }
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
  'branding/cirebon-3d-wordmark.webp','branding/emblem.webp','fabric/mega-mendung-cloth.webp',
  'fabric/torn-cloth.webp','fx/rain.webp','fx/thin-fog.webp','fx/fireflies.webp','fx/embers.webp',
  'faj-kage-rain-near','faj-kage-mega','faj-kage-torn'
]) {
  if (!html.includes(token)) throw new Error(`Cirebon atmosphere gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
console.log('Cirebon Kage atmosphere pass applied.');
