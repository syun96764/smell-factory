const GRADES = [
  {id:'fragrance',label:'Fragrance',odds:45,color:'#c6ff4a'},
  {id:'aroma',label:'Aroma',odds:28,color:'#42f5cd'},
  {id:'scent',label:'Scent',odds:15,color:'#54a8ff'},
  {id:'odor',label:'Odor',odds:8,color:'#c066ff'},
  {id:'smell',label:'Smell',odds:3,color:'#ff4fb0'},
  {id:'xion',label:'Xion',odds:1,color:'#ffd34e'}
];

const MONSTERS = [
  {id:'f1',g:0,shape:'cube',form:'정육면체',name:'새벽 복도를 배회하는 미세한 지온냄새'},
  {id:'f2',g:0,shape:'tetra',form:'정사면체',name:'문틈으로 슬쩍 들어온 지온냄새'},
  {id:'f3',g:0,shape:'prism',form:'삼각기둥',name:'체육복 주머니에 잠든 지온냄새'},
  {id:'a1',g:1,shape:'tetra',form:'정사면체',name:'환풍구를 역주행하는 지온냄새'},
  {id:'a2',g:1,shape:'cube',form:'직육면체',name:'엘리베이터를 점령한 지온냄새'},
  {id:'a3',g:1,shape:'octa',form:'정팔면체',name:'운동장의 바람을 되돌리는 지온냄새'},
  {id:'s1',g:2,shape:'octa',form:'정팔면체',name:'도시 한 블록을 감싸는 지온냄새'},
  {id:'s2',g:2,shape:'prism',form:'육각기둥',name:'구름의 진로를 바꿔버린 지온냄새'},
  {id:'s3',g:2,shape:'sphere',form:'구',name:'대기의 기억에 새겨진 지온냄새'},
  {id:'o1',g:3,shape:'dodeca',form:'정십이면체',name:'하늘이 무너지고 땅이 솟아나는 지온냄새'},
  {id:'o2',g:3,shape:'icosa',form:'정이십면체',name:'태풍의 눈에서 왕좌를 세운 지온냄새'},
  {id:'o3',g:3,shape:'torus',form:'원환면',name:'대륙의 계절을 뒤집는 지온냄새'},
  {id:'sml1',g:4,shape:'icosa',form:'정이십면체',name:'은하가 진동하는 초월적 지온냄새'},
  {id:'sml2',g:4,shape:'sphere',form:'초구의 투영',name:'별빛마저 굴절시킨 궁극의 지온냄새'},
  {id:'sml3',g:4,shape:'torus',form:'클라인 병의 그림자',name:'시공간에 영구 잔향을 남긴 지온냄새'},
  {id:'x1',g:5,shape:'dodeca',form:'초정십이면체',name:'우주의 시작보다 먼저 존재한 태초의 지온냄새'},
  {id:'x2',g:5,shape:'icosa',form:'초정이십면체',name:'모든 평행우주를 하나의 향으로 통일한 지온냄새'},
  {id:'x3',g:5,shape:'torus',form:'4차원 초원환체',name:'존재와 무존재의 경계를 초월한 절대 지온냄새'}
];

const MOVES = [
  ['잔향 톡톡','작지만 끈질긴 냄새 입자',24,95],['환풍기 역회전','바람의 흐름을 강제로 뒤집는다',30,88],
  ['지온 냄새 압축포','농축된 잔향을 직선으로 발사한다',38,82],['대기권 향기 재작성','하늘 전체의 냄새 규칙을 바꾼다',46,72],
  ['은하 진동성 잔향파','별과 별 사이를 흔드는 파동',55,66],['절대후각 차원붕괴','모든 방향에서 냄새가 동시에 온다',68,56],
  ['공간 탈취 불가 선언','상대의 방어를 무시하는 선언',34,90],['초신성 방향제 역설','밝아질수록 냄새가 강해지는 역설',50,68]
];

const defaultSave = {tickets:3,owned:{f1:1},pity:0,sound:true,best:0};
let save = loadSave();
let run = null, busy = false, filter = 'all', audioCtx;

