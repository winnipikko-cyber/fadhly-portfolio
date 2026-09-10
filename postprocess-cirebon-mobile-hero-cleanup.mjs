import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const marker = '<!-- FAJ_CIREBON_MOBILE_HERO_CLEANUP -->';
if (html.includes(marker)) process.exit(0);
if (!html.includes('FAJ_CIREBON_BRANDING_RELIEF_FIX')) throw new Error('Branding relief marker missing before mobile cleanup');

const block = marker + String.raw`
<style id="faj-cirebon-mobile-hero-cleanup-style">
@media(max-width:820px){
  /* The desktop FADHLY sculpture is deliberately absent on phones. The prior
     fallback duplicated it as a second giant word over the chapter index and
     made the hero look like two composited layouts fighting each other. */
  body:not(.no-webgl) .word-fb{display:none!important;opacity:0!important;visibility:hidden!important}

  .hero{min-height:100svh!important;overflow:hidden!important}
  .hero-top{padding-top:calc(var(--nav-h) + 8px)!important;max-width:92vw!important}
  .hero h1{font-size:clamp(29px,9.35vw,42px)!important;line-height:1.01!important;margin-bottom:14px!important}
  .hero-sub{max-width:90vw!important;font-size:12px!important;line-height:1.52!important}
  .hero-spacer{min-height:clamp(168px,29svh,250px)!important}
  .hero-foot{padding-bottom:16px!important;z-index:8!important}

  /* Keep the chapter index legible and architectural. On a 300–400px screen
     the explanatory paragraphs were only a few characters wide and read as
     noise over the gate. The labels remain; detail returns in the sections. */
  .chapters{
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:10px 14px!important;padding-top:12px!important;
    border-top-color:rgba(231,228,220,.16)!important;
  }
  body[data-layout-hero="b"] .chip{display:flex!important;flex-direction:row!important;align-items:flex-start!important;gap:8px!important;min-width:0!important}
  body[data-layout-hero="b"] .chip .num{font-size:clamp(23px,8.3vw,33px)!important;line-height:.92!important;flex:0 0 auto!important}
  body[data-layout-hero="b"] .chip .tx{position:static!important;width:auto!important;height:auto!important;overflow:visible!important;clip:auto!important;clip-path:none!important;white-space:normal!important;padding-top:1px!important;min-width:0!important}
  body[data-layout-hero="b"] .chip b{font-size:8px!important;line-height:1.15!important;letter-spacing:.16em!important;margin:0!important}
  body[data-layout-hero="b"] .chip p{display:none!important}
}
</style>
<script id="faj-cirebon-mobile-hero-cleanup-runtime">
(() => {
  if (!matchMedia('(max-width:820px)').matches) return;
  const started = performance.now();

  function removeDesktopWord(){
    const k = window.__kage;
    if (!k || !k.WORD) return false;
    const w = k.WORD.group;
    if (w) {
      w.visible = false;
      if (w.parent) w.parent.remove(w);
    }
    if (Array.isArray(k.WORD.glyphs)) k.WORD.glyphs.forEach(g => {
      if (!g) return;
      g.visible = false;
      if (g.material) g.material.opacity = 0;
    });
    const fb = document.querySelector('.word-fb');
    if (fb) {
      fb.style.setProperty('display','none','important');
      fb.style.setProperty('opacity','0','important');
    }
    document.documentElement.dataset.fajMobileWord = 'removed';
    return true;
  }

  function tick(){
    if (removeDesktopWord()) return;
    if (performance.now() - started < 15000) requestAnimationFrame(tick);
  }
  tick();
})();
</script>`;

if (!html.includes('</body>')) throw new Error('Cirebon mobile-cleanup body anchor missing');
html = html.replace('</body>', block + '\n</body>');
await writeFile(file, html, 'utf8');
console.log('Cirebon mobile hero cleanup applied.');
