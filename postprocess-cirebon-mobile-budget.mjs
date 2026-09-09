import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

function must(from, to, label) {
  if (!html.includes(from)) throw new Error(`Cirebon mobile-budget anchor missing: ${label}`);
  html = html.replace(from, to);
}

// Keep a little anisotropic filtering on phones so oblique floors/cloth stay
// crisp enough to read, while still avoiding the desktop 8x texture cost.
must(
  "tex.anisotropy = renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;",
  "tex.anisotropy = COARSE ? (renderer && renderer.capabilities ? Math.min(2, renderer.capabilities.getMaxAnisotropy()) : 1) : (renderer && renderer.capabilities ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1);",
  'anisotropy'
);

// Keep one Singa Barong proof point on mobile; the mirrored second carriage is
// a desktop depth accent rather than essential portfolio information.
must(
  "ciPlane('props/singa-barong.webp',{role:'relic',x:-6.6,y:2.25,z:-15.2,w:4.3,h:5.4,opacity:.92,order:10});ciPlane('props/singa-barong.webp',{role:'relic',x:6.7,y:2.15,z:-15.7,w:4,h:5,ry:-.12,opacity:.68,order:9});",
  "ciPlane('props/singa-barong.webp',{role:'relic',x:-6.6,y:2.25,z:-15.2,w:4.3,h:5.4,opacity:.92,order:10});if(!COARSE)ciPlane('props/singa-barong.webp',{role:'relic',x:6.7,y:2.15,z:-15.7,w:4,h:5,ry:-.12,opacity:.68,order:9});",
  'second relic'
);

// Preserve one strong near-camera tree on mobile and drop the extra jungle
// cluster. This retains parallax while reducing a large alpha texture upload
// and overdraw on the smallest screens.
must(
  "ciPlane('foliage/tropical-tree.webp',{role:'fg',x:-10.8,y:5.1,z:3.9,w:12.2,h:15.3,sway:.055,order:24});ciPlane('foliage/jungle-cluster.webp',{role:'fg',x:9.4,y:2,z:5.5,w:13,h:9.1,sway:.038,order:25});",
  "ciPlane('foliage/tropical-tree.webp',{role:'fg',x:-10.8,y:5.1,z:3.9,w:12.2,h:15.3,sway:COARSE?0:.055,order:24});if(!COARSE)ciPlane('foliage/jungle-cluster.webp',{role:'fg',x:9.4,y:2,z:5.5,w:13,h:9.1,sway:.038,order:25});",
  'foreground cluster'
);

// Cloth remains culturally important on mobile, but remove vertex sway there;
// the camera provides the motion and a simple plane is much cheaper to shade.
must(
  "ciPlane('fabric/mega-mendung-cloth.webp',{role:'cloth',x:-10.5,y:9.5,z:-21,w:10.8,h:13.5,sway:.045,opacity:.44,order:7});",
  "ciPlane('fabric/mega-mendung-cloth.webp',{role:'cloth',x:-10.5,y:9.5,z:-21,w:10.8,h:13.5,sway:COARSE?0:.045,opacity:.56,order:7});",
  'cloth sway'
);

// Build guard: mobile budget must remain explicit in generated output.
for (const token of ['Math.min(2, renderer.capabilities.getMaxAnisotropy())', "if(!COARSE)ciPlane('props/singa-barong.webp'", "if(!COARSE)ciPlane('foliage/jungle-cluster.webp'", 'sway:COARSE?0:.045,opacity:.56']) {
  if (!html.includes(token)) throw new Error(`Cirebon mobile-budget gate failed: ${token}`);
}

await writeFile(file, html, 'utf8');
console.log('Cirebon coarse-device scene budget applied.');
