import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

// Temporary portfolio lock: ChoSSI stays out of the Kage × Cirebon experience
// until the user explicitly asks to restore it. Promote CLOSER into that slot
// and keep the overall chapter rhythm intact.
html = html.split('ChoSSI').join('CLOSER');
html = html.split('/work/chossi/').join('/work/closer/');

// The secondary card that already featured CLOSER would now duplicate the
// promoted flagship. Use Teman Deadline there instead so the system grid keeps
// showing a distinct project.
html = html.replace(
  '<div class="card-lab"><b>CLOSER</b><span>CRM</span></div>',
  '<div class="card-lab"><b>Teman Deadline</b><span>OPS</span></div>'
);
html = html.replace(
  '<div class="card-meta"><span>Ownership · routing · follow-up</span><span>01 / 03</span></div>',
  '<div class="card-meta"><span>Intake · scoping · operator handoff</span><span>01 / 03</span></div>'
);

// Replace the ChoSSI-specific system description that otherwise survives the
// brand-name swap and would misdescribe CLOSER.
html = html.replace(
  'Public discovery, class registration, corporate leads, and admin operations in one system.',
  'Lead ownership, pipeline movement, follow-up scheduling, and workspace operations in one system.'
);

if (/ChoSSI|\/work\/chossi\//i.test(html)) {
  throw new Error('ChoSSI temporary-hide gate failed: public Cirebon output still contains ChoSSI');
}

await writeFile(file, html, 'utf8');