function loadSave(){try{return {...defaultSave,...JSON.parse(localStorage.getItem('seongjimon-save')||'{}')}}catch{return {...defaultSave}}}
function persist(){localStorage.setItem('seongjimon-save',JSON.stringify(save));updateHeader()}
function updateHeader(){document.querySelector('#ticket-count').textContent=save.tickets;document.querySelector('#owned-count').textContent=Object.keys(save.owned).length;document.querySelector('#sound-toggle').textContent=save.sound?'♪':'×'}
function grade(m){return GRADES[m.g]}
function figureClass(m){return `monster-figure shape-${m.shape} grade-${grade(m).id}`}
function show(screen){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.querySelector(`#screen-${screen}`).classList.add('active');document.querySelectorAll('.dock button').forEach(b=>b.classList.toggle('active',b.dataset.go===screen));if(screen==='collection')renderCollection();if(screen==='gacha')renderGacha();tone(260,.05)}
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(el.t);el.t=setTimeout(()=>el.classList.remove('show'),1800)}
function tone(freq=300,d=.08,type='sine'){if(!save.sound)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d)}catch{}}

function pickMonster(maxGrade=5){const pool=MONSTERS.filter(m=>m.g<=maxGrade);return pool[Math.floor(Math.random()*pool.length)]}
function startRun(){const owned=MONSTERS.filter(m=>save.owned[m.id]);const base=owned.sort((a,b)=>b.g-a.g)[0]||MONSTERS[0];run={floor:1,wins:0,tickets:0,boost:0,player:{...base,level:1,maxHp:92+base.g*13,hp:92+base.g*13},enemy:null};show('battle');nextBattle()}
function nextBattle(){busy=false;const maxG=Math.min(5,Math.floor((run.floor+1)/2));let enemy=pickMonster(maxG);const level=run.floor+Math.max(0,enemy.g-1);const hp=58+level*15+enemy.g*9;run.enemy={...enemy,level,maxHp:hp,hp};run.player.level=Math.max(1,Math.ceil(run.floor/2));renderBattle();log('공간이 접히며 새로운 지냄이 나타났다.')}
function renderBattle(){const p=run.player,e=run.enemy;setCombatant('player',p);setCombatant('enemy',e);document.querySelector('#floor-label').textContent=`${run.floor}구역`;document.querySelector('#run-tickets').textContent=run.tickets;const pips=document.querySelector('#floor-pips');pips.innerHTML='';for(let i=1;i<=10;i++){const x=document.createElement('i');if(i<run.floor)x.className='done';if(i===run.floor)x.className='current';pips.append(x)}renderMoves()}
function setCombatant(side,m){document.querySelector(`#${side}-grade`).textContent=grade(m).label.toUpperCase();document.querySelector(`#${side}-name`).textContent=m.name;document.querySelector(`#${side}-level`).textContent=`Lv.${m.level||1}`;const fig=document.querySelector(`#${side}-figure`);fig.className=figureClass(m);fig.innerHTML='<span class="face-dot left"></span><span class="face-dot right"></span>';setHp(side,m)}
function setHp(side,m){const pct=Math.max(0,m.hp/m.maxHp*100),bar=document.querySelector(`#${side}-hp`);bar.style.width=`${pct}%`;bar.style.background=pct<25?'#ff5468':pct<55?'#ffd15c':'#c6ff4a';document.querySelector(`#${side}-hp-text`).textContent=`${Math.max(0,m.hp)} / ${m.maxHp}`}
function renderMoves(){const grid=document.querySelector('#move-grid');grid.innerHTML='';const start=Math.min(MOVES.length-4,run.player.g);MOVES.slice(start,start+4).forEach((m,i)=>{const b=document.createElement('button');b.className='move-button';b.innerHTML=`<span><strong>${m[0]}</strong><small>${m[1]}</small></span><b>위력 ${m[2]}</b>`;b.onclick=()=>playerMove(m,i);grid.append(b)})}
function log(t){document.querySelector('#battle-log').textContent=t}
function animate(side,cls){const f=document.querySelector(`#${side}-figure`);f.classList.remove(cls);void f.offsetWidth;f.classList.add(cls);setTimeout(()=>f.classList.remove(cls),450)}
async function playerMove(move,idx){if(busy)return;busy=true;document.querySelectorAll('.move-button').forEach(b=>b.disabled=true);animate('player','attack');tone(330+idx*70,.12,'sawtooth');await wait(270);if(Math.random()*100>move[3]){log(`${move[0]}은 빗나갔다.`)}else{const dmg=Math.max(7,Math.round(move[2]*(.78+Math.random()*.38)+run.boost-run.enemy.g*2));run.enemy.hp-=dmg;animate('enemy','hit');setHp('enemy',run.enemy);log(`${move[0]}! ${dmg}의 잔향 피해.`)}await wait(650);if(run.enemy.hp<=0){winBattle();return}enemyTurn()}
async function enemyTurn(){const m=MOVES[Math.min(MOVES.length-1,run.enemy.g+Math.floor(Math.random()*3))];animate('enemy','attack');tone(150,.14,'square');await wait(280);const dmg=Math.max(5,Math.round((m[2]*.55+run.enemy.level*2.2)*(0.82+Math.random()*.3)-run.player.g));run.player.hp-=dmg;animate('player','hit');setHp('player',run.player);log(`${run.enemy.name}의 ${m[0]}! ${dmg} 피해.`);await wait(700);if(run.player.hp<=0){gameOver();return}busy=false;document.querySelectorAll('.move-button').forEach(b=>b.disabled=false)}
function winBattle(){run.wins++;const got=Math.random()<.55?1:0;run.tickets+=got;log(`${run.enemy.name} 격파!${got?' 뽑기 티켓을 발견했다.':''}`);tone(520,.12);setTimeout(()=>{if(run.floor>=10){run.tickets+=3;completeRun()}else showRewards()},850)}
function showRewards(){const overlay=document.querySelector('#reward-overlay');overlay.classList.add('active');const choices=[['✚','잔향 회복','체력 35% 회복','heal'],['⬆','농도 강화','이번 원정 공격력 +6','power'],['🎟','균열 티켓','뽑기 티켓 +1','ticket']].sort(()=>Math.random()-.5);const box=document.querySelector('#reward-options');box.innerHTML='';choices.forEach(c=>{const b=document.createElement('button');b.className='reward-option';b.innerHTML=`<b>${c[0]}</b><strong>${c[1]}</strong><small>${c[2]}</small>`;b.onclick=()=>takeReward(c[3]);box.append(b)})}
function takeReward(type){if(type==='heal')run.player.hp=Math.min(run.player.maxHp,run.player.hp+Math.round(run.player.maxHp*.35));if(type==='power')run.boost+=6;if(type==='ticket')run.tickets++;document.querySelector('#reward-overlay').classList.remove('active');run.floor++;nextBattle()}
function completeRun(){run.tickets+=3;save.tickets+=run.tickets;save.best=Math.max(save.best,10);persist();document.querySelector('#result-floor').textContent='완주';finishResult()}
function gameOver(){save.tickets+=run.tickets;save.best=Math.max(save.best,run.floor);persist();document.querySelector('#result-floor').textContent=run.floor;finishResult()}
function finishResult(){document.querySelector('#result-wins').textContent=run.wins;document.querySelector('#result-tickets').textContent=run.tickets;show('gameover')}
function abandon(){if(!run)return;save.tickets+=run.tickets;persist();show('lobby');toast('원정을 종료하고 획득 티켓을 보관했다.')}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}

