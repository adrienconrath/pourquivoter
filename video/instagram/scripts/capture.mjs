import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawnSync, execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.resolve(root, '../..');
const version = process.argv[2] ?? 'v001';
if (!/^v\d{3}$/.test(version)) throw Error('Use a version such as v002');
const out = path.join(root, 'assets/screens', version);
try { await fs.access(path.join(out, 'manifest.json')); throw Error('Capture v001 exists; use a new version.'); }
catch (e) { if (e.code !== 'ENOENT') throw e; }
const build = spawnSync('python3', ['scripts/build.py'], {cwd: repo, stdio: 'inherit'});
if (build.status) process.exit(build.status);
await fs.mkdir(out, {recursive: true});
await fs.mkdir(path.join(root, 'assets/fonts'), {recursive: true});
for (const f of ['dm-sans.woff2', 'instrument-serif.woff2', 'dm-sans-OFL.txt', 'instrument-serif-OFL.txt'])
  await fs.copyFile(path.join(repo, 'web/assets', f), path.join(root, 'assets/fonts', f));
const base = path.join(repo, 'dist');
const types = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2', '.webp':'image/webp', '.svg':'image/svg+xml'};
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(base, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
const page = await browser.newPage({viewport:{width:1440,height:1800},deviceScaleFactor:2});
const records = [];
async function capture(name, selector, maxHeight) {
  const element = page.locator(selector).first();
  await element.evaluate(el => el.scrollIntoView({block:'start',behavior:'instant'}));
  const box = await element.boundingBox();
  if (!box || box.width < 1) throw Error(`Missing screenshot target: ${selector}`);
  const clip = {x:box.x,y:box.y,width:box.width,height:Math.min(box.height,maxHeight ?? box.height)};
  await page.screenshot({path:path.join(out,name+'.png'),clip,animations:'disabled'});
  const bytes=await fs.readFile(path.join(out,name+'.png'));
  records.push({file:name+'.png',selector,width:clip.width,height:clip.height,deviceScaleFactor:2,sha256:createHash('sha256').update(bytes).digest('hex')});
}
try {
  await page.goto(origin+'/?themes=prix&profils=', {waitUntil:'networkidle'});
  await page.addStyleTag({content:'html{scroll-behavior:auto!important}.column-scroll{position:static!important}'});
  await page.evaluate(() => document.fonts.ready);
  await page.setViewportSize({width:1280,height:1300});
  await page.goto(origin+'/?themes=prix&profils=attal,le-pen', {waitUntil:'networkidle'});
  await page.screenshot({path:path.join(out,'overview.png'),clip:{x:0,y:0,width:940,height:1050}});
  records.push({file:'overview.png',selected:['attal','le-pen'],theme:'prix',clip:{x:0,y:0,width:940,height:1050},deviceScaleFactor:2,sha256:createHash('sha256').update(await fs.readFile(path.join(out,'overview.png'))).digest('hex')});
  await page.setViewportSize({width:1440,height:1800});
  await page.goto(origin+'/?themes=prix&profils=', {waitUntil:'networkidle'});
  await page.addStyleTag({content:'html{scroll-behavior:auto!important}.column-scroll{position:static!important}'});
  await page.locator('[data-theme-toggle="prix"]').click();
  await capture('themes-off','.theme-stack',200);
  await page.locator('[data-theme-toggle="prix"]').click();
  await capture('themes','.theme-stack',200);
  await capture('people-off','.candidate-choices',150);
  for (const person of ['attal','le-pen']) {
    await page.locator(`.candidate-choice[data-person="${person}"]`).click();
    await capture('people-'+person,'.candidate-choices',150);
  }
  for (const person of ['attal','le-pen']) {
    await capture(person+'-header',`.column-header[data-person="${person}"]`,100);
    await capture(person+'-summary',`#position-prix-${person} .position-summary`,270);
  }
  await page.locator('#position-prix-attal .position-details > summary').click();
  await page.addStyleTag({content:'.position-details .position-field:not(:first-child),.position-details .position-field:first-child li:nth-child(n+2){display:none!important}'});
  await capture('details','#position-prix-attal .position-details');
  await page.locator('#position-prix-attal .position-details > summary').click();
  await page.locator('#position-prix-attal .position-sources > summary').click();
  await page.addStyleTag({content:'.position-sources li:nth-child(n+4){display:none!important}'});
  await capture('sources','#position-prix-attal .position-sources');
  await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify({
    source:'https://pourquivoter.fyi/',
    sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),
    capturedAt:new Date().toISOString(),
    note:'Captures du vrai HTML généré par le dépôt. Recadrages de démonstration : Détails montre une première note entière, Sources les trois premières références entières ; les personnes choisies illustrent les commandes, sans soutien politique.',
    records
  },null,2)+'\n');
  console.log(`Captured ${records.length} website views`);
} finally {
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
