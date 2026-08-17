(() => {
  const DESKTOP_CHUNK_COUNT = 6;
  const MOBILE_CHUNK_COUNT = 5;

  const loadDesktop = async () => {
    window.__FAJ_HERO_B64 = '';
    for (let i = 1; i <= DESKTOP_CHUNK_COUNT; i += 1) {
      const n = String(i).padStart(2, '0');
      await new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.src = `./assets/hero/part-${n}.js`;
        tag.async = false;
        tag.onload = resolve;
        tag.onerror = reject;
        document.head.appendChild(tag);
      });
    }
    if (!window.__FAJ_HERO_B64) return;
    document.documentElement.style.setProperty(
      '--faj-hero-art',
      `url("data:image/webp;base64,${window.__FAJ_HERO_B64}")`
    );
    document.documentElement.classList.add('hero-art-ready');
  };

  const loadMobile = async () => {
    let mobile = '';
    for (let i = 1; i <= MOBILE_CHUNK_COUNT; i += 1) {
      const n = String(i).padStart(2, '0');
      const response = await fetch(`./assets/hero-mobile/part-${n}.txt`, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`Mobile hero chunk ${n} failed (${response.status})`);
      mobile += await response.text();
    }
    if (!mobile) return;
    document.documentElement.style.setProperty(
      '--faj-hero-mobile-art',
      `url("data:image/webp;base64,${mobile}")`
    );
    document.documentElement.classList.add('hero-mobile-art-ready');
  };

  Promise.allSettled([loadDesktop(), loadMobile()]).then((results) => {
    results.forEach((result) => {
      if (result.status === 'rejected') console.warn('Hero artwork failed to load', result.reason);
    });
  });
})();
