const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(pointer: fine)');
const reduced = reducedQuery.matches;
const finePointer = finePointerQuery.matches;

const revealElements = document.querySelectorAll('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
  revealElements.forEach((el) => el.classList.add('visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((el) => io.observe(el));
}

const progress = document.getElementById('progress');
let progressFrame = 0;
const renderProgress = () => {
  progressFrame = 0;
  if (!progress || reduced) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
  progress.style.width = `${value}%`;
};
const scheduleProgress = () => {
  if (progressFrame) return;
  progressFrame = requestAnimationFrame(renderProgress);
};
addEventListener('scroll', scheduleProgress, { passive: true });
addEventListener('resize', scheduleProgress, { passive: true });
addEventListener('orientationchange', scheduleProgress, { passive: true });
scheduleProgress();

const hover = document.getElementById('project-hover');
if (hover && finePointer && !reduced) {
  const hoverLabel = hover.querySelector('span');
  document.querySelectorAll('.project-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      if (hoverLabel) hoverLabel.textContent = row.dataset.project || 'View project';
      hover.classList.add('active');
    });
    row.addEventListener('mouseleave', () => hover.classList.remove('active'));
    row.addEventListener('focus', () => hover.classList.remove('active'));
  });
  addEventListener('pointermove', (event) => {
    hover.style.left = `${event.clientX}px`;
    hover.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const rig = document.getElementById('portrait-rig');
if (rig && finePointer && !reduced) {
  let active = false;
  let sx = 0;
  let sy = 0;

  const settle = () => {
    if (!active) return;
    active = false;
    rig.animate([
      { transform: rig.style.transform || 'translateX(-50%)' },
      { transform: 'translateX(-50%) translateY(7px) scaleX(1.025) scaleY(.982)', offset: 0.45 },
      { transform: 'translateX(-50%)' }
    ], { duration: 560, easing: 'cubic-bezier(.2,.85,.25,1)' });
    rig.style.transform = 'translateX(-50%)';
  };

  rig.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    active = true;
    sx = event.clientX;
    sy = event.clientY;
    rig.setPointerCapture?.(event.pointerId);
  });

  rig.addEventListener('pointermove', (event) => {
    if (!active) return;
    const dx = Math.max(-24, Math.min(24, (event.clientX - sx) * 0.16));
    const dy = Math.max(-18, Math.min(24, (event.clientY - sy) * 0.14));
    const stretchX = 1 + Math.abs(dx) / 900;
    const stretchY = 1 - Math.abs(dy) / 1100;
    rig.style.transform = `translateX(calc(-50% + ${dx}px)) translateY(${dy}px) rotate(${dx * 0.055}deg) scale(${stretchX},${stretchY})`;
  });

  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => {
    rig.addEventListener(type, settle);
  });
}
