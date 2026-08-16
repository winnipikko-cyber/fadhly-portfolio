const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(pointer: fine)');
const reduced = reducedQuery.matches;
const finePointer = finePointerQuery.matches;

/* Final hero portrait: exact user-provided transparent cutout, web-optimized and embedded so no stale fallback can win. */
const FINAL_PORTRAIT = 'data:image/avif;base64,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';

const portraitStyle = document.createElement('style');
portraitStyle.textContent = `
  #portrait-rig:before,.portrait-frame:after{display:none!important}
  .portrait-frame{height:auto!important;aspect-ratio:2/3!important;background:transparent!important;background-image:none!important;border-radius:0!important;box-shadow:none!important;overflow:visible!important}
  .portrait-frame img{display:block!important;width:100%!important;height:100%!important;opacity:1!important;object-fit:contain!important;object-position:center bottom!important;filter:grayscale(1) contrast(1.04)!important;transform:none!important}
  @media(max-width:700px){#portrait-rig{width:min(70vw,320px)!important;top:5.5vh!important}}
  @media(max-width:390px){#portrait-rig{width:min(72vw,292px)!important;top:5vh!important}}
`;
document.head.appendChild(portraitStyle);

const hero = document.querySelector('.hero');
if (hero) {
  hero.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  const heroPortrait = hero.querySelector('.portrait-frame img');
  if (heroPortrait) {
    heroPortrait.src = FINAL_PORTRAIT;
    heroPortrait.removeAttribute('srcset');
  }
}

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

const projectRows = [...document.querySelectorAll('.project-row')];
if (projectRows.length && !finePointer && !reduced) {
  let projectFrame = 0;
  const renderProjectFocus = () => {
    projectFrame = 0;
    const targetY = window.innerHeight * 0.47;
    let closest = null;
    let closestDistance = Infinity;
    projectRows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const visible = rect.bottom > 72 && rect.top < window.innerHeight - 24;
      const distance = Math.abs(center - targetY);
      if (visible && distance < closestDistance) {
        closest = row;
        closestDistance = distance;
      }
    });
    projectRows.forEach((row) => row.classList.toggle('mobile-active', row === closest));
  };
  const scheduleProjectFocus = () => {
    if (projectFrame) return;
    projectFrame = requestAnimationFrame(renderProjectFocus);
  };
  projectRows.forEach((row) => {
    row.addEventListener('touchstart', () => row.classList.add('is-pressed'), { passive: true });
    ['touchend', 'touchcancel'].forEach((type) => row.addEventListener(type, () => row.classList.remove('is-pressed'), { passive: true }));
  });
  addEventListener('scroll', scheduleProjectFocus, { passive: true });
  addEventListener('resize', scheduleProjectFocus, { passive: true });
  addEventListener('orientationchange', scheduleProjectFocus, { passive: true });
  scheduleProjectFocus();
}

const caseLinks = {
  chossi: { href: 'https://chossi-academy.winnipikko.chatgpt.site/', label: 'Open project ↗', meta: 'Project link' },
  closer: { href: 'https://closer-mausu.vercel.app/', label: 'Open live site ↗', meta: 'Live product' },
  mausu: { href: 'https://mausu-bouqet.vercel.app/', label: 'Open live site ↗', meta: 'Live product' }
};
const caseMatch = window.location.pathname.match(/\/work\/([^/]+)\/?$/);
if (caseMatch) {
  const projectLink = caseLinks[caseMatch[1]];
  const caseMeta = document.querySelector('.case-meta');
  if (projectLink && caseMeta) {
    const row = document.createElement('div');
    row.className = 'case-live-meta';
    const label = document.createElement('b');
    label.textContent = projectLink.meta;
    const link = document.createElement('a');
    link.href = projectLink.href;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = projectLink.label;
    link.style.color = '#f0ede7';
    link.style.textDecoration = 'none';
    link.style.fontSize = '11px';
    link.style.lineHeight = '1.5';
    link.style.textAlign = 'right';
    link.style.transition = 'color .2s ease';
    link.addEventListener('mouseenter', () => { link.style.color = 'var(--red)'; });
    link.addEventListener('mouseleave', () => { link.style.color = '#f0ede7'; });
    row.append(label, link);
    caseMeta.appendChild(row);
  }
}
