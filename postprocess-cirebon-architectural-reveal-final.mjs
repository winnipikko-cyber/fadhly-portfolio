import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_ARCHITECTURAL_REVEAL_FINAL -->';
if (html.includes(marker)) process.exit(0);
if (!html.includes('FAJ_CIREBON_MOBILE_HERO_CLEANUP')) throw new Error('Mobile cleanup marker missing before architectural reveal final');

const block = String.raw`${marker}
<style id="faj-cirebon-architectural-reveal-final-style">
/* Make the identity present without turning it into a floating sticker. */
#faj-cirebon-header-seal{width:28px;height:28px;object-fit:contain;opacity:.82;filter:drop-shadow(0 4px 14px rgba(0,0,0,.45));margin-right:8px;flex:0 0 auto}
@media(max-width:820px){#faj-cirebon-header-seal{width:21px;height:21px;opacity:.74;margin-right:6px}}
</style>
<script id="faj-cirebon-architectural-reveal-final-runtime">
(() => {
  const started=performance.now();
  const mobile=matchMedia('(max-width:820px)').matches;

  function role(scene,name){
    const out=[];scene.traverse(o=>{if(o&&o.userData&&o.userData.role===name)out.push(o)});return out;
  }

  function place(o,cfg){
    if(!o)return;
    o.visible=true;
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
      o.material.needsUpdate=true;
    }
  }

  function addHeaderSeal(){
    if(document.getElementById('faj-cirebon-header-seal'))return;
    const host=document.querySelector('.brand')||document.querySelector('.nav .brand')||document.querySelector('header');
    if(!host)return;
    const img=document.createElement('img');
    img.id='faj-cirebon-header-seal';
    img.src='/cirebon-assets/branding/emblem.webp';
    img.alt='';
    img.decoding='async';
    if(host.firstChild)host.insertBefore(img,host.firstChild);else host.appendChild(img);
  }

  function buildInterior(scene){
    if(scene.getObjectByName('FAJ_Pendopo_Interior_Reveal_Final'))return scene.getObjectByName('FAJ_Pendopo_Interior_Reveal_Final');
    const g=new THREE.Group();g.name='FAJ_Pendopo_Interior_Reveal_Final';
    const wood=new THREE.MeshStandardMaterial({color:0x3b241b,roughness:.86,metalness:.01});
    const warmWood=new THREE.MeshStandardMaterial({color:0x6e422b,roughness:.78,metalness:.015});
    const stone=new THREE.MeshStandardMaterial({color:0x4b4540,roughness:.94,metalness:0});
    const floor=new THREE.Mesh(new THREE.BoxGeometry(mobile?12.8:15.8,.26,mobile?5.8:7.2),stone);
    floor.position.set(0,.20,-32.7);floor.receiveShadow=true;g.add(floor);
    const back=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.8:13.8,4.5,.30),wood);
    back.position.set(0,3.0,-35.6);back.receiveShadow=true;g.add(back);
    const seat=new THREE.Mesh(new THREE.BoxGeometry(mobile?3.4:4.4,.48,1.1),warmWood);
    seat.position.set(0,1.15,-34.65);seat.castShadow=!mobile;g.add(seat);
    const seatBack=new THREE.Mesh(new THREE.BoxGeometry(mobile?3.6:4.7,1.4,.24),warmWood);
    seatBack.position.set(0,1.90,-35.04);seatBack.castShadow=!mobile;g.add(seatBack);
    [-1,1].forEach(side=>{
      const lamp=new THREE.PointLight(0xff9c55,mobile?.75:1.35,mobile?8:11,2);
      lamp.position.set(side*(mobile?3.0:4.0),3.25,-33.6);g.add(lamp);
    });
    const center=new THREE.PointLight(0xffb36b,mobile?.85:1.65,mobile?11:16,2);
    center.position.set(0,3.9,-32.2);g.add(center);
    scene.add(g);return g;
  }

  function install(){
    const k=window.__kage;
    if(!k||!k.scene||!window.THREE)return false;
    if(k.scene.userData.fajArchitecturalRevealFinal)return true;
    k.scene.userData.fajArchitecturalRevealFinal=true;
    const {scene}=k;

    addHeaderSeal();

    /* The first Depth V2 ground plane is the staircase. Reduce its rise and move
       it deeper so the camera never passes under a tilted billboard. */
    const grounds=role(scene,'ground-v2').slice().sort((a,b)=>b.position.z-a.position.z);
    const stairs=grounds[0];
    if(stairs){
      place(stairs,{y:-.72,z:mobile?-13.8:-15.4,sx:mobile?.72:.78,sy:mobile?.48:.54,sz:1,rx:-Math.PI*.265,opacity:mobile?.46:.54});
      stairs.renderOrder=6;
    }
    if(grounds[1])place(grounds[1],{y:-.94,opacity:mobile?.28:.34});

    /* Pull the real pendopo ensemble forward as one building. */
    const body=scene.getObjectByName('FAJ_Pendopo_Body_V4');
    if(body){body.position.set(0,-.28,mobile?2.15:3.05);body.scale.setScalar(mobile?.92:1.0);body.visible=true;}

    const pend=role(scene,'pendopo')[0];
    place(pend,{x:0,y:mobile?7.45:7.65,z:mobile?-34.8:-35.0,s:mobile?.76:.78,opacity:mobile?.72:.78});
    const base=role(scene,'pendopo-base-v2')[0];
    place(base,{x:0,y:2.20,z:mobile?-32.9:-33.1,s:mobile?.98:1.05,opacity:mobile?.78:.88});
    const roof=role(scene,'pendopo-roof-v2')[0];
    place(roof,{x:0,y:8.55,z:mobile?-34.1:-34.4,s:mobile?.76:.80,opacity:mobile?.42:.50});
    const beam=role(scene,'pendopo-beam-v2')[0];
    place(beam,{x:0,y:6.10,z:-33.2,s:1.0,opacity:mobile?.72:.88});
    const pillars=role(scene,'pendopo-pillar-v2');
    if(pillars[0])place(pillars[0],{x:mobile?-4.6:-5.9,y:4.55,z:-32.9,s:mobile?.94:1.0,opacity:mobile?.80:.92});
    if(pillars[1])place(pillars[1],{x:mobile?4.6:5.9,y:4.55,z:-33.0,s:mobile?.94:1.0,opacity:mobile?.80:.92});
    const ornament=role(scene,'pendopo-ornament-v2')[0];
    place(ornament,{x:0,y:7.20,z:-32.8,s:.92,opacity:mobile?.30:.40});

    /* Bring mounted identity in front of the rear wall so it is visible through
       the opening, but keep it physically attached to the architecture. */
    const brand=scene.getObjectByName('FAJ_CIREBON_BRANDING_RELIEF_V5');
    if(brand){
      brand.visible=true;
      brand.position.set(0,mobile?-.12:-.18,mobile?3.55:3.75);
      brand.scale.setScalar(mobile?1.06:1.18);
      brand.traverse(o=>{if(o&&o.material){o.visible=true;o.material.opacity=1;o.material.needsUpdate=true;} if(o&&o.isMesh)o.renderOrder=Math.max(o.renderOrder||0,17);});
    }

    const interior=buildInterior(scene);
    interior.position.z=mobile?2.0:2.7;

    /* Keep the open central sightline bright enough to read all the way to the
       emblem and wordmark, without flattening the brick foreground. */
    const reveal=new THREE.PointLight(0xe9a36b,mobile?.70:1.15,mobile?17:24,2);
    reveal.name='FAJ_Pendopo_Reveal_Light_Final';
    reveal.position.set(0,4.7,-30.4);scene.add(reveal);

    if(k.WORLD&&k.WORLD.hallHalo&&k.WORLD.hallHalo.material){k.WORLD.hallHalo.material.opacity=mobile?.20:.28;}

    function enforce(){
      if(body)body.visible=true;
      if(brand)brand.visible=true;
      if(stairs&&stairs.material)stairs.material.opacity=mobile?.46:.54;
      requestAnimationFrame(enforce);
    }
    requestAnimationFrame(enforce);

    document.documentElement.dataset.fajPendopoReveal='final-open-interior';
    window.__fajArchitecturalRevealFinal={installed:true,stairs,body,brand,interior};
    return true;
  }

  function tick(){if(install())return;if(performance.now()-started<15000)requestAnimationFrame(tick)}
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Architectural reveal body anchor missing');
html = html.replace('</body>', block + '\n</body>');
await writeFile(file, html, 'utf8');
console.log('Cirebon architectural reveal final applied: lower stairs, open pendopo interior, visible mounted branding.');
