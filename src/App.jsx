import { useState, useEffect, useMemo, useCallback } from "react";

const fmt = v => v == null || isNaN(v) || v === "" ? "$0" : (v < 0 ? "-" : "") + "$" + Math.abs(Math.round(v)).toLocaleString("en-US");
const fmtP = v => v == null || isNaN(v) ? "0.0%" : (v * 100).toFixed(1) + "%";
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const p = v => parseFloat(v) || 0;

const QUOTES = [
  "The difference between ordinary and extraordinary is that little extra.",
  "Champions aren't made in the ring. They're made in the hours before.",
  "You don't have to be great to start, but you have to start to be great.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Hard work beats talent when talent doesn't work hard.",
  "Don't count the days. Make the days count.",
  "Every rep counts. Every call matters. Every day is a chance to close the gap.",
  "The scoreboard doesn't care about your excuses. Show up and produce.",
  "Pressure is a privilege. It means you're in the arena.",
  "Discipline is choosing between what you want now and what you want most.",
  "Your competition is training right now. What are you doing?",
  "Elite is not a talent level. It's a mindset.",
  "The pain of discipline weighs ounces. The pain of regret weighs tons.",
  "You are one presentation away from changing your month.",
  "Comfort zones are where ambition goes to die. Get uncomfortable.",
  "Nobody remembers second place in March. Push for the podium.",
  "Small daily improvements are the key to staggering long-term results.",
  "What you do today determines where you'll be tomorrow.",
];

/* ── URL Hash ────────────────────────────────────────────────────────── */
const KEYS=["n","py","d","bv","hbv","pbv","ls","b20","act","apt","pr","ps","acv","t5t","t5h","t5p","lk","ag","ab","as","ao","ah","ax"];
function readHash(){try{const h=window.location.hash.slice(1);if(!h)return{};const o={};h.split("&").forEach(p=>{const[k,v]=p.split("=").map(decodeURIComponent);if(k&&v!==undefined)o[k]=v});return o}catch{return{}}}
function writeHash(o){const parts=[];KEYS.forEach(k=>{const v=o[k];if(v!==undefined&&v!==""&&v!=="0"&&v!==false&&v!=="false")parts.push(encodeURIComponent(k)+"="+encodeURIComponent(v))});const h=parts.join("&");if(window.location.hash.slice(1)!==h)window.history.replaceState(null,"","#"+h)}

/* ── Avatar Data ─────────────────────────────────────────────────────── */
const SKIN_TONES=["#F5D0A9","#E8B88A","#D4956B","#B07050","#8B5E3C","#5C3A21"];
const OUTFIT_COLORS=["#c9a227","#52b788","#6c8ebf","#b07cc6","#e74c3c","#e8e8e8"];
const GENDERS=[{id:"male",label:"Male"},{id:"female",label:"Female"}];
const BODY_TYPES=[
  {id:"lean",label:"Lean",m:{sh:34,arm:7,wa:22,hip:24,th:10},f:{sh:30,arm:6,wa:20,hip:28,th:11}},
  {id:"athletic",label:"Athletic",m:{sh:38,arm:9,wa:24,hip:26,th:12},f:{sh:32,arm:7,wa:21,hip:30,th:12}},
  {id:"power",label:"Power",m:{sh:42,arm:12,wa:26,hip:27,th:11},f:{sh:35,arm:9,wa:23,hip:32,th:13}},
  {id:"tank",label:"Tank",m:{sh:44,arm:14,wa:28,hip:28,th:14},f:{sh:38,arm:11,wa:25,hip:34,th:15}},
];
const HAIR_STYLES=[
  {id:"buzz",label:"Buzz"},
  {id:"short",label:"Short"},
  {id:"medium",label:"Medium"},
  {id:"long",label:"Long"},
  {id:"ponytail",label:"Ponytail"},
  {id:"bun",label:"Bun"},
];
const ACC_OPTIONS=[
  {id:"headband",label:"Headband"},
  {id:"medal",label:"Medal"},
  {id:"wristbands",label:"Wristbands"},
  {id:"sunglasses",label:"Sunglasses"},
];

