const $ = s => document.querySelector(s);
const state = {players:["Joueur 1","Joueur 2"],scores:[0,0],turn:0,round:0,total:10,deck:[],mode:null,lastMode:null,sound:true,selected:null,answered:0,bonus:false};
const modes = [
 ["know","🧩","Qui connaît qui ?","Devinez la réponse de l'autre avant de la découvrir.","QUESTIONS · POINTS","gouts"],
 ["deep","🌙","Questions profondes","Prenez le temps de parler de ce qui compte vraiment.","DOUCEUR · ÉCOUTE","emotions"],
 ["trust","🤝","Confiance & écoute","Des petits exercices pour mieux se comprendre.","À DEUX · SANS PRESSION","confiance"],
 ["match","💞","Compatibilité","Comparez vos réponses et découvrez vos points communs.","COMPARAISON · SURPRISES","complicite"],
 ["challenge","⚡","Défis à deux","Des mini-épreuves, des mimes et des missions rigolotes.","ACTION · RIRES","scenarios"],
 ["story","📷","Notre histoire","Souvenirs, anecdotes et moments qui vous ressemblent.","SOUVENIRS · COMPLICITÉ","souvenirs"],
 ["whatif","🎭","Scénarios","Imaginez vos réactions dans des situations improbables.","IMAGINATION · FUN","scenarios"],
 ["truth","🍒","Vérité ou défi","Une question difficile : si tu te trompes ou si tu ne réponds pas, c'est le défi !","QUESTION · SINON DÉFI","personnalite"],
 ["surprise","🎁","Quiz surprise","Un mélange aléatoire de toutes les catégories.","MÉLANGE · ALÉATOIRE","quotidien"],
 ["little","🍓","Les petits détails","Les goûts, les habitudes et les petites choses du quotidien.","500 CARTES DISPONIBLES","quotidien"],
 ["expert","🔮","Cartes sans filtre","Des sujets personnels à partager seulement si vous le souhaitez.","NIVEAU EXPERT · FACULTATIF","expert"],
 ["mini","🎮","Mini-jeux","Pictionary, petit bac, mimes, quiz de couple… Des jeux courts et des jeux plus longs.","38 JEUX · 10 PAR PARTIE","complicite"]
];
const challengeCards = [
 ["MIME EXPRESS","Mime une activité que l'autre adore. L'autre a 3 essais pour deviner.","Défi"],
 ["TROIS INDICES","Décris un souvenir commun en trois indices, sans donner de nom propre.","Défi"],
 ["COMPLIMENT PRÉCIS","Fais un compliment qui parle d'une qualité réelle, pas seulement du physique.","Complicité"],
 ["DEVINE MON TOP 3","L'autre doit deviner tes trois activités préférées pour un jour libre.","Quiz"],
 ["LE DESSIN MYSTÈRE","Dessine un objet qui représente l'autre. L'autre doit deviner pourquoi.","Défi"],
 ["MISSION ÉCOUTE","Pendant une minute, une personne raconte un moment marquant. L'autre reformule ce qu'elle a compris.","Confiance"],
 ["POINT COMMUN","Trouvez en 30 secondes trois choses que vous aimez tous les deux.","Mini-jeu"],
 ["SOUVENIR EN UN MOT","Chacun donne un mot lié à un souvenir commun. Construisez l'histoire ensemble.","Souvenir"],
 ["DEVINE L'ÉMOTION","Décris une situation sans nommer l'émotion. L'autre essaie de la deviner.","Mini-jeu"],
 ["QUESTION RETOURNÉE","Pose une question à l'autre, puis réponds-y toi aussi.","Complicité"]
];
const miniCards = [
 ["LE MÊME CHOIX","Comptez jusqu'à trois et dites chacun votre réponse : soirée tranquille ou sortie improvisée ?","Choix simultané"],
 ["QUI LE FERAIT ?","Lisez à voix haute : qui serait le plus susceptible de se perdre avec un GPS ? Comptez jusqu'à trois et désignez-vous.","Désignation"],
 ["TOP 5","En 45 secondes, trouvez cinq choses que vous aimez tous les deux.","Course contre la montre"],
 ["MOT INTERDIT","Choisissez un mot courant. Discutez pendant une minute sans le prononcer. Si quelqu'un le dit, l'autre marque un point.","Concentration"],
 ["CLASSEMENT SECRET","Chacun classe mentalement : mer, montagne, ville, campagne. Révélez en même temps et comparez.","Révélation"],
 ["DEVINE LE SOUVENIR","Une personne pense à un souvenir commun et donne trois indices. L'autre doit le retrouver.","Mémoire"],
 ["DÉFI ALPHABET","Trouvez chacun à tour de rôle un mot positif décrivant l'autre, de A à Z. Vous pouvez passer une lettre.","Créativité"],
 ["UNE HISTOIRE À DEUX","Inventez une histoire : une phrase chacun, à tour de rôle, pendant six phrases.","Improvisation"]
];
const levels = ["DÉCOUVERTE","COMPLICITÉ","PROFOND","EXPERT"];
function show(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"});}
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200);}
function renderModes(){const grid=$("#modeGrid");grid.innerHTML="";modes.forEach((m,i)=>{const b=document.createElement("button");b.className="mode-card";b.style.setProperty("--glow",["#ff8bb4","#9d86ff","#77d8c4","#ff7eae"][i%4]);b.innerHTML=`<span class="mode-icon">${m[1]}</span><h3>${m[2]}</h3><p>${m[3]}</p><span class="mode-meta">${m[4]}</span>`;b.addEventListener("click",()=>startMode(m));grid.appendChild(b);});}
function startMode(mode){state.mode=mode;state.lastMode=mode;state.scores=[0,0];state.turn=0;state.round=0;state.answered=0;state.bonus=false;
 let cards=[];
 if(mode[0]==="challenge") cards=challengeCards.map(x=>({text:x[1],type:x[2],title:x[0],cat:"Défis",level:"COMPLICITÉ",hint:"Faites le défi ensemble. Vous pouvez l'adapter ou passer."}));
 else if(mode[0]==="mini"){
   const short=shuffle([...miniCards,...MINI_SHORT]).slice(0,7).map(x=>({text:x[1],type:x[2],title:x[0],hint:"Jouez ensemble, puis attribuez un point à la personne qui a gagné… ou partagez le point !"}));
   const long=shuffle([...MINI_LONG]).slice(0,3).map(x=>({...x,long:true}));
   cards=[...long,...short].map(x=>({...x,cat:"Mini-jeux",level:"COMPLICITÉ"}));
 }
 else if(mode[0]==="truth"){
   const pick=(list,type,hint)=>shuffle([...list]).slice(0,5).map(text=>({text,type,title:"Vérité ou défi",cat:"Vérité ou défi",level:"PROFOND",hint}));
   cards=[...pick(TRUTH_GUESS_QUESTIONS,"À TOI DE DEVINER","Si tu te trompes ou si tu ne trouves pas, c'est le défi !"),...pick(TRUTH_HONEST_QUESTIONS,"VÉRITÉ","Réponds honnêtement. Si tu préfères ne pas répondre, c'est le défi !")];
   state.dares=shuffle([...TRUTH_DARES_NOW.map(text=>({text,later:false})),...TRUTH_DARES_LATER.map(text=>({text,later:true}))]);
   state.dareIndex=0;state.laterDares=[];
 }
 else {
   let cats=mode[0]==="surprise"?QUESTION_BANK:QUESTION_BANK.filter(c=>c.id===mode[5] || (mode[0]==="deep"&&["emotions","reves","expert"].includes(c.id)) || (mode[0]==="trust"&&c.id==="confiance") || (mode[0]==="know"&&["gouts","quotidien","personnalite"].includes(c.id)) || (mode[0]==="expert"&&c.id==="expert"));
   cards=cats.flatMap(c=>c.questions.map((q,i)=>({text:q,type:mode[0]==="know"?"DEVINE SA RÉPONSE":"QUESTION",title:c.name,cat:c.name,level:c.level,hint:mode[0]==="know"?"Le joueur dont c'est le tour répond en premier dans sa tête. L'autre tente de deviner.":"Répondez chacun votre tour et prenez le temps d'échanger."})));
 }
 shuffle(cards);state.deck=cards.slice(0,10);state.total=state.deck.length;renderQuestion();show("play");
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function renderQuestion(){stopMiniTimer();if(state.round>=state.total){finish();return;}const q=state.deck[state.round];$("#roundLabel").textContent=`MANCHE ${state.round+1} / ${state.total}`;$("#progressBar").style.width=(state.round/state.total*100)+"%";$("#scoreboard").innerHTML=state.players.map((p,i)=>`<span>${escapeHtml(p)} <b>${state.scores[i]} pts</b></span>`).join("");$("#levelPill").textContent=q.level||"COMPLICITÉ";$("#categoryTitle").textContent=q.title||q.cat;$("#categoryDesc").textContent=q.hint;$("#currentPlayer").textContent=state.players[state.turn];$("#cardType").textContent=q.type||"QUESTION";$("#questionNumber").textContent=String(state.round+1).padStart(2,"0")+" / "+state.total;$("#questionText").textContent=q.text;$("#questionHint").textContent=q.hint;$("#answerArea").innerHTML="";
 if(state.mode[0]==="match"||state.mode[0]==="know"){const area=$("#answerArea");const t=document.createElement("textarea");t.placeholder="Notez votre réponse ici (facultatif)…";area.appendChild(t);const p=document.createElement("div");p.className="micro-note";p.textContent="Comparez vos réponses à voix haute. Accordez-vous un point si vous avez deviné juste ou trouvé un vrai point commun.";area.appendChild(p);}
 else if(state.mode[0]==="mini")renderMini(q);
 else if(state.mode[0]==="challenge"){const area=$("#answerArea");const p=document.createElement("div");p.className="micro-note";p.textContent="Quand vous avez terminé, validez pour passer à la suite.";area.appendChild(p);}
 else if(state.mode[0]==="truth"){const p=document.createElement("div");p.className="micro-note";p.textContent=`${state.players[1-state.turn]} lit la carte à voix haute à ${state.players[state.turn]}, puis juge la réponse.`;$("#answerArea").appendChild(p);}
 else {const t=document.createElement("textarea");t.placeholder="Quelques mots pour commencer… (facultatif)";$("#answerArea").appendChild(t);}
 $("#validateBtn").textContent=state.round===state.total-1?"Terminer":"Continuer";$("#skipBtn").textContent="Passer ↗";$("#passBtn").style.display="none";$("#miniTip").textContent=state.mode[0]==="trust"?"Conseil : reformulez ce que vous avez compris avant de répondre.":"Petit conseil : écoutez la réponse jusqu'au bout, sans vous couper.";
 if(state.mode[0]==="truth"){state.dare=null;$("#validateBtn").textContent="Bonne réponse ✓";$("#skipBtn").textContent="Raté ou pas de réponse → Défi";$("#miniTip").textContent="Rappel : chacun reste libre de passer un défi, sans se justifier.";}
}
function make(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function stopMiniTimer(){if(state.miniTimer){clearInterval(state.miniTimer);state.miniTimer=null;}}
function renderScoreboard(){$("#scoreboard").innerHTML=state.players.map((p,i)=>`<span>${escapeHtml(p)} <b>${state.scores[i]} pts</b></span>`).join("");}
function addMiniTimer(parent,seconds){
 const box=make("div","mini-timer"),label=make("span","mini-timer-value"),btn=make("button","secondary-btn mini-btn","Lancer le chrono");
 const reset=()=>{stopMiniTimer();label.textContent=`⏱ ${seconds} s`;label.classList.remove("done");btn.textContent="Lancer le chrono";};
 btn.addEventListener("click",()=>{reset();btn.textContent="Recommencer";let left=seconds;state.miniTimer=setInterval(()=>{left--;label.textContent=`⏱ ${left} s`;if(left<=0){stopMiniTimer();label.textContent="Temps écoulé !";label.classList.add("done");toast("Temps écoulé !");}},1000);});
 box.appendChild(label);box.appendChild(btn);parent.appendChild(box);reset();return reset;
}
function addMiniCanvas(parent){
 const wrap=make("div","mini-canvas-wrap"),c=make("canvas","mini-canvas"),clear=make("button","skip-btn","Effacer le dessin");
 wrap.appendChild(c);wrap.appendChild(clear);parent.appendChild(wrap);
 c.width=Math.min(parent.clientWidth||640,900);c.height=Math.round(c.width*(innerWidth<=520?.75:.55));
 const g=c.getContext("2d");
 const wipe=()=>{g.fillStyle="#fff4ee";g.fillRect(0,0,c.width,c.height);g.strokeStyle="#17132d";g.lineWidth=Math.max(3,c.width/130);g.lineCap="round";g.lineJoin="round";};
 const at=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height];};
 let drawing=false;
 c.addEventListener("pointerdown",e=>{e.preventDefault();drawing=true;c.setPointerCapture(e.pointerId);const[x,y]=at(e);g.beginPath();g.moveTo(x,y);g.lineTo(x+.01,y);g.stroke();});
 c.addEventListener("pointermove",e=>{if(!drawing)return;const[x,y]=at(e);g.lineTo(x,y);g.stroke();});
 const end=()=>{drawing=false;};
 c.addEventListener("pointerup",end);c.addEventListener("pointercancel",end);
 clear.addEventListener("click",wipe);wipe();return wipe;
}
function renderMini(q){
 const area=$("#answerArea");
 if(q.long){
  $("#categoryDesc").textContent="Un jeu un peu plus long : prenez votre temps !";
  if(q.board){const ul=make("ul","mini-board");q.board.forEach(t=>ul.appendChild(make("li","",t)));area.appendChild(ul);}
  const steps=q.count?shuffle([...q.rounds]).slice(0,q.count):q.rounds;
  const box=make("div","mini-step"),head=make("div","mini-step-head"),prompt=make("div","mini-step-text"),row=make("div","mini-step-actions");
  const reveal=make("button","secondary-btn mini-btn","Voir le mot"),nextStep=make("button","secondary-btn mini-btn","Étape suivante →");
  box.appendChild(head);box.appendChild(prompt);box.appendChild(row);if(q.secret)row.appendChild(reveal);row.appendChild(nextStep);area.appendChild(box);
  const resetTimer=q.timer?addMiniTimer(area,q.timer):null,wipe=q.canvas?addMiniCanvas(area):null;
  let i=0,shown=false;
  const paint=()=>{
   const who=q.alternate?` · À ${state.players[(state.turn+i)%2]} de jouer`:"";
   head.textContent=`${q.stepLabel} ${i+1} / ${steps.length}${who}`;
   prompt.textContent=q.secret&&!shown?"••••••":steps[i];
   reveal.textContent=shown?"Cacher":"Voir le mot";
   nextStep.style.display=i<steps.length-1?"":"none";
  };
  reveal.addEventListener("click",()=>{shown=!shown;paint();});
  nextStep.addEventListener("click",()=>{i++;shown=false;if(resetTimer)resetTimer();if(wipe)wipe();paint();});
  paint();
 }
 const pts=make("div","mini-points");
 state.players.forEach((p,n)=>{const b=make("button","secondary-btn mini-btn",`+1 ${p}`);b.addEventListener("click",()=>{state.scores[n]++;renderScoreboard();});pts.appendChild(b);});
 area.appendChild(pts);
}
function showDare(){const d=state.dares[state.dareIndex++%state.dares.length];state.dare=d;$("#cardType").textContent=d.later?"DÉFI · POUR PLUS TARD":"DÉFI · MAINTENANT";$("#questionText").textContent=d.text;$("#questionHint").textContent=d.later?"Ce défi s'ajoute à votre liste de fin de partie.":"À faire tout de suite… ou à garder pour plus tard.";$("#categoryDesc").textContent="Raté ! Place au défi de couple.";$("#answerArea").innerHTML="";$("#validateBtn").textContent=d.later?"Noté pour plus tard ✓":"Défi réussi ✓";$("#skipBtn").textContent=d.later?"Passer ce défi ↗":"Plus tard ⏳";$("#passBtn").style.display=d.later?"none":"";}
function keepForLater(){state.laterDares.push({player:state.players[state.turn],text:state.dare.text});toast("Défi ajouté à votre liste de fin de partie.");next(true);}
function truthPrimary(){if(!state.dare){toast("Bien joué, un point !");next(false);}else if(state.dare.later)keepForLater();else{toast("Défi réussi, un point !");next(false);}}
function truthSecondary(){if(!state.dare)showDare();else if(state.dare.later){toast("Défi passé, aucun point perdu.");next(true);}else keepForLater();}
function renderLaterDares(){const box=$("#laterDares");box.innerHTML="";const list=state.mode[0]==="truth"?state.laterDares:[];box.style.display=list.length?"":"none";if(!list.length)return;const h=document.createElement("h3");h.textContent="Défis à faire plus tard";box.appendChild(h);const ul=document.createElement("ul");list.forEach(d=>{const li=document.createElement("li");const b=document.createElement("b");b.textContent=d.player+" : ";li.appendChild(b);li.appendChild(document.createTextNode(d.text));ul.appendChild(li);});box.appendChild(ul);const p=document.createElement("div");p.className="micro-note";p.textContent="Rien n'est enregistré : notez-les ou prenez une photo avant de quitter cet écran.";box.appendChild(p);}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function next(skip=false){if(!skip){state.scores[state.turn]++;}state.round++;state.turn=1-state.turn;renderQuestion();}
function finish(){ $("#progressBar").style.width="100%";$("#resultText").textContent=`Vous avez exploré le mode « ${state.mode[2]} ». Le plus important : les échanges que vous venez d'avoir.`;$("#resultScores").innerHTML=state.players.map((p,i)=>`<div class="score-card"><b>${state.scores[i]}</b><span>${escapeHtml(p)} · ${state.mode[0]==="mini"?"points":"points de participation"}</span></div>`).join("");renderLaterDares();show("result");}
function start(){state.players=[$("#name1").value.trim()||"Joueur 1",$("#name2").value.trim()||"Joueur 2"];$("#playerNames").textContent=state.players.join(" ♥ ");renderModes();show("menu");}
function handleCode(){const code=$("#secretCode").value.trim().toUpperCase().replace(/\s/g,"");const secrets={"CUPID":"Mode Cupidon débloqué ! Une sélection de questions tendres arrive. 🏹","COMPLICE":"Mode Complices débloqué ! Place aux défis à deux. 🫶","PAPILLON":"Mode Papillons débloqué ! Une sélection de questions positives. 🦋","NOUSDEUX":"Tu as trouvé le code maison ! Bien joué. ♥"};if(secrets[code]){toast(secrets[code]);$("#secretMessage").textContent=secrets[code];const target={"CUPID":"match","COMPLICE":"challenge","PAPILLON":"deep"}[code];if(target)startMode(modes.find(m=>m[0]===target));}else{$("#secretMessage").textContent="Code inconnu… Essayez CUPID, COMPLICE, PAPILLON ou NOUSDEUX.";}}
$("#startBtn").addEventListener("click",start);$("#backHome").addEventListener("click",()=>show("home"));$("#brandHome").addEventListener("click",e=>{e.preventDefault();show("home");});$("#quitBtn").addEventListener("click",()=>{stopMiniTimer();show("menu");});$("#validateBtn").addEventListener("click",()=>{if(state.mode[0]==="truth")truthPrimary();else next(state.mode[0]==="mini");});$("#skipBtn").addEventListener("click",()=>{if(state.mode[0]==="truth"){truthSecondary();return;}toast("Carte passée, aucun point perdu.");next(true);});$("#passBtn").addEventListener("click",()=>{toast("Défi passé, aucun point perdu.");next(true);});$("#codeBtn").addEventListener("click",handleCode);$("#secretCode").addEventListener("keydown",e=>{if(e.key==="Enter")handleCode();});$("#againBtn").addEventListener("click",()=>startMode(state.lastMode));$("#menuBtn").addEventListener("click",()=>show("menu"));$("#soundBtn").addEventListener("click",()=>{state.sound=!state.sound;$("#soundBtn").style.color=state.sound?"var(--pink2)":"#9087a8";toast(state.sound?"Sons activés (ambiance silencieuse par défaut).":"Sons coupés.");});
renderModes();
