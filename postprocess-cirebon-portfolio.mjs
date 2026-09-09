import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

function must(from, to) {
  if (!html.includes(from)) throw new Error(`Cirebon portfolio anchor missing: ${from.slice(0, 110)}`);
  html = html.split(from).join(to);
}

function optional(from, to) {
  if (html.includes(from)) html = html.split(from).join(to);
}

// Portfolio content: Cirebon remains the visual world, not the subject matter.
must('<span class="brand-tx"><b>CIREBON</b><i>COURT · COAST · CLOUD</i></span>', '<span class="brand-tx"><b>FAJ</b><i>PRODUCT · SYSTEMS · GROWTH</i></span>');
must('<span>Ambang</span><span class="alt">GAPURA</span>', '<span>Work</span><span class="alt">SAMAR</span>');
must('<span>Awan</span><span class="alt">MEGA MENDUNG</span>', '<span>Systems</span><span class="alt">ChoSSI</span>');
must('<span>Warisan</span><span class="alt">PUSAKA</span>', '<span>Growth</span><span class="alt">DIABLO</span>');
must('<span>Pesisir</span><span class="alt">PANTURA</span>', '<span>Now</span><span class="alt">BUILDING</span>');
must('Bab 00 — Ambang Pesisir', 'FADHLY AZIEZ JALALUDDIN — 2026');
must('<span class="mask-line"><span>Between court,</span></span>\n      <span class="mask-line"><span>coast and</span></span>\n      <span class="mask-line"><span>cloud.</span></span>', '<span class="mask-line"><span>Messy ideas.</span></span>\n      <span class="mask-line"><span>Shipped</span></span>\n      <span class="mask-line"><span>systems.</span></span>');
must('Masuk ke Cirebon lewat lapisan yang bertemu di satu tempat: keraton, pesisir, batik, pusaka, dan jejak perjumpaan budaya.', 'I turn messy briefs into products, interfaces, operations, and growth systems that people can actually use, buy, and return to.');
must('<span>Scroll untuk masuk</span>', '<span>Scroll to enter</span>');
must('<b>Gapura</b><p>Bata merah menjadi ambang pertama menuju ruang-ruang keraton.</p>', '<b>Product</b><p>Find the actual problem, reduce the noise, and define what deserves to exist.</p>');
must('<b>Mega Mendung</b><p>Awan Cirebon menjadi bahasa visual yang bergerak pelan di langit.</p>', '<b>Experience</b><p>Turn the product logic into an interface people can understand without a manual.</p>');
must('<b>Pusaka</b><p>Kerajinan, simbol, dan benda warisan membentuk ingatan kolektif.</p>', '<b>Operations</b><p>Connect the visible experience to workflows, data, admin, and delivery behind it.</p>');
must('<b>Pesisir</b><p>Di tepi Pantura, banyak pengaruh datang lalu tinggal sebagai lapisan.</p>', '<b>Growth</b><p>Watch what customers do, learn from the loop, and keep improving what was shipped.</p>');
must('<b>KASEPUHAN</b><i>Siti Inggil — before the court</i>', '<b>FAJ</b><i>Cirebon — spatial portfolio</i>');
must('<span class="v">CIREBON</span>', '<span class="v">FADHLY</span>');
must('<div class="word-fb" aria-hidden="true">CIREBON</div>', '<div class="word-fb" aria-hidden="true">FADHLY</div>');

