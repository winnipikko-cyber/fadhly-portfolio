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

    const timber=new THREE.MeshStandardMaterial({color:0x56382a,roughness:.84,metalness:.012});
    const timberDark=new THREE.MeshStandardMaterial({color:0x2d1d18,roughness:.91,metalness:.01});
    const stone=new THREE.MeshStandardMaterial({color:0x5b5149,roughness:.94,metalness:0});
    const warmWood=new THREE.MeshStandardMaterial({color:0x754832,roughness:.80,metalness:.01});
    const lattice=new THREE.MeshStandardMaterial({color:0x39231b,roughness:.88,metalness:.01});

    const deck=new THREE.Mesh(new THREE.BoxGeometry(mobile?15.2:18.4,.66,mobile?7.4:9.0),stone);
    deck.position.set(0,.36,-35.8);deck.receiveShadow=true;g.add(deck);

    const xs=mobile?[-4.8,-1.6,1.6,4.8]:[-6.3,-2.1,2.1,6.3];
    const zs=mobile?[-33.9,-37.7]:[-33.6,-38.0];
    xs.forEach((x,i)=>zs.forEach((z,j)=>{
      const col=new THREE.Mesh(new THREE.CylinderGeometry(.20,.25,6.25,14),i%2?timber:warmWood);
      col.position.set(x,3.75,z);col.castShadow=!mobile;g.add(col);
      const foot=new THREE.Mesh(new THREE.CylinderGeometry(.36,.42,.28,14),stone);
      foot.position.set(x,.78,z);g.add(foot);
    }));

    zs.forEach(z=>{
      const beam=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.9:14.4,.40,.42),timberDark);
      beam.position.set(0,6.78,z);beam.castShadow=!mobile;g.add(beam);
      const beam2=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.4:13.7,.20,.28),warmWood);
      beam2.position.set(0,6.30,z);g.add(beam2);
    });

    const frontRail=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.7:13.9,.22,.26),warmWood);
    frontRail.position.set(0,5.64,mobile?-33.72:-33.48);g.add(frontRail);

    const sideX=mobile?5.15:6.65;
    [-1,1].forEach(s=>{
      const side=new THREE.Mesh(new THREE.BoxGeometry(.36,.40,mobile?3.9:4.7),timberDark);
      side.position.set(s*sideX,6.78,-35.8);g.add(side);
    });

    const back=new THREE.Mesh(new THREE.BoxGeometry(mobile?10.8:13.7,4.6,.38),new THREE.MeshStandardMaterial({color:0x271b17,roughness:.93,metalness:0}));
    back.position.set(0,3.15,-38.42);g.add(back);

    const glowMat=new THREE.MeshBasicMaterial({color:0xff9a52,transparent:true,opacity:mobile?.11:.16,depthWrite:false,fog:true,blending:THREE.AdditiveBlending});
    const panelXs=mobile?[-3.0,0,3.0]:[-4.2,-1.4,1.4,4.2];
    panelXs.forEach(x=>{
      const panel=new THREE.Mesh(new THREE.PlaneGeometry(mobile?2.1:2.35,3.45),glowMat.clone());
      panel.position.set(x,3.32,-38.18);g.add(panel);
      const top=new THREE.Mesh(new THREE.BoxGeometry(mobile?2.18:2.45,.10,.12),lattice);top.position.set(x,5.06,-38.05);g.add(top);
      const bottom=new THREE.Mesh(new THREE.BoxGeometry(mobile?2.18:2.45,.10,.12),lattice);bottom.position.set(x,1.60,-38.05);g.add(bottom);
      [-1,1].forEach(s=>{const jamb=new THREE.Mesh(new THREE.BoxGeometry(.10,3.55,.12),lattice);jamb.position.set(x+s*(mobile?1.04:1.17),3.32,-38.05);g.add(jamb);});
    });

    scene.add(g);
    return g;
  }

  function install(){
    const k=window.__kage;
    if(!k||!k.scene||!window.THREE)return false;
    if(k.scene.userData.fajPendopoBodyFix)return true;
    k.scene.userData.fajPendopoBodyFix=true;
    const {scene}=k;

    /* Keep the photographic plate as roof/texture support only. The readable
       lower facade now comes from real geometry so the camera sees columns,
       deck, beams and the rear wall instead of one giant roof crop. */
    const pend=role(scene,'pendopo')[0];
    setLayer(pend,{x:0,y:8.15,z:mobile?-37.1:-37.7,scale:mobile?.72:.68,opacity:mobile?.64:.68,depthWrite:true});
    if(pend&&pend.material)pend.material.color.setHex(0xe7cfb6);

    const base=role(scene,'pendopo-base-v2')[0];
    setLayer(base,{x:0,y:2.55,z:mobile?-35.1:-35.5,scale:mobile?.94:1.0,opacity:mobile?.72:.82});

    const roof=role(scene,'pendopo-roof-v2')[0];
    setLayer(roof,{x:0,y:9.15,z:mobile?-36.5:-37.0,scale:mobile?.78:.82,opacity:mobile?.38:.44});

    const beam=role(scene,'pendopo-beam-v2')[0];
    setLayer(beam,{x:0,y:6.70,z:-35.25,scale:.96,opacity:mobile?.68:.82});

    const pillars=role(scene,'pendopo-pillar-v2');
    if(pillars[0])setLayer(pillars[0],{x:mobile?-4.8:-6.1,y:4.95,z:-34.85,scale:mobile?.90:.96,opacity:mobile?.76:.88});
    if(pillars[1])setLayer(pillars[1],{x:mobile?4.8:6.1,y:4.95,z:-35.05,scale:mobile?.90:.96,opacity:mobile?.74:.86});

    const ornament=role(scene,'pendopo-ornament-v2')[0];
    setLayer(ornament,{x:0,y:7.72,z:-34.75,scale:.90,opacity:mobile?.24:.32});

    const body=buildBody(scene);

    const fill=new THREE.PointLight(0xff9347,mobile?1.30:2.20,mobile?20:28,2);
    fill.name='FAJ_Pendopo_Body_Fill_V4';fill.position.set(0,4.15,-35.2);scene.add(fill);
    const frontFill=new THREE.PointLight(0xd7b08a,mobile?.38:.70,mobile?14:18,2);
    frontFill.name='FAJ_Pendopo_Front_Fill_V4';frontFill.position.set(0,4.8,-31.8);scene.add(frontFill);

    window.__fajPendopoBodyFix={installed:true,body,fill,frontFill};
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
console.log('Cirebon pendopo full-body fix applied with visible columns, deck and rear facade.');
