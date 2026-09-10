import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_FINAL_V3 -->';
if (html.includes(marker)) process.exit(0);

const block = String.raw`${marker}
<style id="faj-cirebon-final-v3-style">
/* FINAL V3 — one believable place, not a stack of overlays. */
#faj-kage-rain-near,#faj-kage-rain-far,#faj-kage-mega,#faj-kage-torn{display:none!important;opacity:0!important}
#grain{opacity:.034!important}
#vignette{background:
  radial-gradient(92% 82% at 53% 42%,transparent 34%,rgba(2,5,8,.25) 69%,rgba(1,3,5,.76) 100%),
  linear-gradient(90deg,rgba(2,5,8,.48) 0%,rgba(2,5,8,.15) 29%,transparent 54%)!important}
#gl{filter:saturate(.94) contrast(1.055) brightness(.955)}
.hero::before{height:100%!important;background:
  linear-gradient(90deg,rgba(3,6,9,.64) 0%,rgba(3,6,9,.28) 27%,rgba(3,6,9,.035) 51%,transparent 72%),
  linear-gradient(180deg,rgba(3,6,9,.50),transparent 30%,transparent 72%,rgba(3,6,9,.30))!important}
.hero-top{max-width:min(455px,34vw)!important;z-index:5!important}
.hero-top .eyebrow{margin-bottom:16px!important}
.hero h1{font-size:clamp(30px,3.15vw,51px)!important;line-height:1.0!important}
.hero-sub{max-width:340px!important;color:#bac4bd!important}
.peek,.hero-side{display:none!important}
.hero-foot{z-index:5!important}
.chapters{border-top-color:rgba(231,228,220,.12)!important}
.chip .num{filter:drop-shadow(0 4px 12px rgba(0,0,0,.48))}

/* The project gallery is a clean cinematic row, never one giant placeholder plus two scraps. */
body[data-layout-gallery="b"] .cards{
  display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;
  grid-template-rows:none!important;gap:clamp(12px,1.3vw,20px)!important;align-items:stretch!important
}
body[data-layout-gallery="b"] .card{grid-row:auto!important;transform:none!important;display:block!important;min-height:0!important}
body[data-layout-gallery="b"] .card:first-child{grid-row:auto!important}
body[data-layout-gallery="b"] .card .card-fr,
body[data-layout-gallery="b"] .card:first-child .card-fr,
body[data-layout-gallery="b"] .card:not(:first-child) .card-fr{
  height:auto!important;min-height:0!important;aspect-ratio:16/10!important;overflow:hidden!important;
  border-radius:2px;outline:1px solid rgba(231,228,220,.14)!important;
  box-shadow:0 28px 72px -42px rgba(0,0,0,.92),inset 0 -1px rgba(255,255,255,.025);
  transform:translateZ(0);transition:transform .65s var(--ease-out),outline-color .45s,box-shadow .65s
}
body[data-layout-gallery="b"] .card:hover .card-fr{
  transform:translate3d(0,-5px,0) scale(1.008);outline-color:rgba(231,228,220,.32)!important;
  box-shadow:0 36px 82px -38px rgba(0,0,0,.96),0 0 36px rgba(177,113,62,.055)
}
.card-fr::before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(3,6,9,.02) 28%,rgba(3,6,9,.18) 62%,rgba(3,6,9,.82));
  mix-blend-mode:multiply}
.card:nth-child(1) .card-fr{background:
  linear-gradient(145deg,rgba(102,24,18,.10),rgba(3,6,9,.34)),
  url('/cirebon-assets/architecture/pendopo-night.webp') center 54% / cover no-repeat!important}
.card:nth-child(2) .card-fr{background:
  linear-gradient(145deg,rgba(5,18,31,.15),rgba(3,6,9,.44)),
  url('/cirebon-assets/props/stone-relief.webp') center 42% / cover no-repeat!important}
.card:nth-child(3) .card-fr{background:
  linear-gradient(145deg,rgba(38,21,16,.08),rgba(3,6,9,.44)),
  url('/cirebon-assets/fabric/decorative-cloth.webp') center 48% / cover no-repeat!important}
.card-lab,.card-ar{z-index:3!important}
.card-meta{opacity:.82}
.glow{z-index:2!important;opacity:.72}

/* Keep Cirebon atmospheric, not a UI sticker. */
#mega-mendung{opacity:.055!important;z-index:1!important;filter:blur(.45px)!important}
@media(max-width:1080px){.hero-top{max-width:min(430px,43vw)!important}}
@media(max-width:820px){
  #gl{filter:saturate(.92) contrast(1.035) brightness(.97)}
  .hero-top{max-width:86vw!important}
  .hero h1{font-size:clamp(30px,9.7vw,44px)!important}
  #mega-mendung{opacity:.035!important}
  body[data-layout-gallery="b"] .cards{grid-template-columns:1fr!important;gap:14px!important}
  body[data-layout-gallery="b"] .card .card-fr{aspect-ratio:16/10!important}
  .card:hover .card-fr{transform:none!important}
}
@media(prefers-reduced-motion:reduce){.card-fr{transition:none!important}}
</style>
<script id="faj-cirebon-final-v3-runtime">
(() => {
  const started = performance.now();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(hover: none)').matches;
  const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
  const smooth = (a,b,x) => { const t=clamp((x-a)/Math.max(.0001,b-a)); return t*t*(3-2*t); };

  function loadTexture(url, done){
    const tex = new THREE.TextureLoader().load(url, t => {
      if ('colorSpace' in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
      else if ('encoding' in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
      if (t.wrapS !== undefined) { t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; }
      const r = window.__kage && window.__kage.renderer;
      if (r && r.capabilities) t.anisotropy = Math.min(coarse ? 2 : 8, r.capabilities.getMaxAnisotropy());
      t.needsUpdate = true; if(done) done(t);
    });
    return tex;
  }

  function roleObjects(scene, role){
    const out=[]; scene.traverse(o=>{if(o && o.userData && o.userData.role===role)out.push(o)}); return out;
  }

  function makeUmbul(scene, side, tex){
    const geo = new THREE.PlaneGeometry(coarse?1.42:1.68, coarse?6.9:8.0, 10, 20);
    const mat = new THREE.MeshStandardMaterial({
      map:tex, transparent:true, alphaTest:.018, side:THREE.DoubleSide, depthWrite:true,
      roughness:.91, metalness:.01, color:0xe4ddcf
    });
    const phase = side<0 ? .7 : 2.3;
    mat.onBeforeCompile = sh => {
      sh.uniforms.uTime={value:0}; sh.uniforms.uPhase={value:phase}; mat.userData.shader=sh;
      sh.vertexShader='uniform float uTime; uniform float uPhase;\\n'+sh.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\\nfloat fh=uv.y; float fw=sin(uTime*.68 + position.y*.82 + uPhase); transformed.x += fw*.075*fh*fh; transformed.z += cos(uTime*.51 + position.y*.61 + uPhase)*.045*fh*fh;'
      );
    };
    const m=new THREE.Mesh(geo,mat); m.name=side<0?'FAJ_Umbul_Left':'FAJ_Umbul_Right';
    m.position.set(side*(coarse?4.9:5.75),coarse?6.15:6.7,side<0?-8.85:-9.15);
    m.rotation.y=side*(coarse?.06:.11); m.rotation.z=side*(coarse?.012:.018); m.renderOrder=13;
    m.userData={fajFinalV3:true,kind:'umbul',side,phase,baseX:m.position.x,baseY:m.position.y,baseRZ:m.rotation.z};
    scene.add(m); return m;
  }

  function buildBrickDepth(scene){
    const group=new THREE.Group(); group.name='FAJ_REAL_GATE_DEPTH_V3'; group.userData.fajFinalV3=true;
    loadTexture('/cirebon-assets/materials/brick.webp', tex=>{
      tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(1.35,2.8); tex.needsUpdate=true;
      const mat=new THREE.MeshStandardMaterial({map:tex,color:0x74443b,roughness:.94,metalness:.01});
      const dark=new THREE.MeshStandardMaterial({map:tex,color:0x44261f,roughness:.97,metalness:0});
      const dims=coarse?[1.08,6.9,2.2]:[1.30,7.8,2.65];
      [-1,1].forEach(side=>{
        const pier=new THREE.Mesh(new THREE.BoxGeometry(...dims),mat);
        pier.position.set(side*(coarse?4.12:4.65),dims[1]*.5-.02,-9.75); pier.castShadow=!coarse; pier.receiveShadow=true;
        group.add(pier);
        const jamb=new THREE.Mesh(new THREE.BoxGeometry(coarse?.46:.58,dims[1]*.72,1.82),dark);
        jamb.position.set(side*(coarse?3.33:3.48),dims[1]*.36,-9.22); jamb.castShadow=!coarse; group.add(jamb);
      });
      const sill=new THREE.Mesh(new THREE.BoxGeometry(coarse?8.2:9.4,.16,2.25),dark);
      sill.position.set(0,.08,-9.28); sill.receiveShadow=true; group.add(sill);
    });
    scene.add(group); return group;
  }

  function makeContactShadow(scene){
    const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d');
    const g=x.createRadialGradient(128,64,8,128,64,118);g.addColorStop(0,'rgba(0,0,0,.72)');g.addColorStop(.55,'rgba(0,0,0,.31)');g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g;x.fillRect(0,0,256,128);
    const tex=new THREE.CanvasTexture(c);tex.needsUpdate=true;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(coarse?10:12.5,coarse?3.7:4.5),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.72,depthWrite:false,fog:true}));
    m.rotation.x=-Math.PI/2;m.position.set(0,.035,-8.9);m.renderOrder=7;m.userData.fajFinalV3=true;scene.add(m);return m;
  }

  function makeFrangipani(scene){
    if(coarse)return null;
    const geo=new THREE.PlaneGeometry(8.5,10.8,8,8);
    const mat=new THREE.MeshBasicMaterial({map:loadTexture('/cirebon-assets/foliage/frangipani-branch.webp'),transparent:true,alphaTest:.015,depthWrite:true,side:THREE.DoubleSide,fog:true,color:0xb8c5b3,opacity:.82});
    const m=new THREE.Mesh(geo,mat);m.name='FAJ_Frangipani_Foreground';m.position.set(-9.35,9.2,-3.2);m.rotation.y=.07;m.rotation.z=-.035;m.renderOrder=23;
    m.userData={fajFinalV3:true,kind:'frangipani',baseRZ:m.rotation.z};scene.add(m);return m;
  }

  function makeWorldRain(camera){
    const n=coarse?54:150, pos=new Float32Array(n*6), drops=[];
    const rand=()=>Math.random();
    for(let i=0;i<n;i++)drops.push({x:(rand()-.5)*20,y:(rand()-.5)*14,z:-4-rand()*17,len:.28+rand()*.78,sp:4.5+rand()*7.5,sl:.035+rand()*.075});
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const mat=new THREE.LineBasicMaterial({color:0xa5c3d3,transparent:true,opacity:coarse?.065:.115,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending});
    const lines=new THREE.LineSegments(geo,mat);lines.name='FAJ_World_Rain_V3';lines.renderOrder=8;lines.frustumCulled=false;lines.userData={fajFinalV3:true,kind:'rain',drops};
    camera.add(lines);return lines;
  }

  function applyWordmark(k){
    const w=k.WORD && k.WORD.group;if(!w||w.userData.fajFinalV3)return;
    w.scale.multiplyScalar(coarse?.92:.90);w.position.y-=coarse?.35:.78;w.userData.fajFinalV3=true;
  }

  function install(){
    const k=window.__kage;if(!k||!k.scene||!k.camera||!window.THREE)return false;
    if(k.scene.userData.fajFinalV3)return true;
    k.scene.userData.fajFinalV3=true;
    const {scene,camera,renderer,WORLD,RIG}=k;

    /* Unify the world grade before adding detail. */
    if(renderer){renderer.toneMappingExposure=coarse?.96:.91;}
    if(scene.fog){scene.fog.color.setHex(0x071018);scene.fog.density=coarse?.0155:.0144;}
    scene.background.setHex(0x05090d);
    if(WORLD && WORLD.key){WORLD.key.color.setHex(0x98bfd2);WORLD.key.intensity=.92;}
    if(WORLD && WORLD.moonLight){WORLD.moonLight.color.setHex(0x91bdd8);WORLD.moonLight.intensity=.72;}
    if(WORLD && WORLD.floorMat){WORLD.floorMat.roughness=.58;WORLD.floorMat.metalness=.035;WORLD.floorMat.color.setHex(0x63747b);WORLD.floorMat.needsUpdate=true;}

    const byRole={};scene.traverse(o=>{const r=o&&o.userData&&o.userData.role;if(r)(byRole[r]||(byRole[r]=[])).push(o)});

    /* Delete visual contradictions: rotated PNG walls, hanging character crop, and duplicate branding. */
    ['gate-side-l','gate-side-r','gate-back','cloth','cirebon-wordmark-3d','cirebon-emblem-3d'].forEach(r=>(byRole[r]||[]).forEach(o=>o.visible=false));
    scene.traverse(o=>{if(o&&o.isMesh&&o.geometry&&o.geometry.type==='IcosahedronGeometry'&&o.position.y<2.2)o.visible=false;});

    const gate=(byRole['gate-front']||[])[0];
    if(gate){gate.visible=true;gate.position.set(0,5.18,-8.15);gate.scale.setScalar(coarse?.98:1.035);if(gate.material){gate.material.opacity=1;gate.material.depthWrite=true;gate.material.color.setHex(0xf0ded2);}}

    const pend=(byRole['pendopo']||[])[0];
    if(pend){pend.visible=true;pend.position.set(0,6.75,coarse?-35.8:-37.5);pend.scale.setScalar(coarse?.84:.90);if(pend.material){pend.material.opacity=.94;pend.material.color.setHex(0xffe4c7);}}

    const moon=(byRole['moon-photo']||[])[0];
    if(moon){moon.visible=true;moon.position.set(coarse?6.7:8.15,coarse?12.0:13.1,-43.5);moon.scale.setScalar(coarse?.84:1);if(moon.material){moon.material.opacity=coarse?.38:.46;moon.material.color.setHex(0xdbeaf2);}}

    const fgs=byRole['fg']||[];fgs.forEach((o,i)=>{if(i===0){o.visible=true;if(o.material)o.material.opacity=coarse?.27:.38;o.position.x=-10.5;}else{o.visible=false;}});
    const fog=byRole['fog']||[];fog.forEach((o,i)=>{o.visible=true;if(o.material)o.material.opacity=i===0?(coarse?.075:.105):(coarse?.052:.075);});
    (byRole['rays']||[]).forEach(o=>{if(o.material)o.material.opacity=coarse?0:.055;});

    const relics=byRole['relic']||[];relics.forEach((o,i)=>{o.visible=i===0;if(i===0){o.position.set(-5.25,1.88,-13.2);o.scale.setScalar(.88);if(o.material)o.material.opacity=0;}});
    const chars=byRole['character']||[];chars.forEach(o=>{o.visible=true;if(o.material)o.material.opacity=0;});

    const brick=buildBrickDepth(scene);makeContactShadow(scene);const branch=makeFrangipani(scene);
    const umbul=[];loadTexture('/cirebon-assets/fabric/umbul-umbul.webp',tex=>{umbul.push(makeUmbul(scene,-1,tex));umbul.push(makeUmbul(scene,1,tex));});
    const rain=makeWorldRain(camera);

    const warm=new THREE.PointLight(0xff9b46,coarse?1.15:2.25,35,2);warm.name='FAJ_Pendopo_Spill_V3';warm.position.set(0,4.2,-27.5);scene.add(warm);
    const cold=new THREE.DirectionalLight(0x92bdd6,coarse?.22:.42);cold.name='FAJ_Moon_Rim_V3';cold.position.set(12,18,7);cold.target.position.set(0,4,-11);scene.add(cold.target);scene.add(cold);

    applyWordmark(k);addEventListener('resize',()=>setTimeout(()=>applyWordmark(k),80),{passive:true});

    const pAttr=rain.geometry.attributes.position;let t0=performance.now();
    function animate(now){
      const dt=Math.min((now-t0)/1000,.05);t0=now;const t=now*.001;const p=RIG&&Number.isFinite(RIG.smooth)?RIG.smooth:0;
      const a=pAttr.array,d=rain.userData.drops;
      for(let i=0;i<d.length;i++){const q=d[i];if(!reduced){q.y-=q.sp*dt;if(q.y<-7){q.y=7+Math.random()*3;q.x=(Math.random()-.5)*20;}}
        const j=i*6;a[j]=q.x;a[j+1]=q.y;a[j+2]=q.z;a[j+3]=q.x+q.sl;a[j+4]=q.y-q.len;a[j+5]=q.z;}
      pAttr.needsUpdate=true;
      umbul.forEach((m,i)=>{if(!m)return;const u=m.userData;if(!reduced){m.rotation.z=u.baseRZ+Math.sin(t*.42+u.phase)*.012;m.position.x=u.baseX+Math.sin(t*.31+u.phase)*.035;}if(m.material&&m.material.userData.shader)m.material.userData.shader.uniforms.uTime.value=t;});
      if(branch&&!reduced)branch.rotation.z=branch.userData.baseRZ+Math.sin(t*.18)*.006;
      if(relics[0]&&relics[0].material){const show=smooth(.78,1.26,p)*(1-smooth(2.25,2.86,p));relics[0].material.opacity=.48*show;}
      chars.forEach(o=>{if(o.material){const show=smooth(2.0,2.45,p)*(1-smooth(3.25,3.72,p));o.material.opacity=.34*show;}});
      warm.intensity=(coarse?1.15:2.25)*(1+(reduced?0:Math.sin(t*.77)*.035+Math.sin(t*1.91)*.018));
      if(WORLD&&WORLD.hallHalo&&WORLD.hallHalo.material)WORLD.hallHalo.material.opacity=.21+(reduced?0:Math.sin(t*.43)*.018);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    window.__fajFinalV3={installed:true,brick,umbul,rain,warm,cold};
    document.documentElement.dataset.fajCirebonFinal='v3';
    return true;
  }

  function tick(){if(install())return;if(performance.now()-started<15000)requestAnimationFrame(tick);}
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon final-v3 body anchor missing');
html = html.replace('</body>', block + '\n</body>');

for (const token of ['FAJ_CIREBON_FINAL_V3','FAJ_REAL_GATE_DEPTH_V3','FAJ_World_Rain_V3','fabric/umbul-umbul.webp','materials/brick.webp']) {
  if (!html.includes(token)) throw new Error(`Cirebon final-v3 gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
console.log('Cirebon final V3 realistic scene pass applied.');