// Flagship 01 — SAMAR
must('<span class="k"><b>01</b> — Siti Inggil</span><span class="rule"></span><span class="k">AMBANG</span>', '<span class="k"><b>01</b> — SAMAR</span><span class="rule"></span><span class="k">FLAGSHIP</span>');
must('Red brick, open court, one threshold facing the coast.', 'A paid narrative world where story, product logic, and access control become one experience.');
must('Perjalanan dimulai dari bahasa bata merah Kasepuhan: dinding, gapura, halaman, dan paviliun yang membentuk urutan ruang sebelum kita sampai ke inti keraton.', 'SAMAR started as a story and became a product system: immersive reading, timed free access, payment, entitlement, reader state, and a CMS that lets the experience keep evolving after launch.');
must('Di Cirebon, bentuk tidak datang dari satu sumber. Jejak Jawa, Sunda, Islam, Tionghoa, dan Eropa bertemu di dalam kompleks dan menghasilkan bahasa yang terasa khas pesisir: terbuka, berlapis, dan sulit diperas menjadi satu identitas saja.', 'The important work was not adding more effects. It was making the narrative understandable, the paid boundary trustworthy, and the whole reader journey feel intentional from first scroll to unlocked chapter.');
must('<span>Masuk ke lapisan berikutnya</span>', '<span>Explore the system</span>');
must('<div><b>1529</b><span>Kasepuhan founded</span></div>\n    <div><b>10</b><span>Hectare complex</span></div>\n    <div><b>04</b><span>Cirebon palaces</span></div>\n    <div><b>∞</b><span>Layers</span></div>', '<div><b>08+</b><span>Product builds</span></div>\n    <div><b>04</b><span>Flagship cases</span></div>\n    <div><b>01</b><span>Connected practice</span></div>\n    <div><b>∞</b><span>Iterations</span></div>');

// Flagship 02 — ChoSSI / secondary systems.
must('<span class="k"><b>02</b> — Mega Mendung</span><span class="rule"></span><span class="k">AWAN</span>', '<span class="k"><b>02</b> — ChoSSI</span><span class="rule"></span><span class="k">SYSTEM</span>');
must('<div class="card-lab"><b>Siti Inggil</b><span>AMBANG</span></div>', '<div class="card-lab"><b>CLOSER</b><span>CRM</span></div>');
must('<div class="card-meta"><span>Red-brick threshold</span><span>01 / 03</span></div>', '<div class="card-meta"><span>Ownership · routing · follow-up</span><span>01 / 03</span></div>');
must('<div class="card-lab"><b>Mega Mendung</b><span>AWAN</span></div>', '<div class="card-lab"><b>SiapJual48</b><span>GROWTH</span></div>');
must('<div class="card-meta"><span>Cloud language</span><span>02 / 03</span></div>', '<div class="card-meta"><span>Audit · message · execution</span><span>02 / 03</span></div>');
must('<div class="card-lab"><b>Wadasan</b><span>BATU</span></div>', '<div class="card-lab"><b>Mausu</b><span>COMMERCE</span></div>');
must('<div class="card-meta"><span>Ground and relief</span><span>03 / 03</span></div>', '<div class="card-meta"><span>Storefront · admin · orders</span><span>03 / 03</span></div>');

// Flagship 03 — Diablo Match
must('<span class="k"><b>03</b> — Pusaka & Lapisan</span><span class="rule"></span><span class="k">WARISAN</span>', '<span class="k"><b>03</b> — Diablo Match</span><span class="rule"></span><span class="k">COMMERCE</span>');
must('Five layers. One coast. No single origin.', 'One expensive product. One simple question: will it fit my car?');
must('Ini bukan tur museum. Setiap bab memakai satu elemen Cirebon untuk menunjukkan bagaimana ruang, motif, perdagangan, keyakinan, dan craft saling menempel dari masa ke masa.', 'Diablo Match turns installation proof, vehicle fitment, material choices, and sales context into a product-discovery system that helps buyers get confident before they ever open WhatsApp.');
must('Siti Inggil<em>AMBANG</em>', 'SAMAR<em>PRODUCT</em>');
must('Bata merah sebagai urutan ruang: bukan dekorasi, tapi cara tubuh membaca keraton.', 'Narrative UX, paywall, entitlement, and reader state built as one coherent product.');
must('Mega Mendung<em>AWAN</em>', 'ChoSSI<em>SYSTEM</em>');
must('Motif awan pesisir sebagai sistem visual: berulang, bertingkat, dan bergerak tanpa kehilangan identitas.', 'Public discovery, class registration, corporate leads, and admin operations in one system.');
must('Wadasan<em>BATU</em>', 'Diablo Match<em>COMMERCE</em>');
must('Bahasa batu dan relief yang memberi berat pada komposisi Cirebon di antara awan dan laut.', 'Vehicle fitment, installation proof, catalog clarity, and a paid-growth feedback loop.');
must('Singa Barong<em>PUSAKA</em>', 'Teman Deadline<em>OPS</em>');
must('Kereta pusaka sebagai pertemuan simbolik berbagai pengaruh yang masuk ke Cirebon.', 'Telegram-first intake that turns vague requests into structured, operator-ready orders.');
must('Pesisir & Perjumpaan<em>PANTURA</em>', 'Bad Faith<em>RESEARCH UI</em>');
must('Pelabuhan dan jalur pantai membuat Cirebon tumbuh sebagai tempat perjumpaan, bukan budaya yang berdiri sendirian.', 'A fifteen-scene interactive thesis interface built for dense ideas, presentation, and reading.');

