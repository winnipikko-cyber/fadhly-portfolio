import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_FINAL_V3_COMPOSITION_FIX -->';
if (html.includes(marker)) process.exit(0);
if (!html.includes('FAJ_CIREBON_FINAL_V3')) throw new Error('Final V3 marker missing before composition fix');

const block = String.raw`${marker}
<style id="faj-cirebon-final-v3-composition-fix-style">
/* Front frame: brighter bone copy, cleaner environmental hierarchy. */
.hero h1{color:#e7e9e4!important;text-shadow:0 2px 28px rgba(1,4,7,.88)!important}
.hero-sub{color:#c1cac5!important;text-shadow:0 2px 24px rgba(1,4,7,.94)!important}
#gl{filter:saturate(.96) contrast(1.045) brightness(.985)!important}

/* On phones the WebGL word is too wide for the portrait frustum. Keep the world 3D,
   but let the word itself be a crisp lower-third overlay that still sits in mist. */
@media(max-width:820px){
  body:not(.no-webgl) .word-fb{
    display:block!important;position:absolute!important;left:5vw!important;right:5vw!important;
    bottom:19svh!important;z-index:3!important;pointer-events:none!important;
    font-family:'Wordmark','Onest',sans-serif!important;font-weight:600!important;
    font-size:clamp(54px,19vw,96px)!important;line-height:.82!important;letter-spacing:.018em!important;
    text-align:center!important;color:rgba(230,233,227,.92)!important;
    text-shadow:0 10px 30px rgba(0,0,0,.52),0 1px 0 rgba(255,255,255,.10)!important;
    background:linear-gradient(180deg,#edf0ea 0%,#cbd4cd 58%,rgba(150,165,157,.76) 100%)!important;
    -webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important;
    filter:drop-shadow(0 14px 22px rgba(0,0,0,.30))!important;
  }
  .hero-foot{position:relative!important;z-index:5!important}
}
</style>
<script id="faj-cirebon-final-v3-composition-fix-runtime">
(() => {
  const t0=performance.now();
  const mobile=matchMedia('(max-width:820px)').matches;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

  function role(scene,name){
    const out=[];scene.traverse(o=>{if(o&&o.userData&&o.userData.role===name)out.push(o)});return out;
  }

  function tuneWord(k){
    const w=k.WORD&&k.WORD.group;if(!w)return;
    if(mobile){w.visible=false;return;}
    if(w.userData.fajCompFixed)return;
    /* Final V3 pushed the word too low. Pull it back into the lower third and
       trim the width so the first/last glyph do not clip at 1440. */
    w.scale.multiplyScalar(.88);
    w.position.y+=.62;
    w.userData.fajCompFixed=true;
  }

  function install(){
    const k=window.__kage, v3=window.__fajFinalV3;
    if(!k||!k.scene||!k.renderer||!v3||!v3.installed)return false;
    if(k.scene.userData.fajCompFix)return true;
    k.scene.userData.fajCompFix=true;
    const {scene,renderer,WORLD}=k;

    renderer.toneMappingExposure=mobile?.98:.96;
    if(scene.fog){scene.fog.color.setHex(0x07111a);scene.fog.density=mobile?.0150:.0137;}
    if(WORLD&&WORLD.floorMat){WORLD.floorMat.roughness=.49;WORLD.floorMat.metalness=.045;WORLD.floorMat.color.setHex(0x6c7a80);WORLD.floorMat.needsUpdate=true;}
    if(WORLD&&WORLD.key){WORLD.key.intensity=1.0;WORLD.key.color.setHex(0x9ec6d9);}

    /* A rectangular fake wall is worse than no thickness. Until the gate has a
       measured silhouette mask, hide the box volume and let perspective, contact
       shadow, courtyard and inner architecture carry the depth. */
    const depth=scene.getObjectByName('FAJ_REAL_GATE_DEPTH_V3');
    if(depth)depth.visible=false;

    /* The character was reading like a pasted torso. Remove it from the public
       composition; the architecture now owns the chapter transition. */
    const chars=role(scene,'character');
    chars.forEach(o=>{o.visible=false;if(o.material)o.material.opacity=0;});

    /* Pull the lit pendopo forward enough to read as a destination through the
       gate, while keeping it safely behind the threshold. */
    const pend=role(scene,'pendopo')[0];
    if(pend){
      pend.visible=true;pend.position.set(0,8.35,mobile?-34.2:-34.8);pend.scale.setScalar(mobile?.93:1.02);
      if(pend.material){pend.material.opacity=.98;pend.material.color.setHex(0xffe3c5);pend.material.needsUpdate=true;}
    }

    const moon=role(scene,'moon-photo')[0];
    if(moon){moon.position.set(mobile?6.5:8.0,mobile?12.2:13.35,-43.8);if(moon.material)moon.material.opacity=mobile?.34:.43;}

    /* Keep only one restrained guardian and no chapter crop surprises. */
    const relic=role(scene,'relic');
    relic.forEach((o,i)=>{o.visible=i===0;if(i>0&&o.material)o.material.opacity=0;});

    if(WORLD&&WORLD.hallHalo&&WORLD.hallHalo.material)WORLD.hallHalo.material.opacity=.28;
    tuneWord(k);

    function enforce(){
      chars.forEach(o=>{o.visible=false;if(o.material)o.material.opacity=0;});
      if(depth)depth.visible=false;
      if(mobile&&k.WORD&&k.WORD.group)k.WORD.group.visible=false;
      requestAnimationFrame(enforce);
    }
    requestAnimationFrame(enforce);

    addEventListener('resize',()=>{
      if(mobile&&k.WORD&&k.WORD.group)k.WORD.group.visible=false;
    },{passive:true});

    document.documentElement.dataset.fajCirebonComposition='v3-clean';
    window.__fajCompositionFix={installed:true};
    return true;
  }

  function tick(){if(install())return;if(performance.now()-t0<15000)requestAnimationFrame(tick)}
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon composition-fix body anchor missing');
html = html.replace('</body>', block + '\n</body>');
await writeFile(file, html, 'utf8');
console.log('Cirebon final V3 composition fix applied.');
