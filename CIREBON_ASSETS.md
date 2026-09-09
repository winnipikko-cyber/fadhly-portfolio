# Cirebon Spatial Asset Library

Target runtime path: `/cirebon-assets/...`

Prepared asset pack: **72 optimized WebP assets** for the Kage-inspired Cirebon portfolio experience.

## Structure

- `architecture/` — pendopo roof, pillar, beam, ornament, base; gapura side/back/hero
- `backgrounds/` — Mega Mendung cloudscape, ornamental cloudscape, distant silhouette
- `branding/` — emblem, 3D Cirebon wordmark
- `character/turnaround/` — front, front 3/4, side, back, back 3/4
- `character/detail/` — face, hair, fabric, belt, keris, bracer, footwear
- `fabric/` — Mega Mendung cloth, umbul-umbul, banner, torn cloth, decorative cloth
- `foliage/` — tropical tree, jungle cluster, vine curtain, frangipani, canopy, outcrop
- `fx/` — thin fog, thick fog, smoke, embers, fireflies, rain, god rays
- `ground/` — wet stone, stairs, platform, coastal earth, beach sand, rock, path, courtyard, puddle reflection
- `materials/` — brick, stone, carved wood, roof tile, bronze, earth, leaves, water, sand, batik
- `props/` — Singa Barong, stone lantern, brazier, kendi, fishing boat, wooden cart, altar, relief, moon

The static portfolio build already copies `/public` to the deploy root, so assets placed under `public/cirebon-assets/` are available at `/cirebon-assets/<category>/<filename>.webp`.

Large PNG generation masters are intentionally not intended for the runtime bundle. The prepared WebP exports are the web-facing versions to keep the 3D experience responsive on mobile.
