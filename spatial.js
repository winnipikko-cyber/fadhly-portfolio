// Signature spatial transition adapted from the approved motion reference.
(() => {
  // Load the final mobile correction after script.js has appended grunge + motion CSS.
  // This keeps the mobile fixes authoritative without disturbing the desktop styling.
  const mobileFinal = document.createElement('link');
  mobileFinal.rel = 'stylesheet';
  mobileFinal.href = './mobile-final.css';
  document.head.appendChild(mobileFinal);

  const bridge = document.getElementById('spatial-bridge');
  if (!bridge) return;

  const stage = bridge.querySelector('.spatial-stage');
  const word = bridge.querySelector('.spatial-word');
  const caption = bridge.querySelector('.spatial-caption');
  const cards = [...bridge.querySelectorAll('.spatial-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  let frame = 0;

  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

  const renderDesktop = (rect) => {
    const travel = Math.max(1, bridge.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / travel);
    const approach = clamp(p / .72);
    const exit = clamp((p - .68) / .32);

    cards.forEach((card, index) => {
      const lane = index - 2;
      const fan = lane * (76 + 150 * approach);
      const wave = Math.sin((index + 1) * 1.23 + p * 4.2);
      const y = wave * (36 + 35 * approach) + lane * lane * 9 - 24;
      const z = -720 + approach * 760 + Math.abs(lane) * -42 + exit * 170;
      const x = fan + Math.sin(p * 3 + index) * 26;
      const rotY = lane * (-8 + approach * 3) + wave * 3;
      const rotZ = lane * 2.2 - wave * 2.4;
      const scale = .72 + approach * .34 + exit * .08;
      const alpha = clamp((p + .08) * 2.2) * (1 - exit * .9);

      card.style.opacity = alpha.toFixed(3);
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    const wordScale = .8 + approach * .22 + exit * .08;
    word.style.opacity = (.08 + approach * .22 - exit * .18).toFixed(3);
    word.style.transform = `translate(-50%,-50%) scale(${wordScale.toFixed(3)})`;
    caption.style.opacity = clamp((p - .24) / .34).toFixed(3);
    caption.style.transform = `translateY(${(1 - clamp((p - .24) / .34)) * 28}px)`;
    stage.style.setProperty('--spatial-progress', p.toFixed(3));
  };

  const renderMobile = (rect) => {
    // Same visual language as desktop: cards begin deeper in Z-space, move toward
    // the viewer, fan apart, then soften on exit. Geometry is simply compressed
    // to fit a phone viewport.
    const vh = Math.max(1, window.innerHeight);
    const vw = Math.max(320, window.innerWidth);
    const travel = Math.max(1, bridge.offsetHeight - vh);
    const p = clamp(-rect.top / travel);
    const approach = clamp(p / .72);
    const exit = clamp((p - .68) / .32);
    const baseFan = Math.min(54, vw * .135);
    const growFan = Math.min(72, vw * .18);

    cards.forEach((card, index) => {
      const lane = index - 2;
      const wave = Math.sin((index + 1) * 1.23 + p * 4.2);
      const fan = lane * (baseFan + growFan * approach);
      const x = fan + Math.sin(p * 3 + index) * 9;
      const y = -56 + wave * (17 + 16 * approach) + lane * lane * 4;
      const z = -470 + approach * 505 + Math.abs(lane) * -28 + exit * 95;
      const rotY = lane * (-7 + approach * 2.6) + wave * 2.4;
      const rotZ = lane * 2.1 - wave * 2.1;
      const scale = .74 + approach * .30 + exit * .05;
      const alpha = clamp((p + .08) * 2.35) * (1 - exit * .88);

      card.style.opacity = alpha.toFixed(3);
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    const wordScale = .82 + approach * .18 + exit * .05;
    word.style.opacity = (.055 + approach * .15 - exit * .11).toFixed(3);
    word.style.transform = `translate(-50%,-50%) scale(${wordScale.toFixed(3)})`;

    const captionIn = clamp((p - .24) / .30);
    caption.style.opacity = captionIn.toFixed(3);
    caption.style.transform = `translateY(${((1 - captionIn) * 24).toFixed(1)}px)`;
    stage.style.setProperty('--spatial-progress', p.toFixed(3));
  };

  const render = () => {
    frame = 0;
    if (reduceMotion.matches) return;

    const rect = bridge.getBoundingClientRect();
    if (desktop.matches) renderDesktop(rect);
    else renderMobile(rect);
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(render);
  };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('orientationchange', schedule, { passive: true });
  desktop.addEventListener?.('change', schedule);
  reduceMotion.addEventListener?.('change', schedule);
  schedule();
})();