const AvatarSVG=({gender=0,body=0,skin=0,outfit=0,hair=0,accs=[],size=64})=>{
  const g=GENDERS[gender]||GENDERS[0];
  const bt=BODY_TYPES[body]||BODY_TYPES[0];
  const b=g.id==="female"?bt.f:bt.m;
  const sk=SKIN_TONES[skin]||SKIN_TONES[0];
  const oc=OUTFIT_COLORS[outfit]||OUTFIT_COLORS[0];
  const hs=HAIR_STYLES[hair]||HAIR_STYLES[0];
  const cx=50,headR=12;
  const hasAcc=id=>accs.includes(id);
  return(
    <svg viewBox="0 0 100 125" width={size} height={size*1.25} style={{display:"block"}}>
      {/* Legs */}
      <rect x={cx-b.th-2} y={84} width={b.th} height={28} rx={b.th/2} fill={sk}/>
      <rect x={cx+2} y={84} width={b.th} height={28} rx={b.th/2} fill={sk}/>
      {/* Shorts */}
      <rect x={cx-b.th-2} y={84} width={b.th} height={13} rx={3} fill={oc} opacity={0.7}/>
      <rect x={cx+2} y={84} width={b.th} height={13} rx={3} fill={oc} opacity={0.7}/>
      {/* Torso */}
      {g.id==="female"
        ?<path d={`M${cx-b.wa/2},86 L${cx-b.hip/2},76 L${cx-b.sh/2},52 Q${cx},48 ${cx+b.sh/2},52 L${cx+b.hip/2},76 L${cx+b.wa/2},86 Z`} fill={oc}/>
        :<path d={`M${cx-b.wa/2},86 L${cx-b.sh/2},52 Q${cx},48 ${cx+b.sh/2},52 L${cx+b.wa/2},86 Z`} fill={oc}/>
      }
      {/* Neck */}
      <rect x={cx-4} y={36} width={8} height={10} rx={3} fill={sk}/>
      {/* Arms */}
      <rect x={cx-b.sh/2-b.arm+2} y={52} width={b.arm} height={28} rx={b.arm/2} fill={sk}/>
      <rect x={cx+b.sh/2-2} y={52} width={b.arm} height={28} rx={b.arm/2} fill={sk}/>
      <rect x={cx-b.sh/2-b.arm+2} y={52} width={b.arm} height={8} rx={b.arm/2} fill={oc}/>
      <rect x={cx+b.sh/2-2} y={52} width={b.arm} height={8} rx={b.arm/2} fill={oc}/>
      {/* Head */}
      <circle cx={cx} cy={28} r={headR} fill={sk}/>
      {/* Hair */}
      {hs.id==="buzz"&&<path d={`M${cx-headR+1},28 A${headR-1},${headR-1} 0 1,1 ${cx+headR-1},28`} fill="#333" opacity={0.5}/>}
      {hs.id==="short"&&<path d={`M${cx-headR},28 A${headR},${headR} 0 1,1 ${cx+headR},28 L${cx+headR-2},18 Q${cx},12 ${cx-headR+2},18 Z`} fill="#333"/>}
      {hs.id==="medium"&&<><path d={`M${cx-headR},28 A${headR},${headR} 0 1,1 ${cx+headR},28 L${cx+headR-1},16 Q${cx},10 ${cx-headR+1},16 Z`} fill="#333"/><rect x={cx-headR-2} y={24} width={4} height={14} rx={2} fill="#333"/><rect x={cx+headR-2} y={24} width={4} height={14} rx={2} fill="#333"/></>}
      {hs.id==="long"&&<><path d={`M${cx-headR},28 A${headR},${headR} 0 1,1 ${cx+headR},28 L${cx+headR-1},16 Q${cx},10 ${cx-headR+1},16 Z`} fill="#333"/><rect x={cx-headR-2} y={22} width={4} height={28} rx={2} fill="#333"/><rect x={cx+headR-2} y={22} width={4} height={28} rx={2} fill="#333"/></>}
      {hs.id==="ponytail"&&<><path d={`M${cx-headR},28 A${headR},${headR} 0 1,1 ${cx+headR},28 L${cx+headR-1},16 Q${cx},10 ${cx-headR+1},16 Z`} fill="#333"/><ellipse cx={cx} cy={14} rx={4} ry={3} fill="#333"/><rect x={cx-2} y={14} width={4} height={16} rx={2} fill="#333" transform={`rotate(15,${cx},14)`}/></>}
      {hs.id==="bun"&&<><path d={`M${cx-headR},28 A${headR},${headR} 0 1,1 ${cx+headR},28 L${cx+headR-1},16 Q${cx},10 ${cx-headR+1},16 Z`} fill="#333"/><circle cx={cx} cy={13} r={5} fill="#333"/></>}
      {/* Eyes */}
      <circle cx={cx-4} cy={27} r={1.5} fill="#222"/>
      <circle cx={cx+4} cy={27} r={1.5} fill="#222"/>
      {/* Mouth */}
      <path d={`M${cx-3},32 Q${cx},35 ${cx+3},32`} fill="none" stroke="#222" strokeWidth={1} strokeLinecap="round"/>
      {/* Eyelashes for female */}
      {g.id==="female"&&<><line x1={cx-5.5} y1={25.5} x2={cx-6.5} y2={24.5} stroke="#222" strokeWidth={0.6}/><line x1={cx+5.5} y1={25.5} x2={cx+6.5} y2={24.5} stroke="#222" strokeWidth={0.6}/></>}
      {/* Accessories */}
      {hasAcc("headband")&&<rect x={cx-headR-1} y={20} width={headR*2+2} height={4} rx={2} fill={oc}/>}
      {hasAcc("sunglasses")&&<><rect x={cx-8} y={24} width={6} height={5} rx={2} fill="#111" stroke="#333" strokeWidth={0.5}/><rect x={cx+2} y={24} width={6} height={5} rx={2} fill="#111" stroke="#333" strokeWidth={0.5}/><line x1={cx-2} y1={26.5} x2={cx+2} y2={26.5} stroke="#333" strokeWidth={0.7}/></>}
      {hasAcc("medal")&&<><line x1={cx-3} y1={44} x2={cx} y2={55} stroke={oc} strokeWidth={1.5}/><line x1={cx+3} y1={44} x2={cx} y2={55} stroke={oc} strokeWidth={1.5}/><circle cx={cx} cy={57} r={4} fill="#c9a227" stroke="#8b6914" strokeWidth={1}/><text x={cx} y={59} textAnchor="middle" fontSize={4} fill="#0a0a0a" fontWeight={900}>1</text></>}
      {hasAcc("wristbands")&&<><rect x={cx-b.sh/2-b.arm+1} y={72} width={b.arm+2} height={4} rx={2} fill={oc}/><rect x={cx+b.sh/2-3} y={72} width={b.arm+2} height={4} rx={2} fill={oc}/></>}
      {/* Shoes */}
      <ellipse cx={cx-b.th/2-2} cy={114} rx={b.th/2+2} ry={4} fill="#333"/>
      <ellipse cx={cx+b.th/2+2} cy={114} rx={b.th/2+2} ry={4} fill="#333"/>
    </svg>
  );
};

/* ── Shared Components ───────────────────────────────────────────────── */
const BC="'Barlow Condensed',sans-serif";
const DM="'DM Sans',sans-serif";

