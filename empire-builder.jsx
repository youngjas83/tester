import { useState } from "react";

// ── UTILS ────────────────────────────────────────────────────────────────────
const fmt = n => n>=1e9?`$${(n/1e9).toFixed(1)}B`:n>=1e6?`$${Math.round(n/1e6)}M`:n>=1e3?`$${Math.round(n/1000)}K`:`$${Math.round(n)}`;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;

// ── BADGES ───────────────────────────────────────────────────────────────────
const BADGES = {
  lowRisk:       {icon:"🛡️",label:"Low Risk",      c:"#166534",bg:"#f0fdf4", ex:"This company barely moves during economic downturns. It won't make you rich overnight — but it won't crash either. The perfect stable foundation for your empire!"},
  modRisk:       {icon:"⚡",label:"Mod. Risk",     c:"#92400e",bg:"#fff7ed", ex:"This company swings more than low-risk ones. Bigger potential gains, but bigger drops too. Great once you have a stable base of defensive companies."},
  highRisk:      {icon:"🔥",label:"High Risk",     c:"#b91c1c",bg:"#fef2f2", ex:"This company can skyrocket OR crash hard. Only invest money you can afford to lose! High risk = high potential reward. Watch it closely every turn."},
  wildRisk:      {icon:"🌪️",label:"Wild Risk",     c:"#6d28d9",bg:"#f5f3ff", ex:"This company's value can double or halve in just a few turns! Driven by hype and trends. The timing of when you buy AND sell is absolutely everything here."},
  slowGrowth:    {icon:"🐢",label:"Slow Growth",   c:"#0369a1",bg:"#f0f9ff", ex:"This company grows slowly and steadily — like a savings account. Not exciting, but reliable. Slow growth compounding over many turns quietly creates serious wealth!"},
  steadyGrowth:  {icon:"📈",label:"Steady Growth", c:"#1D4ED8",bg:"#eff6ff", ex:"Grows reliably every turn without drama. The best 'set it and forget it' companies. Steady growth compounding over time is the #1 secret of real-world investors!"},
  fastGrowth:    {icon:"🚀",label:"Fast Growth",   c:"#0891B2",bg:"#ecfeff", ex:"This company can grow incredibly fast — but it can also reverse just as fast. Best during a booming economy or sector. Watch the signals carefully before buying!"},
  inDecline:     {icon:"📉",label:"In Decline",    c:"#dc2626",bg:"#fef2f2", ex:"This company is slowly losing ground to competition or new trends. It loses value every turn even in good conditions. Only worth buying if very cheap — and you plan to sell fast!"},
  cashCow:       {icon:"💰",label:"Cash Cow",      c:"#92400e",bg:"#fff7ed", ex:"Generates lots of profit relative to its size. Great for building steady cash income to fund your other investments. The backbone of any smart empire!"},
  counterCyc:    {icon:"🔄",label:"Counter-Cyclical",c:"#166534",bg:"#f0fdf4",ex:"This company gets STRONGER during recessions! When the economy is bad, people trade down to cheaper options and this company wins. A secret weapon in your recession strategy!"},
  fadAlert:      {icon:"⚠️",label:"Fad Alert",     c:"#b45309",bg:"#fffbeb", ex:"This company's success depends on staying trendy. One bad season and the value can collapse. Ride the wave — but get out before it crashes! Timing is everything."},
  eCommBoom:     {icon:"📦",label:"E-Comm Boom",   c:"#0891B2",bg:"#ecfeff", ex:"Directly benefits from the permanent shift to online shopping. As more people shop online forever, this company only gets more essential. A massive long-term structural tailwind!"},
  stickyRev:     {icon:"🔐",label:"Sticky Revenue",c:"#1D4ED8",bg:"#eff6ff", ex:"Customers keep coming back automatically — subscriptions, habits, or long-term contracts. Once they sign up they rarely leave. Makes earnings very predictable and resilient!"},
};

// ── COMPANIES ────────────────────────────────────────────────────────────────
const COS = {
  burgerblast:{id:"burgerblast",name:"BurgerBlast",   icon:"🍔",icon2:"🍟",sector:"consumer",
    tagline:'"America\'s favorite teen burger chain"',
    about:"BurgerBlast has been feeding teens since 1987 with zero signs of slowing down. People eat burgers whether the economy is booming or in a recession — making this a rock-solid investment in any climate.",
    badges:["lowRisk","steadyGrowth","cashCow"],
    baseProfit:200000,baseMult:20,secular:0.02,
    profSens:0.20,multSens:0.10,multFloor:14,multCeil:26,
    bg:"linear-gradient(135deg,#c2410c,#ea580c 50%,#fb923c)",col:"#EA580C",
    locationCost:0.30,locProfitBoost:0.30},
  novadrip:{id:"novadrip",name:"NovaDrip",     icon:"👟",icon2:"🧢",sector:"consumer",
    tagline:'"Streetwear built on hype and social media"',
    about:"NovaDrip blew up overnight with celebrity endorsements. It could blow up again — or blow up in a very different way. Their entire business model is chasing the next trend.",
    badges:["wildRisk","fastGrowth","fadAlert"],
    baseProfit:80000,baseMult:32,secular:0,
    profSens:1.40,multSens:1.60,multFloor:10,multCeil:48,
    bg:"linear-gradient(135deg,#4c1d95,#7c3aed 50%,#a78bfa)",col:"#7C3AED",
    locationCost:0.30,locProfitBoost:0.30},
  glowlab:{id:"glowlab",name:"GlowLab",       icon:"✨",icon2:"💄",sector:"consumer",
    tagline:'"Premium skincare with a cult following"',
    about:"GlowLab rides the multi-decade wellness trend. Their loyal customers pay premium prices and almost never switch brands. That pricing power is their greatest superpower.",
    badges:["lowRisk","steadyGrowth","stickyRev"],
    baseProfit:140000,baseMult:26,secular:0.015,
    profSens:0.40,multSens:0.50,multFloor:18,multCeil:38,
    bg:"linear-gradient(135deg,#9d174d,#ec4899 50%,#f9a8d4)",col:"#ec4899",
    locationCost:0.30,locProfitBoost:0.30},
  freshmart:{id:"freshmart",name:"FreshMart",    icon:"🛒",icon2:"🥦",sector:"consumer",
    tagline:'"No-frills discount grocery for everyone"',
    about:"FreshMart is boring, reliable, and extremely profitable. When times get tough, shoppers switch FROM fancy stores TO FreshMart. Recessions are actually GOOD for this company!",
    badges:["lowRisk","slowGrowth","counterCyc"],
    baseProfit:250000,baseMult:14,secular:0.008,
    profSens:-0.20,multSens:0.10,multFloor:10,multCeil:20,
    isCounterCyc:true,
    bg:"linear-gradient(135deg,#14532d,#22c55e 50%,#86efac)",col:"#22c55e",
    locationCost:0.28,locProfitBoost:0.30},
  toycraze:{id:"toycraze",name:"ToyCraze",     icon:"🎮",icon2:"🃏",sector:"consumer",
    tagline:'"Collectibles riding a very hot trend"',
    about:"ToyCraze has the hottest collectibles right now. But 'right now' is the key phrase. When the fad fades, so does everything. Timing your exit is more important than your entry.",
    badges:["wildRisk","fastGrowth","fadAlert"],
    baseProfit:60000,baseMult:28,secular:0,
    profSens:1.40,multSens:1.60,multFloor:8,multCeil:45,
    bg:"linear-gradient(135deg,#78350f,#f59e0b 50%,#fde68a)",col:"#f59e0b",
    locationCost:0.30,locProfitBoost:0.30},
  pixelwear:{id:"pixelwear",name:"PixelWear",   icon:"👕",icon2:"🎧",sector:"consumer",
    tagline:'"Teen fashion meets gaming culture"',
    about:"PixelWear blends streetwear with gaming culture. Their limited drops sell out instantly. Moderate risk — less trend-dependent than NovaDrip, but not recession-proof either.",
    badges:["modRisk","steadyGrowth","fadAlert"],
    baseProfit:90000,baseMult:24,secular:0.005,
    profSens:1.00,multSens:0.80,multFloor:12,multCeil:36,
    bg:"linear-gradient(135deg,#164e63,#0891b2 50%,#67e8f9)",col:"#0891B2",
    locationCost:0.30,locProfitBoost:0.30},
  skyflats:{id:"skyflats",name:"SkyFlats",     icon:"🏢",icon2:"🌆",sector:"realestate",
    tagline:'"Urban apartments at 96% occupancy"',
    about:"People always need a place to live. SkyFlats has held 96% occupancy for 8 straight years. Interest rate sensitive but structurally very strong — the gold standard of steady income.",
    badges:["lowRisk","slowGrowth","cashCow"],
    baseProfit:180000,baseMult:22,secular:0.01,
    profSens:0.30,multSens:0.20,multFloor:16,multCeil:30,
    bg:"linear-gradient(135deg,#1e3a8a,#1d4ed8 50%,#93c5fd)",col:"#1D4ED8",
    locationCost:0.35,locProfitBoost:0.28},
  megamall:{id:"megamall",name:"MegaMall",     icon:"🏪",icon2:"🛍️",sector:"realestate",
    tagline:'"Aging mall losing tenants to e-commerce"',
    about:"MegaMall looks cheap, and it's cheap for a reason. E-commerce is permanently taking its tenants. Every turn it gets a little worse. Cheap is not always a bargain — this is a value trap.",
    badges:["highRisk","inDecline","cashCow"],
    baseProfit:200000,baseMult:8,secular:-0.035,
    profSens:1.00,multSens:0.70,multFloor:3,multCeil:14,
    bg:"linear-gradient(135deg,#374151,#6b7280 50%,#d1d5db)",col:"#6B7280",
    locationCost:0.25,locProfitBoost:0.25},
  storesafe:{id:"storesafe",name:"StoreSafe",   icon:"📦",icon2:"🏭",sector:"realestate",
    tagline:'"Self-storage across the suburbs"',
    about:"StoreSafe is the definition of boring and brilliant. As cities get denser, people need more storage. Reliable, unsexy, and consistently profitable every single turn.",
    badges:["lowRisk","slowGrowth","cashCow"],
    baseProfit:140000,baseMult:18,secular:0.01,
    profSens:0.30,multSens:0.20,multFloor:14,multCeil:26,
    bg:"linear-gradient(135deg,#78350f,#d97706 50%,#fde68a)",col:"#d97706",
    locationCost:0.32,locProfitBoost:0.28},
  towerone:{id:"towerone",name:"TowerOne",     icon:"🏙️",icon2:"💼",sector:"realestate",
    tagline:'"Downtown office building post-remote-work"',
    about:"TowerOne was prime real estate before remote work became permanent. Now 30% of desks sit empty. The long-term trend is bad — but it's generating yield while it lasts.",
    badges:["highRisk","inDecline","cashCow"],
    baseProfit:120000,baseMult:10,secular:-0.025,
    profSens:1.00,multSens:0.70,multFloor:3,multCeil:14,
    bg:"linear-gradient(135deg,#0f172a,#475569 50%,#94a3b8)",col:"#475569",
    locationCost:0.28,locProfitBoost:0.25},
  warehousex:{id:"warehousex",name:"WarehouseX",  icon:"🏭",icon2:"🚚",sector:"realestate",
    tagline:'"Industrial warehouses powering e-commerce"',
    about:"Every package you order online passes through a WarehouseX facility. E-commerce growth means this company grows permanently. The secular tailwind here is absolutely massive.",
    badges:["lowRisk","fastGrowth","eCommBoom"],
    baseProfit:160000,baseMult:24,secular:0.02,
    profSens:0.40,multSens:0.50,multFloor:18,multCeil:38,
    bg:"linear-gradient(135deg,#164e63,#0891b2 50%,#a5f3fc)",col:"#0891B2",
    locationCost:0.32,locProfitBoost:0.28},
  sunvilla:{id:"sunvilla",name:"SunVilla",     icon:"🏖️",icon2:"🌴",sector:"realestate",
    tagline:'"Luxury vacation rentals on the coast"',
    about:"SunVilla owns premium vacation properties from Miami to Malibu. Tourism drives their revenue, so economic mood and seasons matter a lot. Great in boom times, soft in downturns.",
    badges:["modRisk","steadyGrowth","cashCow"],
    baseProfit:100000,baseMult:20,secular:0.008,
    profSens:0.80,multSens:0.60,multFloor:12,multCeil:30,
    bg:"linear-gradient(135deg,#78350f,#f59e0b 60%,#fed7aa)",col:"#f59e0b",
    locationCost:0.30,locProfitBoost:0.28},
};
const CO_LIST = Object.values(COS);
const CONSUMER = CO_LIST.filter(c=>c.sector==="consumer");
const REALESTATE = CO_LIST.filter(c=>c.sector==="realestate");

