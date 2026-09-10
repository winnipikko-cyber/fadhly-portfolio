import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_LIVE_CLEANUP -->';
if (html.includes(marker)) process.exit(0);

// 1) Gate cleanup.
// The previous side planes were rotated almost 90deg next to the camera. On a
// portrait viewport they read as thin, duplicated gate slices instead of real
// architectural depth. Remove those slices and keep one quiet inner/back gate
// deeper in the passage.
const oldGate = "if(!COARSE){ciPlane('architecture/gapura-side.webp',{role:'gate-side-l',x:-5.8,y:4.8,z:-7.3,w:8.5,h:15,ry:Math.PI*.49,opacity:.88,order:13});ciPlane('architecture/gapura-side.webp',{role:'gate-side-r',x:5.8,y:4.8,z:-7.3,w:8.5,h:15,ry:-Math.PI*.49,opacity:.88,order:13});ciPlane('architecture/gapura-back.webp',{role:'gate-back',x:0,y:5,z:-6.1,w:13.2,h:16.4,ry:Math.PI,opacity:.72,order:12});}";
const newGate = "ciPlane('architecture/gapura-back.webp',{role:'gate-back',x:0,y:5.15,z:-10.65,w:12.4,h:15.2,opacity:COARSE?.18:.28,order:11});";
if (html.includes(oldGate)) html = html.replace(oldGate, newGate);

// Keep gate opacity longer while the camera actually passes through it. The
// old .19-.34 window made the architecture dissolve almost immediately and
// exposed the individual planes as an edit.
html = html.replace(
  "if(u.role==='gate-front'||u.role==='gate-side-l'||u.role==='gate-side-r'||u.role==='gate-back'){const vis=1-ciEase(.19,.34,p);if(m.material.map)m.material.opacity=u.target*vis;}",
  "if(u.role==='gate-front'||u.role==='gate-back'){const vis=1-ciEase(.31,.48,p);if(m.material.map)m.material.opacity=u.target*vis;}"
);

// 2) Kill the floating torn-cloth / full-screen cloth overlays. They sat above
// the interface and made the project cards look composited. Mega Mendung stays
// in the WebGL world, where it can share perspective/fog instead of behaving as
// a flat page sticker.
const visualFix = String.raw`${marker}
<style id="faj-cirebon-live-cleanup-css">
  #faj-kage-torn,#faj-kage-mega{display:none!important}
  #faj-kage-rain-near,#faj-kage-rain-far{
    z-index:4!important;
    mix-blend-mode:screen!important;
  }
  #faj-kage-rain-near{opacity:.16!important}
  #faj-kage-rain-far{opacity:.075!important;filter:blur(.5px)!important}
  @media(max-width:820px){
    #faj-kage-rain-near{opacity:.12!important;background-size:650px auto!important}
    #faj-kage-rain-far{opacity:.055!important;background-size:900px auto!important}
  }
</style>
<script id="faj-cirebon-umbul-depth">
(() => {
  const started = performance.now();
  const MAX_WAIT = 12000;
  function ready(){
    return typeof ciPlane === 'function' && typeof CIREBON_WORLD !== 'undefined' &&
      CIREBON_WORLD && CIREBON_WORLD.group && typeof COARSE !== 'undefined';
  }
  function addUmbul(){
    if (CIREBON_WORLD.umbulDepth) return;
    CIREBON_WORLD.umbulDepth = true;

    // Ceremonial vertical flags belong to the gate approach and naturally
    // explain the empty side volumes. They stay slightly behind the front gate
    // so the brick silhouette occludes them instead of the cloth covering it.
    const left = ciPlane('fabric/umbul-umbul.webp',{
      role:'umbul-live',x:-5.25,y:7.0,z:-8.55,w:3.15,h:12.9,
      ry:.055,sway:COARSE?0:.025,opacity:COARSE?.62:.76,order:12
    });
    const right = ciPlane('fabric/umbul-umbul.webp',{
      role:'umbul-live',x:5.35,y:7.05,z:-8.72,w:3.15,h:12.9,
      ry:-.06,sway:COARSE?0:.023,opacity:COARSE?.60:.74,order:12
    });
    right.scale.x = -1;

    // One quieter flag deeper in the court gives the camera a second parallax
    // beat without recreating the old wall of flat fabric.
    if(!COARSE){
      ciPlane('fabric/banner.webp',{
        role:'umbul-live-far',x:8.2,y:7.4,z:-17.2,w:2.8,h:10.4,
        ry:-.10,sway:.018,opacity:.38,order:9
      });
    }

    // Shadow-foot: tiny dark masonry volumes sit behind the 2D gate cutout.
    // They are intentionally subtle; their job is to catch fog/light changes
    // during the dolly so the threshold has thickness rather than looking like
    // a pasted PNG.
    if (typeof THREE !== 'undefined' && typeof scene !== 'undefined') {
      const g = new THREE.Group();
      g.name = 'CirebonGateDepthVolume';
      const mat = new THREE.MeshStandardMaterial({
        color:0x3b1b18,roughness:.96,metalness:0,fog:true
      });
      const blocks = [
        [-3.65,2.45,-8.92,1.35,4.9,1.65],
        [ 3.65,2.45,-8.92,1.35,4.9,1.65],
        [-4.22,1.10,-9.10,1.15,2.2,2.15],
        [ 4.22,1.10,-9.10,1.15,2.2,2.15]
      ];
      for(const b of blocks){
        const m = new THREE.Mesh(new THREE.BoxGeometry(b[3],b[4],b[5]),mat);
        m.position.set(b[0],b[1],b[2]);
        m.castShadow = false; m.receiveShadow = true;
        g.add(m);
      }
      scene.add(g);
      CIREBON_WORLD.gateDepthVolume = g;
    }
  }
  function tick(){
    if(ready()) return addUmbul();
    if(performance.now()-started<MAX_WAIT) requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon live cleanup body anchor missing');
html = html.replace('</body>', visualFix + '\n</body>');

for (const token of [
  'FAJ_CIREBON_LIVE_CLEANUP',
  'fabric/umbul-umbul.webp',
  'CirebonGateDepthVolume',
  '#faj-kage-rain-near'
]) {
  if (!html.includes(token)) throw new Error(`Cirebon live cleanup gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
console.log('Cirebon live cleanup pass applied.');
