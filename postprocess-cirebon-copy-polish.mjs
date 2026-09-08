import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

function must(from, to) {
  if (!html.includes(from)) throw new Error(`Cirebon copy-polish anchor missing: ${from.slice(0, 110)}`);
  html = html.split(from).join(to);
}

// The route is Fadhly's portfolio. Cirebon is the spatial language, not the page subject.
must(
  '<title>CIREBON — Court, Coast & Cloud</title>',
  '<title>Fadhly Aziez Jalaluddin — Product, Systems & Growth</title>'
);
must(
  '<meta name="description" content="An immersive night passage through Cirebon: red-brick courts, coastal haze, Mega Mendung, and the layered culture around Kasepuhan, rendered live in WebGL.">',
  '<meta name="description" content="Portfolio of Fadhly Aziez Jalaluddin — products, interfaces, operations, and growth systems inside a Cirebon-inspired immersive WebGL world.">'
);

// Public naming lock: never shorten Mausu Bouqet to Mausu.
must(
  '<div class="card-lab"><b>Mausu</b><span>COMMERCE</span></div>',
  '<div class="card-lab"><b>Mausu Bouqet</b><span>COMMERCE</span></div>'
);

// Keep footer navigation portfolio-first while the environmental vocabulary stays in the world itself.
must(
  '<div><h4>Chapters</h4><ul>\n      <li><a href="#gate" data-cursor>Siti Inggil</a></li>\n      <li><a href="#pathways" data-cursor>Mega Mendung</a></li>\n      <li><a href="#lessons" data-cursor>Pusaka & Lapisan</a></li>\n      <li><a href="#eternity" data-cursor>Pantura</a></li>\n    </ul></div>',
  '<div><h4>Flagships</h4><ul>\n      <li><a href="#gate" data-cursor>SAMAR</a></li>\n      <li><a href="#pathways" data-cursor>CLOSER</a></li>\n      <li><a href="#lessons" data-cursor>Diablo Match</a></li>\n      <li><a href="#eternity" data-cursor>Teman Deadline</a></li>\n    </ul></div>'
);
must(
  '<div><h4>Elements</h4><ul>\n      <li><a href="#lessons" data-cursor>Bata merah</a></li>\n      <li><a href="#lessons" data-cursor>Mega Mendung</a></li>\n      <li><a href="#lessons" data-cursor>Wadasan</a></li>\n      <li><a href="#lessons" data-cursor>Singa Barong</a></li>\n    </ul></div>',
  '<div><h4>Systems</h4><ul>\n      <li><a href="/work/closer/" data-cursor>CLOSER</a></li>\n      <li><a href="/work/siapjual48/" data-cursor>SiapJual48</a></li>\n      <li><a href="/work/mausu-bouqet/" data-cursor>Mausu Bouqet</a></li>\n      <li><a href="/work/bad-faith/" data-cursor>Bad Faith</a></li>\n    </ul></div>'
);
must(
  '<div><h4>Elsewhere</h4><ul>\n      <li><a href="#top" data-cursor>Journal</a></li>\n      <li><a href="#top" data-cursor>Field notes</a></li>\n      <li><a href="#top" data-cursor>Colophon</a></li>\n    </ul></div>',
  '<div><h4>Portfolio</h4><ul>\n      <li><a href="#eternity" data-cursor>Now</a></li>\n      <li><a href="/about/" data-cursor>About</a></li>\n      <li><a href="/contact/" data-cursor>Contact</a></li>\n    </ul></div>'
);

await writeFile(file, html, 'utf8');