// ── NEWS TEMPLATES ────────────────────────────────────────────────────────────
const NEWS_TPL = {
  macro:{
    boom:["Consumer confidence hits a 5-year high","Markets rally as investors feel optimistic","Strong jobs report fuels economic enthusiasm","Holiday spending projected to break records"],
    preBoom:["Economists see signs of improving conditions","Business sentiment starting to tick upward","Several leading indicators turning positive"],
    recession:["Inflation fears grip markets","Consumer spending falls for third straight month","Layoffs rise as companies tighten belts","Fed warns of challenging conditions ahead"],
    preRecession:["Markets show signs of overheating","Analysts warn economy may be peaking","Rising costs squeeze corporate margins"],
    normal:["Economy holds steady as markets stabilize","Moderate growth continues across most sectors","Mixed signals from latest economic data"],
  },
  consumer:{
    boom:["Teen spending at all-time high","Back-to-school shopping surges 20%","Consumer brands report record sell-through rates"],
    downturn:["Discretionary spending falls sharply","Consumers trade down to value brands","Retail traffic drops as shoppers stay home"],
    normal:["Consumer trends remain stable this period","Moderate foot traffic reported across retail"],
  },
  realestate:{
    boom:["Real estate demand surges in urban markets","Rental vacancy rates hit historic lows","Property values climb across all categories"],
    downturn:["Rising vacancies hit commercial properties","Real estate market softens as rates rise","Some landlords report trouble filling units"],
    normal:["Real estate market steady with balanced supply","Rental demand holds firm in most metros"],
  },
  company:{
    burgerblast:["BurgerBlast launches viral limited-edition menu item — lines around the block!","BurgerBlast named #1 teen brand in national survey","Delivery sales surge for BurgerBlast locations"],
    novadrip:["NovaDrip drop sells out in 4 minutes — hype at peak levels!","Influencer partnership could be a game-changer for NovaDrip","NovaDrip faces knockoff crisis — brand dilution risk growing"],
    glowlab:["GlowLab's new serum goes viral on social media","Celebrity endorsement sends GlowLab into overdrive","GlowLab clinical results exceed expectations — stock buzz building"],
    freshmart:["FreshMart reports surge in new memberships as consumers cut back","FreshMart expands private label line — margins improving","FreshMart voted most trusted grocery brand for 4th straight year"],
    toycraze:["ToyCraze collaboration with major gaming franchise confirmed!","ToyCraze secondary market prices up 40% — collectors going wild","Analysts question whether ToyCraze can sustain current growth"],
    pixelwear:["PixelWear x top streamer collab drops next turn — buzz building","PixelWear reports strong international sales in Asia","Supply chain hiccup delays PixelWear's next drop — investors nervous"],
    skyflats:["SkyFlats reports 97% occupancy — highest ever recorded","New development pipeline adds premium units to SkyFlats portfolio","SkyFlats announces buyback — management confidence is high"],
    megamall:["Another anchor tenant leaves MegaMall — vacancy hits 28%","MegaMall pivoting to entertainment — can it work?","Foot traffic at MegaMall down 15% year over year"],
    storesafe:["StoreSafe same-store sales up for 12th consecutive quarter","StoreSafe acquires 40 new facilities — nationwide expansion underway","Urban density data confirms long-term tailwinds for storage sector"],
    towerone:["TowerOne renewal rate falls to 55% — remote work impact deepening","TowerOne considers residential conversion — turnaround hopes rise","Major tenant TowerOne's biggest client reduces office space by half"],
    warehousex:["WarehouseX wins 10-year contract with major online retailer","WarehouseX expands to 4 new markets — demand outpacing supply","Drone delivery pilot at WarehouseX facilities — efficiency gains imminent"],
    sunvilla:["SunVilla summer bookings up 30% — premium travel surges","SunVilla acquires 5 Malibu properties in portfolio expansion","Slow booking season hits SunVilla — weather events reduce demand"],
  },
};

function generateNews(state) {
  const {economy, sectorState, turn} = state;
  const items = [];
  // Macro headline
  const eKey = economy==="boom"?"boom":economy==="recession"?"recession":"normal";
  items.push({type:"macro", text:pick(NEWS_TPL.macro[eKey]), icon:"🌍"});
  // Pre-signal next transition sometimes
  if (state.economyTimer===2 && economy==="boom") items.push({type:"macro",text:pick(NEWS_TPL.macro.preRecession),icon:"⚠️"});
  if (state.economyTimer===2 && economy==="recession") items.push({type:"macro",text:pick(NEWS_TPL.macro.preBoom),icon:"📊"});
  // Sector headline
  const cKey = sectorState.consumer==="boom"?"boom":sectorState.consumer==="downturn"?"downturn":"normal";
  items.push({type:"sector",text:pick(NEWS_TPL.consumer[cKey]),icon:"🛍️",sector:"consumer"});
  const rKey = sectorState.realestate==="boom"?"boom":sectorState.realestate==="downturn"?"downturn":"normal";
  if(Math.random()>0.4) items.push({type:"sector",text:pick(NEWS_TPL.realestate[rKey]),icon:"🏠",sector:"realestate"});
  // Company gossip (1-2 items)
  const gossipCos = Object.keys(NEWS_TPL.company);
  const chosen = gossipCos.sort(()=>Math.random()-0.5).slice(0,rnd(1,2));
  chosen.forEach(id=>{
    items.push({type:"company",text:pick(NEWS_TPL.company[id]),icon:(COS[id]&&COS[id].icon)||"📰",company:id});
  });
  return items;
}

// ── GAME INIT ─────────────────────────────────────────────────────────────────
function initGame(name, diff) {
  const profits={}, mults={}, history={}, portfolio={};
  CO_LIST.forEach(co=>{
    profits[co.id]=co.baseProfit;
    mults[co.id]=co.baseMult;
    history[co.id]=[co.baseProfit];
    portfolio[co.id]={owned:false,locations:1,purchasePrice:0,profitsCollected:0,purchaseTurn:0};
  });
  const st = {
    empireName:name, difficulty:diff,
    phase:"news",
    turn:1, cash:10000000,
    profits, mults, history, portfolio,
    economy:"normal", economyTimer:rnd(3,5),
    sectorState:{consumer:"boom",realestate:"normal"},
    sectorTimer:{consumer:rnd(3,5),realestate:rnd(4,6)},
    actionsTaken:{}, watchlist:[],
    notification:null, wildCard:null,
    level:1, netWorthHistory:[10000000],
  };
  st.news = generateNews(st);
  return st;
}

// ── GAME LOGIC ────────────────────────────────────────────────────────────────
function companyValue(id, state) {
  return Math.round(state.profits[id] * state.mults[id]);
}

function locMultiplier(locations) { return 1 + (locations-1)*0.30; }

function myHoldingValue(id, state) {
  const p = state.portfolio[id];
  if(!p.owned) return 0;
  return Math.round(companyValue(id,state) * locMultiplier(p.locations));
}

function netWorth(state) {
  let nw = state.cash;
  CO_LIST.forEach(co=>{ nw += myHoldingValue(co.id, state); });
  return nw;
}

function interestRate(diff) { return diff==="easy"?0.03:diff==="hard"?0.01:0.02; }

function resolveEndTurn(state) {
  let s = {...state, profits:{...state.profits}, mults:{...state.mults},
           history:{...state.history}, portfolio:{...state.portfolio}};

  // 1. Apply secular drift + cycles to each company
  CO_LIST.forEach(co => {
    let dp = co.secular; // base secular drift
    let dm = 0;

    // Economy effect
    const eBonus = s.economy==="boom"?0.05:s.economy==="recession"?-0.10:0;
    const eMultBonus = s.economy==="boom"?0.02:s.economy==="recession"?-0.03:0;
    // FreshMart counter-cyclical
    const pSens = co.isCounterCyc && s.economy==="recession" ? -0.20 : co.profSens;
    dp += eBonus * pSens;
    dm += eMultBonus * co.multSens;

    // Sector effect
    const sec = co.sector==="consumer"?s.sectorState.consumer:s.sectorState.realestate;
    const sBonus = sec==="boom"?0.12:sec==="downturn"?-0.15:0;
    const sMultBonus = sec==="boom"?0.03:sec==="downturn"?-0.05:0;
    dp += sBonus * co.profSens;
    dm += sMultBonus * co.multSens;

    // Apply
    s.profits[co.id] = Math.round(s.profits[co.id] * (1 + dp));
    s.mults[co.id] = clamp(s.mults[co.id]*(1+dm), co.multFloor, co.multCeil);
    // Profit floor at 10% of base
    s.profits[co.id] = Math.max(s.profits[co.id], Math.round(co.baseProfit*0.1));
  });

  // 2. Collect profits from owned companies
  CO_LIST.forEach(co=>{
    const p = s.portfolio[co.id];
    if(p.owned){
      const earned = Math.round(s.profits[co.id] * locMultiplier(p.locations));
      s.cash += earned;
      s.portfolio[co.id] = {...p, profitsCollected: p.profitsCollected + earned};
    }
  });

  // 3. Cash interest
  const rate = interestRate(s.difficulty);
  s.cash = Math.round(s.cash * (1 + rate));

  // 4. Update history (keep last 8)
  CO_LIST.forEach(co=>{
    const h = [...(s.history[co.id]||[]), s.profits[co.id]];
    s.history[co.id] = h.slice(-8);
  });

  // 5. Economy cycle tick
  s.economyTimer--;
  if(s.economyTimer<=0){
    if(s.economy==="normal"){
      s.economy = Math.random()<0.55?"boom":"recession";
      s.economyTimer = rnd(4,7);
    } else {
      s.economy="normal";
      s.economyTimer=rnd(3,5);
    }
  }

  // 6. Sector cycle ticks
  ["consumer","realestate"].forEach(sec=>{
    s.sectorTimer[sec]--;
    if(s.sectorTimer[sec]<=0){
      const cur=s.sectorState[sec];
      if(cur==="normal") s.sectorState[sec]=Math.random()<0.55?"boom":"downturn";
      else s.sectorState[sec]="normal";
      s.sectorTimer[sec]=rnd(3,5);
    }
  });

  // 7. Wild Card (10% chance per turn, more in Easy)
  const wcChance = s.difficulty==="easy"?0.20:s.difficulty==="hard"?0.08:0.12;
  let wildCard = null;
  if(Math.random()<wcChance){
    const isGood = s.difficulty==="hard"?Math.random()>0.5:true;
    const rco = pick(CO_LIST);
    if(isGood){
      s.profits[rco.id] = Math.round(s.profits[rco.id]*1.25);
      wildCard = {type:"good",company:rco.id,text:`${rco.name} goes viral — earnings surge +25% this turn!`,icon:rco.icon};
    } else {
      s.profits[rco.id] = Math.round(s.profits[rco.id]*0.70);
      wildCard = {type:"bad",company:rco.id,text:`${rco.name} hit by sudden setback — earnings drop −30% this turn!`,icon:rco.icon};
    }
  }

  // 8. Advance turn
  s.turn++;
  s.actionsTaken={};
  s.news = generateNews(s);
  s.wildCard = wildCard;
  s.phase = wildCard ? "wildcard" : "news";

  // 9. Net worth history
  const nw = netWorth(s);
  s.netWorthHistory = [...(s.netWorthHistory||[]), nw].slice(-20);

  // 10. Level check
  if(nw>=1e9) { s.phase="won"; s.level=5; }
  else if(nw>=100e6) s.level=4;
  else if(nw>=25e6) s.level=3;
  else if(nw>=5e6) s.level=2;
  else s.level=1;

  return s;
}

// ── Q&A BANK ─────────────────────────────────────────────────────────────────
const QA = {
  "Basics":[
    {q:"What is a Value Multiplier?",mood:"thinking",a:"The Value Multiplier shows what investors are willing to pay for every $1 a company earns per turn. BurgerBlast earns $200K/turn with a 20× multiplier = worth $4M. Lower = cheaper. Higher = market expects big growth!"},
    {q:"What is Net Worth?",mood:"happy",a:"Net Worth = your cash + the current value of every company you own. This is your score! Start at $10M, reach $1 Billion to win. Every decision you make either grows or shrinks this number."},
    {q:"How do I win?",mood:"excited",a:"Grow your Net Worth to $1 BILLION! Buy great companies, collect profits every turn, open new locations, and ride the economic cycles. Hit $1B and you've built a true Empire!"},
    {q:"What is profit per turn?",mood:"happy",a:"Every turn, each company you own earns money — that's their profit per turn. It goes straight into your bank as cash! More companies + more locations = more cash every single turn."},
    {q:"What is diversification?",mood:"thinking",a:"Spreading your money across DIFFERENT sectors. If Consumer struggles, your Real Estate keeps you safe. All your money in one sector = dangerous. Spread it around!"},
  ],
  "Economy & Sectors":[
    {q:"What does Economy: Booming mean?",mood:"excited",a:"When the Economy is Booming, almost every company earns more profit and gets a higher multiplier. Best time to own companies! The green light on the Economy means go, go, go."},
    {q:"What happens in a recession?",mood:"worried",a:"During a Recession, most companies earn less and their multipliers drop. But NOT all companies — FreshMart actually thrives in recessions! Defensive companies hold steady. Risky ones crash hard."},
    {q:"What is a Sector Trend?",mood:"thinking",a:"Each sector has its own cycle separate from the Economy. Consumer could be booming while Real Estate is in a downturn! That's why owning companies in different sectors protects you."},
    {q:"Why did my company lose value?",mood:"thinking",a:"Two things can happen: profits can fall (company earns less) OR the multiplier can drop (investors pay less per dollar of earnings). Often both happen during downturns. It usually recovers when conditions improve!"},
  ],
  "Company Cards":[
    {q:"What does 'Cash Cow' mean?",mood:"happy",a:"A Cash Cow generates lots of steady profit every turn. BurgerBlast, FreshMart, SkyFlats — these companies pump out cash reliably. Great for funding your other investments!"},
    {q:"What is 'In Decline'?",mood:"worried",a:"Declining companies slowly lose value every turn even in good conditions — like MegaMall losing tenants to e-commerce or TowerOne losing office tenants to remote work. Cheap isn't always a bargain!"},
    {q:"What does 'Counter-Cyclical' mean?",mood:"excited",a:"This company gets STRONGER during recessions! FreshMart is the classic example — when people tighten their belts, they shop at discount grocers instead of fancy stores. A recession secret weapon!"},
    {q:"What is 'Fad Alert'?",mood:"worried",a:"Companies like NovaDrip and ToyCraze depend on staying trendy. One bad season and the value can collapse fast. Ride the wave up — but watch for the signal to get out before it crashes!"},
  ],
  "Strategy":[
    {q:"When should I open a new location?",mood:"thinking",a:"When your company is doing great AND you have spare cash. A new location costs about 30% of the company's value but adds 30% more profit every turn. Better ROI than buying a whole new company!"},
    {q:"What should I do in a recession?",mood:"worried",a:"Stay calm! Sell risky companies BEFORE the recession if you see it coming. Hold your defensive companies — BurgerBlast and FreshMart hold up well. Keep some cash ready to buy great companies at crash prices!"},
    {q:"Should I hold cash or invest?",mood:"thinking",a:"Cash earns 2% per turn — safe but slow. Companies can earn much more. The trick: keep enough cash to buy opportunities (especially during downturns), but don't let too much sit idle while companies are thriving!"},
    {q:"How do I grow fastest?",mood:"excited",a:"Own lots of high-multiplier growth companies during booms. Rotate to defensive ones before recessions. Expand locations on your best earners. Use Wild Cards wisely. And always — ALWAYS — diversify across sectors!"},
  ],
};

