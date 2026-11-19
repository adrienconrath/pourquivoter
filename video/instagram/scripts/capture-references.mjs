import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2] ?? 'v001';
if (!/^v\d{3}$/.test(version)) throw Error('Use a new numbered capture version');
const out = path.join(root, 'assets/references', version);
await fs.mkdir(path.dirname(out), {recursive: true});
await fs.mkdir(out, {recursive: false});
const items = [
  {name:'youtube-roussel',sourceId:'rou-eu-grand-lci',url:'https://www.youtube.com/watch?v=ojWGei6jeY8',clip:{x:0,y:0,width:950,height:730}},
  {name:'tf1-debat',sourceId:'af-tf1-restos',url:'https://www.tf1info.fr/politique/elections/presidentielle/quelle-societe-pour-demain-precarite-logement-retraites-revoyez-les-temps-forts-du-debat-organise-par-lci-en-association-avec-les-restos-du-coeur-2471255.html',clip:{x:0,y:0,width:1360,height:470}},
  {name:'alternatives-ruffin',sourceId:'ruff-ret-alter26',url:'https://www.alternatives-economiques.fr/francois-ruffin-il-est-temps-de-refermer-la-parenthese-liberale',clip:{x:0,y:0,width:1360,height:610}},
];
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const records=[];
try {
  for (const item of items) {
    const page=await browser.newPage({viewport:{width:1360,height:1000},deviceScaleFactor:1.5,locale:'fr-FR'});
    const response=await page.goto(item.url,{waitUntil:'domcontentloaded',timeout:45000});
    if (!response?.ok()) throw Error('Could not load '+item.name);
    await page.waitForTimeout(2500);
    for (const frame of page.frames()) {
      for (const label of ['Tout refuser','Refuser tout','Continuer sans accepter','Reject all','REFUSER']) {
        const target=frame.getByText(label,{exact:true});
        if (await target.count()) {
          try { await target.first().click({timeout:2000,force:true}); } catch {}
        }
      }
    }
    await page.waitForTimeout(1500);
    await page.evaluate(()=>{for(const video of document.querySelectorAll('video')) video.pause();});
    if (await page.getByText('Avant d’accéder à YouTube',{exact:true}).count()) throw Error('YouTube consent still blocks capture');
    const file=item.name+'.png';
    await page.screenshot({path:path.join(out,file),clip:item.clip});
    records.push({...item,file,title:await page.title(),sha256:createHash('sha256').update(await fs.readFile(path.join(out,file))).digest('hex')});
    console.log('Captured real page:',item.name);
    await page.close();
  }
  await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify({capturedAt:new Date().toISOString(),note:'Captures réelles de pages déjà référencées par le site. Extraits du titre, de l’en-tête et des images ; aucun article complet. Les médias et personnes représentés ne soutiennent pas ce projet.',records},null,2)+'\n');
} finally { await browser.close(); }
