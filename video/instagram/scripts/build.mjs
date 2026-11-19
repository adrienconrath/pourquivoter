import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const timing=JSON.parse(await fs.readFile(path.join(root,'assets/audio/edit-v001/timeline.json'),'utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const captions=[];
for(const phrase of timing.phrases){
 const next=timing.phrases[timing.phrases.indexOf(phrase)+1]?.start??29.1;
 const words=timing.words.filter(w=>w.start>=phrase.start-.02&&w.start<next);
 for(let i=0;i<words.length;i+=12){
  const group=words.slice(i,i+12);if(!group.length)continue;
  const id='caption-'+captions.length;
  const start=Math.max(0,group[0].start-.20,(captions.at(-1)?.end??-.025)+.025);
  captions.push({id,start,end:Math.min(29.2,words[i+12]?words[i+12].start-.04:next-.08),words:group.map((w,j)=>({...w,id:id+'-word-'+j}))});
 }
}
const html=captions.map(c=>`<p class="caption" id="${c.id}"><span class="caption-line">${c.words.map(w=>`<span class="caption-word" id="${w.id}">${escape(w.text)}</span>`).join(' ')}</span></p>`).join('\n');
if(captions.some(c=>!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.end<=c.start))throw Error('Invalid subtitle timing');
let template=await fs.readFile(path.join(root,'composition.html.in'),'utf8');
template=template.replace('{{captions}}',html).replace('{{timeline}}',JSON.stringify({captions}).replaceAll('<','\\u003c')).replace('{{animation}}',await fs.readFile(path.join(root,'film.js'),'utf8'));
await fs.writeFile(path.join(root,'index.html'),template);
console.log('Built 30-second portrait composition with '+captions.length+' aligned caption groups');
