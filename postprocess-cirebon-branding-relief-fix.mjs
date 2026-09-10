import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_BRANDING_RELIEF_FIX -->';
if (html.includes(marker)) process.exit(0);
if (!html.includes('FAJ_CIREBON_PENDOPO_BODY_FIX')) throw new Error('Pendopo body marker missing before branding relief fix');

const block = String.raw`${marker}
<script id="faj-cirebon-branding-relief-fix">
(() => {
  const started = performance.now();
  const mobile = matchMedia('(max-width:820px)').matches;

  function texture(url, done){
    const t = new THREE.TextureLoader().load(url, tex => {
      if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      else if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      const r = window.__kage && window.__kage.renderer;
      if (r && r.capabilities) tex.anisotropy = Math.min(mobile ? 2 : 8, r.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      if (done) done(tex);
    });
    return t;
  }

  function makeRelief(scene){
    const old = scene.getObjectByName('FAJ_CIREBON_BRANDING_RELIEF_V5');
    if (old) return old;

    const g = new THREE.Group();
    g.name = 'FAJ_CIREBON_BRANDING_RELIEF_V5';
    g.userData.fajBrandingRelief = true;

    const bronze = new THREE.MeshStandardMaterial({
      color:0x6d5235, roughness:.58, metalness:.34
    });
    const bronzeDark = new THREE.MeshStandardMaterial({
      color:0x2b2019, roughness:.73, metalness:.18
    });
    const stone = new THREE.MeshStandardMaterial({
      color:0x302a27, roughness:.94, metalness:.01
    });

    /* Emblem: a real wall medallion, not a floating image. */
    const medallion = new THREE.Mesh(
      new THREE.CylinderGeometry(mobile?1.02:1.22, mobile?1.02:1.22, .18, 48),
      bronzeDark
    );
    medallion.rotation.x = Math.PI/2;
    medallion.position.set(0, mobile?5.25:5.45, -38.18);
    medallion.castShadow = !mobile;
    medallion.receiveShadow = true;
    g.add(medallion);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(mobile?1.00:1.20, mobile?.055:.07, 12, 64),
      bronze
    );
    ring.position.set(0, mobile?5.25:5.45, -38.05);
    ring.castShadow = !mobile;
    g.add(ring);

    const emblemMat = new THREE.MeshStandardMaterial({
      map:texture('/cirebon-assets/branding/emblem.webp'), transparent:true,
      alphaTest:.018, side:THREE.DoubleSide, depthWrite:true,
      roughness:.62, metalness:.08, color:0xf0dec2
    });
    const emblem = new THREE.Mesh(
      new THREE.PlaneGeometry(mobile?2.02:2.38, mobile?2.02:2.38), emblemMat
    );
    emblem.name = 'FAJ_Cirebon_Emblem_Mounted';
    emblem.position.set(0, mobile?5.25:5.45, -37.94);
    emblem.castShadow = !mobile;
    emblem.renderOrder = 18;
    g.add(emblem);

    /* Wordmark: mount it on a shallow stone plaque below the crest. The source
       has generous transparent vertical space, so crop the texture instead of
       stretching the logo into a fake-looking shape. */
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(mobile?4.6:5.8, mobile?1.34:1.52, .16), stone
    );
    plaque.position.set(0, mobile?3.16:3.20, -38.18);
    plaque.castShadow = !mobile;
    plaque.receiveShadow = true;
    g.add(plaque);

    const plaqueLip = new THREE.Mesh(
      new THREE.BoxGeometry(mobile?4.85:6.05, .08, .22), bronzeDark
    );
    plaqueLip.position.set(0, mobile?2.48:2.42, -38.08);
    g.add(plaqueLip);

    const wordTex = texture('/cirebon-assets/branding/cirebon-3d-wordmark.webp', tex => {
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.repeat.set(1,.62);
      tex.offset.set(0,.19);
      tex.needsUpdate = true;
    });
    const wordMat = new THREE.MeshStandardMaterial({
      map:wordTex, transparent:true, alphaTest:.018,
      side:THREE.DoubleSide, depthWrite:true,
      roughness:.58, metalness:.10, color:0xf0ddc2
    });
    const word = new THREE.Mesh(
      new THREE.PlaneGeometry(mobile?4.25:5.35, mobile?1.98:2.48), wordMat
    );
    word.name = 'FAJ_Cirebon_Wordmark_Mounted';
    word.position.set(0, mobile?3.18:3.22, -37.96);
    word.castShadow = !mobile;
    word.renderOrder = 18;
    g.add(word);

    const warm = new THREE.PointLight(0xd88a4d, mobile?.26:.42, mobile?8:10, 2);
    warm.position.set(0,4.15,-35.9);
    g.add(warm);

    /* Keep branding physically inside the pendopo rear wall. It should be seen
       through the gate opening and become clearer as the camera crosses the threshold. */
    scene.add(g);
    return g;
  }

  function install(){
    const k = window.__kage;
    if (!k || !k.scene || !window.THREE) return false;
    if (k.scene.userData.fajBrandingReliefFix) return true;
    k.scene.userData.fajBrandingReliefFix = true;

    const g = makeRelief(k.scene);

    /* Old duplicate branding planes were intentionally disabled in Final V3.
       Leave them off; this mounted relief is the single canonical branding treatment. */
    k.scene.traverse(o => {
      const r = o && o.userData && o.userData.role;
      if (r === 'cirebon-wordmark-3d' || r === 'cirebon-emblem-3d') o.visible = false;
    });

    document.documentElement.dataset.fajBranding = 'mounted-relief-v5';
    window.__fajBrandingRelief = {installed:true, group:g};
    return true;
  }

  function tick(){
    if (install()) return;
    if (performance.now() - started < 15000) requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon branding relief body anchor missing');
html = html.replace('</body>', block + '\n</body>');
await writeFile(file, html, 'utf8');
console.log('Cirebon mounted emblem and wordmark relief applied.');