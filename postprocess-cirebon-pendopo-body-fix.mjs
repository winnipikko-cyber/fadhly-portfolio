import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_PENDOPO_BODY_FIX -->';
if (html.includes(marker)) process.exit(0);
if (!html.includes('FAJ_CIREBON_FINAL_V3_COMPOSITION_FIX')) throw new Error('Composition fix marker missing before pendopo body fix');

const block = String.raw`${marker}
<script id="faj-cirebon-pendopo-body-fix">
(() => {
  const started = performance.now();
  const mobile = matchMedia('(max-width:820px)').matches;

  function role(scene,name){
    const out=[];scene.traverse(o=>{if(o&&o.userData&&o.userData.role===name)out.push(o)});return out;
  }

  function setLayer(o, cfg){
    if(!o)return;
    o.visible=true;
    if(cfg.x!==undefined)o.position.x=cfg.x;
    if(cfg.y!==undefined)o.position.y=cfg.y;
    if(cfg.z!==undefined)o.position.z=cfg.z;
    if(cfg.scale!==undefined)o.scale.setScalar(cfg.scale);
    if(o.userData){
      if(cfg.x!==undefined)o.userData.baseX=cfg.x;
      if(cfg.y!==undefined)o.userData.baseY=cfg.y;
      if(cfg.z!==undefined)o.userData.baseZ=cfg.z;
      if(cfg.opacity!==undefined)o.userData.target=cfg.opacity;
    }
    if(o.material){
      if(cfg.opacity!==undefined)o.material.opacity=cfg.opacity;
      o.material.depthWrite=cfg.depthWrite!==undefined?cfg.depthWrite:o.material.depthWrite;
      o.material.needsUpdate=true;
    }
  }

  function buildBody(scene){
    if(scene.getObjectByName('FAJ_Pendopo_Body_V4')) return scene.getObjectByName('FAJ_Pendopo_Body_V4');
    const g=new THREE.Group();
    g.name='FAJ_Pendopo_Body_V4';

    const timber=new THREE.MeshStandardMaterial({color:0x3b261d,roughness:.86,metalness:.015});
    const timberDark=new THREE.MeshStandardMaterial({color:0x241916,roughness:.92,metalness:.01});
    const stone=new THREE.MeshStandardMaterial({color:0x4d4640,roughness:.95,metalness:0});
    const warmWood=new THREE.MeshStandardMaterial({color:0x5b3826,roughness:.82,metalness:.01});

    const deck=new THREE.Mesh(new THREE.BoxGeometry(mobile?14.5:17.5,.58,mobile?6.6:8.2),stone);
    deck.position.set(0,.32,-35.5);deck.receiveShadow=true;g.add(deck);

    const xs=mobile?[-4.8,-1.6,1.6,4.8]:[-6.3,-2.1,2.1,6.3];
    const zs=mobile?[-33.8,-37.0]:[-33.5,-37.5];
    xs.forEach((x,i)=>zs.forEach((z,j)=>{
      const col=new THREE.Mesh(new THREE.CylinderGeometry(.19,.23,5.7,12),i%2?timber:warmWood);
      col.position.set(x,3.15,z);col.castShadow=!mobile;g.add(col);
      const foot=new THREE.Mesh(new THREE.CylinderGeometry(.34,.39,.24,12),stone);
      foot.position.set(x,.73,z);g.add(foot);
    }));

    zs.forEach(z=>{
      const beam=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.8:14.2,.34,.38),timberDark);
      beam.position.set(0,6.02,z);beam.castShadow=!mobile;g.add(beam);
      const beam2=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.2:13.5,.18,.26),warmWood);
      beam2.position.set(0,5.55,z);g.add(beam2);
    });

    const sideX=mobile?5.15:6.65;
    [-1,1].forEach(s=>{
      const side=new THREE.Mesh(new THREE.BoxGeometry(.34,.34,mobile?3.55:4.35),timberDark);
      side.position.set(s*sideX,6.02,-35.5);g.add(side);
    });

    const back=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.4:13.2,3.5,.34),new THREE.MeshStandardMaterial({color:0x211916,roughness:.94,metalness:0}));
    back.position.set(0,3.1,-38.5);g.add(back);

    const innerGlow=new THREE.Mesh(new THREE.PlaneGeometry(mobile?8.5:10.6,3.3),new THREE.MeshBasicMaterial({color:0xff8b3f,transparent:true,opacity:mobile?.085:.13,depthWrite:false,fog:true,blending:THREE.AdditiveBlending}));
    innerGlow.position.set(0,3.25,-38.25);g.add(innerGlow);

    scene.add(g);
    return g;
  }

  function install(){
    const k=window.__kage;
    if(!k||!k.scene||!window.THREE)return false;
    if(k.scene.userData.fajPendopoBodyFix)return true;
    k.scene.userData.fajPendopoBodyFix=true;
    const {scene}=k;

    /* The photographic pendopo had been pushed too close and too large, so the
       roof filled the frame and hid the building underneath. Use it as the
       distant roof/inner-hall plate, not as the whole structure. */
    const pend=role(scene,'pendopo')[0];
    setLayer(pend,{x:0,y:7.55,z:mobile?-36.3:-37.1,scale:mobile?.80:.78,opacity:.90,depthWrite:true});
    if(pend&&pend.material)pend.material.color.setHex(0xf2d7bc);

    /* Recompose the separated architectural plates into a readable facade.
       Their userData bases are updated too, so the scene-rhythm pass animates
       around these positions instead of snapping them back to the old ones. */
    const base=role(scene,'pendopo-base-v2')[0];
    setLayer(base,{x:0,y:2.45,z:mobile?-34.8:-35.2,scale:mobile?.90:.96,opacity:mobile?.58:.70});

    const roof=role(scene,'pendopo-roof-v2')[0];
    setLayer(roof,{x:0,y:8.95,z:mobile?-36.0:-36.6,scale:mobile?.82:.86,opacity:mobile?.46:.56});

    const beam=role(scene,'pendopo-beam-v2')[0];
    setLayer(beam,{x:0,y:6.45,z:-35.1,scale:.93,opacity:mobile?.50:.66});

    const pillars=role(scene,'pendopo-pillar-v2');
    if(pillars[0])setLayer(pillars[0],{x:mobile?-4.6:-5.9,y:4.85,z:-34.7,scale:mobile?.84:.92,opacity:mobile?.54:.72});
    if(pillars[1])setLayer(pillars[1],{x:mobile?4.6:5.9,y:4.85,z:-34.9,scale:mobile?.84:.92,opacity:mobile?.52:.70});

    const ornament=role(scene,'pendopo-ornament-v2')[0];
    setLayer(ornament,{x:0,y:7.65,z:-34.6,scale:.90,opacity:mobile?.28:.38});

    const body=buildBody(scene);

    /* A low warm spill under the eaves makes the columns read as a physical
       volume and visually attaches the roof to the floor. */
    const fill=new THREE.PointLight(0xff9347,mobile?.82:1.45,mobile?18:24,2);
    fill.name='FAJ_Pendopo_Body_Fill_V4';fill.position.set(0,4.2,-34.7);scene.add(fill);

    window.__fajPendopoBodyFix={installed:true,body,fill};
    document.documentElement.dataset.fajPendopo='full-body-v4';
    return true;
  }

  function tick(){
    if(install())return;
    if(performance.now()-started<15000)requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon pendopo body-fix body anchor missing');
html = html.replace('</body>', block + '\n</body>');
await writeFile(file, html, 'utf8');
console.log('Cirebon pendopo full-body fix applied.');
