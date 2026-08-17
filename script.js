const grungeTheme = document.createElement('link');
grungeTheme.rel = 'stylesheet';
grungeTheme.href = './hero-grunge.css';
document.head.appendChild(grungeTheme);

const motionTheme = document.createElement('link');
motionTheme.rel = 'stylesheet';
motionTheme.href = './motion.css';
document.head.appendChild(motionTheme);
document.documentElement.classList.add('motion-ready');

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
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('hero-motion-ready')));
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

/* Richer interaction layer. Everything is transform/opacity based and respects reduced motion. */
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const topbar = document.querySelector('.topbar');
const contact = document.querySelector('.contact');
const contactWord = document.querySelector('.contact-word');
const about = document.querySelector('.about');
const process = document.querySelector('.process');
const caseShowcase = document.querySelector('.case-showcase');
const capItems = [...document.querySelectorAll('.cap-item')];

const motionTargets = [
  ...document.querySelectorAll('.section-head h2, .cap-intro h2, .cap-item, .about-title, .about-copy > p, .contact-inner, footer > *, .case-hero h1, .case-lede, .case-meta, .case-showcase, .case-copy section, .result, .next-case')
];

motionTargets.forEach((el, index) => {
  el.classList.add('motion-target');
  el.style.setProperty('--motion-delay', `${(index % 4) * 65}ms`);
});

if (reduced || !('IntersectionObserver' in window)) {
  motionTargets.forEach((el) => el.classList.add('motion-seen'));
} else {
  const motionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-seen');
        motionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  motionTargets.forEach((el) => motionObserver.observe(el));
}

if (!reduced && finePointer) {
  projectRows.forEach((row) => {
    row.addEventListener('pointermove', (event) => {
      const rect = row.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      const ny = ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1;
      row.style.setProperty('--row-x', nx.toFixed(3));
      row.style.setProperty('--row-y', ny.toFixed(3));
      row.style.setProperty('--row-tilt', `${(nx * 6).toFixed(2)}deg`);
    }, { passive: true });
    row.addEventListener('pointerleave', () => {
      row.style.setProperty('--row-x', '0');
      row.style.setProperty('--row-y', '0');
      row.style.setProperty('--row-tilt', '0deg');
    });
  });

  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      button.style.setProperty('--mag-x', `${(dx * 0.1).toFixed(1)}px`);
      button.style.setProperty('--mag-y', `${(dy * 0.12).toFixed(1)}px`);
    }, { passive: true });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--mag-x', '0px');
      button.style.setProperty('--mag-y', '0px');
    });
  });

  if (hero) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      hero.style.setProperty('--hero-shift-x', `${(nx * -16).toFixed(1)}px`);
      hero.style.setProperty('--hero-shift-y', `${(ny * -10).toFixed(1)}px`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--hero-shift-x', '0px');
      hero.style.setProperty('--hero-shift-y', '0px');
    });
  }

  if (contact) {
    contact.addEventListener('pointermove', (event) => {
      const rect = contact.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      const ny = (event.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      contact.style.setProperty('--contact-light-x', `${(nx * 60).toFixed(1)}px`);
      contact.style.setProperty('--contact-light-y', `${(ny * 45).toFixed(1)}px`);
    }, { passive: true });
  }

  const light = document.createElement('div');
  light.className = 'motion-light';
  light.setAttribute('aria-hidden', 'true');
  document.body.appendChild(light);
  let lightFrame = 0;
  let lightX = -500;
  let lightY = -500;
  addEventListener('pointermove', (event) => {
    lightX = event.clientX - 170;
    lightY = event.clientY - 170;
    if (lightFrame) return;
    lightFrame = requestAnimationFrame(() => {
      lightFrame = 0;
      light.style.transform = `translate3d(${lightX.toFixed(1)}px,${lightY.toFixed(1)}px,0)`;
    });
  }, { passive: true });
}

