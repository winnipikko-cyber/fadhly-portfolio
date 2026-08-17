const grungeTheme = document.createElement('link');
grungeTheme.rel = 'stylesheet';
grungeTheme.href = './hero-grunge.css';
document.head.appendChild(grungeTheme);

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = window.matchMedia('(pointer: fine)');
const reduced = reducedQuery.matches;
const finePointer = finePointerQuery.matches;

/* Keep the approved cutout available as a fallback, while the hero presentation layer uses the grunge artwork. */
const FINAL_PORTRAIT = './assets/fadhly-portrait-final.avif';
const portraitStyle = document.createElement('style');
portraitStyle.textContent = `
  #portrait-rig:before,.portrait-frame:after{display:none!important}
  .portrait-frame{height:auto!important;aspect-ratio:2/3!important;background:transparent!important;background-image:none!important;border-radius:0!important;box-shadow:none!important;overflow:visible!important}
  .portrait-frame img{display:block!important;width:100%!important;height:100%!important;opacity:1!important;object-fit:contain!important;object-position:center bottom!important;filter:grayscale(1) contrast(1.04)!important;transform:none!important}
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
