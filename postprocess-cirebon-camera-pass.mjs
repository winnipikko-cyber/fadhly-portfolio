import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const file = path.join(process.cwd(), 'dist', 'cirebon', 'index.html');
let html = await readFile(file, 'utf8');

const from = `const CAM = [
  { p: [  0.0, 4.05, 13.6 ], t: [  0.0, 6.60, -18.0 ], fov: 36 },  /* 0 hero        */
  { p: [ -5.6, 2.35, 11.6 ], t: [  1.2, 5.60, -14.0 ], fov: 48 },  /* 1 the sanmon  */
  { p: [  1.2, 3.60,  2.2 ], t: [ -0.6, 7.50, -22.0 ], fov: 40 },  /* 2 gardens     */
  { p: [  5.2, 2.10, -3.4 ], t: [ -2.6, 7.00, -20.0 ], fov: 46 },  /* 3 craft       */
  { p: [  0.0, 7.60, -16.0 ], t: [  0.0, 13.0, -40.0 ], fov: 42 }, /* 4 afterlight  */`;

const to = `const CAM = [
  { p: [  0.0, 4.05, 13.6 ], t: [  0.0, 6.20, -16.0 ], fov: 36 },  /* 0 intro — face the gate */
  { p: [ -4.2, 2.90,  7.4 ], t: [  0.8, 5.10, -12.5 ], fov: 44 },  /* 1 SAMAR — approach */
  { p: [  1.0, 3.70, -9.2 ], t: [ -0.4, 6.10, -26.0 ], fov: 39 },  /* 2 CLOSER — cross threshold */
  { p: [  4.0, 4.20,-19.0 ], t: [ -1.2, 5.70, -34.0 ], fov: 42 },  /* 3 Diablo — court, never under stairs */
  { p: [ -0.6, 5.20,-22.0 ], t: [  0.0, 4.90, -34.0 ], fov: 41 },  /* 4 Now — look into full pendopo interior */`;

if (!html.includes(from)) throw new Error('Cirebon camera-pass anchor missing');
html = html.replace(from, to);

// Release guards that must survive every late-stage postprocess.
if (/ChoSSI|\/work\/chossi\//i.test(html)) throw new Error('Camera pass reintroduced ChoSSI');
if (/<b>Mausu<\/b>|>Mausu</i.test(html)) throw new Error('Camera pass found shortened Mausu Bouqet');

await writeFile(file, html, 'utf8');
console.log('Cirebon camera choreography now stays above the court and looks directly into the full pendopo interior.');
