const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => reduced ? el.classList.add('visible') : io.observe(el));

const progress = document.getElementById('progress');
const updateProgress = () => {
  if (!progress || reduced) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const hover = document.getElementById('project-hover');
if (hover && matchMedia('(pointer:fine)').matches && !reduced) {
  document.querySelectorAll('.project-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      hover.querySelector('span').textContent = row.dataset.project || 'View project';
      hover.classList.add('active');
    });
    row.addEventListener('mouseleave', () => hover.classList.remove('active'));
  });
  addEventListener('pointermove', (e) => {
    hover.style.left = `${e.clientX}px`;
    hover.style.top = `${e.clientY}px`;
  }, { passive: true });
}

const rig = document.getElementById('portrait-rig');
if (rig && !reduced) {
  let active = false, sx = 0, sy = 0, dx = 0, dy = 0;
  const settle = () => {
    active = false; dx = 0; dy = 0;
    rig.animate([
      { transform: rig.style.transform || 'translateX(-50%)' },
      { transform: 'translateX(-50%) translateY(7px) scaleX(1.025) scaleY(.982)', offset: .45 },
      { transform: 'translateX(-50%)' }
    ], { duration: 560, easing: 'cubic-bezier(.2,.85,.25,1)' });
    rig.style.transform = 'translateX(-50%)';
  };
  rig.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' && Math.abs(e.movementY) > 3) return;
    active = true; sx = e.clientX; sy = e.clientY; rig.setPointerCapture?.(e.pointerId);
  });
  rig.addEventListener('pointermove', (e) => {
    if (!active) return;
    dx = Math.max(-24, Math.min(24, (e.clientX - sx) * .16));
    dy = Math.max(-18, Math.min(24, (e.clientY - sy) * .14));
    const stretchX = 1 + Math.abs(dx) / 900;
    const stretchY = 1 - Math.abs(dy) / 1100;
    rig.style.transform = `translateX(calc(-50% + ${dx}px)) translateY(${dy}px) rotate(${dx * .055}deg) scale(${stretchX},${stretchY})`;
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach((type) => rig.addEventListener(type, settle));
}
