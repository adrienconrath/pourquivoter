const tl=gsap.timeline({paused:true});
tl.to({}, {duration:30},0);
const phases=[['overload',0,3.55],['me',3.55,6.0],['intro',6.0,9.65],['themes',9.65,11.25],['people',11.25,13.10],['compare',13.10,17.55],['details',17.55,20.12],['verify',20.12,23.0],['end',23.0,30]];
tl.set('.scene',{autoAlpha:0},0);
for(const[id,start,end]of phases){
 const node=document.getElementById(id);
 tl.set('.film-footer',{color:node.classList.contains('dark')?'#c5bcae':'#746a5d'},start);
 tl.fromTo(node,{autoAlpha:0},{autoAlpha:1,duration:.12,ease:'none'},start);
 tl.fromTo(node.querySelector('.headline'),{y:55,opacity:0},{y:0,opacity:1,duration:.40,ease:'power3.out'},start+.04);
 if(node.querySelector('.hero-asset'))tl.fromTo(node.querySelector('.hero-asset'),{y:65,opacity:0},{y:0,opacity:1,duration:.42,ease:'power3.out'},start+.12);
 if(end<30)tl.to(node,{autoAlpha:0,duration:.08,ease:'none'},end-.04);
}
tl.fromTo('.doc-one',{y:180,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.2);
tl.fromTo('.doc-two',{y:220,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},.65);
tl.fromTo('.doc-three',{y:220,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'},1.15);
tl.to('#themes-selected',{opacity:1,duration:.1},10.18);
tl.fromTo('#tap-theme',{opacity:0,scale:.65},{opacity:1,scale:1,duration:.18},10.0);
tl.to('#tap-theme',{opacity:0,scale:1.25,duration:.3},10.22);
tl.to('#people-one',{opacity:1,duration:.08},11.65);
tl.to('#people-two',{opacity:1,duration:.08},12.4);
tl.fromTo('#tap-person',{opacity:0,scale:.7},{opacity:1,scale:1,duration:.15},11.52);
tl.to('#tap-person',{x:321,duration:.45,ease:'power2.inOut'},11.9);
tl.to('#tap-person',{opacity:0,duration:.2},12.5);
tl.fromTo('.comparison-card:nth-child(2)',{y:70},{y:0,duration:.55,ease:'power3.out'},13.55);
tl.to('#summary-badge',{opacity:1,y:-15,duration:.2},15.4);
tl.to('#sources-image',{opacity:1,duration:.15},18.75);
tl.fromTo('#end .url',{scale:.95},{scale:1,duration:.55,ease:'back.out(1.3)'},23.35);
for(const cue of window.filmData.captions){
 tl.set('#'+cue.id,{opacity:1},cue.start);
 tl.set('#'+cue.id,{opacity:0},cue.end);
 for(const word of cue.words){
  tl.set('#'+word.id,{color:'#d9e9b1'},word.start);
  tl.set('#'+word.id,{color:'#fffdf8'},word.end+.04);
 }
}
window.__timelines=window.__timelines||{};
window.__timelines['pqv-instagram']=tl;
