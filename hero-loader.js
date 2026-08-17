(() => {
  const HERO_CHUNK_COUNT = 6;
  window.__FAJ_HERO_B64 = '';

  const load = async () => {
    try {
      for (let i = 1; i <= HERO_CHUNK_COUNT; i += 1) {
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
    } catch (error) {
      console.warn('Hero artwork failed to load', error);
    }
  };

  load();
})();