// ── CHIP SVG ─────────────────────────────────────────────────────────────────
function Chip({size=80,mood="happy"}){
  const ex=mood==="excited",wo=mood==="worried",th=mood==="thinking";
  return(
    <svg width={size} height={Math.round(size*1.42)} viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cbd" x1=".15" y1="0" x2=".85" y2="1"><stop offset="0%" stopColor="#c8d6e5"/><stop offset="50%" stopColor="#8fa3b8"/><stop offset="100%" stopColor="#4a5568"/></linearGradient>
        <linearGradient id="chd" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stopColor="#dce8f2"/><stop offset="100%" stopColor="#7a8fa0"/></linearGradient>
        <radialGradient id="cey" cx="35%" cy="30%" r="70%"><stop offset="0%" stopColor="#bfdbfe"/><stop offset="50%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1d4ed8"/></radialGradient>
        <filter id="cgl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="csg"><feGaussianBlur stdDeviation="3.5"/></filter>
      </defs>
      <ellipse cx="60" cy="165" rx="28" ry="4" fill="rgba(0,0,0,0.15)"/>
      <rect x="42" y="143" width="15" height="18" rx="7" fill="#475569"/>
      <rect x="63" y="143" width="15" height="18" rx="7" fill="#475569"/>
      <rect x="40" y="156" width="19" height="5" rx="2.5" fill="#334155"/>
      <rect x="61" y="156" width="19" height="5" rx="2.5" fill="#334155"/>
      <rect x="29" y="88" width="62" height="57" rx="15" fill="url(#cbd)"/>
      <path d="M31 91 Q45 88 50 106 Q48 121 33 126 Q31 115 31 91Z" fill="rgba(255,255,255,.14)"/>
      <rect x="29" y="130" width="62" height="17" rx="15" fill="rgba(0,0,0,.12)"/>
      <path d="M17 92 L29 89 L29 102 L17 99Z" fill="#8396a7"/><path d="M91 89 L103 92 L103 99 L91 102Z" fill="#8396a7"/>
      <line x1="17" y1="93" x2="29" y2="90" stroke="rgba(96,165,250,.7)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="91" y1="90" x2="103" y2="93" stroke="rgba(96,165,250,.7)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="37" y="99" width="46" height="33" rx="9" fill="rgba(0,0,0,.38)"/>
      <rect x="39" y="101" width="42" height="29" rx="7" fill="rgba(2,12,42,.88)"/>
      {[[43,128,9],[50,122,15],[57,113,24],[64,118,19],[71,124,13]].map(([x,y,h],i)=>(
        <rect key={i} x={x} y={y} width="5.5" height={h} rx="2" fill={`rgba(96,165,250,${.5+i*.1})`}/>
      ))}
      <text x="60" y="109" textAnchor="middle" fill="rgba(147,197,253,.6)" fontSize="5.5" fontFamily="Nunito,sans-serif" fontWeight="800" letterSpacing=".5">PORTFOLIO</text>
      <rect x="47" y="79" width="26" height="12" rx="6" fill="#8396a7"/>
      <rect x="47" y="82" width="26" height="2.5" rx="1" fill="rgba(96,165,250,.5)"/>
      <rect x="47" y="87" width="26" height="2.5" rx="1" fill="rgba(96,165,250,.3)"/>
      <rect x="22" y="22" width="76" height="60" rx="20" fill="url(#chd)"/>
      <ellipse cx="40" cy="34" rx="22" ry="13" fill="rgba(255,255,255,.3)" transform="rotate(-12 40 34)"/>
      <rect x="10" y="34" width="14" height="24" rx="6" fill="#8396a7"/><rect x="12" y="38" width="6" height="16" rx="3" fill="rgba(96,165,250,.75)" filter="url(#cgl)"/>
      <rect x="96" y="34" width="14" height="24" rx="6" fill="#8396a7"/><rect x="96" y="38" width="6" height="16" rx="3" fill="rgba(96,165,250,.75)" filter="url(#cgl)"/>
      <rect x="26" y="40" width="68" height="34" rx="12" fill="rgba(0,8,30,.65)"/>
      <rect x="30" y="44" width="25" height="19" rx="8" fill="rgba(59,130,246,.18)" filter="url(#csg)"/>
      <rect x="65" y="44" width="25" height="19" rx="8" fill="rgba(59,130,246,.18)" filter="url(#csg)"/>
      <rect x="31" y="45" width="23" height="17" rx="7" fill="url(#cey)"/>
      <rect x="66" y="45" width="23" height="17" rx="7" fill="url(#cey)"/>
      <circle cx="42.5" cy="53.5" r="5.5" fill="#0c1445"/><circle cx="77.5" cy="53.5" r="5.5" fill="#0c1445"/>
      <circle cx="44.5" cy="51" r="2.5" fill="white" opacity=".9"/><circle cx="79.5" cy="51" r="2.5" fill="white" opacity=".9"/>
      <rect x="31" y="45" width="23" height="17" rx="7" fill="none" stroke="rgba(147,197,253,.55)" strokeWidth="1.5"/>
      <rect x="66" y="45" width="23" height="17" rx="7" fill="none" stroke="rgba(147,197,253,.55)" strokeWidth="1.5"/>
      <path d={ex?"M28 41 L39 35 L54 40":wo?"M28 44 L39 48 L54 44":th?"M29 38 L39 34 L54 40":"M29 42 L40 38 L54 42"} stroke="rgba(147,197,253,.95)" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#cgl)"/>
      <path d={ex?"M66 40 L81 35 L92 41":wo?"M66 44 L81 48 L92 44":th?"M66 41 L81 34 L92 38":"M66 42 L80 38 L91 42"} stroke="rgba(147,197,253,.95)" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#cgl)"/>
      <rect x="36" y="64" width="48" height="13" rx="6.5" fill="rgba(0,8,30,.5)"/>
      {wo?<path d="M40 72 Q60 67 80 72" stroke="rgba(147,197,253,.9)" strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#cgl)"/>
        :ex?<path d="M38 68 Q60 78 82 68" stroke="rgba(147,197,253,.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#cgl)"/>
        :th?<path d="M42 70 Q60 70 78 70" stroke="rgba(147,197,253,.9)" strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#cgl)"/>
        :<path d="M40 68 Q60 74 80 68" stroke="rgba(147,197,253,.9)" strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#cgl)"/>}
      {th&&<><circle cx="85" cy="57" r="3" fill="rgba(147,197,253,.8)" filter="url(#cgl)"/><circle cx="91" cy="50" r="4.5" fill="rgba(147,197,253,.6)" filter="url(#cgl)"/><circle cx="96" cy="42" r="6" fill="rgba(147,197,253,.4)" filter="url(#cgl)"/></>}
      <line x1="60" y1="22" x2="60" y2="11" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"/>
      <line x1="60" y1="13" x2="50" y2="5" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="60" y1="13" x2="70" y2="5" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="50" cy="5" r="4" fill="#60a5fa" filter="url(#cgl)"/><circle cx="70" cy="5" r="4" fill="#60a5fa" filter="url(#cgl)"/>
      <circle cx="50" cy="5" r="2" fill="#bfdbfe"/><circle cx="70" cy="5" r="2" fill="#bfdbfe"/>
      <path d={ex?"M29 96 Q13 82 11 67":"M29 97 Q13 109 15 123"} stroke="#8396a7" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <ellipse cx={ex?11:14} cy={ex?54:134} rx="6.5" ry="8" fill="#8396a7"/>
      <path d={ex?"M91 96 Q107 82 109 67":"M91 97 Q107 109 105 123"} stroke="#8396a7" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <ellipse cx={ex?109:103} cy={ex?54:134} rx="6.5" ry="8" fill="#8396a7"/>
    </svg>
  );
}

// ── SPARKLINE ─────────────────────────────────────────────────────────────────
function Spark({data,color="#22c55e",w=100,h=32,uid="s"}){
  if(!data||data.length<2) return null;
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1;
  const xs=w/(data.length-1);
  const pts=data.map((v,i)=>[i*xs, h-((v-min)/range)*(h-6)-3]);
  const p=pts.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const gid=`sg-${uid}`;
  return(
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block"}}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity=".35"/><stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <path d={p+` L${w} ${h} L0 ${h}Z`} fill={`url(#${gid})`}/>
      <path d={p} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="4" fill={color}/>
    </svg>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Modal({onClose,children,dark=false}){
  return(
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:dark?"linear-gradient(135deg,#1e1b4b,#1d4ed8)":"white",borderRadius:24,padding:"22px 20px",maxWidth:326,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.4)",color:dark?"white":"#1e293b"}}>
        {children}
      </div>
    </div>
  );
}

function SheetModal({onClose,children,title}){
  return(
    <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",zIndex:300,display:"flex",alignItems:"flex-end"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:"24px 24px 0 0",padding:"18px 18px 36px",width:"100%",boxShadow:"0 -8px 40px rgba(0,0,0,.25)"}}>
        <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:2,margin:"0 auto 14px"}}/>
        {title&&<div style={{fontSize:20,fontWeight:900,color:"#1e293b",marginBottom:16}}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

function Btn({onClick,label,color="#1D4ED8",disabled=false,style={}}){
  return(
    <button onClick={onClick} disabled={disabled} style={{padding:"14px",borderRadius:14,border:"none",background:disabled?"#e2e8f0":`linear-gradient(135deg,${color},${color}cc)`,color:disabled?"#94a3b8":"white",fontSize:15,fontWeight:900,cursor:disabled?"default":"pointer",fontFamily:'"Nunito",sans-serif',boxShadow:disabled?"none":`0 4px 14px ${color}50`,...style}}>
      {label}
    </button>
  );
}

function BottomNav({active,setTab}){
  const tabs=[{icon:"🏙️",label:"Empire"},{icon:"📰",label:"News"},{icon:"📊",label:"Market"},{icon:"🤖",label:"Chip"}];
  return(
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:68,background:"white",borderTop:"1px solid #e2e8f0",display:"flex",boxShadow:"0 -4px 20px rgba(0,0,0,.07)"}}>
      {tabs.map((t,i)=>(
        <div key={i} onClick={()=>setTab(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,paddingBottom:8,cursor:"pointer",position:"relative"}}>
          <div style={{fontSize:i===active?25:21}}>{t.icon}</div>
          <span style={{fontSize:12,fontWeight:800,color:i===active?"#1D4ED8":"#94a3b8"}}>{t.label}</span>
          {i===active&&<div style={{position:"absolute",bottom:5,width:22,height:3,borderRadius:2,background:"#1D4ED8"}}/>}
        </div>
      ))}
    </div>
  );
}

// ── SETUP: NAME ───────────────────────────────────────────────────────────────
function NameScreen({onNext}){
  const [name,setName]=useState("");
  const ok=name.trim().length>0;
  return(
    <div style={{height:"100%",background:"linear-gradient(160deg,#7c3aed 0%,#1D4ED8 55%,#0f172a 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 22px",gap:20,overflow:"hidden",position:"relative"}}>
      {[[40,30],[120,80],[220,20],[330,70],[355,140],[155,160],[260,190]].map(([x,y],i)=>(
        <div key={i} style={{position:"absolute",left:x,top:y,width:2.5,height:2.5,borderRadius:"50%",background:"white",opacity:.25+i*.03}}/>
      ))}
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:6,filter:"drop-shadow(0 4px 12px rgba(0,0,0,.4))"}}>🏙️</div>
        <div style={{fontSize:30,fontWeight:900,color:"white",lineHeight:1.1}}>Welcome to<br/><span style={{color:"#FCD34D"}}>Empire Builder!</span></div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.55)",marginTop:8,fontWeight:600}}>Start with $10M · Build to $1 Billion</div>
      </div>
      <div style={{background:"rgba(255,255,255,.97)",borderRadius:26,padding:"24px 22px",width:"100%",maxWidth:320,boxShadow:"0 20px 60px rgba(0,0,0,.35)"}}>
        <div style={{fontSize:17,fontWeight:900,color:"#1e293b",marginBottom:5}}>Name your empire 🏆</div>
        <div style={{fontSize:13,color:"#64748b",fontWeight:600,marginBottom:14}}>Shows on the winner's leaderboard</div>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ok&&onNext(name.trim())} placeholder='e.g. "Jason\'s Empire"'
          style={{width:"100%",padding:"15px 16px",borderRadius:14,border:`2px solid ${ok?"#1D4ED8":"#e2e8f0"}`,fontSize:17,fontWeight:700,color:"#1e293b",fontFamily:'"Nunito",sans-serif',outline:"none",boxSizing:"border-box",background:ok?"#eff6ff":"#f8fafc"}}/>
        <div style={{fontSize:12,color:"#94a3b8",fontWeight:600,marginTop:8,marginBottom:18}}>✏️ You can edit this anytime with the pencil button</div>
        <Btn onClick={()=>ok&&onNext(name.trim())} label={ok?`Let's go, ${name.trim()}! 🚀`:"Enter your empire name →"} disabled={!ok} style={{width:"100%"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Chip size={52} mood="excited"/>
        <div style={{background:"rgba(255,255,255,.13)",borderRadius:16,padding:"10px 14px",maxWidth:210,backdropFilter:"blur(4px)"}}>
          <div style={{fontSize:13,color:"white",fontWeight:700,lineHeight:1.55}}>"I'll be cheering you on every step of the way!" 🎉</div>
        </div>
      </div>
    </div>
  );
}

