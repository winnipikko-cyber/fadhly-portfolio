// Signature spatial transition adapted from the approved motion reference.
(() => {
  const mobileFinal = document.createElement('link');
  mobileFinal.rel = 'stylesheet';
  mobileFinal.href = './mobile-final.css';
  document.head.appendChild(mobileFinal);

  const mobileTuning = document.createElement('link');
  mobileTuning.rel = 'stylesheet';
  mobileTuning.href = './mobile-tuning.css';
  document.head.appendChild(mobileTuning);

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
    const vw = Math.max(320, window.innerWidth);

    // Mobile uses a compact, non-sticky scene. Progress follows the section as it
    // enters the viewport, so there is no long empty scroll tail after the caption.
    const start = window.innerHeight * .82;
    const end = -bridge.offsetHeight * .18;
    const p = clamp((start - rect.top) / Math.max(1, start - end));
    const approach = clamp(p / .58);

    // Compute the spread from the actual viewport width. This guarantees that the
    // outer cards stay inside the mobile viewport even at maximum approach/zoom.
    const cardWidth = Math.min(120, Math.max(94, vw * .28));
    const maxOuterX = Math.max(72, (vw - cardWidth - 28) / 2);
    const step = Math.min(100, maxOuterX / 2);

    cards.forEach((card, index) => {
      const lane = index - 2;
      const wave = Math.sin((index + 1) * 1.23 + p * 3.2);
      const spread = step * (.58 + .42 * approach);
      const fan = lane * spread;
      const x = fan + Math.sin(p * 2.6 + index) * 4;
      const y = -10 + wave * (7 + 7 * approach) + lane * lane * 2;
      const z = -175 + approach * 142 + Math.abs(lane) * -11;
      const rotY = lane * (-5 + approach * 1.8) + wave * 1.5;
      const rotZ = lane * 1.55 - wave * 1.25;
      const scale = .90 + approach * .08;
      const alpha = clamp((p + .18) * 2.8);

      card.style.opacity = alpha.toFixed(3);
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    const wordScale = .84 + approach * .10;
    word.style.opacity = (.055 + approach * .10).toFixed(3);
    word.style.transform = `translate(-50%,-50%) scale(${wordScale.toFixed(3)})`;

    // Keep the caption present. It only glides into place; it never fades away.
    const captionIn = clamp((p - .02) / .22);
    caption.style.opacity = '1';
    caption.style.transform = `translateY(${((1 - captionIn) * 14).toFixed(1)}px)`;
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
