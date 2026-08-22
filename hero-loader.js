(() => {
  const root = document.documentElement;
  const mobileQuery = window.matchMedia('(max-width: 760px)');

  const applyHero = () => {
    if (mobileQuery.matches) {
      root.style.setProperty('--faj-hero-mobile-art', 'url("./assets/hero-mobile.webp")');
      root.classList.add('hero-mobile-art-ready');
      return;
    }

    root.style.setProperty('--faj-hero-art', 'url("./assets/hero-desktop.webp")');
    root.classList.add('hero-art-ready');
  };

  applyHero();
  mobileQuery.addEventListener?.('change', applyHero);
})();
