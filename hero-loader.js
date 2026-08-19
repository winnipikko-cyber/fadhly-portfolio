(() => {
  const DESKTOP_CHUNK_COUNT = 6;
  const MOBILE_CHUNK_COUNT = 16;
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  let mobileObjectUrl = '';

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

  const decodeBase64 = (value) => {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  const canDecodeSeparately = (parts) => {
    try {
      return parts.every((part) => {
        if (!part || part.length % 4 !== 0) return false;
        decodeBase64(part);
        return true;
      });
    } catch {
      return false;
    }
  };

  const buildMobileBlob = (parts) => {
    if (canDecodeSeparately(parts)) {
      return new Blob(parts.map(decodeBase64), { type: 'image/webp' });
    }
    return new Blob([decodeBase64(parts.join(''))], { type: 'image/webp' });
  };

  const loadMobile = async () => {
    if (!mobileQuery.matches || document.documentElement.classList.contains('hero-mobile-art-ready')) return;

    const parts = [];
    for (let i = 1; i <= MOBILE_CHUNK_COUNT; i += 1) {
      const n = String(i).padStart(2, '0');
      const response = await fetch(`./assets/hero-mobile/part-${n}.txt`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Mobile hero chunk ${n} failed (${response.status})`);
      parts.push((await response.text()).trim());
    }
    if (!parts.length) return;

    const blob = buildMobileBlob(parts);
    const nextUrl = URL.createObjectURL(blob);
    const probe = new Image();

    await new Promise((resolve, reject) => {
      probe.onload = resolve;
      probe.onerror = () => reject(new Error('Mobile hero WebP failed to decode'));
      probe.src = nextUrl;
    });

    if (mobileObjectUrl) URL.revokeObjectURL(mobileObjectUrl);
    mobileObjectUrl = nextUrl;
    document.documentElement.style.setProperty('--faj-hero-mobile-art', `url("${mobileObjectUrl}")`);
    document.documentElement.classList.add('hero-mobile-art-ready');
  };

  loadDesktop().catch((error) => console.warn('Desktop hero artwork failed to load', error));
  loadMobile().catch((error) => console.warn('Mobile hero artwork failed to load', error));

  mobileQuery.addEventListener?.('change', (event) => {
    if (event.matches) loadMobile().catch((error) => console.warn('Mobile hero artwork failed to load', error));
  });

  addEventListener('pagehide', () => {
    if (mobileObjectUrl) URL.revokeObjectURL(mobileObjectUrl);
  }, { once: true });
})();
