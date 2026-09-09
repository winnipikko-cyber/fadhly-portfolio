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

  // Keep the experimental spatial build out of the flagship hierarchy while still
  // making it discoverable as a deliberate craft / cultural interface study.
  const specialBuild = document.querySelector('.special-build');
  if (specialBuild && !specialBuild.querySelector('[data-cirebon-entry]')) {
    const count = specialBuild.querySelector('.section-count');
    if (count) count.textContent = '08–09 / special builds';

    const title = specialBuild.querySelector('#special-title');
    if (title) title.textContent = 'Research, culture, and interaction — rebuilt as interfaces.';

    const card = document.createElement('a');
    card.className = 'special-card special-card-cirebon reveal rv-in';
    card.href = './cirebon/';
    card.dataset.cirebonEntry = 'true';
    card.setAttribute('aria-label', 'Enter Cirebon — Court, Coast & Cloud immersive experience');
    card.innerHTML = `
      <div class="special-card-index">09</div>
      <div class="special-card-copy">
        <p class="eyebrow">Immersive cultural interface · Three.js</p>
        <h3>CIREBON — Court, Coast & Cloud</h3>
        <p>A spatial night passage through Kasepuhan-inspired courts, red-brick thresholds, Mega Mendung, Wadasan, royal heritage, and the layered identity of a coastal city.</p>
        <div class="now-tags"><span>Three.js</span><span>Spatial storytelling</span><span>Cultural study</span><span>Adaptive quality</span></div>
      </div>
      <span class="special-card-arrow">↗</span>`;
    specialBuild.appendChild(card);

    const style = document.createElement('style');
    style.textContent = `
      .special-card-cirebon{margin-top:16px;background:radial-gradient(circle at 76% 18%,rgba(61,113,153,.22),transparent 34%),radial-gradient(circle at 18% 84%,rgba(141,52,37,.25),transparent 32%),linear-gradient(135deg,#101722,#090b0f)}
      .special-card-cirebon:before{content:"CIREBON";color:rgba(126,174,205,.035)}
      .special-card-cirebon .eyebrow{color:#a76d5c}
      .special-card-cirebon .now-tags span{border-color:rgba(126,174,205,.18)}
    `;
    document.head.appendChild(style);
  }

  const bridge = document.getElementById('spatial-bridge');
  if (!bridge) return;

  const stage = bridge.querySelector('.spatial-stage');
  const word = bridge.querySelector('.spatial-word');
  const caption = bridge.querySelector('.spatial-caption');
  const cards = [...bridge.querySelectorAll('.spatial-card')];
  const cardCenter = (cards.length - 1) / 2;
  const maxLane = Math.max(1, cardCenter);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  let frame = 0;
  let lastMobileProgress = -1;

  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

  const renderDesktop = (rect) => {
    const travel = Math.max(1, bridge.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / travel);
    const approach = clamp(p / .72);
    const exit = clamp((p - .68) / .32);

    cards.forEach((card, index) => {
      const lane = index - cardCenter;
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
    const start = window.innerHeight * .82;
    const end = -bridge.offsetHeight * .18;
    const p = clamp((start - rect.top) / Math.max(1, start - end));

    // Skip sub-pixel progress changes. On touch scrolling this cuts redundant style
    // writes while keeping the animation visually continuous.
    if (lastMobileProgress >= 0 && Math.abs(p - lastMobileProgress) < .004) return;
    lastMobileProgress = p;

    const approach = clamp(p / .58);
    const cardWidth = Math.min(120, Math.max(94, vw * .28));
    const maxOuterX = Math.max(72, (vw - cardWidth - 28) / 2);
    const step = Math.min(92, maxOuterX / maxLane);

    cards.forEach((card, index) => {
      const lane = index - cardCenter;
      const wave = Math.sin((index + 1) * 1.23 + p * 3.0);
      const spread = step * (.58 + .42 * approach);
      const fan = lane * spread;
      const x = fan + Math.sin(p * 2.4 + index) * 3;
      const y = -9 + wave * (6 + 6 * approach) + lane * lane * 2;
      const rotZ = lane * 1.35 - wave * 1.05;
      const scale = .90 + approach * .08;
      const alpha = clamp((p + .18) * 2.8);

      card.style.opacity = alpha.toFixed(3);
      card.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${y.toFixed(1)}px),0) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });

    const wordScale = .84 + approach * .10;
    word.style.opacity = (.055 + approach * .10).toFixed(3);
    word.style.transform = `translate(-50%,-50%) scale(${wordScale.toFixed(3)})`;

    const captionIn = clamp((p - .02) / .22);
    caption.style.opacity = '1';
    caption.style.transform = `translateY(${((1 - captionIn) * 14).toFixed(1)}px)`;
    stage.style.setProperty('--spatial-progress', p.toFixed(3));
  };

  const render = () => {
    frame = 0;
    if (reduceMotion.matches) return;

    const rect = bridge.getBoundingClientRect();
    if (!desktop.matches && (rect.bottom < -80 || rect.top > window.innerHeight + 80)) return;

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
  desktop.addEventListener?.('change', () => {
    lastMobileProgress = -1;
    schedule();
  });
  reduceMotion.addEventListener?.('change', schedule);
  schedule();
})();