function rollGrade(){if(save.pity>=29)return 4+Math.floor(Math.random()*2);let r=Math.random()*100,sum=0;for(let i=0;i<GRADES.length;i++){sum+=GRADES[i].odds;if(r<sum)return i}return 0}
function pull(){if(save.tickets<1){toast('티켓이 부족하다. 던전에서 획득할 수 있다.');tone(110,.1);return}save.tickets--;const gi=rollGrade();save.pity=gi>=4?0:save.pity+1;const pool=MONSTERS.filter(m=>m.g===gi),m=pool[Math.floor(Math.random()*pool.length)],isNew=!save.owned[m.id];save.owned[m.id]=(save.owned[m.id]||0)+1;persist();renderGacha();summonReveal(m,isNew)}
async function summonReveal(m,isNew){const o=document.querySelector('#summon-overlay'),g=grade(m);o.className=`summon-overlay active reveal-${g.id}`;document.querySelector('#summon-result-grade').textContent=g.label.toUpperCase();document.querySelector('#summon-result-grade').style.color=g.color;const f=document.querySelector('#summon-result-figure');f.className=figureClass(m);f.innerHTML='<span class="face-dot left"></span><span class="face-dot right"></span>';document.querySelector('#summon-result-name').textContent=m.name;document.querySelector('#summon-new').textContent=isNew?'NEW!':`보유 ${save.owned[m.id]}개`;tone(260+giToTone(m.g),.35,'sawtooth');if(m.g>=4){document.body.classList.add('rare-flash');setTimeout(()=>document.body.classList.remove('rare-flash'),700)}}
function giToTone(g){return g*105}
function renderGacha(){document.querySelector('#odds-list').innerHTML=GRADES.map(g=>`<span style="border-color:${g.color}55;color:${g.color}">${g.label} ${g.odds}%</span>`).join('');document.querySelector('#pity-text').textContent=`Smell 이상 확정까지 ${30-save.pity}회`;document.querySelector('#pull-once').disabled=save.tickets<1}
function renderCollection(){const fs=document.querySelector('#grade-filters');fs.innerHTML='';[['all','전체'],...GRADES.map(g=>[g.id,g.label])].forEach(([id,label])=>{const b=document.createElement('button');b.textContent=label;b.classList.toggle('active',filter===id);b.onclick=()=>{filter=id;renderCollection()};fs.append(b)});const list=filter==='all'?MONSTERS:MONSTERS.filter(m=>grade(m).id===filter);document.querySelector('#collection-grid').innerHTML=list.map(m=>{const owned=save.owned[m.id]||0;return `<article class="collection-card ${owned?'':'locked'}"><small>${owned?`×${owned}`:'???'}</small><span style="color:${grade(m).color}">${grade(m).label.toUpperCase()} · ${m.form}</span><div class="${figureClass(m)}">${owned?'<i class="face-dot left"></i><i class="face-dot right"></i>':''}</div><h3>${owned?m.name:'아직 관측되지 않은 지냄'}</h3></article>`}).join('')}

