import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_LIVE_DIRECTIVE_V6 -->';
if (html.includes(marker)) process.exit(0);
if (!html.includes('FAJ_CIREBON_ARCHITECTURAL_REVEAL_FINAL')) {
  throw new Error('Architectural reveal final marker missing before Live Directive V6');
}

const block = String.raw`${marker}
<style id="faj-cirebon-live-directive-v6-style">
/* Project-card cloth: use the Mega Mendung fabric as a moving material, not a static poster. */
[data-faj-wind-card]{position:relative!important;overflow:hidden!important;isolation:isolate!important;background:#071019!important}
[data-faj-wind-card] > *:not(.faj-wind-cloth){position:relative;z-index:3}
.faj-wind-cloth{position:absolute!important;inset:-7%!important;z-index:1!important;pointer-events:none!important;overflow:hidden!important;background:linear-gradient(145deg,#08111d 0%,#14213a 54%,#1d1010 100%)!important}
.faj-wind-cloth img{position:absolute;width:122%;height:122%;left:-10%;top:-11%;object-fit:cover;object-position:center;transform-origin:12% 46%;filter:saturate(.92) contrast(1.1) brightness(.73) drop-shadow(0 18px 40px rgba(0,0,0,.55));will-change:transform,filter;animation:fajWindCloth 5.8s cubic-bezier(.45,.05,.42,.96) infinite alternate}
.faj-wind-cloth::before{content:"";position:absolute;inset:0;z-index:2;background:radial-gradient(90% 72% at 65% 24%,rgba(239,176,103,.17),transparent 46%),linear-gradient(180deg,rgba(4,9,15,.03),rgba(3,6,10,.48));mix-blend-mode:screen;pointer-events:none}
.faj-wind-cloth::after{content:"";position:absolute;inset:0;z-index:2;background:linear-gradient(90deg,rgba(2,6,10,.35),transparent 26%,transparent 72%,rgba(1,4,7,.28)),linear-gradient(180deg,transparent 55%,rgba(0,0,0,.44));pointer-events:none}
@keyframes fajWindCloth{
  0%{transform:perspective(900px) translate3d(-1.8%,1.3%,0) rotateY(5deg) rotateZ(-1.2deg) skewY(-1.5deg) scale(1.035,1.00);filter:saturate(.88) contrast(1.10) brightness(.70) drop-shadow(0 18px 40px rgba(0,0,0,.55))}
  34%{transform:perspective(900px) translate3d(.2%,-.8%,0) rotateY(-2deg) rotateZ(.45deg) skewY(.6deg) scale(1.055,.985)}
  68%{transform:perspective(900px) translate3d(1.5%,.5%,0) rotateY(-6deg) rotateZ(1.0deg) skewY(1.4deg) scale(1.03,1.02);filter:saturate(.98) contrast(1.12) brightness(.78) drop-shadow(0 20px 46px rgba(0,0,0,.58))}
  100%{transform:perspective(900px) translate3d(-.4%,-1.1%,0) rotateY(3deg) rotateZ(-.35deg) skewY(-.55deg) scale(1.06,.995)}
}
@media(max-width:820px){
  .faj-wind-cloth{inset:-3%!important}
  .faj-wind-cloth img{width:116%;height:116%;left:-7%;top:-8%;animation-duration:6.8s}
}
</style>
<script id="faj-cirebon-live-directive-v6-runtime">
(() => {
  const started=performance.now();
  const mobile=matchMedia('(max-width:820px)').matches;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

  function role(scene,name){
    const out=[];scene.traverse(o=>{if(o&&o.userData&&o.userData.role===name)out.push(o)});return out;
  }
  function setLayer(o,cfg){
    if(!o)return;
    o.visible=cfg.visible===undefined?true:cfg.visible;
    if(cfg.x!==undefined)o.position.x=cfg.x;
    if(cfg.y!==undefined)o.position.y=cfg.y;
    if(cfg.z!==undefined)o.position.z=cfg.z;
    if(cfg.s!==undefined)o.scale.setScalar(cfg.s);
    if(cfg.sx!==undefined)o.scale.x=cfg.sx;
    if(cfg.sy!==undefined)o.scale.y=cfg.sy;
    if(cfg.sz!==undefined)o.scale.z=cfg.sz;
    if(cfg.rx!==undefined)o.rotation.x=cfg.rx;
    if(o.userData){
      if(cfg.x!==undefined)o.userData.baseX=cfg.x;
      if(cfg.y!==undefined)o.userData.baseY=cfg.y;
      if(cfg.z!==undefined)o.userData.baseZ=cfg.z;
      if(cfg.opacity!==undefined)o.userData.target=cfg.opacity;
    }
    if(o.material){
      if(cfg.opacity!==undefined)o.material.opacity=cfg.opacity;
      if(cfg.color!==undefined)o.material.color.setHex(cfg.color);
      o.material.needsUpdate=true;
    }
  }
  function tex(url,done){
    return new THREE.TextureLoader().load(url,t=>{
      if('colorSpace' in t&&THREE.SRGBColorSpace)t.colorSpace=THREE.SRGBColorSpace;
      else if('encoding' in t&&THREE.sRGBEncoding)t.encoding=THREE.sRGBEncoding;
      const r=window.__kage&&window.__kage.renderer;
      if(r&&r.capabilities)t.anisotropy=Math.min(mobile?2:8,r.capabilities.getMaxAnisotropy());
      t.needsUpdate=true;if(done)done(t);
    });
  }

  function installWindCard(){
    if(document.querySelector('[data-faj-wind-card]'))return true;
    const labels=[...document.querySelectorAll('.card-lab b')];
    const label=labels.find(el=>/mausu/i.test((el.textContent||'').trim()));
    if(!label)return false;
    let host=label;
    for(let i=0;i<8&&host&&host!==document.body;i++,host=host.parentElement){
      if(host.querySelector&&host.querySelector('.card-lab')&&host.querySelector('.card-meta'))break;
    }
    if(!host||host===document.body)return false;
    host.dataset.fajWindCard='mega-mendung';
    host.style.backgroundImage='none';
    const oldImgs=[...host.querySelectorAll('img')];
    oldImgs.forEach(img=>{if(!img.closest('.faj-wind-cloth'))img.style.opacity='0';});
    const layer=document.createElement('div');layer.className='faj-wind-cloth';layer.setAttribute('aria-hidden','true');
    const img=document.createElement('img');
    img.src='/cirebon-assets/fabric/mega-mendung-cloth.webp';
    img.alt='';img.decoding='async';img.loading='eager';
    layer.appendChild(img);host.prepend(layer);
    return true;
  }

  function makeFullPendopoFacade(scene){
    let mesh=scene.getObjectByName('FAJ_Pendopo_Full_Facade_V6');
    if(mesh)return mesh;
    const mat=new THREE.MeshBasicMaterial({
      map:tex('/cirebon-assets/architecture/pendopo-night.webp'),transparent:true,
      alphaTest:.018,depthWrite:true,depthTest:true,fog:true,side:THREE.DoubleSide,
      color:0xf1dcc4,opacity:mobile?.88:.92
    });
    mesh=new THREE.Mesh(new THREE.PlaneGeometry(mobile?10.8:15.8,mobile?9.6:13.3),mat);
    mesh.name='FAJ_Pendopo_Full_Facade_V6';
    mesh.position.set(0,mobile?4.15:4.75,mobile?-27.2:-29.2);
    mesh.renderOrder=8;mesh.frustumCulled=false;
    scene.add(mesh);return mesh;
  }

  function buildRealApproach(scene){
    let g=scene.getObjectByName('FAJ_Pendopo_Approach_V6');if(g)return g;
    g=new THREE.Group();g.name='FAJ_Pendopo_Approach_V6';
    const stone=new THREE.MeshStandardMaterial({color:0x465159,roughness:.43,metalness:.035});
    const edge=new THREE.MeshStandardMaterial({color:0x2d3030,roughness:.82,metalness:.01});
    const corridor=new THREE.Mesh(new THREE.BoxGeometry(mobile?5.0:6.8,.16,mobile?13.0:15.5),stone);
    corridor.position.set(0,-.86,mobile?-17.2:-18.2);corridor.receiveShadow=true;g.add(corridor);
    const count=mobile?5:6;
    for(let i=0;i<count;i++){
      const w=mobile?5.0:6.6;
      const step=new THREE.Mesh(new THREE.BoxGeometry(w,.24,mobile?.78:.88),i===count-1?stone:edge);
      step.position.set(0,-.72+i*.16,(mobile?-22.1:-23.0)-i*(mobile?.70:.78));
      step.receiveShadow=true;step.castShadow=!mobile;g.add(step);
    }
    const landing=new THREE.Mesh(new THREE.BoxGeometry(mobile?5.2:6.9,.28,mobile?2.1:2.6),stone);
    landing.position.set(0,.08,mobile?-26.0:-27.4);landing.receiveShadow=true;g.add(landing);
    scene.add(g);return g;
  }

  function installScene(){
    const k=window.__kage;
    if(!k||!k.scene||!k.camera||!window.THREE)return false;
    const {scene,camera,WORLD}=k;
    if(scene.userData.fajLiveDirectiveV6)return true;
    scene.userData.fajLiveDirectiveV6=true;

    /* The old tilted staircase billboard was the visual wall that hid the lower
       pendopo. Remove it and replace it with shallow 3D steps + a wet approach. */
    const grounds=role(scene,'ground-v2').slice().sort((a,b)=>b.position.z-a.position.z);
    if(grounds[0]){grounds[0].visible=false;if(grounds[0].material)grounds[0].material.opacity=0;}
    buildRealApproach(scene);

    /* Bring the actual body forward into the gate sightline. */
    const body=scene.getObjectByName('FAJ_Pendopo_Body_V4');
    if(body){
      body.visible=true;
      body.position.set(0,mobile?-1.05:-.82,mobile?8.8:8.1);
      body.scale.setScalar(mobile?.78:.90);
    }
    const interior=scene.getObjectByName('FAJ_Pendopo_Interior_Reveal_Final');
    if(interior){interior.visible=true;interior.position.z=mobile?7.7:7.0;interior.position.y=mobile?-.66:-.48;}

    /* Photographic facade is only a readable skin. Real geometry remains in
       front/behind it and takes over as the camera approaches. */
    const fullFacade=makeFullPendopoFacade(scene);
    const pend=role(scene,'pendopo')[0];
    setLayer(pend,{x:0,y:mobile?6.05:6.45,z:mobile?-30.0:-31.2,s:mobile?.60:.66,opacity:.34});
    const roof=role(scene,'pendopo-roof-v2')[0];
    setLayer(roof,{x:0,y:mobile?7.30:7.70,z:mobile?-29.2:-30.2,s:mobile?.61:.68,opacity:.24});
    const base=role(scene,'pendopo-base-v2')[0];
    setLayer(base,{x:0,y:mobile?1.05:1.24,z:mobile?-27.3:-28.7,s:mobile?.86:.98,opacity:.74});
    const beam=role(scene,'pendopo-beam-v2')[0];
    setLayer(beam,{x:0,y:mobile?4.68:5.05,z:mobile?-27.4:-28.9,s:mobile?.83:.94,opacity:.80});
    const pillars=role(scene,'pendopo-pillar-v2');
    if(pillars[0])setLayer(pillars[0],{x:mobile?-3.75:-5.15,y:mobile?3.35:3.78,z:mobile?-27.2:-28.65,s:mobile?.76:.90,opacity:.88});
    if(pillars[1])setLayer(pillars[1],{x:mobile?3.75:5.15,y:mobile?3.35:3.78,z:mobile?-27.3:-28.72,s:mobile?.76:.90,opacity:.88});

    /* Mounted Cirebon identity must be visible through the central bay. */
    const brand=scene.getObjectByName('FAJ_CIREBON_BRANDING_RELIEF_V5');
    if(brand){
      brand.visible=true;brand.position.set(0,mobile?-.78:-.48,mobile?9.15:8.75);brand.scale.setScalar(mobile?.78:.92);
      brand.traverse(o=>{if(o&&o.material){o.visible=true;o.material.opacity=1;o.material.needsUpdate=true;}});
    }

    const warm=new THREE.PointLight(0xff9c55,mobile?1.15:2.05,mobile?18:26,2);
    warm.name='FAJ_Pendopo_Interior_Live_V6';warm.position.set(0,mobile?3.1:3.7,mobile?-25.2:-26.8);scene.add(warm);
    const cool=new THREE.PointLight(0x89b9d1,mobile?.28:.48,mobile?13:18,2);
    cool.name='FAJ_Pendopo_Moon_Fill_V6';cool.position.set(mobile?4.2:6.0,mobile?7.8:9.2,mobile?-24:-26);scene.add(cool);
    if(WORLD&&WORLD.hallHalo&&WORLD.hallHalo.material)WORLD.hallHalo.material.opacity=mobile?.16:.22;

    function animate(){
      const dz=Math.abs(camera.position.z-fullFacade.position.z);
      const visible=dz<8?clamp((dz-2.1)/5.9,.05,1):1;
      if(fullFacade.material)fullFacade.material.opacity=(mobile?.88:.92)*visible;
      if(brand)brand.visible=true;
      if(body)body.visible=true;
      if(grounds[0])grounds[0].visible=false;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    document.documentElement.dataset.fajCirebonLiveDirective='v6-full-pendopo-wind-cloth';
    window.__fajCirebonLiveDirectiveV6={installed:true,fullFacade,body,brand};
    return true;
  }

  function tick(){
    const card=installWindCard();
    const scene=installScene();
    if(card&&scene)return;
    if(performance.now()-started<16000)requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Live Directive V6 body anchor missing');
html = html.replace('</body>', block + '\n</body>');
await writeFile(file, html, 'utf8');
console.log('Cirebon Live Directive V6 applied: full pendopo reveal, shallow 3D approach, visible branding, waving Mega Mendung project card.');