const Badge=({label,s})=>{const C={Qualified:{bg:"linear-gradient(135deg,#c9a227,#e8d374)",c:"#1a1207",ic:"\u2605"},"On Pace":{bg:"linear-gradient(135deg,#2d6a4f,#52b788)",c:"#f0fff4",ic:"\u25B2"},"In Training":{bg:"linear-gradient(135deg,#6b3a2a,#c97b4b)",c:"#fff5ee",ic:"\u25C6"}}[s]||{bg:"#333",c:"#aaa",ic:"?"};return<div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",gap:3}}>{label&&<div style={{fontSize:9,color:"#666",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>{label}</div>}<span style={{display:"inline-flex",alignItems:"center",gap:5,background:C.bg,color:C.c,padding:"6px 14px",borderRadius:6,fontSize:13,fontWeight:700,letterSpacing:0.5,fontFamily:BC,textTransform:"uppercase"}}><span style={{fontSize:12}}>{C.ic}</span>{s}</span></div>};

const Bar=({cur,tgt,label,color="#c9a227",marker})=>{const pct=tgt>0?cl(cur/tgt,0,1.35):0;return<div style={{marginBottom:12}}>{label&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13,color:"#ccc",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}><span>{label}</span><span style={{color:"#e8e8e8",fontWeight:600}}>{(pct*100).toFixed(1)}%</span></div>}<div style={{position:"relative",height:12,background:"#1a1a1a",borderRadius:6}}><div style={{width:`${Math.min(pct,1)*100}%`,height:"100%",borderRadius:6,background:pct>=1?"linear-gradient(90deg,#c9a227,#e8d374)":`linear-gradient(90deg,${color}55,${color})`,transition:"width .7s cubic-bezier(.4,0,.2,1)",boxShadow:pct>=1?"0 0 12px #c9a22744":"none"}}/>{marker!=null&&<div style={{position:"absolute",left:`${cl(marker,0,1)*100}%`,top:-2,width:2,height:16,background:"#fff5",borderRadius:1}}/>}</div></div>};