if (!finePointer) {
  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('touchstart', () => button.classList.add('motion-pressed'), { passive: true });
    ['touchend', 'touchcancel'].forEach((type) => button.addEventListener(type, () => button.classList.remove('motion-pressed'), { passive: true }));
  });
}

const navLinks = [...document.querySelectorAll('.topbar nav a[href^="#"]')];
if (navLinks.length && 'IntersectionObserver' in window) {
  const navMap = new Map(navLinks.map((link) => [link.getAttribute('href')?.slice(1), link]));
  const navSections = [...navMap.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.remove('is-active'));
    navMap.get(visible.target.id)?.classList.add('is-active');
  }, { rootMargin: '-38% 0px -48% 0px', threshold: [0, 0.1, 0.35, 0.6] });
  navSections.forEach((section) => navObserver.observe(section));
}

let globalMotionFrame = 0;
const renderGlobalMotion = () => {
  globalMotionFrame = 0;
  const y = window.scrollY;
  if (topbar) topbar.classList.toggle('is-scrolled', y > 24);
  if (reduced) return;

  if (hero) {
    const rect = hero.getBoundingClientRect();
    const p = clamp01((-rect.top) / Math.max(1, window.innerHeight));
    hero.style.setProperty('--hero-scroll-y', `${(p * 20).toFixed(1)}px`);
    hero.style.setProperty('--hero-scale', (1.015 + p * 0.018).toFixed(4));
  }

  if (contact && contactWord) {
    const rect = contact.getBoundingClientRect();
    const p = clamp01((window.innerHeight - rect.top) / Math.max(1, window.innerHeight + rect.height));
    contact.style.setProperty('--contact-shift', `${((0.5 - p) * 150).toFixed(1)}px`);
  }

  if (about && process) {
    const rect = about.getBoundingClientRect();
    const p = clamp01((window.innerHeight * 0.78 - rect.top) / Math.max(1, rect.height * 0.72));
    about.style.setProperty('--process-progress', `${(p * 100).toFixed(1)}%`);
    about.classList.toggle('is-process-active', p > 0.16);
  }

  if (caseShowcase) {
    const rect = caseShowcase.getBoundingClientRect();
    const p = clamp01((window.innerHeight - rect.top) / Math.max(1, window.innerHeight + rect.height));
    caseShowcase.style.setProperty('--case-shift', `${((0.5 - p) * 44).toFixed(1)}px`);
  }

  if (capItems.length) {
    const targetY = window.innerHeight * 0.48;
    let closest = null;
    let distance = Infinity;
    capItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      if (rect.bottom <= 64 || rect.top >= window.innerHeight - 24) return;
      const nextDistance = Math.abs(center - targetY);
      if (nextDistance < distance) {
        distance = nextDistance;
        closest = item;
      }
    });
    capItems.forEach((item) => item.classList.toggle('motion-focus', item === closest));
  }

  const results = [...document.querySelectorAll('.result')];
  if (results.length) {
    const targetY = window.innerHeight * 0.54;
    let closestResult = null;
    let resultDistance = Infinity;
    results.forEach((result) => {
      const rect = result.getBoundingClientRect();
      if (rect.bottom <= 70 || rect.top >= window.innerHeight - 20) return;
      const center = rect.top + rect.height / 2;
      const d = Math.abs(center - targetY);
      if (d < resultDistance) {
        resultDistance = d;
        closestResult = result;
      }
    });
    results.forEach((result) => result.classList.toggle('motion-focus', result === closestResult));
  }
};

const scheduleGlobalMotion = () => {
  if (globalMotionFrame) return;
  globalMotionFrame = requestAnimationFrame(renderGlobalMotion);
};
addEventListener('scroll', scheduleGlobalMotion, { passive: true });
addEventListener('resize', scheduleGlobalMotion, { passive: true });
addEventListener('orientationchange', scheduleGlobalMotion, { passive: true });
scheduleGlobalMotion();

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
