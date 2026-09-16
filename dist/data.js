(()=>{
const GRADES=[
 {id:'fragrance',label:'Fragrance',odds:45,color:'#c6ff4a'},{id:'aroma',label:'Aroma',odds:28,color:'#42f5cd'},
 {id:'scent',label:'Scent',odds:15,color:'#54a8ff'},{id:'odor',label:'Odor',odds:8,color:'#c066ff'},
 {id:'smell',label:'Smell',odds:3,color:'#ff4fb0'},{id:'xion',label:'Xion',odds:1,color:'#ffd34e'}
];
const TYPES=[
 {id:'smell',name:'냄새',color:'#c6ff4a'},{id:'bug',name:'벌레',color:'#67df8a'},{id:'dark',name:'악',color:'#9d86c8'},
 {id:'marae',name:'마래',color:'#ff9d4d'},{id:'ghost',name:'고스트',color:'#70a8ff'}
];
const TYPE_STRONG={smell:'marae',marae:'bug',bug:'dark',dark:'ghost',ghost:'smell'};
const ABILITIES={
 veil:{name:'향기 장막',desc:'전투마다 처음 받는 피해 35% 감소'},reflux:{name:'역류 기관',desc:'기술이 빗나가면 최대 HP의 8% 회복'},
 resonance:{name:'기하 공명',desc:'같은 기술을 연속 사용하면 위력 25% 증가'},diffuse:{name:'고체 확산',desc:'모든 공격 기술의 위력 10% 증가'},
 absorb:{name:'잔향 흡수',desc:'준 피해의 15%만큼 HP 회복'},phase:{name:'위상 향기',desc:'상대 기술의 명중률 15% 감소'},
 armor:{name:'밀폐 구조',desc:'받는 피해가 항상 8% 감소'},surge:{name:'농도 폭주',desc:'HP가 35% 이하일 때 위력 30% 증가'},
 critical:{name:'초정밀 후각',desc:'치명타 확률 22% 증가'},conductor:{name:'잔향 전도체',desc:'기술 부가효과 발동률 20% 증가'},
 renewal:{name:'영구 발향',desc:'자신의 행동 직전마다 최대 HP의 3% 회복'},sovereignty:{name:'냄새 군주',desc:'공격·특수공격·방어·특수방어 8% 강화'},
 bastion:{name:'불통의 밀폐벽',desc:'HP가 가득 찼을 때 받는 첫 피해 60% 감소'},ghoststep:{name:'무취 유령보행',desc:'전투마다 처음 받는 공격 기술을 완전히 회피'},
 omni:{name:'만능 잔향',desc:'모든 타입의 기술에 자속 보정을 적용'},mirror:{name:'방어축 반전',desc:'방어 계산 시 방어와 특수방어 중 높은 수치를 사용'},
 endure:{name:'차원 고정점',desc:'전투마다 한 번 쓰러질 피해를 HP 1로 버팀'},fortune:{name:'황금 잔향',desc:'구역 보상의 희귀도 운 수치가 18 증가'}
};
const ARCHETYPES=[
 [72,72,72,72,72,72],[92,38,168,45,138,22],[56,132,42,132,42,116],
 [64,84,58,96,60,150],[98,46,78,105,168,32],[82,82,82,82,82,82]
];
const rawMonsters=[
 ['f1',0,'cube','정육면체','새벽 복도를 배회하는 미세한 지온냄새','veil'],['f2',0,'tetra','정사면체','문틈으로 슬쩍 들어온 지온냄새','reflux'],['f3',0,'prism','삼각기둥','체육복 주머니에 잠든 지온냄새','resonance'],['f4',0,'octa','정팔면체','사물함 번호를 기억하는 지온냄새','diffuse'],['f5',0,'sphere','구','책장 사이를 구르는 지온냄새','absorb'],['f6',0,'torus','원환면','창문 틈에서 맴도는 지온냄새','ghoststep'],
 ['a1',1,'tetra','정사면체','환풍구를 역주행하는 지온냄새','reflux'],['a2',1,'cube','직육면체','엘리베이터를 점령한 지온냄새','bastion'],['a3',1,'octa','정팔면체','운동장의 바람을 되돌리는 지온냄새','diffuse'],['a4',1,'prism','육각기둥','급식실의 시간을 멈춘 지온냄새','renewal'],['a5',1,'dodeca','정십이면체','복도 끝 경보기를 울리는 지온냄새','conductor'],['a6',1,'sphere','구','옥상 구름을 끌어내리는 지온냄새','surge'],
 ['s1',2,'octa','정팔면체','도시 한 블록을 감싸는 지온냄새','veil'],['s2',2,'prism','육각기둥','구름의 진로를 바꿔버린 지온냄새','phase'],['s3',2,'sphere','구','대기의 기억에 새겨진 지온냄새','renewal'],['s4',2,'dodeca','정십이면체','기상 위성을 혼란시킨 지온냄새','critical'],['s5',2,'torus','원환면','도시의 모든 창문을 떨게 한 지온냄새','resonance'],['s6',2,'icosa','정이십면체','해안선을 따라 질주하는 지온냄새','fortune'],
 ['o1',3,'dodeca','정십이면체','하늘이 무너지고 땅이 솟아나는 지온냄새','armor'],['o2',3,'icosa','정이십면체','태풍의 눈에서 왕좌를 세운 지온냄새','surge'],['o3',3,'torus','원환면','대륙의 계절을 뒤집는 지온냄새','conductor'],['o4',3,'sphere','구','산맥을 넘어 메아리치는 지온냄새','absorb'],['o5',3,'cube','초입방체의 그림자','중력의 방향을 바꾼 지온냄새','mirror'],['o6',3,'octa','별모양 팔면체','해와 달의 교대 근무를 방해한 지온냄새','sovereignty'],
 ['sml1',4,'icosa','정이십면체','은하가 진동하는 초월적 지온냄새','resonance'],['sml2',4,'sphere','초구의 투영','별빛마저 굴절시킨 궁극의 지온냄새','omni'],['sml3',4,'torus','클라인 병의 그림자','시공간에 영구 잔향을 남긴 지온냄새','renewal'],['sml4',4,'dodeca','대십이면체','행성의 자전축을 재배치한 지온냄새','sovereignty'],['sml5',4,'prism','초차원 각기둥','블랙홀의 경고장을 반송한 지온냄새','veil'],['sml6',4,'octa','4차원 정팔면체','우주 배경복사를 덮어쓴 지온냄새','conductor'],
 ['x1',5,'dodeca','초정십이면체','우주의 시작보다 먼저 존재한 태초의 지온냄새','endure'],['x2',5,'icosa','초정이십면체','모든 평행우주를 하나의 향으로 통일한 지온냄새','critical'],['x3',5,'torus','4차원 초원환체','존재와 무존재의 경계를 초월한 절대 지온냄새','absorb'],['x4',5,'sphere','무한차원 초구','시간이 탄생하기 전부터 기다린 지온냄새','renewal'],['x5',5,'cube','테서랙트','우주 법칙의 원본을 덮어쓴 지온냄새','mirror'],['x6',5,'prism','무한각기둥','관측 가능한 모든 차원을 봉인한 지온냄새','omni'],
 ['f7',0,'cube','정육면체','신발장 구석에서 출석을 부르는 지온냄새','armor'],['f8',0,'tetra','정사면체','분필가루에 몰래 탑승한 지온냄새','phase'],['f9',0,'prism','삼각기둥','책상 서랍의 비밀을 지키는 지온냄새','conductor'],['f10',0,'octa','정팔면체','복사기 주변을 세 바퀴 도는 지온냄새','fortune'],['f11',0,'sphere','구','우산꽂이에서 비 소식을 전하는 지온냄새','surge'],['f12',0,'torus','원환면','교실 시계보다 먼저 쉬는 지온냄새','mirror'],
 ['a7',1,'cube','직육면체','계단참의 공기를 접어버린 지온냄새','veil'],['a8',1,'tetra','정사면체','자판기 동전을 향으로 바꾼 지온냄새','absorb'],['a9',1,'prism','오각기둥','방송실 마이크를 독점한 지온냄새','critical'],['a10',1,'octa','정팔면체','체육관 매트를 깨운 지온냄새','ghoststep'],['a11',1,'sphere','구','도서관 정숙 표지판을 흔드는 지온냄새','resonance'],['a12',1,'torus','원환면','급식표의 메뉴 순서를 바꾼 지온냄새','endure'],
 ['s7',2,'cube','입방팔면체','교문 밖 바람을 줄 세운 지온냄새','sovereignty'],['s8',2,'tetra','깎은 정사면체','구름 사이에 사물함을 만든 지온냄새','armor'],['s9',2,'prism','팔각기둥','운동장 모래를 공중에 정렬한 지온냄새','diffuse'],['s10',2,'octa','별모양 팔면체','도시의 신호등을 동시에 재채기시킨 지온냄새','reflux'],['s11',2,'sphere','타원체','한강의 물결에 냄새 암호를 쓴 지온냄새','omni'],['s12',2,'torus','이중 원환면','기상청 예보를 향기로 수정한 지온냄새','bastion'],
 ['o7',3,'cube','초입방체의 단면','대륙의 환풍구를 전부 잠근 지온냄새','renewal'],['o8',3,'tetra','대정사면체','사막의 모래폭풍에 이름표를 붙인 지온냄새','fortune'],['o9',3,'prism','십이각기둥','해류의 진행 방향을 뒤집은 지온냄새','phase'],['o10',3,'octa','대팔면체','번개의 냄새를 병에 담은 지온냄새','critical'],['o11',3,'sphere','초구의 단면','북극의 오로라를 향기로 염색한 지온냄새','mirror'],['o12',3,'torus','뫼비우스 원환면','지구의 자전 소리를 냄새로 번역한 지온냄새','endure'],
 ['sml7',4,'cube','회전 테서랙트','은하수의 중심에 방향제를 설치한 지온냄새','omni'],['sml8',4,'tetra','5차원 정사면체','초신성 폭발보다 먼저 퍼진 지온냄새','surge'],['sml9',4,'prism','성운 각기둥','별자리의 순서를 다시 배열한 지온냄새','conductor'],['sml10',4,'octa','우주 정팔면체','달의 뒷면에 영구 잔향을 새긴 지온냄새','bastion'],['sml11',4,'sphere','중력 초구','블랙홀의 탈취 요청을 거절한 지온냄새','absorb'],['sml12',4,'torus','시공 원환체','광속보다 먼저 코끝에 도착한 지온냄새','ghoststep'],
 ['x7',5,'cube','무한 테서랙트','가능한 모든 미래를 냄새로 기록한 지온냄새','sovereignty'],['x8',5,'tetra','절대 정사면체','수학적 차원 전체에 잔향을 증명한 지온냄새','resonance'],['x9',5,'prism','초월 무한각기둥','관측자의 기억보다 먼저 존재한 지온냄새','veil'],['x10',5,'octa','절대 정팔면체','우주 상수를 향기 농도로 바꾼 지온냄새','fortune'],['x11',5,'sphere','절대 초구','무한 우주의 경계를 안쪽으로 접은 지온냄새','endure'],['x12',5,'torus','무한 중첩 원환체','존재하는 모든 환풍구의 기원이 된 지온냄새','omni']
];
const MONSTERS=rawMonsters.map(([id,g,shape,form,name,ability],index)=>{
 const variant=index%6,boost=g*9,stats=ARCHETYPES[variant].map((v,i)=>v+boost+(i===0?g*2:0));
 const primary=TYPES[(g+variant)%5].id,secondary=(variant===2||variant===5)?TYPES[(g+variant+2)%5].id:null;
 const typeNames=[primary,secondary].filter(Boolean).map(id=>TYPES.find(t=>t.id===id).name).join('·');
 return{id,g,shape,form,name,ability,variant,types:[primary,secondary].filter(Boolean),stats,description:`${form} 구조 안에 ${typeNames} 계열 잔향을 압축한 지냄이다. ${name}라는 기록명처럼 주변 공간에 독특한 냄새 현상을 일으키며, ${ABILITIES[ability].name} 특성으로 전투 흐름을 바꾼다.`};
});
const XION_BOSS={
 id:'boss-seongjion',g:5,shape:'cube',form:'초월 테서랙트',name:'성지온',ability:'sovereignty',variant:5,
 types:['smell','dark'],stats:[210,165,155,190,165,145],boss:true,
 description:'XION 심층의 가장 아래에서 모든 지온냄새를 지휘하는 최종보스다.'
};
const MOVES={
 trace:{name:'잔향 톡톡',type:'smell',category:'physical',desc:'작지만 확실한 냄새 입자',power:35,acc:100,pp:12,tag:'필중'},
 mist:{name:'후각 교란 안개',type:'ghost',category:'special',desc:'상대 명중률을 낮춘다',power:28,acc:92,pp:8,tag:'명중↓',effect:'accuracy',chance:100},
 solid:{name:'입체 냄새 고체화',type:'marae',category:'physical',desc:'보호막을 생성한다',power:32,acc:94,pp:7,tag:'보호막',effect:'shield',chance:100},
 rest:{name:'잔향 재충전',type:'smell',category:'status',desc:'35% 회복하지만 방어가 감소한다',power:0,acc:100,pp:4,tag:'회복·방어↓',effect:'rest',chance:100},
 vent:{name:'환풍기 역회전',type:'bug',category:'special',desc:'상대 공격력을 낮춘다',power:38,acc:88,pp:8,tag:'공격↓',effect:'attackDown',chance:65},
 compress:{name:'지온냄새 압축포',type:'smell',category:'special',desc:'치명타 확률이 높은 농축탄',power:52,acc:83,pp:6,tag:'급소 +25%',crit:25},
 deodorize:{name:'공간 탈취 불가 선언',type:'dark',category:'status',desc:'체력을 회복하고 보호막을 친다',power:0,acc:100,pp:4,tag:'회복·보호막',effect:'healShield',chance:100},
 pierce:{name:'기하 관통 잔향',type:'marae',category:'physical',desc:'상대 방어 강화를 무시한다',power:48,acc:90,pp:7,tag:'방어 무시',pierce:true},
 rewrite:{name:'대기권 향기 재작성',type:'marae',category:'special',desc:'특수공격이 오르지만 반동을 받는다',power:59,acc:76,pp:5,tag:'특공↑·반동',effect:'specialUp',recoil:.08,chance:100},
 inverse:{name:'역방향 냄새 흡입',type:'bug',category:'physical',desc:'피해의 35%를 흡수한다',power:50,acc:84,pp:6,tag:'흡수 35%',drain:.35},
 paradox:{name:'초신성 방향제 역설',type:'dark',category:'special',desc:'상대 특수방어를 크게 낮춘다',power:61,acc:72,pp:5,tag:'특방↓↓',effect:'specialDefenseDown',chance:70},
 singularity:{name:'잔향 특이점',type:'ghost',category:'special',desc:'3턴 동안 지속 피해를 준다',power:64,acc:68,pp:4,tag:'지속 피해',effect:'dot',chance:75},
 galaxy:{name:'은하 진동성 잔향파',type:'ghost',category:'special',desc:'낮은 확률로 상대 행동을 봉쇄한다',power:70,acc:67,pp:4,tag:'행동 봉쇄',effect:'stun',chance:35},
 overclock:{name:'후각기관 초과가동',type:'bug',category:'physical',desc:'고명중 공격 후 큰 반동을 받는다',power:68,acc:96,pp:5,tag:'반동 15%',recoil:.15},
 dimension:{name:'차원 환기구 폐쇄',type:'dark',category:'physical',desc:'보호막을 파괴하고 강화를 초기화한다',power:72,acc:75,pp:4,tag:'강화 해제',effect:'dispel',chance:100},
 collapse:{name:'절대후각 차원붕괴',type:'smell',category:'special',desc:'최대 위력 대신 체력을 크게 소모한다',power:92,acc:58,pp:3,tag:'반동 20%',recoil:.20}
};
const MOVE_SETS=[['trace','mist','solid','rest'],['vent','compress','deodorize','pierce'],['mist','inverse','rewrite','solid'],['paradox','singularity','dimension','deodorize'],['galaxy','overclock','inverse','rewrite'],['collapse','dimension','galaxy','singularity']];
const DUNGEONS=[
 {id:'sewer',name:'잔향 하수도',difficulty:'EASY',index:0,desc:'약한 잔향이 모이는 입문 던전.',floors:12,minG:0,maxG:1,scale:.82,color:'#c6ff4a'},
 {id:'lab',name:'역풍 연구소',difficulty:'NORMAL',index:1,desc:'실험 장치가 부가효과를 증폭하는 표준 던전.',floors:16,minG:0,maxG:2,scale:1,color:'#42f5cd'},
 {id:'sky',name:'대기권 균열',difficulty:'HARD',index:2,desc:'Odor와 Smell이 모습을 드러내는 고난도 던전.',floors:20,minG:1,maxG:4,scale:1.18,color:'#c066ff'},
 {id:'xion',name:'XION 심층',difficulty:'NIGHTMARE',index:3,desc:'24구역에서 성지온이 기다리는 극한 던전.',floors:24,minG:2,maxG:5,scale:1.4,color:'#ff4fb0'}
];
const ACHIEVEMENTS=[
 {id:'first_capture',icon:'◉',name:'첫 포획',desc:'야생 지냄을 처음으로 포획한다.'},
 {id:'first_win',icon:'⚔',name:'첫 번째 잔향',desc:'지냄을 처음으로 격파한다.'},
 {id:'easy_clear',icon:'◆',name:'하수도 정복자',desc:'잔향 하수도를 완주한다.'},
 {id:'hard_clear',icon:'▲',name:'대기권 돌파',desc:'대기권 균열을 완주한다.'},
 {id:'xion_clear',icon:'✦',name:'차원의 지배자',desc:'XION 심층을 완주한다.'},
 {id:'collector10',icon:'◇',name:'냄새 수집가',desc:'서로 다른 지냄 10종을 모은다.'},
 {id:'collector36',icon:'◈',name:'잔향 연구자',desc:'서로 다른 지냄 36종을 모은다.'},
 {id:'collector72',icon:'⬢',name:'완전한 도감',desc:'지냄 72종을 모두 모은다.'},
 {id:'super_hit',icon:'◎',name:'상성 박사',desc:'효과가 굉장한 공격을 처음 적중시킨다.'},
 {id:'pp_master',icon:'▣',name:'마지막 한 수',desc:'PP가 1 남은 기술로 적을 격파한다.'}
];
window.GAME_DATA={GRADES,TYPES,TYPE_STRONG,ABILITIES,MONSTERS,XION_BOSS,MOVES,MOVE_SETS,DUNGEONS,ACHIEVEMENTS};
})();