const Card=({label,value,sub,accent})=><div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:"16px 18px",flex:"1 1 160px",minWidth:160}}><div style={{fontSize:12,color:"#bbb",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>{label}</div><div style={{fontSize:26,fontWeight:800,color:accent||"#e8e8e8",fontFamily:BC,lineHeight:1.1}}>{value}</div>{sub&&<div style={{fontSize:13,color:"#aaa",marginTop:5}}>{sub}</div>}</div>;

const Sec=({icon,title,sub,children})=><div style={{marginBottom:28}}><div style={{marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span style={{fontSize:18}}>{icon}</span><span style={{fontSize:20,fontWeight:800,color:"#e8e8e8",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.5}}>{title}</span></div>{sub&&<div style={{fontSize:14,color:"#aaa",paddingLeft:26}}>{sub}</div>}<div style={{height:1,background:"linear-gradient(90deg,#c9a22744,transparent)",marginTop:8}}/></div>{children}</div>;

const Field=({label,value,onChange,ph,pre,suf,locked})=>(
  <div style={{flex:"1 1 140px",minWidth:130}}>
    <label style={{display:"block",fontSize:11,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.2,marginBottom:5,fontWeight:600}}>{label}</label>
    <div style={{display:"flex",alignItems:"center",background:locked?"#0a0a0a":"#111",border:`2px solid ${locked?"#1a1a1a":"#333"}`,borderRadius:8,overflow:"hidden",transition:"border-color .2s",opacity:locked?0.6:1}}
      onFocus={e=>!locked&&(e.currentTarget.style.borderColor="#c9a227")}
      onBlur={e=>!locked&&(e.currentTarget.style.borderColor="#333")}>
      {pre&&<span style={{padding:"0 0 0 12px",color:"#999",fontSize:16,fontFamily:BC,fontWeight:700}}>{pre}</span>}
      <input type="number" value={value} onChange={e=>!locked&&onChange(e.target.value)} placeholder={ph||"0"} readOnly={locked}
        style={{flex:1,background:"transparent",border:"none",color:locked?"#666":"#fff",padding:"12px",fontSize:18,fontFamily:BC,fontWeight:700,outline:"none",MozAppearance:"textfield",WebkitAppearance:"none",width:"100%",cursor:locked?"not-allowed":"text"}}/>
      {suf&&<span style={{padding:"0 12px 0 0",color:"#999",fontSize:13,fontFamily:BC}}>{suf}</span>}
    </div>
  </div>
);

const TextField=({label,value,onChange,ph})=>(
  <div style={{flex:"1 1 200px",minWidth:180}}>
    <label style={{display:"block",fontSize:11,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.2,marginBottom:5,fontWeight:600}}>{label}</label>
    <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={ph||""}
      style={{width:"100%",background:"#111",border:"2px solid #333",borderRadius:8,color:"#fff",padding:"12px",fontSize:17,fontFamily:BC,fontWeight:700,outline:"none",boxSizing:"border-box",transition:"border-color .2s"}}
      onFocus={e=>e.target.style.borderColor="#c9a227"}
      onBlur={e=>e.target.style.borderColor="#333"}/>
  </div>
);

const GroupLabel=({children})=>(<div style={{fontSize:11,color:"#666",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8,marginTop:18,fontWeight:700,borderBottom:"1px solid #1a1a1a",paddingBottom:5}}>{children}</div>);

/* Picker: single-select */
const Pick=({label,options,value,onChange,renderOpt})=>(
  <div style={{marginBottom:10}}>
    <div style={{fontSize:10,color:"#888",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.2,marginBottom:5}}>{label}</div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
      {options.map((opt,i)=>(
        <div key={i} onClick={()=>onChange(i)} style={{cursor:"pointer",border:`2px solid ${value===i?"#c9a227":"#252525"}`,borderRadius:6,padding:3,background:value===i?"#1a1a0f":"#111",transition:"all .15s"}}>
          {renderOpt?renderOpt(opt,i):<div style={{padding:"3px 9px",fontSize:11,fontFamily:BC,color:value===i?"#c9a227":"#aaa",fontWeight:600,textTransform:"uppercase"}}>{opt.label||opt}</div>}
        </div>
      ))}
    </div>
  </div>
);

/* Toggle chip: multi-select */
const Chip=({label,active,onClick,color="#c9a227"})=>(
  <div onClick={onClick} style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:6,border:`2px solid ${active?color+"88":"#252525"}`,background:active?"#1a1a0f":"#111",transition:"all .15s"}}>
    <div style={{width:14,height:14,borderRadius:3,border:`2px solid ${active?color:"#444"}`,background:active?color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#0a0a0a",fontWeight:900}}>{active?"\u2713":""}</div>
    <span style={{fontSize:11,fontFamily:BC,color:active?color:"#aaa",fontWeight:600,textTransform:"uppercase"}}>{label}</span>
  </div>
);

/* ── Main App ────────────────────────────────────────────────────────── */
export default function App(){
  const initial=useMemo(()=>readHash(),[]);

  const[name,setName]=useState(initial.n||"");
  const[pyBl,setPyBl]=useState(initial.py||"");
  const[curDay,setCurDay]=useState(initial.d||"1");
  const[totalBV,setTotalBV]=useState(initial.bv||"");
  const[hBV,setHBV]=useState(initial.hbv||"");
  const[pBV,setPBV]=useState(initial.pbv||"");
  const[lsBV,setLsBV]=useState(initial.ls||"");
  const[bv20,setBv20]=useState(initial.b20||"");
  const[acts,setActs]=useState(initial.act||"");
  const[appts,setAppts]=useState(initial.apt||"");
  const[pres,setPres]=useState(initial.pr||"");
  const[presSale,setPresSale]=useState(initial.ps||"");
  const[acv,setAcv]=useState(initial.acv||"");
  const[t5t,setT5t]=useState(initial.t5t||"");
  const[t5h,setT5h]=useState(initial.t5h||"");
  const[t5p,setT5p]=useState(initial.t5p||"");
  const[locked110,setLocked110]=useState(initial.lk==="1");
  const[panelOpen,setPanelOpen]=useState(true);
  const[avatarOpen,setAvatarOpen]=useState(false);
  const[copied,setCopied]=useState(false);

  const handleShare=()=>{
    const url=window.location.href;
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)});
    }else{
      const t=document.createElement("textarea");t.value=url;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t);
      setCopied(true);setTimeout(()=>setCopied(false),2000);
    }
  };

  const[avGender,setAvGender]=useState(parseInt(initial.ag)||0);
  const[avBody,setAvBody]=useState(parseInt(initial.ab)||0);
  const[avSkin,setAvSkin]=useState(parseInt(initial.as)||0);
  const[avOutfit,setAvOutfit]=useState(parseInt(initial.ao)||0);
  const[avHair,setAvHair]=useState(parseInt(initial.ah)||0);
  const[avAccs,setAvAccs]=useState(()=>{try{return initial.ax?initial.ax.split(",").filter(Boolean):[]}catch{return[]}});

  const toggleAcc=id=>setAvAccs(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);

  const BU_MEDIAN=67120;
  const quote=useMemo(()=>QUOTES[Math.floor(Math.random()*QUOTES.length)],[]);

  const syncHash=useCallback(()=>{
    writeHash({n:name,py:pyBl,d:curDay,bv:totalBV,hbv:hBV,pbv:pBV,ls:lsBV,b20:bv20,act:acts,apt:appts,pr:pres,ps:presSale,acv,t5t,t5h,t5p,lk:locked110?"1":"",ag:String(avGender),ab:String(avBody),as:String(avSkin),ao:String(avOutfit),ah:String(avHair),ax:avAccs.join(",")});
  },[name,pyBl,curDay,totalBV,hBV,pBV,lsBV,bv20,acts,appts,pres,presSale,acv,t5t,t5h,t5p,locked110,avGender,avBody,avSkin,avOutfit,avHair,avAccs]);
  useEffect(()=>{syncHash()},[syncHash]);

  const QD=20,CD=31;
  const py=p(pyBl),med=BU_MEDIAN,day=Math.max(1,Math.min(31,Math.round(p(curDay))));
  const adj=Math.max(py,med),q110=adj*1.1,c120=adj*1.2;
  const tBV=p(totalBV),tH=p(hBV),tP=p(pBV),tLS=p(lsBV),t20=p(bv20);
  const wBV=tBV-tLS,pct=adj>0?wBV/adj:0;
  const d2q=Math.max(0,QD-day),d2c=Math.max(0,CD-day);

  const s110=locked110?"Qualified":(day<QD&&q110>0&&wBV/q110>=(day/QD)*0.85?"On Pace":"In Training");
  const s120=pct>=1.2?"Qualified":(c120>0&&wBV/c120>=(day/CD)*0.85?"On Pace":"In Training");
  const bonus=(locked110&&s120==="Qualified")?1200:(locked110?700:(s120==="Qualified"?500:0));

  const g2q=Math.max(0,q110-wBV),g2c=Math.max(0,c120-wBV);
  const drQ=d2q>0?g2q/d2q:(g2q>0?Infinity:0);
  const drC=d2c>0?g2c/d2c:(g2c>0?Infinity:0);
  const dAvg=day>0?wBV/day:0,pFin=dAvg*CD,p20proj=dAvg*QD;

  const nA=p(acts),nAp=p(appts),nPr=p(pres),nPS=p(presSale),nAcv=p(acv);
  const apptR=nA>0?nAp/nA:0,holdR=nAp>0?nPr/nAp:0,closeR=nPr>0?nPS/nPr:0;
  const projW=nPS*nAcv,wksR=d2c>0?d2c/7:0,behP=wBV+(projW*wksR);

  const v5t=p(t5t),v5h=p(t5h),v5p=p(t5p);
  const gPt=Math.max(0,v5t-wBV),gPh=Math.max(0,v5h-tH),gPp=Math.max(0,v5p-tP);
  const aCV=nAcv>0?nAcv:5000,cr=closeR>0?closeR:0.33;
  const cPt=gPt>0?Math.ceil(gPt/aCV):0,cPh=gPh>0?Math.ceil(gPh/aCV):0,cPp=gPp>0?Math.ceil(gPp/aCV):0;
  const prPt=cPt>0?Math.ceil(cPt/cr):0,prPh=cPh>0?Math.ceil(cPh/cr):0,prPp=cPp>0?Math.ceil(cPp/cr):0;

  return<div style={{minHeight:"100vh",background:"#0a0a0a",color:"#e8e8e8",fontFamily:DM}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}input[type=number]{-moz-appearance:textfield}::selection{background:#c9a22744}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#0a0a0a}::-webkit-scrollbar-thumb{background:#252525;border-radius:3px}@media(max-width:900px){.olympiad-layout{flex-direction:column!important}.olympiad-left{position:static!important;width:100%!important;max-height:none!important;max-width:100%!important}}`}</style>

    <header style={{background:"#0a0a0aee",backdropFilter:"blur(14px)",borderBottom:"1px solid #1a1a1a",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:8,background:"linear-gradient(135deg,#c9a227,#8b6914)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,fontFamily:BC,color:"#0a0a0a"}}>M</div>
        <div><div style={{fontSize:17,fontWeight:800,fontFamily:BC,textTransform:"uppercase",letterSpacing:2}}>March Olympiad</div><div style={{fontSize:11,color:"#666",fontFamily:BC,letterSpacing:1}}>PERFORMANCE INTELLIGENCE DASHBOARD</div></div>
      </div>
      <div style={{display:"flex",gap:16,alignItems:"center"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:800,fontFamily:BC,color:d2q<=3&&d2q>0?"#e74c3c":"#c9a227"}}>{d2q}</div><div style={{fontSize:9,color:"#666",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>to Elite Qualifier</div></div>
        <div style={{width:1,height:32,background:"#252525"}}/>
        <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:800,fontFamily:BC,color:d2c<=5&&d2c>0?"#e74c3c":"#52b788"}}>{d2c}</div><div style={{fontSize:9,color:"#666",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>to Championship</div></div>
      </div>
    </header>

    <div style={{background:"#0d0d0d",borderBottom:"1px solid #1a1a1a",padding:"10px 24px",textAlign:"center"}}>
      <div style={{fontSize:14,color:"#c9a227",fontFamily:BC,fontStyle:"italic",letterSpacing:0.5}}>"{quote}"</div>
    </div>

    {/* Action Bar */}
    <div style={{background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",padding:"10px 24px",display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
      <div onClick={()=>window.open("https://saileestrada.github.io/msbu-olympiad/#d=1","_blank")} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",background:"linear-gradient(135deg,#c9a227,#8b6914)",color:"#0a0a0a",borderRadius:6,fontSize:13,fontWeight:700,fontFamily:BC,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",transition:"opacity .2s"}}
        onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        + Start Fresh
      </div>
      <div onClick={handleShare} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 18px",background:copied?"#52b788":"#1a1a1a",border:"1px solid #333",color:copied?"#0a0a0a":"#e8e8e8",borderRadius:6,fontSize:13,fontWeight:700,fontFamily:BC,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",transition:"all .2s"}}
        onMouseEnter={e=>{if(!copied)e.currentTarget.style.borderColor="#c9a227"}}
        onMouseLeave={e=>{if(!copied)e.currentTarget.style.borderColor="#333"}}>
        {copied?"\u2713 Link Copied!":"Share Your Dashboard"}
      </div>
    </div>

    <div className="olympiad-layout" style={{display:"flex",gap:0,maxWidth:1400,margin:"0 auto"}}>

      {/* LEFT PANEL */}
      <div className="olympiad-left" style={{width:panelOpen?380:48,minWidth:panelOpen?340:48,flexShrink:0,position:"sticky",top:0,alignSelf:"flex-start",maxHeight:"100vh",overflowY:panelOpen?"auto":"hidden",background:"#0d0d0d",borderRight:"1px solid #1a1a1a",transition:"width .3s ease, min-width .3s ease"}}>
        <div onClick={()=>setPanelOpen(!panelOpen)} style={{padding:panelOpen?"12px 20px":"12px 0",display:"flex",alignItems:"center",justifyContent:panelOpen?"space-between":"center",cursor:"pointer",borderBottom:"1px solid #1a1a1a",background:"#111",transition:"padding .3s"}}>
          {panelOpen&&<span style={{fontSize:13,fontWeight:700,color:"#c9a227",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.5}}>Input Panel</span>}
          <span style={{fontSize:18,color:"#c9a227",fontWeight:700,fontFamily:BC,transform:panelOpen?"rotate(0deg)":"rotate(180deg)",transition:"transform .3s",display:"inline-block"}}>{"\u25BC"}</span>
        </div>

        {panelOpen&&<div style={{padding:"4px 20px 24px"}}>
          <GroupLabel>Athlete</GroupLabel>
          <TextField label="Name" value={name} onChange={setName} ph="First Name Only"/>

          {/* Avatar Builder */}
          <div onClick={()=>setAvatarOpen(!avatarOpen)} style={{marginTop:10,padding:"8px 12px",background:"#111",border:"1px solid #252525",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <AvatarSVG gender={avGender} body={avBody} skin={avSkin} outfit={avOutfit} hair={avHair} accs={avAccs} size={28}/>
              <span style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>Build Your Avatar</span>
            </div>
            <span style={{fontSize:14,color:"#666",transform:avatarOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",display:"inline-block"}}>{"\u25BC"}</span>
          </div>

          {avatarOpen&&<div style={{marginTop:8,padding:14,background:"#0a0a0a",border:"1px solid #1a1a1a",borderRadius:8}}>
            <div style={{display:"flex",gap:16,marginBottom:8,alignItems:"flex-start"}}>
              <div style={{background:"#111",borderRadius:10,padding:10,border:"1px solid #252525"}}>
                <AvatarSVG gender={avGender} body={avBody} skin={avSkin} outfit={avOutfit} hair={avHair} accs={avAccs} size={80}/>
              </div>
              <div style={{flex:1}}>
                <Pick label="Gender" options={GENDERS} value={avGender} onChange={setAvGender}/>
                <Pick label="Body Type" options={BODY_TYPES} value={avBody} onChange={setAvBody}/>
              </div>
            </div>
            <Pick label="Hair Style" options={HAIR_STYLES} value={avHair} onChange={setAvHair}/>
            <Pick label="Skin Tone" options={SKIN_TONES} value={avSkin} onChange={setAvSkin}
              renderOpt={(c,i)=><div style={{width:26,height:26,borderRadius:"50%",background:c}}/>}/>
            <Pick label="Outfit Color" options={OUTFIT_COLORS} value={avOutfit} onChange={setAvOutfit}
              renderOpt={(c,i)=><div style={{width:26,height:26,borderRadius:"50%",background:c}}/>}/>
            <div style={{marginBottom:4}}>
              <div style={{fontSize:10,color:"#888",fontFamily:BC,textTransform:"uppercase",letterSpacing:1.2,marginBottom:5}}>Accessories (pick multiple)</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {ACC_OPTIONS.map(a=><Chip key={a.id} label={a.label} active={avAccs.includes(a.id)} onClick={()=>toggleAcc(a.id)}/>)}
              </div>
            </div>
          </div>}

          <GroupLabel>Baseline</GroupLabel>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Field label="PY Weight (Mar 2025)" value={pyBl} onChange={setPyBl} pre="$"/>
            <Field label="BU Median Floor" value={BU_MEDIAN} onChange={()=>{}} pre="$" locked/>
          </div>
          <div style={{fontSize:11,color:"#666",marginTop:4,fontFamily:BC}}>
            (If PY Baseline is below ${BU_MEDIAN.toLocaleString()}, the median floor will be used as Training Weight)
          </div>
          <div style={{marginTop:10}}>
            <Field label="Current Day of March (1-31)" value={curDay} onChange={setCurDay}/>
          </div>

          <div style={{marginTop:12,padding:"10px 14px",background:"#0a0a0a",borderRadius:8,border:"1px solid #1a1a1a"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"4px 12px",fontSize:14,fontFamily:BC}}>
              <span style={{color:"#c9a227"}}>Training Weight</span><span style={{color:"#c9a227",fontWeight:700,textAlign:"right"}}>{fmt(adj)}</span>
              <span style={{color:"#bbb"}}>Elite Qualifier (110%)</span><span style={{color:"#ddd",fontWeight:600,textAlign:"right"}}>{fmt(q110)}</span>
              <span style={{color:"#bbb"}}>Championship (120%)</span><span style={{color:"#ddd",fontWeight:600,textAlign:"right"}}>{fmt(c120)}</span>
            </div>
          </div>

          <GroupLabel>Current Stats</GroupLabel>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Field label="Total" value={totalBV} onChange={setTotalBV} pre="$"/>
            <Field label="Max Rep (LS)" value={lsBV} onChange={setLsBV} pre="$"/>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:10}}>
            <Field label="Heritage" value={hBV} onChange={setHBV} pre="$"/>
            <Field label="PAF" value={pBV} onChange={setPBV} pre="$"/>
          </div>
          {day>=QD&&<div style={{marginTop:10}}><Field label="Weight as of Mar 20" value={bv20} onChange={setBv20} pre="$"/></div>}
          <div style={{fontSize:13,color:"#888",marginTop:8}}>Working BV = <span style={{color:"#e8e8e8",fontWeight:700}}>{fmt(wBV)}</span></div>

          <div style={{display:"flex",alignItems:"center",gap:12,marginTop:14,padding:"12px 14px",background:locked110?"#1a2e1a":"#111",border:`2px solid ${locked110?"#52b78866":"#252525"}`,borderRadius:8,transition:"all .3s",cursor:"pointer"}} onClick={()=>setLocked110(!locked110)}>
            <div style={{width:22,height:22,borderRadius:5,border:`2px solid ${locked110?"#c9a227":"#555"}`,background:locked110?"#c9a227":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",flexShrink:0}}>
              {locked110&&<span style={{color:"#0a0a0a",fontSize:15,fontWeight:900,lineHeight:1}}>{"\u2713"}</span>}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:locked110?"#c9a227":"#ccc",fontFamily:BC,textTransform:"uppercase",letterSpacing:0.8}}>
                {locked110?"\u2605 Elite Qualifier Locked":"Lock Elite Qualifier (110% by Mar 20)"}
              </div>
              <div style={{fontSize:12,color:locked110?"#52b788":"#666",marginTop:2}}>
                {locked110?"Earning $700. Hit Championship for $1,200 total.":"Check only when confirmed by March 20."}
              </div>
            </div>
          </div>

          <GroupLabel>Weekly Training Log</GroupLabel>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Field label="Prospects" value={acts} onChange={setActs}/>
            <Field label="Appts Booked" value={appts} onChange={setAppts}/>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:10}}>
            <Field label="Presentations" value={pres} onChange={setPres}/>
            <Field label="Pres. w/ Sale" value={presSale} onChange={setPresSale}/>
          </div>
          <div style={{marginTop:10}}>
            <Field label="Average Weight" value={acv} onChange={setAcv} pre="$"/>
          </div>

          <GroupLabel>Podium Thresholds</GroupLabel>
          <div style={{fontSize:12,color:"#666",marginBottom:8}}>Enter current Top 5 values from your manager</div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Field label="# 5 Heritage" value={t5h} onChange={setT5h} pre="$"/>
          </div>
          <div style={{marginTop:10}}>
            <Field label="# 5 PAF" value={t5p} onChange={setT5p} pre="$"/>
          </div>
        </div>}
      </div>

      {/* RIGHT PANEL */}
      <div style={{flex:1,padding:"20px 24px",minWidth:0}}>

        {name&&<div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{background:"#0a0a0a",borderRadius:10,padding:6,border:"1px solid #252525"}}>
              <AvatarSVG gender={avGender} body={avBody} skin={avSkin} outfit={avOutfit} hair={avHair} accs={avAccs} size={52}/>
            </div>
            <div style={{fontSize:22,fontWeight:800,fontFamily:BC}}>{name}</div>
          </div>
          <div style={{display:"flex",gap:12}}>
            <Badge label="Elite" s={s110}/>
            <Badge label="Championship" s={s120}/>
          </div>
        </div>}

        <Sec icon={"\u2B06"} title="Current Lift" sub="Where you stand and what you need per day">
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
            <Card label="Current Lift" value={fmt(wBV)} sub={`of ${fmt(adj)} training weight`}/>
            <Card label="Performance Delta" value={fmtP(pct)} sub={pct>=1?"Above baseline":`${fmt(adj-wBV)} to baseline`} accent={pct>=1?"#52b788":"#c9a227"}/>
            <Card label="Bonus Potential" value={`$${bonus.toLocaleString()}`} sub={bonus>=1200?"Elite + Championship earned":bonus===700?"Elite locked. Hit Championship for $1,200":bonus===500?"Championship only. Elite not locked":"No bonus yet"} accent="#52b788"/>
          </div>
          <div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16,marginBottom:16}}>
            <Bar cur={wBV} tgt={q110} label="Progress to Elite Qualifier (110%)" color="#c9a227"/>
            <Bar cur={wBV} tgt={c120} label="Progress to Championship Qualifier (120%)" color="#52b788" marker={c120>0?q110/c120:0}/>
            <Bar cur={tH} tgt={py>0?py*0.4:med*0.3} label="Heritage" color="#6c8ebf"/>
            <Bar cur={tP} tgt={py>0?py*0.6:med*0.5} label="PAF" color="#b07cc6"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginBottom:16}}>
            <div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16,textAlign:"center"}}>
              <div style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Daily Avg</div>
              <div style={{fontSize:30,fontWeight:800,fontFamily:BC}}>{fmt(dAvg)}</div>
              <div style={{fontSize:13,color:"#888"}}>per day so far</div>
            </div>
            <div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16,textAlign:"center"}}>
              <div style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Need per Day for Elite</div>
              <div style={{fontSize:30,fontWeight:800,fontFamily:BC,color:"#c9a227"}}>{drQ===Infinity?"\u2014":fmt(drQ)}</div>
              <div style={{fontSize:13,color:"#888"}}>{d2q>0?`${d2q} days to Mar 20`:"Elite deadline passed"}</div>
            </div>
            <div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16,textAlign:"center"}}>
              <div style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Need per Day for Championship</div>
              <div style={{fontSize:30,fontWeight:800,fontFamily:BC,color:"#52b788"}}>{drC===Infinity?"\u2014":fmt(drC)}</div>
              <div style={{fontSize:13,color:"#888"}}>{d2c>0?`${d2c} days to Mar 31`:"Championship day passed"}</div>
            </div>
          </div>
          <div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16,marginBottom:14}}>
              <div>
                <div style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>Projected at Mar 20</div>
                <div style={{fontSize:28,fontWeight:800,fontFamily:BC,color:"#c9a227"}}>{fmt(p20proj)}</div>
                <div style={{fontSize:13,color:"#aaa"}}>{p20proj>=q110?"On pace for Elite Qualifier":`${fmt(q110-p20proj)} short of Elite`}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>Projected Finish</div>
                <div style={{fontSize:28,fontWeight:800,fontFamily:BC,color:"#52b788"}}>{fmt(pFin)}</div>
                <div style={{fontSize:13,color:"#aaa"}}>{pFin>=c120?"Championship pace":pFin>=q110?"Elite pace, push for Championship":"Below Elite pace"}</div>
              </div>
            </div>
            <div style={{position:"relative",height:32,background:"#1a1a1a",borderRadius:6}}>
              <div style={{position:"absolute",left:`${c120>0?cl(adj/c120,0,1)*100:83.3}%`,top:0,bottom:0,width:1,background:"#333"}}><span style={{position:"absolute",top:-15,left:-14,fontSize:9,color:"#555",fontFamily:BC,whiteSpace:"nowrap"}}>100%</span></div>
              <div style={{position:"absolute",left:`${c120>0?cl(q110/c120,0,1)*100:91.7}%`,top:0,bottom:0,width:2,background:"#c9a22766"}}><span style={{position:"absolute",top:-15,left:-12,fontSize:9,color:"#c9a227",fontFamily:BC,whiteSpace:"nowrap"}}>Elite</span></div>
              <div style={{position:"absolute",right:0,top:0,bottom:0,width:2,background:"#52b78866"}}><span style={{position:"absolute",top:-15,right:-6,fontSize:9,color:"#52b788",fontFamily:BC}}>Champ</span></div>
              <div style={{width:`${c120>0?cl(wBV/c120,0,1)*100:0}%`,height:"100%",borderRadius:6,background:"linear-gradient(90deg,#c9a22722,#c9a22766)",transition:"width .6s"}}/>
              {pFin>0&&c120>0&&<div style={{position:"absolute",left:`${cl(pFin/c120,0,1)*100}%`,top:3,width:8,height:26,borderRadius:4,background:pFin>=c120?"#52b788":"#e74c3c",border:"2px solid #0a0a0a",opacity:0.85}}><span style={{position:"absolute",bottom:-15,left:-18,fontSize:9,color:pFin>=c120?"#52b788":"#e74c3c",fontFamily:BC,whiteSpace:"nowrap"}}>Projected</span></div>}
            </div>
          </div>
        </Sec>

        <Sec icon={"\uD83D\uDCCB"} title="Training Log" sub="What your weekly behaviors project">
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
            <Card label="Set Rate" value={fmtP(apptR)} sub="Appts / Activities" accent={apptR>0?"#6c8ebf":"#444"}/>
            <Card label="Hold Rate" value={fmtP(holdR)} sub="Pres. / Appts" accent={holdR>0?"#b07cc6":"#444"}/>
            <Card label="Conversion" value={fmtP(closeR)} sub="Sales / Pres." accent={closeR>0?"#e8e8e8":"#444"}/>
            <Card label="Weekly Output" value={fmt(projW)} sub={`${nPS} sales x ${fmt(nAcv)} avg contract`} accent={projW>0?"#e8e8e8":"#444"}/>
          </div>
          {projW>0&&<div style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16}}>
            <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:12,color:"#aaa",fontFamily:BC,textTransform:"uppercase",letterSpacing:1}}>Behavior-Projected Finish</div>
                <div style={{fontSize:36,fontWeight:800,fontFamily:BC,color:behP>=c120?"#52b788":behP>=q110?"#c9a227":"#e8e8e8"}}>{fmt(behP)}</div>
                <div style={{fontSize:14,color:"#aaa"}}>Current lift + weekly output x {wksR.toFixed(1)} weeks</div>
              </div>
              <div style={{flex:1,minWidth:200}}>
                <Bar cur={behP} tgt={c120} label="Behavior Projection vs Championship" color={behP>=c120?"#52b788":"#c9a227"} marker={c120>0?q110/c120:0}/>
              </div>
            </div>
            <div style={{fontSize:14,color:behP>=c120?"#52b788":behP>=q110?"#c9a227":"#e74c3c",fontFamily:BC,fontWeight:700,marginTop:10,textTransform:"uppercase",letterSpacing:0.5}}>
              {behP>=c120?"Your training puts you in Championship range. Keep this pace.":behP>=q110?"Tracking toward Elite. One more sale per week gets you to Championship.":"At this output, you'll fall short. Increase presentations or raise your average contract BV."}
            </div>
          </div>}
        </Sec>

        <Sec icon={"\uD83C\uDFC5"} title="Podium Push" sub="What it takes to reach Top 5">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
            {[{label:"Heritage",gap:gPh,cur:tH,thresh:v5h,contracts:cPh,pres:prPh,color:"#b07cc6",inP:tH>=v5h&&v5h>0},
              {label:"PAF",gap:gPp,cur:tP,thresh:v5p,contracts:cPp,pres:prPp,color:"#6c8ebf",inP:tP>=v5p&&v5p>0}
            ].map(pd=><div key={pd.label} style={{background:"#111",border:"1px solid #252525",borderRadius:10,padding:16}}>
              <div style={{fontSize:15,fontWeight:700,fontFamily:BC,textTransform:"uppercase",letterSpacing:1,color:pd.color,marginBottom:10}}>{pd.label} Podium</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"5px 16px",fontSize:14,fontFamily:BC,marginBottom:10}}>
                <span style={{color:"#bbb"}}>Your Current</span><span style={{color:"#ddd",fontWeight:600}}>{fmt(pd.cur)}</span>
                <span style={{color:"#bbb"}}>Top 5 Threshold</span><span style={{color:"#ddd",fontWeight:600}}>{pd.thresh>0?fmt(pd.thresh):"Not set"}</span>
                <span style={{color:pd.color}}>Distance</span><span style={{color:pd.color,fontWeight:700}}>{pd.thresh<=0?"Enter threshold":pd.inP?"On Podium":fmt(pd.gap)}</span>
              </div>
              {pd.thresh>0&&!pd.inP&&pd.gap>0&&<div style={{borderTop:"1px solid #1a1a1a",paddingTop:8,fontSize:14,fontFamily:BC}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"#bbb"}}>Contracts</span><span style={{color:"#ddd",fontWeight:700}}>{pd.contracts}</span></div>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#bbb"}}>Presentations</span><span style={{color:"#ddd",fontWeight:700}}>{pd.pres}</span></div>
                <div style={{fontSize:12,color:"#666",marginTop:6}}>Based on {fmt(aCV)} average contract BV and {fmtP(cr)} conversion</div>
              </div>}
              {pd.inP&&<div style={{fontSize:14,fontWeight:700,color:pd.color,fontFamily:BC,textTransform:"uppercase",textAlign:"center",padding:"8px 0"}}>On the podium. Defend it.</div>}
            </div>)}
          </div>
        </Sec>

        <div style={{textAlign:"center",padding:"20px 0 10px",borderTop:"1px solid #1a1a1a",marginTop:16}}>
          <div style={{fontSize:10,color:"#252525",fontFamily:BC,textTransform:"uppercase",letterSpacing:2}}>March Olympiad {"\u00B7"} Performance Intelligence System {"\u00B7"} Q1 2026</div>
        </div>
      </div>
    </div>
  </div>;
}
