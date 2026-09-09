import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist', 'cirebon');
const base = 'https://raw.githubusercontent.com/MengTo/threeui/68802d5428071ada5c20db8094b1649e6bb770ed/public/landing-pages';

const sources = {
  'kage.html': 'c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49',
  'secret-pathways-assets/fonts.css': '985f85a904a4096f92c06552b06f42a45973ac004af4780d68f18af65ddcc1b0',
  'secret-pathways-assets/three.min.js': '8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271',
  'secret-pathways-assets/generated/kage-sanmon-preview.webp': '23937f8c8350c55730c3bd17066a250548b2d29aad0e6ffb96218c1354b6db43',
  'secret-pathways-assets/generated/kage-approach.webp': '39ff338936097e1bde0c4eadcf09805b9890862703186e67314942de7e0bc36c',
  'secret-pathways-assets/generated/kage-lantern-court.webp': 'c0a6ff7da1cd6909d66e2f3f690b0d524a693e01d2222ab846d0074a90f47471',
  'secret-pathways-assets/generated/kage-moonwater.webp': 'b8c8060c51c87a103bae619b3a4cc8b8b80632649d83f1f2c2299051e7f9b400',
  'secret-pathways-assets/foreground/png/temple-wall.webp': '41c00f017e4ecf2147ee468d74da955bb4e2dad773f75a575022842eaf7609ce',
  'secret-pathways-assets/foreground/png/pine-tree.webp': '79b233716d067bbc64c1507f79e4a30ba5f445995158c78562cc5b81f607ede7',
  'secret-pathways-assets/foreground/png/tall-grass.webp': '8db0b5fbd160a7225391a6283a99681e346e205f24191031657285ef85ef12d2',
  'secret-pathways-assets/foreground/png/sakura-branch.webp': '48564194d40496090dbf3bba2a68785cf91fafb655dc8d43ac16f6678aff196d',
  'secret-pathways-assets/foreground/png/maple-leaves.webp': '35a90fec62c1a6bbfbbe73cd5d7b1acb889e80546d404182ef9a45fe417b531f',
  'secret-pathways-assets/foreground/png/stone-lantern.webp': 'd5f3c881bc9d92b72eaaff2b709614d66e21a19e14025d2b9b16a15ab52df3bc',
  'secret-pathways-assets/foreground/png/garden-bush.webp': '707e2516ebc0108041fe0ddc26d8bff0a69dc9700641f837765018b64e9ff15e',
  'secret-pathways-assets/foreground/png/basalt-stones.webp': '150f1c87e181d651c318168c271bb65c9c8abac6dea6f2421fdd081c5b740471',
  'secret-pathways-assets/foreground/png/hill.webp': 'ffba816244bcba98e4e33c6ee56165edfe4048db4af122ef3f5822180a85edbc',
  'secret-pathways-assets/foreground/png/shrine-ruins.webp': '77006e58f2066e6fa9bfc504df396db49b1c7977858fa52d34dd2dad5feced77'
};

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