// ── SETUP: DIFFICULTY ─────────────────────────────────────────────────────────
function DifficultyScreen({onNext}){
  const [sel,setSel]=useState("normal");
  const levels=[
    {id:"easy",  icon:"🌱",label:"Easy",  c:"#22c55e",bg:"#f0fdf4",bc:"#86efac",perks:["3% cash interest/turn","More boom periods","More Wild Cards","Clearer news signals"]},
    {id:"normal",icon:"⚖️",label:"Normal",c:"#1D4ED8",bg:"#eff6ff",bc:"#bfdbfe",perks:["2% cash interest/turn","Balanced cycles","Standard Wild Cards","Realistic news signals"]},
    {id:"hard",  icon:"🔥",label:"Hard",  c:"#ef4444",bg:"#fef2f2",bc:"#fca5a5",perks:["1% cash interest/turn","More recessions","Company Disasters","Misleading headlines"]},
  ];
  return(
    <div style={{height:"100%",background:"linear-gradient(160deg,#1e1b4b 0%,#0a0a18 100%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 24px",overflow:"hidden",position:"relative"}}>
      {[[40,28],[200,18],[340,55],[355,140]].map(([x,y],i)=>(
        <div key={i} style={{position:"absolute",left:x,top:y,width:2,height:2,borderRadius:"50%",background:"white",opacity:.25}}/>
      ))}
      <Chip size={80} mood="happy"/><br/>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:22,fontWeight:900,color:"white",lineHeight:1.2}}>How tough do you<br/>want it? 💪</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:7,fontWeight:600}}>You can change this later in settings</div>
      </div>
      <div style={{width:"100%",maxWidth:330,display:"flex",flexDirection:"column",gap:12,flex:1,overflowY:"auto"}}>
        {levels.map(lv=>(
          <div key={lv.id} onClick={()=>setSel(lv.id)} style={{background:sel===lv.id?lv.bg:"rgba(255,255,255,.07)",border:`2px solid ${sel===lv.id?lv.bc:"rgba(255,255,255,.12)"}`,borderRadius:20,padding:"15px 16px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:46,height:46,borderRadius:14,background:sel===lv.id?lv.c:"rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{lv.icon}</div>
              <div style={{fontSize:18,fontWeight:900,color:sel===lv.id?lv.c:"rgba(255,255,255,.8)",flex:1}}>{lv.label}</div>
              {sel===lv.id&&<span style={{fontSize:18}}>✓</span>}
            </div>
            {sel===lv.id&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:12}}>
                {lv.perks.map(p=><div key={p} style={{background:"rgba(255,255,255,.55)",borderRadius:10,padding:"6px 9px",fontSize:12,fontWeight:700,color:"#1e293b"}}>✓ {p}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <Btn onClick={()=>onNext(sel)} label={`Start on ${levels.find(l=>l.id===sel).label} →`} style={{marginTop:16,width:"100%",maxWidth:330}}/>
    </div>
  );
}

// ── SETUP: CHIP INTRO ─────────────────────────────────────────────────────────
function IntroScreen({onDone}){
  const [step,setStep]=useState(0);
  const steps=[
    {mood:"excited",text:"Hey! I'm CHIP — your AI investing coach! I live right here in your game and I'm ready to help you build a BILLION-dollar empire! 🤖"},
    {mood:"happy",  text:"Each TURN you read the News, check your companies, and decide: buy, sell, or open a new location. After you're done — tap End Turn to collect profits! 📰"},
    {mood:"excited",text:"You start with $10 million. Buy companies, collect their profits every turn, and watch your wealth compound. Hit $1 BILLION to win! 🚀"},
    {mood:"thinking",text:"Watch the Economy and Sector trends — they affect every company you own. Booming = earn more. Recession = most companies struggle. But not all! 💡"},
    {mood:"excited",text:"Spread your money across different sectors. If one sector crashes, the others protect you. That's called diversification — the #1 investor skill. Let's go! 💰"},
  ];
  const cur=steps[step];
  return(
    <div style={{height:"100%",background:"linear-gradient(160deg,#1D4ED8 0%,#1e1b4b 60%,#0a0a1a 100%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 22px 24px",position:"relative",overflow:"hidden"}}>
      {[[30,22],[80,58],[200,18],[310,52],[355,112],[160,142],[58,182],[280,168]].map(([x,y],i)=>(
        <div key={i} style={{position:"absolute",left:x,top:y,width:2.5,height:2.5,borderRadius:"50%",background:"white",opacity:.25+i*.03}}/>
      ))}
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:12,color:"#93c5fd",fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",marginBottom:4}}>WELCOME TO</div>
        <div style={{fontSize:36,fontWeight:900,color:"white",lineHeight:1}}>EMPIRE</div>
        <div style={{fontSize:36,fontWeight:900,color:"#FCD34D",lineHeight:1.1}}>BUILDER</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginTop:6,fontWeight:600}}>$10M to start · $1 Billion to win</div>
      </div>
      <div style={{position:"relative",marginBottom:4}}>
        <div style={{position:"absolute",inset:-24,borderRadius:"50%",background:"radial-gradient(circle,rgba(96,165,250,.22) 0%,transparent 70%)"}}/>
        <Chip size={108} mood={cur.mood}/>
      </div>
      <div style={{background:"white",borderRadius:24,padding:"18px 20px",maxWidth:305,position:"relative",boxShadow:"0 8px 32px rgba(0,0,0,.35)",marginBottom:18}}>
        <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderBottom:"12px solid white"}}/>
        <div style={{fontSize:15,color:"#1e293b",lineHeight:1.65,fontWeight:700,textAlign:"center"}}>{cur.text}</div>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:18}}>
        {steps.map((_,i)=><div key={i} onClick={()=>setStep(i)} style={{width:i===step?22:8,height:8,borderRadius:4,background:i===step?"#FCD34D":"rgba(255,255,255,.25)",cursor:"pointer"}}/>)}
      </div>
      <button onClick={()=>step<steps.length-1?setStep(s=>s+1):onDone()} style={{background:step===steps.length-1?"linear-gradient(135deg,#22c55e,#15803d)":"linear-gradient(135deg,#FCD34D,#f59e0b)",color:step===steps.length-1?"white":"#1e1b4b",border:"none",borderRadius:20,padding:"15px 0",fontSize:16,fontWeight:900,cursor:"pointer",width:"100%",maxWidth:290,fontFamily:'"Nunito",sans-serif',boxShadow:"0 4px 20px rgba(0,0,0,.3)"}}>
        {step===steps.length-1?"🚀 Start Building My Empire!":"Got it! Keep going →"}
      </button>
    </div>
  );
}

// ── NEWS MODAL ─────────────────────────────────────────────────────────────────
function NewsModal({news,turn,onClose}){
  return(
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.65)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"white",borderRadius:24,width:"100%",maxWidth:340,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.4)"}}>
        <div style={{background:"linear-gradient(135deg,#1e1b4b,#1D4ED8)",padding:"18px 20px",color:"white"}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:"2px",opacity:.7,textTransform:"uppercase"}}>EMPIRE BUILDER NEWS</div>
          <div style={{fontSize:22,fontWeight:900,marginTop:2}}>📰 Turn {turn} Headlines</div>
        </div>
        <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:10,maxHeight:320,overflowY:"auto"}}>
          {news.map((item,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 12px",borderRadius:14,background:item.type==="macro"?"#f8fafc":item.type==="sector"?"#eff6ff":"#fff7ed",border:`1.5px solid ${item.type==="macro"?"#e2e8f0":item.type==="sector"?"#bfdbfe":"#fde68a"}`}}>
              <span style={{fontSize:20,flexShrink:0}}>{item.icon}</span>
              <div>
                <div style={{fontSize:10,fontWeight:800,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".5px",marginBottom:2}}>{item.type==="macro"?"Economy":item.type==="sector"?"Sector":"Company Gossip"}</div>
                <div style={{fontSize:14,fontWeight:700,color:"#1e293b",lineHeight:1.45}}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"12px 18px 20px"}}>
          <Btn onClick={onClose} label="Got it — let's invest! →" style={{width:"100%"}}/>
        </div>
      </div>
    </div>
  );
}

// ── WILD CARD MODAL ────────────────────────────────────────────────────────────
function WildCardModal({wc,onClose}){
  const good=wc.type==="good";
  return(
    <Modal onClose={()=>{}} dark>
      <div style={{textAlign:"center"}}>
        <Chip size={80} mood={good?"excited":"worried"}/>
        <div style={{fontSize:12,fontWeight:800,color:good?"#FCD34D":"#fca5a5",letterSpacing:"2px",textTransform:"uppercase",margin:"8px 0"}}>{good?"🃏 WILD CARD!":"💥 SETBACK!"}</div>
        <div style={{fontSize:18,fontWeight:900,color:"white",lineHeight:1.3,marginBottom:12}}>{wc.text}</div>
        <div style={{background:good?"rgba(134,239,172,.15)":"rgba(252,165,165,.15)",border:`1.5px solid ${good?"rgba(134,239,172,.4)":"rgba(252,165,165,.4)"}`,borderRadius:16,padding:"12px",marginBottom:20}}>
          <div style={{fontSize:15,fontWeight:800,color:good?"#86efac":"#fca5a5"}}>{good?"Unexpected upside! 🚀":"Tough break! Stay diversified 🛡️"}</div>
        </div>
        <Btn onClick={onClose} label={good?"That's amazing! 🎉":"Got it 😬"} color={good?"#22c55e":"#ef4444"} style={{width:"100%"}}/>
      </div>
    </Modal>
  );
}