// Closing / Now
must('Bab 04 — Pesisir', 'NOW — 2026');
must('<h2 class="display" data-rv="up">PANTURA</h2>', '<h2 class="display" data-rv="up">STILL BUILDING.</h2>');
must('Keraton bukan akhir perjalanan. Di luar temboknya ada pesisir, perdagangan, batik, bahasa, dan ingatan yang terus membuat Cirebon berubah tanpa kehilangan jejaknya.', 'The portfolio is a snapshot. SAMAR is moving toward launch, SiapJual48 is live, and AFTERGIG is being prototyped from product engineering through brand and launch.');
must('<span>Ulangi perjalanan</span>', '<span>Back to the beginning</span>');
must('A spatial study of Cirebon through Kasepuhan, coastal exchange, Mega Mendung, Wadasan, and royal heritage — built as a live Three.js night passage.', 'A portfolio about turning messy problems into products, systems, interfaces, operations, and growth loops — inside a Cirebon-inspired live Three.js world.');
must('© 2026 FAJ — Cirebon Spatial Study', '© 2026 Fadhly Aziez Jalaluddin');
must('<span>COURT · COAST · CLOUD</span>', '<span>PRODUCT · SYSTEMS · GROWTH</span>');
must('WebGL · Onest · Cirebon', 'WebGL · Cirebon · Portfolio');
must("const word = 'CIREBON'", "const word = 'FADHLY'");
must("const names = ['Ambang Pesisir', 'Siti Inggil', 'Mega Mendung', 'Pusaka & Lapisan', 'Pantura', 'Colophon'];", "const names = ['Intro', 'SAMAR', 'ChoSSI', 'Diablo Match', 'Teman Deadline', 'Colophon'];");

optional('secret-pathways-assets/generated/kage-sanmon-preview.webp', '/cirebon-assets/architecture/gapura-hero.webp');
optional('secret-pathways-assets/generated/kage-approach.webp', '/cirebon-assets/architecture/pendopo-night.webp');
optional('secret-pathways-assets/generated/kage-lantern-court.webp', '/cirebon-assets/fabric/mega-mendung-cloth.webp');
optional('secret-pathways-assets/generated/kage-moonwater.webp', '/cirebon-assets/ground/wet-courtyard.webp');