document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go)show(go.dataset.go)});
document.querySelector('#start-run').onclick=startRun;document.querySelector('#retry-run').onclick=startRun;document.querySelector('#abandon-run').onclick=abandon;document.querySelector('#pull-once').onclick=pull;document.querySelector('#summon-close').onclick=()=>document.querySelector('#summon-overlay').classList.remove('active');document.querySelector('#sound-toggle').onclick=()=>{save.sound=!save.sound;persist();toast(save.sound?'소리를 켰다.':'소리를 껐다.')};
updateHeader();renderGacha();

window.seongjimon={startDungeon:startRun,openGacha:()=>show('gacha'),openCollection:()=>show('collection'),getStatus:()=>({tickets:save.tickets,owned:Object.keys(save.owned).length,bestFloor:save.best,inRun:!!run})};

// 지원 브라우저에서는 게임의 핵심 이동과 상태 확인을 구조화된 도구로도 노출한다.
if(document.modelContext?.registerTool){
  const tools=[
    {name:'read_game_status',title:'게임 상태 확인',description:'보유 티켓, 도감 수집 수, 최고 도달 구역과 원정 진행 여부를 확인한다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>window.seongjimon.getStatus()},
    {name:'start_dungeon_run',title:'던전 원정 시작',description:'현재 가장 높은 등급의 보유 지냄으로 새 던전 원정을 시작하고 전투 화면을 연다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:()=>{startRun();return {started:true,floor:run.floor,monster:run.player.name}}},
    {name:'open_jinaem_collection',title:'지냄 도감 열기',description:'수집한 지냄을 확인할 수 있는 도감 화면을 연다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:()=>{show('collection');return {opened:true,owned:Object.keys(save.owned).length}}}
  ];
  tools.forEach(tool=>{try{Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{})}catch{}});
}