async function fetchVerified(rel) {
  const res = await fetch(`${base}/${rel}`);
  if (!res.ok) throw new Error(`Failed to fetch ThreeUI source: ${rel} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  const got = sha256(buf);
  const expected = sources[rel];
  if (got !== expected) throw new Error(`SHA-256 mismatch for ${rel}: expected ${expected}, got ${got}`);
  return buf;
}

function replaceAll(source, pairs) {
  let out = source;
  for (const [from, to] of pairs) {
    if (!out.includes(from)) throw new Error(`Cirebon transform anchor missing: ${from.slice(0, 96)}`);
    out = out.split(from).join(to);
  }
  return out;
}

function replaceBetween(source, start, end, replacement) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error(`Cirebon transform block missing: ${start}`);
  return source.slice(0, a) + replacement + '\n\n' + source.slice(b);
}

const palaceWorld = String.raw`function buildTemple() {
  const g = new THREE.Group();
  const brick = new THREE.MeshStandardMaterial({ color: 0x8d3425, roughness: .94, metalness: .01 });
  const plaster = new THREE.MeshStandardMaterial({ color: 0xd9d7cf, roughness: .92, metalness: 0 });
  const timber = new THREE.MeshStandardMaterial({ color: 0x2a211d, roughness: .88, metalness: .02 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x171b1c, roughness: .78, metalness: .06 });
  const porcelain = new THREE.MeshStandardMaterial({ color: 0xcfd7d6, roughness: .55, metalness: .02 });
  const F = PODIUM;

  // Siti Inggil-inspired open pavilion: an interpretive spatial study, not a measured reconstruction.
  const court = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 11), brick);
  court.position.set(0, F + .6, TEMPLE_Z + 2.2); court.castShadow = true; court.receiveShadow = true; g.add(court);

  for (let side = -1; side <= 1; side += 2) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(2.1, 4.4, 8.2), brick);
    wall.position.set(side * 9.7, F + 2.6, TEMPLE_Z + 2.2); wall.castShadow = true; g.add(wall);
    for (let i = 0; i < 3; i++) {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .08, 24), porcelain);
      plate.rotation.x = Math.PI / 2;
      plate.position.set(side * 10.78, F + 1.5, TEMPLE_Z - .6 + i * 2.7);
      g.add(plate);
    }
  }

  const cols = 7;
  for (let row = 0; row < 2; row++) for (let i = 0; i < cols; i++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, 4.4, 14), timber);
    col.position.set(-7.8 + i * 2.6, F + 3.0, TEMPLE_Z + (row ? 5.3 : -.7));
    col.castShadow = true; g.add(col);
  }

  const pavilionRoof = new THREE.Mesh(roofGeo(10.8, 5.7, 3.2, 2.8, .36, .10), roof);
  pavilionRoof.position.set(0, F + 5.0, TEMPLE_Z + 2.3); pavilionRoof.castShadow = true; g.add(pavilionRoof);

  const inner = new THREE.Mesh(new THREE.BoxGeometry(26, 6.4, 9), plaster);
  inner.position.set(0, F + 3.2, TEMPLE_Z - 9.0); inner.castShadow = true; g.add(inner);
  const innerRoof = new THREE.Mesh(roofGeo(14.8, 5.8, 3.5, 2.4, .34, .08), roof);
  innerRoof.position.set(0, F + 6.2, TEMPLE_Z - 9.0); innerRoof.castShadow = true; g.add(innerRoof);

  const warm = new THREE.MeshBasicMaterial({ color: hdr(1.02, .42, .16), fog: true, toneMapped: false });
  for (let i = 0; i < 5; i++) {
    const bay = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.25), warm);
    bay.position.set(-6.0 + i * 3.0, F + 3.0, TEMPLE_Z - 4.44); g.add(bay);
  }

  WORLD.templeTop = F + 9.2;
  scene.add(g); WORLD.temple = g;

  const spill = new THREE.Mesh(new THREE.PlaneGeometry(36, 18),
    new THREE.MeshBasicMaterial({ map: tx(texGlow('rgba(232,145,74,.72)', 'rgba(143,61,28,.20)')),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: .24 }));
  spill.position.set(0, F + 2.7, TEMPLE_Z + 7.4); spill.renderOrder = 2;
  scene.add(spill); WORLD.hallHalo = spill;

  const mist = new THREE.Mesh(new THREE.PlaneGeometry(72, 24),
    new THREE.MeshBasicMaterial({ map: tx(texGlow('rgba(91,139,174,.46)', 'rgba(38,78,117,.16)')),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, opacity: .16 }));
  mist.position.set(0, F + .2, TEMPLE_Z + 9); mist.renderOrder = 2; scene.add(mist);
}`;

const gapuraWorld = String.raw`function buildTorii() {
  const brick = new THREE.MeshStandardMaterial({ color: 0x8d3425, roughness: .96, metalness: 0 });
  const brickDark = new THREE.MeshStandardMaterial({ color: 0x5f281f, roughness: .98, metalness: 0 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0xd8d9d2, roughness: .58, metalness: .02 });
  const g = new THREE.Group();

  function tower(side) {
    const x = side * 3.35;
    const levels = [
      [1.95, 1.05, .74, 0.0],
      [1.72, 1.15, .68, .82],
      [1.44, 1.28, .60, 1.70],
      [1.16, 1.38, .52, 2.65],
      [.86, 1.52, .45, 3.70]
    ];
    levels.forEach((L, i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(L[0], L[1], L[2]), i % 2 ? brickDark : brick);
      m.position.set(x + side * i * .09, .52 + L[3], -8.6); m.castShadow = true; g.add(m);
    });
    const crown = new THREE.Mesh(new THREE.BoxGeometry(.62, 1.0, .44), brickDark);
    crown.position.set(x + side * .42, 5.24, -8.6); crown.rotation.z = side * -.12; g.add(crown);

    for (let i = 0; i < 3; i++) {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .06, 20), ceramic);
      plate.rotation.x = Math.PI / 2;
      plate.position.set(x - side * .98, 1.15 + i * .72, -8.18); g.add(plate);
    }
  }
  tower(-1); tower(1);

  const stair = new THREE.Mesh(new THREE.BoxGeometry(3.7, .24, 2.4), brickDark);
  stair.position.set(0, .12, -8.5); stair.receiveShadow = true; g.add(stair);
  g.scale.setScalar(.92);
  scene.add(g); WORLD.torii = g;
}`;

function transformKage(input) {
  let html = input;

  html = replaceAll(html, [
    ['<title>Kage — Where stillness reveals the unseen</title>', '<title>CIREBON — Court, Coast & Cloud</title>'],
    ['A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL.', 'An immersive night passage through Cirebon: red-brick courts, coastal haze, Mega Mendung, and the layered culture around Kasepuhan, rendered live in WebGL.'],
    ['--vermilion:#e0231c;', '--vermilion:#a94732;'],
    ['--ember:#ff5a3c;', '--ember:#d66b42;'],
    ['--gold:#c9a24a;', '--gold:#aa8b55;'],
    ['--bone:#dfe7e0;', '--bone:#e7e4dc;'],
    ['--bone-dim:#aab4ad;', '--bone-dim:#b9b3a7;'],
    ['--ink:#05070a;', '--ink:#07090d;'],
    ['--ink-2:#0a0e12;', '--ink-2:#101722;'],
    ['#e0231c', '#a94732'],
    ['<span class="brand-tx"><b>KAGE</b><i>HIDDEN REALMS OF KYOTO</i></span>', '<span class="brand-tx"><b>CIREBON</b><i>COURT · COAST · CLOUD</i></span>'],
    ['<span>Temples</span><span class="alt">伽藍</span>', '<span>Ambang</span><span class="alt">GAPURA</span>'],
    ['<span>Gardens</span><span class="alt">庭園</span>', '<span>Awan</span><span class="alt">MEGA MENDUNG</span>'],
    ['<span>Rituals</span><span class="alt">神事</span>', '<span>Warisan</span><span class="alt">PUSAKA</span>'],
    ['<span>Afterlight</span><span class="alt">残光</span>', '<span>Pesisir</span><span class="alt">PANTURA</span>'],
    ['Chapter 00 — The Hidden Gate', 'Bab 00 — Ambang Pesisir'],
    ['<span class="mask-line"><span>Where stillness</span></span>\n      <span class="mask-line"><span>reveals the</span></span>\n      <span class="mask-line"><span>unseen.</span></span>', '<span class="mask-line"><span>Between court,</span></span>\n      <span class="mask-line"><span>coast and</span></span>\n      <span class="mask-line"><span>cloud.</span></span>'],
    ['Enter Kyoto through its quiet thresholds, where ritual,\n      craft, and memory shape the path.', 'Masuk ke Cirebon lewat lapisan yang bertemu di satu tempat: keraton, pesisir, batik, pusaka, dan jejak perjumpaan budaya.'],
    ['<span>Scroll to enter</span>', '<span>Scroll untuk masuk</span>'],
    ['<b>Thresholds</b><p>Discover the hidden gates that open on to deeper paths.</p>', '<b>Gapura</b><p>Bata merah menjadi ambang pertama menuju ruang-ruang keraton.</p>'],
    ['<b>Still Gardens</b><p>Witness the courts where silence gently unfolds.</p>', '<b>Mega Mendung</b><p>Awan Cirebon menjadi bahasa visual yang bergerak pelan di langit.</p>'],
    ['<b>Sacred Craft</b><p>Embrace the hands and heritage that shape devotion.</p>', '<b>Pusaka</b><p>Kerajinan, simbol, dan benda warisan membentuk ingatan kolektif.</p>'],
    ['<b>Night Rituals</b><p>Explore the rites that awaken when the day is done.</p>', '<b>Pesisir</b><p>Di tepi Pantura, banyak pengaruh datang lalu tinggal sebagai lapisan.</p>'],
    ['<b class="jp">山門</b><i>Sanmon — before the bell</i>', '<b>KASEPUHAN</b><i>Siti Inggil — before the court</i>'],
    ['<span class="v jp">影の道</span>', '<span class="v">CIREBON</span>'],
    ['<span class="k"><b>01</b> — The Sanmon</span><span class="rule"></span><span class="k jp">山門</span>', '<span class="k"><b>01</b> — Siti Inggil</span><span class="rule"></span><span class="k">AMBANG</span>'],
    ['Charred cypress, worn stone, one gate left open.', 'Red brick, open court, one threshold facing the coast.'],
    ['Kage begins where the city stops: a mountain gate of cedar burned black,\n        standing in its own weather. The soot is not decoration. It is how a board is taught to survive a\n        hundred rainy seasons, and the first thing this place asks you to understand.', 'Perjalanan dimulai dari bahasa bata merah Kasepuhan: dinding, gapura, halaman, dan paviliun yang membentuk urutan ruang sebelum kita sampai ke inti keraton.'],
    ['Climb the worn steps and the worship hall lifts out of the mist, its paper\n        screens lit from inside like a lantern the size of a house. Above the eaves a vermilion moon holds\n        its place, patient, half hidden. Nothing here is in a hurry. Neither, for the next ninety minutes,\n        are you.', 'Di Cirebon, bentuk tidak datang dari satu sumber. Jejak Jawa, Sunda, Islam, Tionghoa, dan Eropa bertemu di dalam kompleks dan menghasilkan bahasa yang terasa khas pesisir: terbuka, berlapis, dan sulit diperas menjadi satu identitas saja.'],
    ['<span>Cross the threshold</span>', '<span>Masuk ke lapisan berikutnya</span>'],
    ['<div><b>05</b><span>Chapters</span></div>\n    <div><b>92</b><span>Minutes</span></div>\n    <div><b>1611</b><span>Hall raised</span></div>\n    <div><b>∞</b><span>Stillness</span></div>', '<div><b>1529</b><span>Kasepuhan founded</span></div>\n    <div><b>10</b><span>Hectare complex</span></div>\n    <div><b>04</b><span>Cirebon palaces</span></div>\n    <div><b>∞</b><span>Layers</span></div>'],
    ['<span class="k"><b>02</b> — Still Gardens</span><span class="rule"></span><span class="k jp">庭園</span>', '<span class="k"><b>02</b> — Mega Mendung</span><span class="rule"></span><span class="k">AWAN</span>'],
    ['<div class="card-lab"><b>Approach</b><span class="jp">参道</span></div>', '<div class="card-lab"><b>Siti Inggil</b><span>AMBANG</span></div>'],
    ['<div class="card-meta"><span>The long climb</span><span>01 / 03</span></div>', '<div class="card-meta"><span>Red-brick threshold</span><span>01 / 03</span></div>'],
    ['<div class="card-lab"><b>Lanterns</b><span class="jp">灯籠</span></div>', '<div class="card-lab"><b>Mega Mendung</b><span>AWAN</span></div>'],
    ['<div class="card-meta"><span>Lantern court</span><span>02 / 03</span></div>', '<div class="card-meta"><span>Cloud language</span><span>02 / 03</span></div>'],
    ['<div class="card-lab"><b>Moonwater</b><span class="jp">月影</span></div>', '<div class="card-lab"><b>Wadasan</b><span>BATU</span></div>'],
    ['<div class="card-meta"><span>The wet court</span><span>03 / 03</span></div>', '<div class="card-meta"><span>Ground and relief</span><span>03 / 03</span></div>'],
    ['<span class="k"><b>03</b> — Sacred Craft</span><span class="rule"></span><span class="k jp">手業</span>', '<span class="k"><b>03</b> — Pusaka & Lapisan</span><span class="rule"></span><span class="k">WARISAN</span>'],
    ['Five chapters. Ninety minutes. One quiet mind.', 'Five layers. One coast. No single origin.'],
    ['Each chapter is a walk, not a lecture. You arrive at the gate, climb the\n      steps, sit with the lantern, and leave with one thing worth keeping.', 'Ini bukan tur museum. Setiap bab memakai satu elemen Cirebon untuk menunjukkan bagaimana ruang, motif, perdagangan, keyakinan, dan craft saling menempel dari masa ke masa.'],
    ['The Hidden Gate<em class="jp">山門</em>', 'Siti Inggil<em>AMBANG</em>'],
    ['Why a gate is a sentence, and what you agree to when you walk under one.', 'Bata merah sebagai urutan ruang: bukan dekorasi, tapi cara tubuh membaca keraton.'],
    ['Borrowed Scenery<em class="jp">借景</em>', 'Mega Mendung<em>AWAN</em>'],
    ['Shakkei: composing with a mountain you will never own.', 'Motif awan pesisir sebagai sistem visual: berulang, bertingkat, dan bergerak tanpa kehilangan identitas.'],
    ['Charred Cypress<em class="jp">焼杉</em>', 'Wadasan<em>BATU</em>'],
    ['Yakisugi: burning a board black so the weather will let it live.', 'Bahasa batu dan relief yang memberi berat pada komposisi Cirebon di antara awan dan laut.'],
    ['Lantern Light<em class="jp">灯籠</em>', 'Singa Barong<em>PUSAKA</em>'],
    ['How a single ember decides the scale of everything around it.', 'Kereta pusaka sebagai pertemuan simbolik berbagai pengaruh yang masuk ke Cirebon.'],
    ['The Vermilion Moon<em class="jp">朱月</em>', 'Pesisir & Perjumpaan<em>PANTURA</em>'],
    ['Why the moon burns red over the valley, and what the garden does with it.', 'Pelabuhan dan jalur pantai membuat Cirebon tumbuh sebagai tempat perjumpaan, bukan budaya yang berdiri sendirian.'],
    ['Chapter 04 — Afterlight', 'Bab 04 — Pesisir'],
    ['<h2 class="display" data-rv="up">Afterlight</h2>', '<h2 class="display" data-rv="up">PANTURA</h2>'],
    ['The gate does not close behind you. Take the walk whenever the noise\n    gets loud — it is always the same path, and never the same light.', 'Keraton bukan akhir perjalanan. Di luar temboknya ada pesisir, perdagangan, batik, bahasa, dan ingatan yang terus membuat Cirebon berubah tanpa kehilangan jejaknya.'],
    ['<span>Begin the walk</span>', '<span>Ulangi perjalanan</span>'],
    ['A five-chapter night walk through a Kyoto mountain temple. Three illustrated garden field notes\n        sit inside a live Three.js sanctuary.', 'A spatial study of Cirebon through Kasepuhan, coastal exchange, Mega Mendung, Wadasan, and royal heritage — built as a live Three.js night passage.'],
    ['© 2026 Kage — Kage no Michi', '© 2026 FAJ — Cirebon Spatial Study'],
    ['<span class="jp">静けさは一つの技である</span>', '<span>COURT · COAST · CLOUD</span>'],
    ['WebGL · Onest · Kyoto', 'WebGL · Onest · Cirebon'],
    ["const word = 'KAGE'", "const word = 'CIREBON'"],
    ["const names = ['The Hidden Gate', 'The Sanmon', 'Still Gardens', 'Sacred Craft', 'Afterlight', 'Colophon'];", "const names = ['Ambang Pesisir', 'Siti Inggil', 'Mega Mendung', 'Pusaka & Lapisan', 'Pantura', 'Colophon'];"],
    ["['Growing the maples', () => {\n    buildMaple(71, 12.6, -13.0, 1.05); buildMaple(72, -11.8, -9.4, .95);\n    buildMaple(73, 9.2, -19.0, .82);   buildMaple(74, -14.5, -17.5, 1.0);\n    buildMaple(75, 16.5, -6.0, .88);\n  }]", "['Holding the coastal canopy', () => {}]"],
    ["['Painting the near grass', () => buildForeground()]", "['Opening the court', () => { WORLD.fg = []; }]"],
    ["['Raising the mist', () => { buildAtmosphere(); buildLeafFall(); buildWisps(); }]", "['Raising the coastal haze', () => { buildAtmosphere(); buildWisps(); }]"],
    ["color: hdr(3.6, .64, .61)", "color: hdr(1.72, 1.34, .92)"],
    ["texGlow('rgba(255,124,112,.90)', 'rgba(206,52,48,.26)')", "texGlow('rgba(92,156,204,.70)', 'rgba(35,78,130,.24)')"]
  ]);

  html = replaceBetween(html, 'function buildTemple() {', '/* --------------------------------------------------- the vermilion moon', palaceWorld);
  html = replaceBetween(html, 'function buildTorii() {', 'function buildLantern(x, z, s, y) {', gapuraWorld);

  html = html.replace('</style>\n</head>', `