const assetWorld = String.raw`
const CIREBON_ASSET_ROOT = '/cirebon-assets';
const CIREBON_WORLD = { group:null, layers:[], fog:[], ready:0 };
function ciEase(a,b,x){ const t=Math.max(0,Math.min(1,(x-a)/Math.max(.0001,b-a))); return t*t*(3-2*t); }
function ciTex(rel, ready){
  return new THREE.TextureLoader().load(CIREBON_ASSET_ROOT + '/' + rel, tex => {
    if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;
    tex.needsUpdate = true; CIREBON_WORLD.ready++; if (ready) ready(tex);
  }, undefined, () => {});
}
function ciPlane(rel, cfg={}){
  const w=cfg.w||8, h=cfg.h||8;
  const mat=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:cfg.depthWrite!==false,depthTest:cfg.depthTest!==false,alphaTest:cfg.alphaTest===undefined?.018:cfg.alphaTest,side:THREE.DoubleSide,fog:cfg.fog!==false,color:cfg.color||0xffffff,blending:cfg.additive?THREE.AdditiveBlending:THREE.NormalBlending});
  const geo=new THREE.PlaneGeometry(w,h,cfg.sway?10:1,cfg.sway?8:1); const mesh=new THREE.Mesh(geo,mat);
  mesh.position.set(cfg.x||0,cfg.y||0,cfg.z||0); if(cfg.ry)mesh.rotation.y=cfg.ry;if(cfg.rx)mesh.rotation.x=cfg.rx; mesh.renderOrder=cfg.order||8;mesh.frustumCulled=false;
  mesh.userData={ci:true,rel,target:cfg.opacity===undefined?1:cfg.opacity,baseX:mesh.position.x,baseY:mesh.position.y,baseZ:mesh.position.z,baseRY:mesh.rotation.y,drift:cfg.drift||0,sway:cfg.sway||0,role:cfg.role||'',phase:cfg.phase||0};
  ciTex(rel,tex=>{mat.map=tex;mat.opacity=mesh.userData.target;mat.needsUpdate=true;if(cfg.onReady)cfg.onReady(mesh);});
  if(cfg.sway){mat.onBeforeCompile=sh=>{sh.uniforms.uT=WORLD.uT;sh.uniforms.uAmp={value:cfg.sway};sh.vertexShader='uniform float uT; uniform float uAmp;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nfloat ciH=uv.y; transformed.x += sin(uT*.72 + position.y*.24)*uAmp*ciH*ciH; transformed.y += cos(uT*.51 + position.x*.21)*uAmp*.18*ciH;');};}
  CIREBON_WORLD.group.add(mesh);CIREBON_WORLD.layers.push(mesh);return mesh;
}
function buildCirebonAssetWorld(){
  if(CIREBON_WORLD.group)return;const g=new THREE.Group();g.name='CirebonAssetWorld';scene.add(g);CIREBON_WORLD.group=g;
  ciPlane('architecture/gapura-hero.webp',{role:'gate-front',x:0,y:5,z:-8.15,w:13.8,h:17.1,order:14,onReady:()=>{if(WORLD.torii)WORLD.torii.visible=false;}});
  if(!COARSE){ciPlane('architecture/gapura-side.webp',{role:'gate-side-l',x:-5.8,y:4.8,z:-7.3,w:8.5,h:15,ry:Math.PI*.49,opacity:.88,order:13});ciPlane('architecture/gapura-side.webp',{role:'gate-side-r',x:5.8,y:4.8,z:-7.3,w:8.5,h:15,ry:-Math.PI*.49,opacity:.88,order:13});ciPlane('architecture/gapura-back.webp',{role:'gate-back',x:0,y:5,z:-6.1,w:13.2,h:16.4,ry:Math.PI,opacity:.72,order:12});}
  ciPlane('architecture/pendopo-night.webp',{role:'pendopo',x:0,y:7.4,z:TEMPLE_Z+1,w:27,h:20,opacity:.97,order:8,onReady:()=>{if(WORLD.temple)WORLD.temple.visible=false;}});
  ciPlane('props/singa-barong.webp',{role:'relic',x:-6.6,y:2.25,z:-15.2,w:4.3,h:5.4,opacity:.92,order:10});ciPlane('props/singa-barong.webp',{role:'relic',x:6.7,y:2.15,z:-15.7,w:4,h:5,ry:-.12,opacity:.68,order:9});
  ciPlane('props/full-moon.webp',{role:'moon-photo',x:8.8,y:13.5,z:-38,w:9.5,h:9.5,opacity:.58,depthWrite:false,order:2});
  ciPlane('foliage/tropical-tree.webp',{role:'fg',x:-10.8,y:5.1,z:3.9,w:12.2,h:15.3,sway:.055,order:24});ciPlane('foliage/jungle-cluster.webp',{role:'fg',x:9.4,y:2,z:5.5,w:13,h:9.1,sway:.038,order:25});
  ciPlane('fabric/mega-mendung-cloth.webp',{role:'cloth',x:-10.5,y:9.5,z:-21,w:10.8,h:13.5,sway:.045,opacity:.44,order:7});
  ciPlane('character/turnaround/front.webp',{role:'character',x:6.4,y:4.7,z:-20,w:6,h:10.4,opacity:0,order:11});
  const fogA=ciPlane('fx/thin-fog.webp',{role:'fog',x:-2,y:3.2,z:-5,w:27,h:13,opacity:.18,depthWrite:false,additive:true,fog:false,order:18,drift:.22});const fogB=ciPlane('fx/thin-fog.webp',{role:'fog',x:8,y:5,z:-27,w:34,h:16,opacity:.13,depthWrite:false,additive:true,fog:false,order:6,drift:-.13});CIREBON_WORLD.fog.push(fogA,fogB);
  if(!COARSE)ciPlane('fx/godrays.webp',{role:'rays',x:10.2,y:12.5,z:-30,w:18,h:25,opacity:.12,depthWrite:false,additive:true,fog:false,order:5});
}
function updateCirebonAssetWorld(dt){
  if(!CIREBON_WORLD.group)return;const p=(RIG&&Number.isFinite(RIG.smooth))?RIG.smooth:0;
  for(const m of CIREBON_WORLD.layers){const u=m.userData||{};if(u.drift)m.position.x=u.baseX+Math.sin(clock*.15+u.phase)*u.drift*4;if(u.role==='fg')m.rotation.z=Math.sin(clock*.18+u.baseX)*.006;
    if(u.role==='gate-front'||u.role==='gate-side-l'||u.role==='gate-side-r'||u.role==='gate-back'){const vis=1-ciEase(.19,.34,p);if(m.material.map)m.material.opacity=u.target*vis;}
    if(u.role==='character'){const vis=ciEase(.48,.58,p)*(1-ciEase(.82,.91,p));if(m.material.map)m.material.opacity=.88*vis;m.position.y=u.baseY+Math.sin(clock*.42)*.025;}
    if(u.role==='cloth'){const vis=ciEase(.22,.35,p)*(1-ciEase(.62,.78,p));if(m.material.map)m.material.opacity=u.target*(.28+.72*vis);}
    if(u.role==='relic'){const vis=ciEase(.42,.55,p)*(1-ciEase(.82,.94,p));if(m.material.map)m.material.opacity=u.target*(.30+.70*vis);}
    if(u.role==='rays'&&m.material.map)m.material.opacity=u.target*(.74+.26*Math.sin(clock*.36));
  }
}
`;
const bootAnchor='/* ======================================================== 14 · booting */\nconst JOBS = [';
if(!html.includes(bootAnchor))throw new Error('Cirebon asset-world boot anchor missing');html=html.replace(bootAnchor,assetWorld+'\n\n'+bootAnchor);
must("['Opening the court', () => { WORLD.fg = []; }]", "['Composing the Cirebon depth', () => { WORLD.fg = []; buildCirebonAssetWorld(); }]");
must('function updateWorld(dt) {\n  WORLD.uT.value = clock;', 'function updateWorld(dt) {\n  WORLD.uT.value = clock;\n  updateCirebonAssetWorld(dt);');

const caseNav=String.raw`<style id="faj-case-links">.faj-case-link{display:inline-flex;align-items:center;gap:.6em;margin-top:22px;padding:10px 0;border-bottom:1px solid rgba(223,231,224,.32);font:500 10px/1 Onest,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--bone);position:relative;z-index:30}.faj-case-link:hover{border-color:var(--vermilion)}</style><script>addEventListener('DOMContentLoaded',()=>{const defs=[['gate','/work/samar/'],['pathways','/work/chossi/'],['lessons','/work/diablo/'],['eternity','/work/teman-deadline/']];defs.forEach(([id,href])=>{const sec=document.getElementById(id);if(!sec)return;const host=sec.querySelector('.gate-copy,.cur-head,.fin,.sec-head')||sec;const a=document.createElement('a');a.className='faj-case-link';a.href=href;a.textContent='Open case study ↗';a.setAttribute('data-cursor','');host.appendChild(a);});});</script>`;
html=html.replace('</body>',caseNav+'\n</body>');
await writeFile(file,html,'utf8');
console.log('Cirebon portfolio content + separated Three.js asset world applied.');