// ── COMPANY CARD ──────────────────────────────────────────────────────────────
function CompanyCard({co,state,onBuy,onSell,onLocation,onBack,onWatchToggle}){
  const [flipped,setFlipped]=useState(false);
  const [badgePopup,setBadgePopup]=useState(null);
  const [actionConfirm,setActionConfirm]=useState(null); // {type,cost,label}
  const [infoPopup,setInfoPopup]=useState(null);

  const p=state.portfolio[co.id];
  const profit=state.profits[co.id];
  const mult=state.mults[co.id];
  const val=companyValue(co.id,state);
  const holdVal=myHoldingValue(co.id,state);
  const history=state.history[co.id]||[];
  const profitTrend=history.length>=2?((history[history.length-1]-history[history.length-2])/history[history.length-2]*100):0;
  const watched=state.watchlist.includes(co.id);
  const actionTaken=state.actionsTaken[co.id];
  const locCost=Math.round(val*co.locationCost);
  const canBuy=!p.owned && state.cash>=val && !actionTaken;
  const canSell=p.owned && !actionTaken;
  const canLoc=p.owned && p.locations<5 && state.cash>=locCost && !actionTaken;
  const totalGain=p.owned?(holdVal-p.purchasePrice+p.profitsCollected):0;

  const INFOS={
    profit:{title:"💰 Profit Per Turn",body:"How much money this company earns every single turn. As the owner, this goes straight into your bank! Higher profit = more cash for you each turn."},
    value:{title:"🏷️ Company Value",body:"What the whole company is worth right now. You pay this to buy it. If the value rises and you sell, you make a profit on top of all the profits you collected!"},
    mult:{title:"⭐ Value Multiplier",body:"Investors pay this many dollars for every $1 the company earns per turn. Higher = market expects big growth. Lower = market is pessimistic. Value = Profit × Multiplier."},
    stability:{title:"📊 Stability",body:"Shows how much this company swings with the economy. 1 dot = rock solid. 5 dots = wild ride. Higher stability = safer in downturns."},
  };

  const stabilityDots=co.profSens<=0.30?2:co.profSens<=0.50?3:co.profSens<=1.00?4:5;

  function confirmAction(type){
    if(type==="buy") setActionConfirm({type:"buy",cost:val,label:`Buy ${co.name}`,detail:`Cost: ${fmt(val)}`});
    else if(type==="sell") setActionConfirm({type:"sell",cost:null,label:`Sell ${co.name}`,detail:`You'll receive: ${fmt(holdVal)}`});
    else if(type==="location") setActionConfirm({type:"location",cost:locCost,label:`Open New Location`,detail:`Cost: ${fmt(locCost)} · Profit: +${fmt(Math.round(profit*co.locProfitBoost))}/turn`});
  }

  function doAction(){
    const t=actionConfirm.type;
    setActionConfirm(null);
    if(t==="buy") onBuy(co.id);
    else if(t==="sell") onSell(co.id);
    else if(t==="location") onLocation(co.id);
  }

  return(
    <div style={{height:"100%",background:"#EFF6FF",display:"flex",flexDirection:"column",overflowY:"auto",position:"relative"}}>
      {badgePopup&&(
        <Modal onClose={()=>setBadgePopup(null)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{fontSize:17,fontWeight:900,color:"#1e293b",flex:1}}>{badgePopup.icon} {badgePopup.label}</div>
            <div onClick={()=>setBadgePopup(null)} style={{cursor:"pointer",fontSize:20,color:"#94a3b8"}}>✕</div>
          </div>
          <div style={{fontSize:14,color:"#475569",lineHeight:1.72,fontWeight:600,marginBottom:14}}>{badgePopup.ex}</div>
          <div style={{display:"flex",alignItems:"center",gap:10,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
            <Chip size={38} mood="thinking"/><div style={{fontSize:13,color:"#1D4ED8",fontWeight:700}}>— Chip 🤖</div>
          </div>
        </Modal>
      )}
      {infoPopup&&(
        <Modal onClose={()=>setInfoPopup(null)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{fontSize:17,fontWeight:900,color:"#1e293b",flex:1}}>{INFOS[infoPopup].title}</div>
            <div onClick={()=>setInfoPopup(null)} style={{cursor:"pointer",fontSize:20,color:"#94a3b8"}}>✕</div>
          </div>
          <div style={{fontSize:14,color:"#475569",lineHeight:1.72,fontWeight:600,marginBottom:14}}>{INFOS[infoPopup].body}</div>
          <div style={{display:"flex",alignItems:"center",gap:10,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
            <Chip size={38} mood="happy"/><div style={{fontSize:13,color:"#1D4ED8",fontWeight:700}}>— Chip 🤖</div>
          </div>
        </Modal>
      )}
      {actionConfirm&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)",zIndex:200,display:"flex",alignItems:"flex-end"}}>
          <div style={{background:"white",borderRadius:"24px 24px 0 0",padding:"24px 20px 32px",width:"100%"}}>
            <div style={{width:40,height:4,background:"#e2e8f0",borderRadius:2,margin:"0 auto 18px"}}/>
            <div style={{fontSize:20,fontWeight:900,color:"#1e293b",marginBottom:16,textAlign:"center"}}>{actionConfirm.label}</div>
            <div style={{background:"#f8fafc",borderRadius:16,padding:"14px",marginBottom:18}}>
              <div style={{fontSize:15,fontWeight:700,color:"#1e293b",textAlign:"center"}}>{actionConfirm.detail}</div>
              {actionConfirm.type==="buy"&&<div style={{fontSize:13,color:"#64748b",fontWeight:600,marginTop:6,textAlign:"center"}}>Cash after: {fmt(state.cash-actionConfirm.cost)}</div>}
            </div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setActionConfirm(null)} style={{flex:1,padding:"14px",borderRadius:14,border:"2px solid #e2e8f0",background:"white",fontSize:15,fontWeight:800,color:"#64748b",cursor:"pointer",fontFamily:'"Nunito",sans-serif'}}>Cancel</button>
              <button onClick={doAction} style={{flex:2,padding:"14px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#1D4ED8,#1e40af)",fontSize:15,fontWeight:900,color:"white",cursor:"pointer",fontFamily:'"Nunito",sans-serif',boxShadow:"0 4px 14px rgba(29,78,216,.4)"}}>Confirm ✓</button>
            </div>
          </div>
        </div>
      )}

      <div style={{padding:"10px 12px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span onClick={onBack} style={{fontSize:14,color:"#64748b",fontWeight:700,cursor:"pointer"}}>← Back</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {p.owned&&!flipped&&<span style={{fontSize:12,color:"#1D4ED8",fontWeight:700,cursor:"pointer"}} onClick={()=>setFlipped(true)}>Details ›</span>}
            {flipped&&<span style={{fontSize:12,color:"#1D4ED8",fontWeight:700,cursor:"pointer"}} onClick={()=>setFlipped(false)}>‹ Card</span>}
            <span onClick={()=>onWatchToggle(co.id)} style={{fontSize:18,cursor:"pointer"}}>{watched?"🔖":"🏷️"}</span>
          </div>
        </div>

        {/* CARD */}
        <div style={{background:"white",borderRadius:26,border:`3px solid ${co.col}`,boxShadow:`0 8px 36px ${co.col}30`,overflow:"hidden"}}>
          {!flipped?(
            <>
              {/* Art */}
              <div style={{height:155,background:co.bg,position:"relative",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{position:"absolute",top:-30,left:-30,width:130,height:130,borderRadius:"50%",background:"rgba(255,255,255,.15)"}}/>
                <div style={{fontSize:78,filter:"drop-shadow(0 6px 18px rgba(0,0,0,.4))",zIndex:1,userSelect:"none"}}>{co.icon}</div>
                <div style={{position:"absolute",bottom:10,right:16,fontSize:26,opacity:.65,userSelect:"none"}}>{co.icon2}</div>
                {p.owned&&<div style={{position:"absolute",top:10,left:10,background:"#22c55e",borderRadius:20,padding:"5px 12px",color:"white",fontSize:12,fontWeight:800,boxShadow:"0 2px 8px rgba(34,197,94,.4)"}}>✓ Owned · {p.locations} location{p.locations>1?"s":""}</div>}
                {actionTaken&&<div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,.65)",borderRadius:14,padding:"5px 10px",fontSize:12,fontWeight:800,color:"white",backdropFilter:"blur(4px)"}}>✓ Actioned</div>}
              </div>
              {/* Body */}
              <div style={{padding:"14px 15px",display:"flex",flexDirection:"column",gap:11}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:22,fontWeight:900,color:"#1e293b"}}>{co.icon} {co.name}</span>
                    <span style={{fontSize:11,background:`${co.col}18`,color:co.col,padding:"3px 10px",borderRadius:10,fontWeight:800,textTransform:"capitalize"}}>{co.sector==="realestate"?"Real Estate":co.sector}</span>
                  </div>
                  <div style={{fontSize:13,color:"#64748b",fontStyle:"italic",marginTop:2,fontWeight:600}}>{co.tagline}</div>
                </div>
                {/* Badges */}
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".5px",marginBottom:7}}>Company Profile — tap any badge to learn more</div>
                  <div style={{display:"flex",gap:8}}>
                    {co.badges.map(bk=>{const b=BADGES[bk];return(
                      <div key={bk} onClick={()=>setBadgePopup(b)} style={{flex:1,background:b.bg,borderRadius:14,padding:"9px 6px",textAlign:"center",border:`1.5px solid ${b.c}30`,cursor:"pointer"}}>
                        <div style={{fontSize:20}}>{b.icon}</div>
                        <div style={{fontSize:11,fontWeight:800,color:b.c,marginTop:3,lineHeight:1.2}}>{b.label}</div>
                      </div>
                    );})}
                  </div>
                </div>
                {/* About */}
                <div style={{background:"#fafafa",borderRadius:14,padding:"11px 13px",borderLeft:`4px solid ${co.col}`}}>
                  <div style={{fontSize:13,fontWeight:800,color:"#92400e",textTransform:"uppercase",letterSpacing:".5px",marginBottom:5}}>About This Company</div>
                  <div style={{fontSize:14,color:"#374151",lineHeight:1.65,fontWeight:600}}>{co.about}</div>
                </div>
                {/* Stats */}
                <div style={{display:"flex",gap:8}}>
                  <div onClick={()=>setInfoPopup("profit")} style={{flex:1,background:"#f0fdf4",borderRadius:16,padding:"12px 10px",textAlign:"center",cursor:"pointer"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".4px"}}>Profit/Turn ⓘ</div>
                    <div style={{fontSize:24,fontWeight:900,color:"#22c55e",lineHeight:1.1,marginTop:3}}>{fmt(profit)}</div>
                    <div style={{fontSize:12,color:profitTrend>=0?"#22c55e":"#ef4444",fontWeight:700,marginTop:2}}>{profitTrend>=0?"▲":"▼"} {Math.abs(Math.round(profitTrend))}%</div>
                  </div>
                  <div onClick={()=>setInfoPopup("value")} style={{flex:1,background:"#eff6ff",borderRadius:16,padding:"12px 10px",textAlign:"center",cursor:"pointer"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".4px"}}>Value ⓘ</div>
                    <div style={{fontSize:24,fontWeight:900,color:"#1D4ED8",lineHeight:1.1,marginTop:3}}>{fmt(val)}</div>
                  </div>
                </div>
                {/* Value Multiplier */}
                <div onClick={()=>setInfoPopup("mult")} style={{background:"linear-gradient(135deg,#fef3c7,#fde68a)",borderRadius:16,padding:"12px 14px",display:"flex",alignItems:"center",gap:10,border:"2px solid #fbbf24",cursor:"pointer"}}>
                  <span style={{fontSize:24}}>⭐</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:".4px"}}>Value Multiplier ⓘ</div>
                    <div style={{fontSize:26,fontWeight:900,color:"#92400e",lineHeight:1}}>{Math.round(mult)}×</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,color:"#78350f",fontWeight:700,lineHeight:1.7}}>{fmt(profit)} × {Math.round(mult)}</div>
                    <div style={{fontSize:13,color:"#78350f",fontWeight:900}}>= {fmt(val)}</div>
                  </div>
                </div>
                {/* Trend */}
                <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:5,textTransform:"uppercase",letterSpacing:".4px"}}>Profit History</div>
                    <div style={{background:"#f0fdf4",borderRadius:12,padding:"8px 10px"}}><Spark data={history} color="#22c55e" w={150} h={36} uid={co.id}/></div>
                  </div>
                  <div onClick={()=>setInfoPopup("stability")} style={{textAlign:"center",cursor:"pointer"}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:5,textTransform:"uppercase",letterSpacing:".4px"}}>Stability ⓘ</div>
                    <div style={{display:"flex",gap:3,justifyContent:"center"}}>
                      {[1,2,3,4,5].map(j=><div key={j} style={{width:12,height:12,borderRadius:"50%",background:j<=stabilityDots?"#1D4ED8":"#e2e8f0"}}/>)}
                    </div>
                    <div style={{fontSize:11,color:"#1D4ED8",fontWeight:800,marginTop:4}}>{stabilityDots<=2?"Very Stable":stabilityDots===3?"Moderate":stabilityDots===4?"Volatile":"Very Wild"}</div>
                  </div>
                </div>
                {/* Actions */}
                <div style={{display:"flex",gap:8}}>
                  {!p.owned&&<Btn onClick={()=>canBuy&&confirmAction("buy")} label={`Buy · ${fmt(val)}`} disabled={!canBuy} style={{flex:2}}/>}
                  {p.owned&&<Btn onClick={()=>canSell&&confirmAction("sell")} label="Sell" color="#ef4444" disabled={!canSell} style={{flex:1}}/>}
                  {p.owned&&<Btn onClick={()=>canLoc&&confirmAction("location")} label={`+Location · ${fmt(locCost)}`} disabled={!canLoc} style={{flex:2,fontSize:13}}/>}
                </div>
                {actionTaken&&<div style={{textAlign:"center",fontSize:13,color:"#94a3b8",fontWeight:700}}>✓ Action taken this turn — wait for next turn</div>}
              </div>
            </>
          ):(
            /* BACK OF CARD */
            <div style={{padding:"14px 15px",display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:co.bg,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:40}}>{co.icon}</span>
                <div><div style={{fontSize:20,fontWeight:900,color:"white"}}>{co.name}</div><div style={{fontSize:13,opacity:.8,fontWeight:600,color:"white"}}>{p.locations} location{p.locations>1?"s":""} owned</div></div>
              </div>
              {/* Larger history */}
              <div>
                <div style={{fontSize:13,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".5px",marginBottom:7}}>Earnings History</div>
                <div style={{background:"#f0fdf4",borderRadius:14,padding:"10px 12px"}}><Spark data={history} color="#22c55e" w={305} h={52} uid={`${co.id}-b`}/></div>
              </div>
              {/* Location breakdown */}
              <div style={{background:"#eff6ff",borderRadius:16,padding:"13px 14px"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#1D4ED8",textTransform:"uppercase",letterSpacing:".5px",marginBottom:8}}>My Locations</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {Array.from({length:p.locations},(_,i)=>(
                    <div key={i} style={{background:"white",borderRadius:12,padding:"8px 10px",textAlign:"center",border:"2px solid #bfdbfe",minWidth:58}}>
                      <div style={{fontSize:18}}>{i===0?"🏢":"🏪"}</div>
                      <div style={{fontSize:11,fontWeight:800,color:"#1D4ED8",marginTop:3}}>{i===0?"HQ":`Branch ${i}`}</div>
                    </div>
                  ))}
                  {p.locations<5&&<div onClick={()=>canLoc&&confirmAction("location")} style={{background:"#f1f5f9",borderRadius:12,padding:"8px 10px",textAlign:"center",border:"2px dashed #cbd5e1",cursor:canLoc?"pointer":"default",minWidth:58,opacity:canLoc?1:.5}}>
                    <div style={{fontSize:18}}>➕</div><div style={{fontSize:10,fontWeight:800,color:"#94a3b8",marginTop:3}}>Open</div>
                  </div>}
                </div>
              </div>
              {/* Total gain breakdown */}
              <div style={{background:"#f0fdf4",borderRadius:16,padding:"14px 15px",border:"2px solid #86efac"}}>
                <div style={{fontSize:13,fontWeight:800,color:"#166534",textTransform:"uppercase",letterSpacing:".5px",marginBottom:10}}>My Investment</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[["I Paid",fmt(p.purchasePrice),"#475569"],["Value Today",fmt(holdVal),"#1D4ED8"],["Value Change",`${holdVal-p.purchasePrice>=0?"+":""}${fmt(holdVal-p.purchasePrice)}`,(holdVal-p.purchasePrice>=0?"#22c55e":"#ef4444")],["Profits Collected",`+${fmt(p.profitsCollected)}`,"#22c55e"]].map(([l,v,c])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:14,color:"#64748b",fontWeight:700}}>{l}</span>
                      <span style={{fontSize:15,fontWeight:900,color:c}}>{v}</span>
                    </div>
                  ))}
                  <div style={{height:2,background:"linear-gradient(90deg,transparent,#22c55e,transparent)",borderRadius:1}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"white",borderRadius:12,padding:"10px 12px"}}>
                    <span style={{fontSize:15,fontWeight:900,color:"#166534"}}>🎉 My Total Gain</span>
                    <span style={{fontSize:22,fontWeight:900,color:totalGain>=0?"#22c55e":"#ef4444"}}>{totalGain>=0?"+":""}{fmt(totalGain)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SECTOR VIEW ───────────────────────────────────────────────────────────────
function SectorView({sector,state,onSelect,onBack}){
  const companies=CO_LIST.filter(c=>c.sector===sector);
  const label=sector==="consumer"?"Consumer":"Real Estate";
  const sState=state.sectorState[sector];
  const stateCol={boom:"#22c55e",normal:"#f59e0b",downturn:"#ef4444"}[sState];
  const stateLabel={boom:"🟢 Booming",normal:"🟡 Steady",downturn:"🔴 Downturn"}[sState];
  return(
    <div style={{height:"100%",background:"#EFF6FF",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <div style={{background:"linear-gradient(135deg,#1D4ED8,#1e40af)",padding:"12px 16px",color:"white"}}>
        <span onClick={onBack} style={{fontSize:14,fontWeight:700,cursor:"pointer",opacity:.8}}>← Empire</span>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
          <div style={{fontSize:22,fontWeight:900}}>{label} Market</div>
          <div style={{fontSize:13,fontWeight:800,color:stateCol,background:`${stateCol}22`,padding:"5px 11px",borderRadius:12}}>{stateLabel}</div>
        </div>
      </div>
      <div style={{padding:"12px 14px 82px",display:"flex",flexDirection:"column",gap:11}}>
        {companies.map(co=>{
          const p=state.portfolio[co.id];
          const profit=state.profits[co.id];
          const val=companyValue(co.id,state);
          const history=state.history[co.id]||[];
          const trend=history.length>=2?((history[history.length-1]-history[history.length-2])/history[history.length-2]*100):0;
          return(
            <div key={co.id} onClick={()=>onSelect(co.id)} style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:"0 3px 16px rgba(0,0,0,.07)",border:`2px solid ${co.col}22`,cursor:"pointer"}}>
              <div style={{height:90,background:co.bg,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{position:"absolute",top:-20,left:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.12)"}}/>
                <span style={{fontSize:52,filter:"drop-shadow(0 4px 12px rgba(0,0,0,.35))",userSelect:"none"}}>{co.icon}</span>
                {p.owned&&<div style={{position:"absolute",top:8,left:8,background:"#22c55e",borderRadius:14,padding:"4px 10px",color:"white",fontSize:11,fontWeight:800}}>✓ {p.locations} location{p.locations>1?"s":""}</div>}
              </div>
              <div style={{padding:"11px 14px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:900,color:"#1e293b"}}>{co.icon} {co.name}</div>
                  <div style={{fontSize:12,color:"#64748b",fontStyle:"italic",fontWeight:600,marginTop:2}}>{co.tagline}</div>
                  <div style={{display:"flex",gap:6,marginTop:7}}>
                    {co.badges.slice(0,2).map(bk=>{const b=BADGES[bk];return(
                      <div key={bk} style={{fontSize:11,fontWeight:800,color:b.c,background:b.bg,padding:"3px 8px",borderRadius:8}}>{b.icon} {b.label}</div>
                    );})}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:11,color:"#94a3b8",fontWeight:700}}>PROFIT/TURN</div>
                  <div style={{fontSize:18,fontWeight:900,color:"#22c55e"}}>{fmt(profit)}</div>
                  <div style={{fontSize:11,color:trend>=0?"#22c55e":"#ef4444",fontWeight:700}}>{trend>=0?"▲":"▼"}{Math.abs(Math.round(trend))}%</div>
                  <div style={{fontSize:13,color:"#64748b",fontWeight:700,marginTop:2}}>Val: {fmt(val)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── EMPIRE TAB ────────────────────────────────────────────────────────────────
function EmpireTab({state,setState,setTab}){
  const [view,setView]=useState("home"); // home | sector | card
  const [activeSector,setActiveSector]=useState(null);
  const [activeCard,setActiveCard]=useState(null);
  const [editName,setEditName]=useState(false);
  const [tempName,setTempName]=useState(state.empireName);
  const [showLevels,setShowLevels]=useState(false);

  const nw=netWorth(state);

  const SECTORS=[
    {id:"consumer",   name:"Consumer",    icon:"🛍️",col:"#EA580C"},
    {id:"realestate", name:"Real Estate", icon:"🏠",col:"#1D4ED8"},
    ...LOCKED_SECTORS,
  ];
  const LEVELS=[
    {n:1,name:"Street Smart",   req:"Start",   nwReq:0,     done:true, c:"#22c55e"},
    {n:2,name:"City Mogul",     req:"$5M",     nwReq:5e6,   done:nw>=5e6, c:"#7C3AED"},
    {n:3,name:"Tech Pioneer",   req:"$25M",    nwReq:25e6,  done:nw>=25e6,c:"#0891B2"},
    {n:4,name:"Industrials Boss",req:"$100M",  nwReq:100e6, done:nw>=100e6,c:"#6B7280"},
    {n:5,name:"BILLIONAIRE!",   req:"$1B",     nwReq:1e9,   done:nw>=1e9, c:"#FCD34D"},
  ];
  const lvlPct=Math.min(100,nw>=25e6?100:nw>=5e6?50+(nw-5e6)/(20e6)*50:nw/5e6*50);

  function handleBuy(id){
    const val=companyValue(id,state);
    if(state.cash<val||state.portfolio[id].owned||state.actionsTaken[id]) return;
    setState(s=>({...s,cash:s.cash-val,portfolio:{...s.portfolio,[id]:{...s.portfolio[id],owned:true,locations:1,purchasePrice:val,profitsCollected:0,purchaseTurn:s.turn}},actionsTaken:{...s.actionsTaken,[id]:"bought"}}));
  }
  function handleSell(id){
    const val=myHoldingValue(id,state);
    if(!state.portfolio[id].owned||state.actionsTaken[id]) return;
    setState(s=>({...s,cash:s.cash+val,portfolio:{...s.portfolio,[id]:{...s.portfolio[id],owned:false,locations:1,purchasePrice:0,profitsCollected:0}},actionsTaken:{...s.actionsTaken,[id]:"sold"}}));
    setView("sector");
  }
  function handleLocation(id){
    const co=COS[id];
    const val=companyValue(id,state);
    const cost=Math.round(val*co.locationCost);
    if(state.cash<cost||!state.portfolio[id].owned||state.portfolio[id].locations>=5||state.actionsTaken[id]) return;
    setState(s=>{
      const locs=s.portfolio[id].locations+1;
      const newProfit=Math.round(s.profits[id]*(1+co.locProfitBoost));
      return{...s,cash:s.cash-cost,portfolio:{...s.portfolio,[id]:{...s.portfolio[id],locations:locs,purchasePrice:s.portfolio[id].purchasePrice+cost}},profits:{...s.profits,[id]:newProfit},actionsTaken:{...s.actionsTaken,[id]:"location"}};
    });
  }
  function handleWatch(id){
    setState(s=>({...s,watchlist:s.watchlist.includes(id)?s.watchlist.filter(x=>x!==id):[...s.watchlist,id]}));
  }

  if(view==="card"&&activeCard) return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",position:"relative"}}>
      <CompanyCard co={COS[activeCard]} state={state} onBuy={handleBuy} onSell={handleSell} onLocation={handleLocation} onBack={()=>setView("sector")} onWatchToggle={handleWatch}/>
      <BottomNav active={0} setTab={setTab}/>
    </div>
  );
  if(view==="sector"&&activeSector) return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",position:"relative"}}>
      <SectorView sector={activeSector} state={state} onSelect={id=>{setActiveCard(id);setView("card");}} onBack={()=>setView("home")}/>
      <BottomNav active={0} setTab={setTab}/>
    </div>
  );

  const ownedCount=CO_LIST.filter(c=>state.portfolio[c.id].owned).length;
  const economyCol={boom:"#22c55e",normal:"#f59e0b",recession:"#ef4444"}[state.economy];
  const economyLabel={boom:"Booming",normal:"Steady",recession:"Slowdown"}[state.economy];

  return(
    <div style={{height:"100%",background:"#EFF6FF",display:"flex",flexDirection:"column",position:"relative"}}>
      {showLevels&&(
        <SheetModal onClose={()=>setShowLevels(false)} title="Your Journey to $1B 🏆">
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {LEVELS.map(lv=>(
              <div key={lv.n} style={{display:"flex",alignItems:"center",gap:12,background:lv.done?lv.c+"18":"#f8fafc",borderRadius:16,padding:"12px 14px",border:`2px solid ${lv.done?lv.c+"40":"#e2e8f0"}`}}>
                <div style={{width:40,height:40,borderRadius:12,background:lv.done?lv.c:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:lv.done?"white":"#94a3b8",flexShrink:0}}>L{lv.n}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:900,color:lv.done?"#1e293b":"#94a3b8"}}>{lv.name}</div>
                  <div style={{fontSize:12,color:lv.done?"#64748b":"#94a3b8",fontWeight:600}}>{(LEVELS[lv.n-1]&&LEVELS[lv.n-1].desc)||""}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:900,color:lv.done?lv.c:"#94a3b8"}}>{lv.req}</div>
                  {lv.done&&<div style={{fontSize:11,color:lv.c,fontWeight:700}}>✓ Done</div>}
                </div>
              </div>
            ))}
          </div>
        </SheetModal>
      )}
      {editName&&(
        <Modal onClose={()=>setEditName(false)}>
          <div style={{fontSize:17,fontWeight:900,color:"#1e293b",marginBottom:12}}>Rename Your Empire ✏️</div>
          <input value={tempName} onChange={e=>setTempName(e.target.value)} style={{width:"100%",padding:"13px 14px",borderRadius:12,border:"2px solid #1D4ED8",fontSize:16,fontWeight:700,color:"#1e293b",fontFamily:'"Nunito",sans-serif',outline:"none",boxSizing:"border-box",marginBottom:14}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setEditName(false)} style={{flex:1,padding:"13px",borderRadius:12,border:"2px solid #e2e8f0",background:"white",fontSize:14,fontWeight:800,color:"#64748b",cursor:"pointer",fontFamily:'"Nunito",sans-serif'}}>Cancel</button>
            <button onClick={()=>{setState(s=>({...s,empireName:tempName.trim()||s.empireName}));setEditName(false);}} style={{flex:2,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1D4ED8,#1e40af)",fontSize:14,fontWeight:900,color:"white",cursor:"pointer",fontFamily:'"Nunito",sans-serif'}}>Save ✓</button>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#1D4ED8 0%,#1e40af 100%)",padding:"14px 16px 12px",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,opacity:.65,letterSpacing:"1.5px",textTransform:"uppercase"}}>EMPIRE BUILDER</div>
            <div style={{display:"flex",alignItems:"center",gap:7,marginTop:3}}>
              <span style={{fontSize:20,fontWeight:900}}>{state.empireName}</span>
              <span onClick={()=>{setTempName(state.empireName);setEditName(true);}} style={{fontSize:16,cursor:"pointer",opacity:.75}}>✏️</span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,fontWeight:700,opacity:.65,letterSpacing:"1px",textTransform:"uppercase"}}>NET WORTH</div>
            <div style={{fontSize:28,fontWeight:900,color:"#FCD34D",lineHeight:1}}>{fmt(nw)}</div>
            <div style={{fontSize:11,opacity:.55,fontWeight:600}}>Goal: $1 Billion</div>
          </div>
        </div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          <div style={{background:`rgba(${state.economy==="boom"?"34,197,94":state.economy==="recession"?"239,68,68":"245,158,11"},.2)`,borderRadius:20,padding:"6px 12px",display:"flex",alignItems:"center",gap:6,border:`1px solid rgba(${state.economy==="boom"?"34,197,94":state.economy==="recession"?"239,68,68":"245,158,11"},.35)`}}>
            <div style={{width:9,height:9,borderRadius:"50%",background:economyCol,boxShadow:`0 0 7px ${economyCol}`}}/>
            <span style={{fontSize:13,fontWeight:800}}>Economy: {economyLabel}</span>
          </div>
          <div style={{background:"rgba(255,255,255,.15)",borderRadius:20,padding:"6px 12px"}}>
            <span style={{fontSize:13,fontWeight:800}}>💵 {fmt(state.cash)}</span>
          </div>
          <div style={{background:"rgba(255,255,255,.1)",borderRadius:20,padding:"6px 12px"}}>
            <span style={{fontSize:13,fontWeight:800}}>⏱️ Turn {state.turn}</span>
          </div>
        </div>
      </div>

      {/* Level bar */}
      <div style={{padding:"10px 14px 0"}}>
        <div onClick={()=>setShowLevels(true)} style={{background:"white",borderRadius:16,padding:"10px 14px",boxShadow:"0 2px 10px rgba(0,0,0,.06)",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <span style={{fontSize:13,fontWeight:900,color:"#7C3AED"}}>L{state.level}: {LEVELS[state.level-1]&&LEVELS[state.level-1].name}</span>
            <span style={{fontSize:12,color:"#1D4ED8",fontWeight:800}}>All levels ›</span>
          </div>
          <div style={{height:8,background:"#f1f5f9",borderRadius:4,overflow:"hidden"}}>
            <div style={{width:`${lvlPct}%`,height:"100%",background:"linear-gradient(90deg,#22c55e,#7C3AED)",borderRadius:4,transition:"width .6s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            {["L1","L2","L3","L4","🏆"].map((l,i)=><span key={i} style={{fontSize:10,fontWeight:700,color:i<state.level?"#7C3AED":"#cbd5e1"}}>{l}</span>)}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {ownedCount>0&&(
        <div style={{padding:"8px 14px 0",display:"flex",gap:8}}>
          <div style={{flex:1,background:"white",borderRadius:14,padding:"10px 12px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Companies</div>
            <div style={{fontSize:20,fontWeight:900,color:"#1e293b"}}>{ownedCount}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:14,padding:"10px 12px",textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
            <div style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Profit/Turn</div>
            <div style={{fontSize:20,fontWeight:900,color:"#22c55e"}}>{fmt(CO_LIST.filter(c=>state.portfolio[c.id].owned).reduce((s,c)=>s+Math.round(state.profits[c.id]*locMultiplier(state.portfolio[c.id].locations)),0))}</div>
          </div>
        </div>
      )}

      {/* Sector tiles */}
      <div style={{flex:1,overflowY:"auto",padding:"10px 14px 82px",display:"flex",flexDirection:"column",gap:12}}>
        {SECTORS.map((sec,i)=>{
          const isLocked=LOCKED_SECTORS.find(l=>l.id===sec.id);
          const sectorCos=CO_LIST.filter(c=>c.sector===sec.id);
          const ownedInSec=sectorCos.filter(c=>state.portfolio[c.id]&&state.portfolio[c.id].owned).length;
          const sState=state.sectorState&&state.sectorState[sec.id];
          const sCol=sState==="boom"?"#22c55e":sState==="downturn"?"#ef4444":"#f59e0b";
          const sLabel=sState==="boom"?"🟢 Booming":sState==="downturn"?"🔴 Downturn":"🟡 Steady";
          if(isLocked){
            return(
              <div key={sec.id} style={{background:"#f8fafc",borderRadius:22,border:"2px solid #e2e8f0",opacity:.5,overflow:"hidden"}}>
                <div style={{padding:"18px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:56,height:56,borderRadius:17,background:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{sec.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:18,fontWeight:900,color:"#94a3b8"}}>{sec.name} Market</div>
                    <div style={{fontSize:14,color:"#94a3b8",fontWeight:700,marginTop:3}}>🔒 Unlocks at {sec.unlockAmount>=1e6?`$${sec.unlockAmount/1e6}M`:`$${sec.unlockAmount}`}</div>
                  </div>
                  <div style={{fontSize:24,opacity:.35}}>🔒</div>
                </div>
              </div>
            );
          }
          return(
            <div key={sec.id} onClick={()=>{setActiveSector(sec.id);setView("sector");}} style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:"0 3px 16px rgba(0,0,0,.07)",border:`2px solid ${sec.col}22`,cursor:"pointer"}}>
              <div style={{background:`linear-gradient(135deg,${sec.col}18 0%,${sec.col}08 100%)`,padding:"18px 18px",display:"flex",alignItems:"center",gap:14}}>
                {/* Icon with heat ring */}
                <div style={{position:"relative",width:56,height:56,flexShrink:0}}>
                  {ownedInSec>0&&<div style={{position:"absolute",inset:-5,borderRadius:20,boxShadow:`0 0 16px ${sec.col}80,0 0 32px ${sec.col}35`}}/>}
                  <div style={{width:56,height:56,borderRadius:17,background:sec.col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:`0 4px 14px ${sec.col}50`}}>{sec.icon}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:19,fontWeight:900,color:"#1e293b"}}>{sec.name} Market</div>
                  <div style={{fontSize:14,color:"#64748b",fontWeight:700,marginTop:3}}>
                    {ownedInSec>0?`${ownedInSec} ${ownedInSec===1?"company":"companies"} owned · tap to manage`:"Tap to explore companies"}
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:13,fontWeight:800,color:sCol,background:`${sCol}18`,padding:"5px 11px",borderRadius:12}}>{sLabel}</div>
                  <div style={{fontSize:12,color:"#94a3b8",fontWeight:600,marginTop:5}}>6 companies</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNav active={0} setTab={setTab}/>
    </div>
  );
}

// ── NEWS TAB ─────────────────────────────────────────────────────────────────
function NewsTab({state,setTab}){
  return(
    <div style={{height:"100%",background:"#EFF6FF",display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{background:"linear-gradient(135deg,#1e1b4b,#1D4ED8)",padding:"14px 16px 14px",color:"white"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:"2px",opacity:.7,textTransform:"uppercase"}}>EMPIRE BUILDER</div>
        <div style={{fontSize:22,fontWeight:900,marginTop:2}}>📰 Turn {state.turn} News</div>
        <div style={{fontSize:13,opacity:.65,fontWeight:600,marginTop:2}}>What's happening in the markets</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px 82px",display:"flex",flexDirection:"column",gap:11}}>
        {state.news.map((item,i)=>(
          <div key={i} style={{background:"white",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
            <div style={{padding:"3px 14px",background:item.type==="macro"?"#1e293b":item.type==="sector"?"#1D4ED8":"#EA580C",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:12}}>{item.icon}</span>
              <span style={{fontSize:11,fontWeight:800,color:"white",letterSpacing:".5px",textTransform:"uppercase"}}>{item.type==="macro"?"Economy":item.type==="sector"?"Sector":"Company Gossip"}</span>
            </div>
            <div style={{padding:"13px 15px"}}>
              <div style={{fontSize:15,fontWeight:800,color:"#1e293b",lineHeight:1.45}}>{item.text}</div>
              {item.type==="company"&&COS[item.company]&&<div style={{marginTop:8,fontSize:13,color:"#64748b",fontWeight:600}}>Mentioned: {COS[item.company].icon} {COS[item.company].name}</div>}
            </div>
          </div>
        ))}
        <div style={{background:"#fffbeb",borderRadius:16,padding:"12px 14px",display:"flex",gap:8,border:"1.5px solid #fde68a"}}>
          <Chip size={40} mood="thinking"/>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:800,color:"#92400e",marginBottom:3}}>Chip's Take</div>
            <div style={{fontSize:13,color:"#78350f",fontWeight:600,lineHeight:1.55}}>
              {state.economy==="boom"?"The economy is booming! Good time to own growth companies. Just don't forget to watch for signs of a slowdown."
               :state.economy==="recession"?"Recession mode! Stick with defensive companies like BurgerBlast and FreshMart. Cash is your friend right now."
               :"Markets are steady. A good time to research companies and plan your next move!"}
            </div>
          </div>
        </div>
      </div>
      <BottomNav active={1} setTab={setTab}/>
    </div>
  );
}

// ── MARKET TAB ────────────────────────────────────────────────────────────────
function MarketTab({state,setTab}){
  const nw=netWorth(state);
  const hist=state.netWorthHistory||[nw];
  const sConsumer=state.sectorState.consumer;
  const sRe=state.sectorState.realestate;
  const econCol={boom:"#22c55e",normal:"#f59e0b",recession:"#ef4444"}[state.economy];
  const econLabel={boom:"🟢 Booming",normal:"🟡 Steady",recession:"🔴 Slowdown"}[state.economy];
  return(
    <div style={{height:"100%",background:"#EFF6FF",display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{background:"linear-gradient(135deg,#1D4ED8,#1e40af)",padding:"14px 16px",color:"white"}}>
        <div style={{fontSize:22,fontWeight:900}}>📊 Market Overview</div>
        <div style={{fontSize:13,opacity:.65,fontWeight:600}}>Economy · Sectors · Your Net Worth</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px 82px",display:"flex",flexDirection:"column",gap:12}}>
        {/* Economy */}
        <div style={{background:"white",borderRadius:18,padding:"16px",boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".5px",marginBottom:10}}>Economy Status</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:52,height:52,borderRadius:16,background:econCol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:`0 4px 14px ${econCol}50`}}>🌍</div>
            <div>
              <div style={{fontSize:22,fontWeight:900,color:econCol}}>{econLabel}</div>
              <div style={{fontSize:13,color:"#64748b",fontWeight:600,marginTop:2}}>
                {state.economy==="boom"?"Most companies are earning more and their values are rising!"
                 :state.economy==="recession"?"Most companies are struggling. Defensive ones holding up better."
                 :"Stable conditions. Good time to research and plan!"}
              </div>
            </div>
          </div>
        </div>
        {/* Sectors */}
        <div style={{background:"white",borderRadius:18,padding:"16px",boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".5px",marginBottom:12}}>Sector Trends</div>
          {[{id:"consumer",name:"Consumer",icon:"🛍️",col:"#EA580C",state:sConsumer},{id:"realestate",name:"Real Estate",icon:"🏠",col:"#1D4ED8",state:sRe}].map(s=>{
            const c={boom:"#22c55e",normal:"#f59e0b",downturn:"#ef4444"}[s.state];
            return(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10,padding:"10px 12px",background:`${s.col}08`,borderRadius:14,border:`1.5px solid ${s.col}22`}}>
                <div style={{width:42,height:42,borderRadius:13,background:s.col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:900,color:"#1e293b"}}>{s.name}</div>
                </div>
                <div style={{fontSize:13,fontWeight:800,color:c,background:`${c}18`,padding:"5px 11px",borderRadius:12}}>
                  {{boom:"🟢 Booming",normal:"🟡 Steady",downturn:"🔴 Downturn"}[s.state]}
                </div>
              </div>
            );
          })}
        </div>
        {/* Net worth chart */}
        <div style={{background:"white",borderRadius:18,padding:"16px",boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>Net Worth History</div>
          <div style={{fontSize:26,fontWeight:900,color:"#1e293b",marginBottom:10}}>{fmt(nw)}</div>
          <div style={{background:"#f0fdf4",borderRadius:12,padding:"10px 12px"}}>
            <Spark data={hist} color="#22c55e" w={300} h={64} uid="nw"/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>Turn 1</span>
            <span style={{fontSize:12,color:"#22c55e",fontWeight:800}}>Now: {fmt(nw)}</span>
          </div>
        </div>
        {/* Interest rate info */}
        <div style={{background:"#fffbeb",borderRadius:16,padding:"12px 14px",display:"flex",gap:10,border:"1.5px solid #fde68a"}}>
          <span style={{fontSize:22}}>💵</span>
          <div>
            <div style={{fontSize:14,fontWeight:900,color:"#92400e"}}>Cash Interest Rate</div>
            <div style={{fontSize:13,color:"#78350f",fontWeight:600,lineHeight:1.55}}>Your cash earns {Math.round(interestRate(state.difficulty)*100)}% interest every turn. On {fmt(state.cash)}, that's {fmt(Math.round(state.cash*interestRate(state.difficulty)))} this turn — but investing in companies can earn much more!</div>
          </div>
        </div>
      </div>
      <BottomNav active={2} setTab={setTab}/>
    </div>
  );
}

// ── CHIP TAB ─────────────────────────────────────────────────────────────────
function ChipTab({state,setTab}){
  const [subTab,setSubTab]=useState("qa");
  const [cat,setCat]=useState("Basics");
  const [openQ,setOpenQ]=useState(null);
  const [search,setSearch]=useState("");
  const [openEQ,setOpenEQ]=useState(null);

  const allQA=Object.values(QA).flat();
  const filtered=search.length>1?allQA.filter(q=>q.q.toLowerCase().includes(search.toLowerCase())):null;
  const displayItems=filtered||QA[cat]||[];

  const nw=netWorth(state);
  const ownedCos=CO_LIST.filter(c=>state.portfolio[c.id].owned);
  const sectors=[...new Set(ownedCos.map(c=>c.sector))];
  const totalProfit=ownedCos.reduce((s,c)=>s+Math.round(state.profits[c.id]*locMultiplier(state.portfolio[c.id].locations)),0);
  const cashInterest=Math.round(state.cash*interestRate(state.difficulty));
  const turnsToNext=state.level<5?Math.ceil(((state.level===1?5e6:state.level===2?25e6:state.level===3?100e6:1e9)-nw)/Math.max(1,totalProfit+cashInterest)):0;

  const EMPIRE_QS=[
    {q:"How diversified am I?",icon:"🌐",a:()=>sectors.length===0?"You don't own any companies yet! Start by buying one in each sector.":sectors.length===1?`You own companies in just 1 sector (${sectors[0]==="consumer"?"Consumer":"Real Estate"}). Consider expanding into the other sector to protect yourself!`:`You own companies in ${sectors.length} sectors — good diversification! Different sectors protect each other when one struggles.`,mood:()=>sectors.length>=2?"excited":"worried"},
    {q:"How much do I earn per turn?",icon:"💰",a:()=>`Your companies earn ${fmt(totalProfit)} per turn, and your cash earns ${fmt(cashInterest)} interest. Total income per turn: ${fmt(totalProfit+cashInterest)}!`,mood:()=>"happy"},
    {q:"Which company is my best?",icon:"🏆",a:()=>{const best=ownedCos.reduce((b,c)=>{const g=(myHoldingValue(c.id,state)-state.portfolio[c.id].purchasePrice)+state.portfolio[c.id].profitsCollected;const bid=(b&&b.id)||"burgerblast";const bg=(myHoldingValue(bid,state)-state.portfolio[bid].purchasePrice)+state.portfolio[bid].profitsCollected;return(!b||g>bg)?c:b},null);if(!best) return "Buy a company first, then come back to see!";const gain=(myHoldingValue(best.id,state)-state.portfolio[best.id].purchasePrice)+state.portfolio[best.id].profitsCollected;return `Your best investment so far is ${best.name}! Total gain: ${fmt(gain)}. ${gain>0?"Nice pick!":"It's been tough, but watch for a turnaround."}`;},mood:()=>ownedCos.length>0?"excited":"thinking"},
    {q:"How many turns to next level?",icon:"📈",a:()=>state.level>=5?"You won! You're already a Billionaire! 🎉":turnsToNext<=0?"Almost there!!":`Based on your current income, roughly ${turnsToNext} more turns to Level ${state.level+1}. But your wealth compounds, so it'll happen faster than you think!`,mood:()=>state.level>=4?"excited":"thinking"},
    {q:"Is my portfolio too risky?",icon:"⚠️",a:()=>{const risky=ownedCos.filter(c=>c.profSens>1.0).length;const safe=ownedCos.filter(c=>c.profSens<=0.40).length;if(ownedCos.length===0) return "Buy some companies first!";if(risky>safe) return `You have ${risky} high-risk companies and only ${safe} defensive ones. Consider adding BurgerBlast or FreshMart for balance!`;return `Good balance! ${safe} defensive companies give you a solid foundation. ${risky>0?`Your ${risky} riskier pick${risky>1?"s":""} add some exciting upside.`:""}`},mood:()=>"thinking"},
    {q:"Should I open more locations?",icon:"🏪",a:()=>{const candidate=ownedCos.find(c=>state.portfolio[c.id].locations<5&&c.profSens<=0.50);if(!candidate) return ownedCos.length===0?"Buy a company first!":"All your companies are at max locations or too risky for expansion right now.";const cost=Math.round(companyValue(candidate.id,state)*candidate.locationCost);return `${candidate.name} looks great for expansion! A new location costs ${fmt(cost)} and adds ${fmt(Math.round(state.profits[candidate.id]*candidate.locProfitBoost))}/turn. Great ROI if you have the cash!`},mood:()=>"thinking"},
  ];

  return(
    <div style={{height:"100%",background:"#EFF6FF",display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{background:"linear-gradient(135deg,#1e1b4b 0%,#1D4ED8 100%)",padding:"14px 16px 0",color:"white"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <Chip size={48} mood={(openQ&&openQ.mood)||openEQ?"thinking":"happy"}/>
          <div><div style={{fontSize:20,fontWeight:900}}>Ask Chip</div><div style={{fontSize:13,opacity:.65,fontWeight:600}}>Your personal investing coach</div></div>
        </div>
        <div style={{display:"flex",background:"rgba(0,0,0,.2)",borderRadius:"14px 14px 0 0",overflow:"hidden"}}>
          {[{id:"qa",label:"🎓 Q&A Bank"},{id:"empire",label:"🏙️ My Empire"}].map(t=>(
            <div key={t.id} onClick={()=>{setSubTab(t.id);setOpenQ(null);setOpenEQ(null);}} style={{flex:1,padding:"11px",textAlign:"center",fontSize:14,fontWeight:800,cursor:"pointer",background:subTab===t.id?"white":"transparent",color:subTab===t.id?"#1D4ED8":"rgba(255,255,255,.7)",borderRadius:subTab===t.id?"12px 12px 0 0":"0"}}>{t.label}</div>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:78}}>
        {subTab==="qa"&&(
          <>
            <div style={{padding:"12px 14px 0"}}>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,pointerEvents:"none"}}>🔍</span>
                <input value={search} onChange={e=>{setSearch(e.target.value);setOpenQ(null);}} placeholder="Search any investing topic..."
                  style={{width:"100%",padding:"12px 14px 12px 42px",borderRadius:14,border:"2px solid #e2e8f0",fontSize:15,fontWeight:700,color:"#1e293b",fontFamily:'"Nunito",sans-serif',outline:"none",boxSizing:"border-box",background:"white"}}/>
              </div>
            </div>
            {!search&&(
              <div style={{padding:"10px 14px 0",display:"flex",gap:8,overflowX:"auto"}}>
                {Object.keys(QA).map(c=>(
                  <div key={c} onClick={()=>{setCat(c);setOpenQ(null);}} style={{padding:"7px 14px",borderRadius:22,flexShrink:0,background:cat===c?"#1D4ED8":"white",color:cat===c?"white":"#64748b",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:cat===c?"0 2px 8px rgba(29,78,216,.3)":"0 1px 4px rgba(0,0,0,.07)"}}>{c}</div>
                ))}
              </div>
            )}
            <div style={{padding:"10px 14px 0",display:"flex",flexDirection:"column",gap:8}}>
              {search&&<div style={{fontSize:13,color:"#94a3b8",fontWeight:700}}>{(filtered&&filtered.length)||0} results for "{search}"</div>}
              {displayItems.map((item,i)=>(
                <div key={i}>
                  <div onClick={()=>setOpenQ(openQ&&openQ.q===item.q?null:item)} style={{background:"white",borderRadius:openQ&&openQ.q===item.q?"16px 16px 0 0":"16px",padding:"14px 16px",cursor:"pointer",boxShadow:openQ&&openQ.q===item.q?"none":"0 2px 8px rgba(0,0,0,.05)",border:`2px solid ${openQ&&openQ.q===item.q?"#1D4ED8":"transparent"}`,borderBottom:openQ&&openQ.q===item.q?"none":"auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                    <span style={{fontSize:15,fontWeight:800,color:"#1e293b",lineHeight:1.35,flex:1}}>{item.q}</span>
                    <span style={{fontSize:18,flexShrink:0,transition:"transform .2s",display:"inline-block",transform:openQ&&openQ.q===item.q?"rotate(180deg)":"none"}}>⌄</span>
                  </div>
                  {openQ&&openQ.q===item.q&&(
                    <div style={{background:"#eff6ff",borderRadius:"0 0 16px 16px",padding:"14px 16px",border:"2px solid #1D4ED8",borderTop:"none",display:"flex",alignItems:"flex-start",gap:12}}>
                      <div style={{flexShrink:0,marginTop:2}}><Chip size={44} mood={item.mood}/></div>
                      <div style={{fontSize:14,color:"#1e293b",lineHeight:1.7,fontWeight:700}}>{item.a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {subTab==="empire"&&(
          <div style={{padding:"12px 14px 0",display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:"linear-gradient(135deg,#1e1b4b,#1D4ED8)",borderRadius:20,padding:"16px",display:"flex",gap:12,alignItems:"center",border:"1px solid rgba(96,165,250,.3)"}}>
              <Chip size={56} mood={openEQ?"thinking":"happy"}/>
              <div>
                <div style={{fontSize:15,fontWeight:900,color:"white",marginBottom:3}}>{openEQ?"Analyzing your empire...":"What do you want to know?"}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.6)",fontWeight:600}}>Tap a question for personalized advice!</div>
              </div>
            </div>
            {EMPIRE_QS.map((item,i)=>(
              <div key={i}>
                <div onClick={()=>setOpenEQ(openEQ&&openEQ.q===item.q?null:item)} style={{background:"white",borderRadius:openEQ&&openEQ.q===item.q?"16px 16px 0 0":"16px",padding:"15px 16px",cursor:"pointer",border:`2px solid ${openEQ&&openEQ.q===item.q?"#7C3AED":"transparent"}`,borderBottom:openEQ&&openEQ.q===item.q?"none":"auto",boxShadow:openEQ&&openEQ.q===item.q?"none":"0 2px 8px rgba(0,0,0,.05)",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:22,flexShrink:0}}>{item.icon}</span>
                  <span style={{fontSize:15,fontWeight:800,color:"#1e293b",flex:1}}>{item.q}</span>
                  <span style={{fontSize:18,flexShrink:0,display:"inline-block",transition:"transform .2s",transform:openEQ&&openEQ.q===item.q?"rotate(180deg)":"none"}}>⌄</span>
                </div>
                {openEQ&&openEQ.q===item.q&&(
                  <div style={{background:"#f5f3ff",borderRadius:"0 0 16px 16px",padding:"14px 16px",border:"2px solid #7C3AED",borderTop:"none",display:"flex",alignItems:"flex-start",gap:12}}>
                    <div style={{flexShrink:0}}><Chip size={44} mood={item.mood()}/></div>
                    <div style={{fontSize:14,color:"#1e293b",lineHeight:1.7,fontWeight:700}}>{item.a()}</div>
                  </div>
                )}
              </div>
            ))}
            <div style={{background:"#fef9c3",borderRadius:14,padding:"11px 14px",display:"flex",gap:8,border:"1px solid #fde68a"}}>
              <span style={{fontSize:15}}>💡</span>
              <div style={{fontSize:12,color:"#78350f",fontWeight:700,lineHeight:1.6}}>Chip uses your actual game data — decisions are always yours to make!</div>
            </div>
          </div>
        )}
      </div>
      <BottomNav active={3} setTab={setTab}/>
    </div>
  );
}

// ── WIN SCREEN ────────────────────────────────────────────────────────────────
function WinScreen({state,onRestart}){
  const nw=netWorth(state);
  const ownedCos=CO_LIST.filter(c=>state.portfolio[c.id].owned);
  const totalProfits=CO_LIST.reduce((s,c)=>s+state.portfolio[c.id].profitsCollected,0);
  return(
    <div style={{height:"100%",background:"linear-gradient(160deg,#1e1b4b,#1D4ED8 40%,#0a0a1a)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"28px 22px",textAlign:"center",overflowY:"auto",position:"relative"}}>
      {[[20,30],[100,60],[220,20],[330,70],[355,180],[60,220],[280,240]].map(([x,y],i)=>(
        <div key={i} style={{position:"absolute",left:x,top:y,width:3,height:3,borderRadius:"50%",background:"#FCD34D",opacity:.5+i*.04}}/>
      ))}
      <Chip size={110} mood="excited"/>
      <div style={{fontSize:13,fontWeight:800,color:"#FCD34D",letterSpacing:"2px",textTransform:"uppercase",marginTop:12,marginBottom:8}}>🎊 CONGRATULATIONS! 🎊</div>
      <div style={{fontSize:32,fontWeight:900,color:"white",lineHeight:1.1,marginBottom:4}}>YOU BUILT A</div>
      <div style={{fontSize:38,fontWeight:900,color:"#FCD34D",lineHeight:1}}>BILLION-DOLLAR</div>
      <div style={{fontSize:38,fontWeight:900,color:"#FCD34D",lineHeight:1.1,marginBottom:12}}>EMPIRE!</div>
      <div style={{fontSize:18,fontWeight:900,color:"white",marginBottom:20}}>{state.empireName}</div>
      <div style={{background:"rgba(255,255,255,.08)",borderRadius:24,padding:"20px",width:"100%",maxWidth:310,marginBottom:24,border:"1px solid rgba(252,211,77,.3)"}}>
        <div style={{fontSize:13,fontWeight:800,color:"#FCD34D",textTransform:"uppercase",letterSpacing:".5px",marginBottom:14}}>Final Stats</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Net Worth",fmt(nw)],["Turns Played",state.turn],["Companies",ownedCos.length],["Profits Earned",fmt(totalProfits)]].map(([l,v])=>(
            <div key={l} style={{background:"rgba(255,255,255,.1)",borderRadius:14,padding:"12px 10px"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:700,textTransform:"uppercase",letterSpacing:".4px"}}>{l}</div>
              <div style={{fontSize:20,fontWeight:900,color:"white",marginTop:2}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onRestart} style={{background:"linear-gradient(135deg,#FCD34D,#f59e0b)",color:"#1e1b4b",border:"none",borderRadius:20,padding:"16px",fontSize:16,fontWeight:900,cursor:"pointer",width:"100%",maxWidth:290,fontFamily:'"Nunito",sans-serif',boxShadow:"0 4px 20px rgba(252,211,77,.4)"}}>Play Again 🚀</button>
    </div>
  );
}

// ── END TURN BUTTON ───────────────────────────────────────────────────────────
function EndTurnBar({state,onEndTurn}){
  const profit=CO_LIST.filter(c=>state.portfolio[c.id].owned).reduce((s,c)=>s+Math.round(state.profits[c.id]*locMultiplier(state.portfolio[c.id].locations)),0);
  const interest=Math.round(state.cash*interestRate(state.difficulty));
  return(
    <div style={{position:"absolute",bottom:68,left:0,right:0,padding:"0 14px 8px",background:"linear-gradient(180deg,transparent 0%,#EFF6FF 30%)"}}>
      <button onClick={onEndTurn} style={{width:"100%",padding:"14px",borderRadius:20,border:"none",background:"linear-gradient(135deg,#22c55e,#15803d)",color:"white",fontSize:16,fontWeight:900,cursor:"pointer",fontFamily:'"Nunito",sans-serif',boxShadow:"0 4px 18px rgba(34,197,94,.45)",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
        <span>End Turn {state.turn} →</span>
        <span style={{fontSize:13,opacity:.85,fontWeight:700}}>Earn {fmt(profit+interest)}</span>
      </button>
    </div>
  );
}

// ── LOCKED SECTORS (referenced in EmpireTab) ──────────────────────────────────
const LOCKED_SECTORS=[
  {id:"entertainment",name:"Entertainment",icon:"🎭",col:"#7C3AED",unlockAmount:5e6},
  {id:"tech",          name:"Tech",          icon:"💻",col:"#0891B2",unlockAmount:25e6},
  {id:"industrials",   name:"Industrials",   icon:"⚙️",col:"#6B7280",unlockAmount:100e6},
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function EmpireBuilder(){
  const [setupPhase,setSetupPhase]=useState("name"); // name | difficulty | intro | game
  const [empireName,setEmpireName]=useState("");
  const [difficulty,setDifficulty]=useState("normal");
  const [gameState,setGameState]=useState(null);
  const [tab,setTab]=useState(0);

  function startGame(name,diff){
    const gs=initGame(name,diff);
    setGameState(gs);
    setSetupPhase("game");
  }

  function handleEndTurn(){
    setGameState(s=>{
      const next=resolveEndTurn(s);
      return next;
    });
    setTab(0); // back to empire after end turn
  }

  // ── SETUP FLOW ─────────────────────────────────────────────────────────────
  if(setupPhase==="name") return(
    <Frame><NameScreen onNext={name=>{setEmpireName(name);setSetupPhase("difficulty");}}/></Frame>
  );
  if(setupPhase==="difficulty") return(
    <Frame><DifficultyScreen onNext={diff=>{setDifficulty(diff);setSetupPhase("intro");}}/></Frame>
  );
  if(setupPhase==="intro") return(
    <Frame><IntroScreen onDone={()=>startGame(empireName,difficulty)}/></Frame>
  );
  if(!gameState) return <Frame><div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",background:"#EFF6FF"}}><div style={{fontSize:18,fontWeight:700,color:"#1D4ED8"}}>Loading...</div></div></Frame>;

  // ── GAME MODALS ────────────────────────────────────────────────────────────
  if(gameState.phase==="won") return(
    <Frame><WinScreen state={gameState} onRestart={()=>{setSetupPhase("name");setGameState(null);}}/></Frame>
  );
  if(gameState.phase==="wildcard"&&gameState.wildCard) return(
    <Frame>
      <WildCardModal wc={gameState.wildCard} onClose={()=>setGameState(s=>({...s,phase:"news"}))}/>
      <div style={{height:"100%",background:"#EFF6FF"}}/>
    </Frame>
  );
  if(gameState.phase==="news") return(
    <Frame>
      <NewsModal news={gameState.news} turn={gameState.turn} onClose={()=>setGameState(s=>({...s,phase:"actions"}))}/>
      <div style={{height:"100%",background:"#EFF6FF"}}/>
    </Frame>
  );

  // ── MAIN GAME ──────────────────────────────────────────────────────────────
  return(
    <Frame>
      <div style={{height:"100%",position:"relative",display:"flex",flexDirection:"column"}}>
        <div style={{flex:1,overflow:"hidden",position:"relative"}}>
          {tab===0&&<EmpireTab state={gameState} setState={setGameState} setTab={setTab}/>}
          {tab===1&&<NewsTab state={gameState} setTab={setTab}/>}
          {tab===2&&<MarketTab state={gameState} setTab={setTab}/>}
          {tab===3&&<ChipTab state={gameState} setTab={setTab}/>}
        </div>
        {/* End Turn button floats above bottom nav */}
        <EndTurnBar state={gameState} onEndTurn={handleEndTurn}/>
      </div>
    </Frame>
  );
}

// ── PHONE FRAME WRAPPER ───────────────────────────────────────────────────────
function Frame({children}){
  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 30% 0%,#1e1b4b,#050510 70%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"22px 16px 32px",fontFamily:'"Nunito",sans-serif'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:2px}`}</style>
      <div style={{color:"rgba(255,255,255,.35)",fontSize:12,fontWeight:800,letterSpacing:"2px",textTransform:"uppercase",marginBottom:18}}>🏙️ Empire Builder</div>
      <div style={{width:375,height:740,borderRadius:52,overflow:"hidden",position:"relative",boxShadow:"0 0 0 2px rgba(255,255,255,.06),0 0 0 10px rgba(0,0,0,.22),0 30px 80px rgba(0,0,0,.65)"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:38,background:"rgba(0,0,0,.3)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px"}}>
          <span style={{fontSize:13,fontWeight:800,color:"rgba(255,255,255,.85)"}}>9:41</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,.7)"}}>●●● 📶 🔋</span>
        </div>
        <div style={{position:"absolute",inset:0,paddingTop:38,height:"100%"}}>
          {children}
        </div>
      </div>
      <div style={{color:"rgba(255,255,255,.2)",fontSize:11,marginTop:14,textAlign:"center",fontWeight:600,maxWidth:360,lineHeight:1.6}}>
        Build from $10M → $1 Billion · Tap badges on company cards for Chip explanations
      </div>
    </div>
  );
}