/* ===================================================== Cirebon derivative */
#fg-sky,.fg{display:none!important}
.peek-fr{background:linear-gradient(155deg,rgba(7,9,13,.10),rgba(7,9,13,.72)),radial-gradient(90% 120% at 72% 12%,rgba(84,145,192,.46),transparent 55%),linear-gradient(145deg,#7a3026 0 34%,#191f2a 34% 56%,#0b1017 56% 100%)!important}
.card:nth-child(1) .card-fr{background:linear-gradient(155deg,rgba(7,9,13,.08),rgba(7,9,13,.74)),linear-gradient(135deg,#8d3425,#3f211f 48%,#111722)!important}
.card:nth-child(2) .card-fr{background:radial-gradient(110% 65% at 15% 25%,transparent 48%,rgba(210,228,238,.15) 49% 51%,transparent 52%),radial-gradient(100% 70% at 72% 68%,transparent 48%,rgba(210,228,238,.13) 49% 51%,transparent 52%),linear-gradient(145deg,#10243d,#1d5b88 52%,#8ab7d0)!important}
.card:nth-child(3) .card-fr{background:linear-gradient(165deg,rgba(7,9,13,.10),rgba(7,9,13,.72)),linear-gradient(135deg,#2a2b2c,#695248 54%,#14191f)!important}
#mega-mendung{position:fixed;inset:-14vh -10vw auto auto;width:min(74vw,980px);height:min(62vh,680px);z-index:1;pointer-events:none;opacity:.17;filter:blur(.2px)}
#mega-mendung path{fill:none;stroke:#85b8d6;stroke-width:1.4;vector-effect:non-scaling-stroke}
#mega-mendung .deep{stroke:#315f86;stroke-width:3.4;opacity:.72}
@media(max-width:820px){#mega-mendung{width:118vw;right:-42vw;top:7vh;opacity:.12}.cur-dot{display:none!important}}
</style>\n</head>`);

  html = html.replace('<canvas id="gl" aria-hidden="true"></canvas>', `<canvas id="gl" aria-hidden="true"></canvas>
<svg id="mega-mendung" viewBox="0 0 900 520" aria-hidden="true">
  <path class="deep" d="M870 112c-94-82-226-82-311 5-52-67-165-54-198 28-70-30-155 1-181 72 42-22 90-8 113 31-61-6-117 34-132 92 46-30 105-25 144 12 49 48 131 48 181-2 54 70 169 63 213-14 73 39 166 12 201-62-39 18-84 9-114-23 61 2 112-42 121-100-38 28-90 24-125-8 43-2 78-19 88-31z"/>
  <path d="M842 151c-77-57-177-51-239 18-55-45-142-32-178 31-62-24-132 6-153 64 43-17 88-4 113 31-55 2-102 40-116 93 42-26 95-21 130 12 46 43 118 42 162-2 50 57 145 54 191-7 56 25 125 8 162-39-42 12-83-2-107-34 45-3 83-35 94-78-35 20-78 14-107-16 32-9 52-34 48-73z"/>
  <path d="M720 60c-55-37-127-30-174 17-41-33-106-23-132 25-48-17-101 6-117 50 31-12 65-2 83 24-42 1-77 29-88 69 31-19 71-16 98 9 35 33 88 32 121-2 36 43 108 41 141-5 44 20 96 8 123-29-31 8-61-2-78-26 34-3 63-27 69-59-27 14-59 8-78-14 23-7 37-26 32-59z"/>
</svg>`);

  html = html.replace('<body data-layout-hero="b"', '<body data-experience="cirebon" data-layout-hero="b"');
  html = html.replace('<script src="secret-pathways-assets/three.min.js"></script>', '<script src="secret-pathways-assets/three.min.js"></script>\n<!-- Derived from ThreeUI Kage canonical source c8e06b90397a; cultural direction and world modifications by FAJ portfolio. -->');
  return html;
}

await mkdir(out, { recursive: true });

const canonical = await fetchVerified('kage.html');
const derived = transformKage(canonical.toString('utf8'));
await writeFile(path.join(out, 'index.html'), derived, 'utf8');

for (const rel of Object.keys(sources).filter((p) => p !== 'kage.html')) {
  const buf = await fetchVerified(rel);
  const dest = path.join(out, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
}

console.log('Cirebon spatial experience prepared from verified ThreeUI Kage source.');
