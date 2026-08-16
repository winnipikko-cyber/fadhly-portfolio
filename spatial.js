// Signature spatial transition adapted from the approved motion reference.
(() => {
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
    // Mobile keeps the same scroll-linked feeling with cheaper 2D transforms.
    // The section is not sticky on small screens, so progress is measured from
    // the moment it enters the viewport until it leaves it.
    const vh = Math.max(1, window.innerHeight);
    const p = clamp((vh - rect.top) / (vh + Math.max(1, rect.height)));
    const motion = clamp((p - .06) / .88);
    const compact = window.innerWidth <= 390;
    const baseX = compact ? [-92, -48, 0, 50, 94] : [-116, -56, 0, 66, 120];
    const baseY = [-30, 18, -38, 24, -28];
    const baseRot = [-9, 6, -2, -5, 8];

    cards.forEach((card, index) => {
      const lane = index - 2;
      const wave = Math.sin(motion * 5.2 + index * 1.15);
      const spread = lane * (10 + motion * 8);
      const x = baseX[index] + spread + wave * 7;
      const y = baseY[index] + Math.cos(motion * 4.4 + index) * 10 - motion * 8;
      const rot = baseRot[index] + wave * 2.8;
      const scale = .94 + motion * .07 + (index === 2 ? .025 : 0);
      const alpha = .64 + clamp(motion * 1.5) * .3;

      card.style.opacity = alpha.toFixed(3);
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    const wordScale = .94 + motion * .1;
    word.style.opacity = (.07 + motion * .09).toFixed(3);
    word.style.transform = `translate(-50%,-50%) scale(${wordScale.toFixed(3)})`;

    // Keep the message readable while still giving it a small reveal.
    const captionIn = clamp((p - .18) / .22);
    caption.style.opacity = (.72 + captionIn * .28).toFixed(3);
    caption.style.transform = `translateY(${((1 - captionIn) * 18).toFixed(1)}px)`;
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
