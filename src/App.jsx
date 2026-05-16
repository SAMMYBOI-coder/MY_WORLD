import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CPTS_MODULES = [
  { id: 1, name: "Penetration Testing Process", category: "Methodology", xp: 250 },
  { id: 2, name: "Getting Started", category: "Methodology", xp: 250 },
  { id: 3, name: "Network Enumeration with Nmap", category: "Networking", xp: 250 },
  { id: 4, name: "Footprinting", category: "Networking", xp: 250 },
  { id: 5, name: "Information Gathering - Web Edition", category: "Networking", xp: 250 },
  { id: 6, name: "Vulnerability Assessment", category: "Methodology", xp: 250 },
  { id: 7, name: "File Transfers", category: "Shells", xp: 250 },
  { id: 8, name: "Shells & Payloads", category: "Shells", xp: 250 },
  { id: 9, name: "Using the Metasploit Framework", category: "Shells", xp: 250 },
  { id: 10, name: "Password Attacks", category: "Password", xp: 250 },
  { id: 11, name: "Attacking Common Services", category: "Password", xp: 250 },
  { id: 12, name: "Pivoting, Tunneling, and Port Forwarding", category: "Pivoting", xp: 250 },
  { id: 13, name: "Active Directory Enumeration & Attacks", category: "AD Attacks", xp: 250 },
  { id: 14, name: "Using Web Proxies", category: "Web Attacks", xp: 250 },
  { id: 15, name: "Attacking Web Applications with FFuf", category: "Web Attacks", xp: 250 },
  { id: 16, name: "Login Brute Forcing", category: "Password", xp: 250 },
  { id: 17, name: "SQL Injection Fundamentals", category: "Web Attacks", xp: 250 },
  { id: 18, name: "SQLMap Essentials", category: "Web Attacks", xp: 250 },
  { id: 19, name: "Cross-Site Scripting (XSS)", category: "Web Attacks", xp: 250 },
  { id: 20, name: "File Inclusion", category: "Web Attacks", xp: 250 },
  { id: 21, name: "File Upload Attacks", category: "Web Attacks", xp: 250 },
  { id: 22, name: "Command Injections", category: "Web Attacks", xp: 250 },
  { id: 23, name: "Web Attacks", category: "Web Attacks", xp: 250 },
  { id: 24, name: "Attacking Common Applications", category: "Web Attacks", xp: 250 },
  { id: 25, name: "Linux Privilege Escalation", category: "Linux", xp: 250 },
  { id: 26, name: "Windows Privilege Escalation", category: "Windows", xp: 250 },
  { id: 27, name: "Documentation & Reporting", category: "Reporting", xp: 250 },
  { id: 28, name: "Attacking Enterprise Networks", category: "Methodology", xp: 250 },
  { id: 29, name: "Linux Fundamentals", category: "Linux", xp: 250 },
  { id: 30, name: "Windows Fundamentals", category: "Windows", xp: 250 },
  { id: 31, name: "Introduction to Networking", category: "Networking", xp: 250 },
  { id: 32, name: "Web Requests", category: "Web Attacks", xp: 250 },
  { id: 33, name: "Introduction to Web Applications", category: "Web Attacks", xp: 250 },
  { id: 34, name: "Using CrackMapExec", category: "AD Attacks", xp: 250 },
  { id: 35, name: "Active Directory BloodHound", category: "AD Attacks", xp: 250 },
];

const CERT_PATHS = [
  {
    id: "ejpt", name: "eJPT", full: "eLearnSecurity Junior Penetration Tester",
    provider: "INE / eLearnSecurity", status: "achieved", achievedDate: "2024",
    color: "#22c55e", icon: "🏅", xpReward: 1000,
    description: "Entry-level penetration testing certification. Covers networking, web app basics, and host-based attacks.",
    skills: ["Network Scanning", "Web App Basics", "Host Attacks", "Pivoting"],
  },
  {
    id: "cpts", name: "CPTS", full: "Certified Penetration Testing Specialist",
    provider: "HackTheBox", status: "active", startDate: new Date().toISOString(),
    color: "#00ff88", icon: "⚡", xpReward: 5000,
    description: "Professional-grade pentest cert covering web, AD, network attacks and full engagement methodology.",
    skills: ["Web Attacks", "Active Directory", "Privilege Escalation", "Reporting"],
    modules: CPTS_MODULES,
  },
  {
    id: "cdsa", name: "CDSA", full: "Certified Defensive Security Analyst",
    provider: "HackTheBox", status: "planned", color: "#3b82f6", icon: "🛡️", xpReward: 5000,
    description: "Blue team focused cert. SOC analysis, SIEM, threat hunting, and incident response.",
    skills: ["SOC Analysis", "SIEM", "Threat Hunting", "Incident Response"],
  },
  {
    id: "cwee", name: "CWEE", full: "Certified Web Exploitation Expert",
    provider: "HackTheBox", status: "planned", color: "#f59e0b", icon: "🕷️", xpReward: 6000,
    description: "Advanced web exploitation covering complex injection chains, deserialization, and logic flaws.",
    skills: ["Advanced SQLi", "Deserialization", "SSRF Chains", "Race Conditions"],
  },
  {
    id: "cwes", name: "CWES", full: "Certified Web Exploitation Specialist",
    provider: "HackTheBox", status: "planned", color: "#f59e0b", icon: "🌐", xpReward: 4500,
    description: "Web security specialist path covering OWASP Top 10 and beyond in depth.",
    skills: ["XSS Chains", "Authentication Bypass", "Business Logic", "API Security"],
  },
  {
    id: "offshore", name: "Offshore", full: "HTB Pro Lab: Offshore",
    provider: "HackTheBox", status: "planned", color: "#8b5cf6", icon: "🌊", xpReward: 4000,
    description: "Active Directory focused Pro Lab. Multi-forest, real-world enterprise simulation.",
    skills: ["Multi-Forest AD", "Kerberoasting", "Trust Abuse", "C2 Frameworks"],
  },
  {
    id: "rastalabs", name: "RastaLabs", full: "HTB Pro Lab: RastaLabs",
    provider: "HackTheBox", status: "planned", color: "#ec4899", icon: "🌿", xpReward: 4000,
    description: "Red team focused Pro Lab. Evasion, persistence, and advanced post-exploitation.",
    skills: ["AV Evasion", "Persistence", "Lateral Movement", "Red Team Ops"],
  },
];

const DEFAULT_CTFS = [
  // CTF Competitions
  { id: "ctf_1", type: "competition", name: "PicoCTF 2024", platform: "PicoCTF", difficulty: "beginner", category: "Mixed", points: 0, solved: false, writeup: "", notes: "", url: "https://picoctf.org" },
  { id: "ctf_2", type: "competition", name: "NahamCon CTF 2024", platform: "NahamCon", difficulty: "easy", category: "Mixed", points: 0, solved: false, writeup: "", notes: "", url: "https://nahamcon.com" },
  { id: "ctf_3", type: "competition", name: "HTB Cyber Apocalypse 2024", platform: "HackTheBox", difficulty: "medium", category: "Mixed", points: 0, solved: false, writeup: "", notes: "", url: "https://ctf.hackthebox.com" },
  { id: "ctf_4", type: "competition", name: "TryHackMe Advent of Cyber", platform: "TryHackMe", difficulty: "beginner", category: "Mixed", points: 0, solved: false, writeup: "", notes: "", url: "https://tryhackme.com/christmas" },
  { id: "ctf_5", type: "competition", name: "CTFtime — Beginner Track", platform: "CTFtime", difficulty: "beginner", category: "Mixed", points: 0, solved: false, writeup: "", notes: "", url: "https://ctftime.org" },
  // HTB Machines
  { id: "htb_1", type: "machine", name: "Lame", platform: "HackTheBox", difficulty: "easy", category: "Linux", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Lame" },
  { id: "htb_2", type: "machine", name: "Blue", platform: "HackTheBox", difficulty: "easy", category: "Windows", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Blue" },
  { id: "htb_3", type: "machine", name: "Legacy", platform: "HackTheBox", difficulty: "easy", category: "Windows", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Legacy" },
  { id: "htb_4", type: "machine", name: "Jerry", platform: "HackTheBox", difficulty: "easy", category: "Windows", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Jerry" },
  { id: "htb_5", type: "machine", name: "Bashed", platform: "HackTheBox", difficulty: "easy", category: "Linux", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Bashed" },
  { id: "htb_6", type: "machine", name: "Nibbles", platform: "HackTheBox", difficulty: "easy", category: "Linux", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Nibbles" },
  { id: "htb_7", type: "machine", name: "Beep", platform: "HackTheBox", difficulty: "easy", category: "Linux", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Beep" },
  { id: "htb_8", type: "machine", name: "Cronos", platform: "HackTheBox", difficulty: "medium", category: "Linux", points: 30, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Cronos" },
  { id: "htb_9", type: "machine", name: "Solidstate", platform: "HackTheBox", difficulty: "medium", category: "Linux", points: 30, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/SolidState" },
  { id: "htb_10", type: "machine", name: "Active", platform: "HackTheBox", difficulty: "easy", category: "Windows/AD", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Active" },
  { id: "htb_11", type: "machine", name: "Forest", platform: "HackTheBox", difficulty: "easy", category: "Windows/AD", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Forest" },
  { id: "htb_12", type: "machine", name: "Sauna", platform: "HackTheBox", difficulty: "easy", category: "Windows/AD", points: 20, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Sauna" },
  { id: "htb_13", type: "machine", name: "Monteverde", platform: "HackTheBox", difficulty: "medium", category: "Windows/AD", points: 30, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Monteverde" },
  { id: "htb_14", type: "machine", name: "Cascade", platform: "HackTheBox", difficulty: "medium", category: "Windows/AD", points: 30, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/machines/Cascade" },
  // HTB Challenges
  { id: "chal_1", type: "challenge", name: "Weak RSA", platform: "HackTheBox", difficulty: "easy", category: "Crypto", points: 10, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/challenges" },
  { id: "chal_2", type: "challenge", name: "You know 0xDiablos", platform: "HackTheBox", difficulty: "easy", category: "Pwn", points: 10, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/challenges" },
  { id: "chal_3", type: "challenge", name: "Templated", platform: "HackTheBox", difficulty: "easy", category: "Web", points: 10, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/challenges" },
  { id: "chal_4", type: "challenge", name: "Injection", platform: "HackTheBox", difficulty: "easy", category: "Web", points: 10, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/challenges" },
  { id: "chal_5", type: "challenge", name: "Litter", platform: "HackTheBox", difficulty: "medium", category: "Forensics", points: 30, solved: false, writeup: "", notes: "", url: "https://app.hackthebox.com/challenges" },
];

const LEVEL_THRESHOLDS = [0,100,300,600,1000,1500,2100,2800,3600,4500,5500,6600,7800,9100,10500,12000,13600,15300,17100,19000,21000,23100,25300,27600,30000];
const RANKS = [
  { min:1,max:2, name:"Script Kiddie", color:"#6b7280" },
  { min:3,max:5, name:"Greenhorn", color:"#22c55e" },
  { min:6,max:9, name:"Junior Pentester", color:"#3b82f6" },
  { min:10,max:14, name:"Security Analyst", color:"#8b5cf6" },
  { min:15,max:19, name:"Senior Analyst", color:"#f59e0b" },
  { min:20,max:24, name:"Red Team Operator", color:"#ef4444" },
  { min:25,max:99, name:"Elite Hacker", color:"#00ff88" },
];

const DIFF_COLOR = { beginner:"#22c55e", easy:"#22c55e", medium:"#f59e0b", hard:"#ef4444", insane:"#ff00ff" };
const TYPE_ICON = { machine:"🖥️", challenge:"⚔️", competition:"🏁" };
const CAT_COLOR = {
  "Web Attacks":"#00ff88","Networking":"#00cfff","Linux":"#ffaa00","Windows":"#4488ff",
  "AD Attacks":"#ff4488","Reporting":"#cc88ff","Methodology":"#88ccff",
  "Shells":"#ff8844","Password":"#ff4444","Pivoting":"#44ffaa",
};

const INITIAL_STATE = {
  // CPTS progress
  cpts_completed: [], cpts_notes: {}, cpts_dates: {},
  // Certs
  cert_notes: {}, cert_customDates: {},
  // CTFs (merged with defaults)
  ctfs: DEFAULT_CTFS,
  // Global XP bonuses
  bonusXP: 0,
  startDate: new Date().toISOString(),
  globalNotes: "",
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("hacker_os_v2"));
    if (!saved) return INITIAL_STATE;
    // Merge new default CTFs not in saved
    const existingIds = new Set((saved.ctfs || []).map(c => c.id));
    const newDefaults = DEFAULT_CTFS.filter(c => !existingIds.has(c.id));
    return { ...INITIAL_STATE, ...saved, ctfs: [...(saved.ctfs || []), ...newDefaults] };
  } catch { return INITIAL_STATE; }
}
function saveState(s) { localStorage.setItem("hacker_os_v2", JSON.stringify(s)); }

// ─── CALC HELPERS ─────────────────────────────────────────────────────────────

function getTotalXP(state) {
  const cptsXP = state.cpts_completed.reduce((s, id) => {
    const m = CPTS_MODULES.find(x => x.id === id);
    return s + (m ? m.xp : 0);
  }, 0);
  const ejptXP = 1000; // already achieved
  const ctfXP = (state.ctfs || []).filter(c => c.solved).reduce((s, c) => s + (c.points || 10), 0);
  return cptsXP + ejptXP + ctfXP + (state.bonusXP || 0);
}
function getLevel(xp) {
  let lv = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) { if (xp >= LEVEL_THRESHOLDS[i]) lv = i+1; else break; }
  return Math.min(lv, 25);
}
function getRank(lv) { return RANKS.find(r => lv >= r.min && lv <= r.max) || RANKS[0]; }
function getCPTSPct(state) {
  return Math.round((state.cpts_completed.length / CPTS_MODULES.length) * 100);
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

function XPBar({ xp, level }) {
  const cur = LEVEL_THRESHOLDS[level-1] || 0;
  const nxt = LEVEL_THRESHOLDS[level] || 30000;
  const pct = level >= 25 ? 100 : Math.round(((xp - cur) / (nxt - cur)) * 100);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#3a6a4a", marginBottom:3, fontFamily:"'Courier New',monospace" }}>
        <span>{xp.toLocaleString()} XP</span>
        <span>{level < 25 ? `→ Lv.${level+1} at ${nxt.toLocaleString()}` : "MAX"}</span>
      </div>
      <div style={{ height:6, background:"#060f0a", borderRadius:3, overflow:"hidden", border:"1px solid #0d2a1a" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#003322,#00ff88)", transition:"width 0.7s ease", borderRadius:3 }} />
      </div>
    </div>
  );
}

function Badge({ text, color = "#00ff88" }) {
  return (
    <span style={{ fontSize:9, color, background:`${color}18`, border:`1px solid ${color}40`, borderRadius:3, padding:"1px 6px", fontFamily:"'Courier New',monospace", letterSpacing:1 }}>
      {text}
    </span>
  );
}

function ProgressRing({ pct, size = 60, color = "#00ff88", label }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0d2a1a" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:12, fontWeight:700, color, fontFamily:"'Courier New',monospace" }}>{pct}%</span>
        {label && <span style={{ fontSize:8, color:"#3a6a4a" }}>{label}</span>}
      </div>
    </div>
  );
}

function RadarMini({ state }) {
  const STATS = [
    { label:"WEB", cats:["Web Attacks"] },
    { label:"NET", cats:["Networking"] },
    { label:"LIN", cats:["Linux"] },
    { label:"WIN", cats:["Windows"] },
    { label:"AD", cats:["AD Attacks"] },
    { label:"REP", cats:["Reporting"] },
    { label:"OPS", cats:["Methodology","Shells","Password","Pivoting"] },
  ];
  const sz=160, cx=80, cy=80, r=60;
  const n=STATS.length;
  const angles = STATS.map((_,i)=>(i*2*Math.PI/n)-Math.PI/2);
  const vals = STATS.map(s=>{
    const rel=CPTS_MODULES.filter(m=>s.cats.includes(m.category));
    const done=rel.filter(m=>state.cpts_completed.includes(m.id)).length;
    return rel.length>0 ? done/rel.length : 0;
  });
  const grid=(f)=>angles.map(a=>`${cx+f*r*Math.cos(a)},${cy+f*r*Math.sin(a)}`).join(" ");
  const data=angles.map((a,i)=>`${cx+vals[i]*r*Math.cos(a)},${cy+vals[i]*r*Math.sin(a)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${sz} ${sz}`} style={{ width:"100%", maxWidth:160 }}>
      {[.25,.5,.75,1].map(f=><polygon key={f} points={grid(f)} fill="none" stroke="#0d2a1a" strokeWidth={.8}/>)}
      {angles.map((a,i)=><line key={i} x1={cx} y1={cy} x2={cx+r*Math.cos(a)} y2={cy+r*Math.sin(a)} stroke="#0d2a1a" strokeWidth={.8}/>)}
      <polygon points={data} fill="#00ff8822" stroke="#00ff88" strokeWidth={1.5}/>
      {angles.map((a,i)=>{
        const lx=cx+(r+14)*Math.cos(a), ly=cy+(r+14)*Math.sin(a);
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="central" style={{ fontSize:7, fill:"#3a8a5a", fontFamily:"monospace" }}>{STATS[i].label}</text>;
      })}
    </svg>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#030f07", border:"1px solid #1a4a2a", borderRadius:8, padding:24, width:"100%", maxWidth:600, maxHeight:"85vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#00ff88", fontFamily:"'Courier New',monospace", letterSpacing:2 }}>{title}</span>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#3a6a4a", fontSize:18, cursor:"pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────

function Notif({ msg, type }) {
  const colors = { xp:"#00ff88", level:"#ffaa00", achievement:"#cc88ff", info:"#00cfff" };
  const c = colors[type] || "#00ff88";
  return (
    <div style={{
      position:"fixed", top:16, right:16, zIndex:9999,
      background:"#030f07", border:`1px solid ${c}`, borderRadius:6,
      padding:"10px 18px", fontSize:12, color:c, fontFamily:"'Courier New',monospace",
      boxShadow:`0 0 24px ${c}33`, animation:"slideIn 0.3s ease",
    }}>{msg}</div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [state, setState] = useState(loadState);
  const [page, setPage] = useState("home");
  const [subPage, setSubPage] = useState(null); // cert id or ctf filter
  const [notif, setNotif] = useState(null);
  const [modal, setModal] = useState(null); // { type, data }
  const [ctfFilter, setCtfFilter] = useState({ type:"all", diff:"all", platform:"all", solved:"all", search:"" });
  const [moduleFilter, setModuleFilter] = useState({ cat:"All", search:"" });
  const [prevLevel, setPrevLevel] = useState(null);
  const notifRef = useRef(null);

  useEffect(() => { saveState(state); }, [state]);

  const xp = getTotalXP(state);
  const level = getLevel(xp);
  const rank = getRank(level);

  useEffect(() => {
    if (prevLevel !== null && level > prevLevel) {
      showNotif(`⚡ LEVEL UP → ${level}! You are now ${getRank(level).name}`, "level");
    }
    setPrevLevel(level);
  }, [level]);

  function showNotif(msg, type = "info") {
    clearTimeout(notifRef.current);
    setNotif({ msg, type });
    notifRef.current = setTimeout(() => setNotif(null), 3500);
  }

  function toggleCPTS(id) {
    const done = state.cpts_completed.includes(id);
    const mod = CPTS_MODULES.find(m => m.id === id);
    setState(s => ({
      ...s,
      cpts_completed: done ? s.cpts_completed.filter(x=>x!==id) : [...s.cpts_completed, id],
      cpts_dates: done ? { ...s.cpts_dates, [id]: undefined } : { ...s.cpts_dates, [id]: new Date().toISOString() },
    }));
    if (!done && mod) showNotif(`+${mod.xp} XP ─ ${mod.name}`, "xp");
  }

  function toggleCTF(id) {
    setState(s => ({
      ...s,
      ctfs: s.ctfs.map(c => c.id === id ? { ...c, solved: !c.solved } : c),
    }));
    const ctf = state.ctfs.find(c => c.id === id);
    if (ctf && !ctf.solved) showNotif(`✓ ${ctf.name} pwned! +${ctf.points} XP`, "xp");
  }

  function updateCTF(id, field, val) {
    setState(s => ({ ...s, ctfs: s.ctfs.map(c => c.id === id ? { ...c, [field]: val } : c) }));
  }

  function addCTF(entry) {
    setState(s => ({ ...s, ctfs: [...s.ctfs, { ...entry, id: `custom_${Date.now()}` }] }));
    showNotif("✓ Entry added", "info");
  }

  function deleteCTF(id) {
    if (!id.startsWith("custom_") && !window.confirm("Remove this entry?")) return;
    setState(s => ({ ...s, ctfs: s.ctfs.filter(c => c.id !== id) }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type:"application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `hacker_os_${new Date().toISOString().split("T")[0]}.json`; a.click();
  }
  function importData(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { try { setState(JSON.parse(ev.target.result)); showNotif("✓ Data imported", "info"); } catch { showNotif("✗ Invalid file", "xp"); } };
    r.readAsText(f);
  }

  // derived
  const cptsPct = getCPTSPct(state);
  const solvedCTFs = (state.ctfs || []).filter(c => c.solved).length;
  const totalCTFs = (state.ctfs || []).length;
  const achievedCerts = CERT_PATHS.filter(c => c.status === "achieved").length + (cptsPct === 100 ? 1 : 0);

  const NAV = [
    { id:"home", label:"HOME" },
    { id:"certs", label:"CERTIFICATIONS" },
    { id:"ctfs", label:"CTF & LABS" },
    { id:"settings", label:"SETTINGS" },
  ];

  const s = (p) => ({
    padding:"7px 14px", cursor:"pointer", fontSize:10, fontFamily:"'Courier New',monospace", fontWeight:600,
    border:"1px solid", borderRadius:3, transition:"all 0.2s", letterSpacing:1,
    borderColor: page===p ? "#00ff88":"#0d2a1a",
    color: page===p ? "#00ff88":"#2a5a3a",
    background: page===p ? "#001a0f":"transparent",
  });

  const inp = { background:"#020f08", border:"1px solid #0d2a1a", borderRadius:4, padding:"6px 10px", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, outline:"none", width:"100%" };
  const sel = { ...inp, width:"auto" };

  return (
    <div style={{ minHeight:"100vh", background:"#010a05", color:"#00ff88", fontFamily:"'Courier New',monospace" }}>
      {/* scanlines */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", backgroundImage:"repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)", zIndex:9000 }} />

      {notif && <Notif {...notif} />}

      {/* Modal */}
      {modal && modal.type === "ctf_detail" && (
        <Modal title={`◈ ${modal.data.name}`} onClose={() => setModal(null)}>
          <CTFDetailModal ctf={modal.data} updateCTF={updateCTF} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal && modal.type === "add_ctf" && (
        <Modal title="◈ ADD NEW ENTRY" onClose={() => setModal(null)}>
          <AddCTFModal onAdd={(e) => { addCTF(e); setModal(null); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal && modal.type === "cert_detail" && (
        <Modal title={`◈ ${modal.data.name} — ${modal.data.full}`} onClose={() => setModal(null)}>
          <CertDetailModal cert={modal.data} state={state} toggleCPTS={toggleCPTS} moduleFilter={moduleFilter} setModuleFilter={setModuleFilter} inp={inp} />
        </Modal>
      )}

      {/* HEADER */}
      <div style={{ borderBottom:"1px solid #0a2015", padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#010a05", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:16, fontWeight:700, letterSpacing:3, color:"#00ff88" }}>◈ HACKER OS</span>
          <span style={{ fontSize:9, color:"#1a4a2a", letterSpacing:2 }}>GROWTH SYSTEM v2</span>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {NAV.map(n => <button key={n.id} style={s(n.id)} onClick={() => { setPage(n.id); setSubPage(null); }}>{n.label}</button>)}
          <div style={{ marginLeft:8, padding:"5px 12px", background:"#001a0f", border:"1px solid #0d3a1a", borderRadius:3 }}>
            <span style={{ fontSize:10, color:"#3a6a4a" }}>LV </span>
            <span style={{ fontSize:13, fontWeight:700, color:rank.color }}>{level}</span>
            <span style={{ fontSize:9, color:"#3a6a4a", marginLeft:4 }}>{rank.name}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"20px 16px 60px" }}>

        {/* ── HOME ── */}
        {page === "home" && (
          <div>
            {/* Top identity bar */}
            <div style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:20, alignItems:"center", marginBottom:20, padding:"16px 20px", background:"#020f08", border:"1px solid #0a2015", borderRadius:8 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:52 }}>👾</div>
                <div style={{ fontSize:10, color:"#1a4a2a", marginTop:2 }}>OPERATOR</div>
              </div>
              <div>
                <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:22, fontWeight:700, color:rank.color }}>Level {level}</span>
                  <span style={{ fontSize:12, color:"#3a6a4a" }}>─</span>
                  <span style={{ fontSize:14, color:rank.color, letterSpacing:2 }}>{rank.name.toUpperCase()}</span>
                </div>
                <XPBar xp={xp} level={level} />
                <div style={{ display:"flex", gap:16, marginTop:8 }}>
                  <span style={{ fontSize:10, color:"#3a6a4a" }}>{xp.toLocaleString()} total XP</span>
                  <span style={{ fontSize:10, color:"#2a5a3a" }}>◈ eJPT certified</span>
                  <span style={{ fontSize:10, color:"#2a5a3a" }}>{solvedCTFs} challenges pwned</span>
                </div>
              </div>
              <RadarMini state={state} />
            </div>

            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
              {[
                { label:"CERTS ACHIEVED", value:`${achievedCerts}`, sub:"of "+CERT_PATHS.length },
                { label:"CPTS PROGRESS", value:`${cptsPct}%`, sub:`${state.cpts_completed.length}/${CPTS_MODULES.length} modules` },
                { label:"CHALLENGES", value:solvedCTFs, sub:`of ${totalCTFs} listed` },
                { label:"TOTAL XP", value:xp.toLocaleString(), sub:"lifetime" },
              ].map(c => (
                <div key={c.label} style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:6, padding:"12px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:9, color:"#2a5a3a", marginBottom:4, letterSpacing:1 }}>{c.label}</div>
                  <div style={{ fontSize:20, fontWeight:700, color:"#00ff88" }}>{c.value}</div>
                  <div style={{ fontSize:9, color:"#1a3a2a", marginTop:2 }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {/* Cert path overview */}
              <div style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:6, padding:16 }}>
                <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:12 }}>◈ CERTIFICATION PATHS</div>
                {CERT_PATHS.map(cert => {
                  const isDone = cert.status === "achieved" || (cert.id === "cpts" && cptsPct === 100);
                  const isActive = cert.status === "active";
                  const pct = cert.id === "cpts" ? cptsPct : (cert.status === "achieved" ? 100 : 0);
                  return (
                    <div key={cert.id} onClick={() => { setPage("certs"); setSubPage(cert.id); }}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid #0a1a0f", cursor:"pointer" }}
                    >
                      <span style={{ fontSize:18 }}>{cert.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                          <span style={{ fontSize:12, color: isDone ? cert.color : isActive ? cert.color : "#2a4a3a" }}>{cert.name}</span>
                          <Badge text={cert.status.toUpperCase()} color={cert.color} />
                        </div>
                        <div style={{ height:3, background:"#0a1a0f", borderRadius:2 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:cert.color, borderRadius:2, transition:"width 0.5s" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => setPage("certs")} style={{ width:"100%", marginTop:12, background:"transparent", border:"1px solid #0d2a1a", color:"#2a5a3a", fontFamily:"'Courier New',monospace", fontSize:10, padding:"7px", borderRadius:4, cursor:"pointer" }}>VIEW ALL PATHS →</button>
              </div>

              {/* CTF quick view */}
              <div style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:6, padding:16 }}>
                <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:12 }}>◈ RECENT CTF ACTIVITY</div>
                {(state.ctfs || []).filter(c => c.solved).slice(-6).reverse().map(c => (
                  <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid #0a1a0f" }}>
                    <div>
                      <span style={{ fontSize:11, color:"#00ff88" }}>✓ {c.name}</span>
                      <div style={{ fontSize:9, color:"#2a4a3a" }}>{c.platform} · {c.category}</div>
                    </div>
                    <span style={{ fontSize:10, color:DIFF_COLOR[c.difficulty]||"#3a6a4a" }}>+{c.points} XP</span>
                  </div>
                ))}
                {(state.ctfs || []).filter(c => c.solved).length === 0 && (
                  <div style={{ fontSize:11, color:"#1a3a2a", padding:"8px 0" }}>No challenges solved yet. Start hacking!</div>
                )}
                <button onClick={() => setPage("ctfs")} style={{ width:"100%", marginTop:12, background:"transparent", border:"1px solid #0d2a1a", color:"#2a5a3a", fontFamily:"'Courier New',monospace", fontSize:10, padding:"7px", borderRadius:4, cursor:"pointer" }}>VIEW ALL CHALLENGES →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── CERTIFICATIONS ── */}
        {page === "certs" && (
          <CertsPage
            state={state} setState={setState} subPage={subPage} setSubPage={setSubPage}
            toggleCPTS={toggleCPTS} showNotif={showNotif} inp={inp} sel={sel}
            moduleFilter={moduleFilter} setModuleFilter={setModuleFilter}
            cptsPct={cptsPct} setModal={setModal}
          />
        )}

        {/* ── CTFs ── */}
        {page === "ctfs" && (
          <CTFsPage
            state={state} ctfFilter={ctfFilter} setCtfFilter={setCtfFilter}
            toggleCTF={toggleCTF} updateCTF={updateCTF} deleteCTF={deleteCTF}
            setModal={setModal} inp={inp} sel={sel}
          />
        )}

        {/* ── SETTINGS ── */}
        {page === "settings" && (
          <SettingsPage state={state} setState={setState} exportData={exportData} importData={importData} inp={inp} />
        )}
      </div>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#010a05; }
        ::-webkit-scrollbar-thumb { background:#0d2a1a; border-radius:2px; }
        input[type=checkbox] { accent-color:#00ff88; cursor:pointer; }
        button:hover { opacity:0.85; }
        a { color:#00ff88; }
      `}</style>
    </div>
  );
}

// ─── CERTS PAGE ───────────────────────────────────────────────────────────────

function CertsPage({ state, setState, subPage, setSubPage, toggleCPTS, showNotif, inp, sel, moduleFilter, setModuleFilter, cptsPct, setModal }) {
  const activeCert = subPage ? CERT_PATHS.find(c => c.id === subPage) : null;

  if (activeCert) {
    return <CertDetail cert={activeCert} state={state} toggleCPTS={toggleCPTS} onBack={() => setSubPage(null)}
      moduleFilter={moduleFilter} setModuleFilter={setModuleFilter} inp={inp} cptsPct={cptsPct} />;
  }

  return (
    <div>
      <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:16 }}>◈ ALL CERTIFICATION PATHS</div>

      {/* Achieved */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:9, color:"#1a4a2a", letterSpacing:2, marginBottom:10, borderBottom:"1px solid #0a1a0f", paddingBottom:6 }}>ACHIEVED</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
          {CERT_PATHS.filter(c => c.status==="achieved").map(cert => (
            <CertCard key={cert.id} cert={cert} pct={100} onClick={() => setSubPage(cert.id)} />
          ))}
        </div>
      </div>

      {/* Active */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:9, color:"#1a4a2a", letterSpacing:2, marginBottom:10, borderBottom:"1px solid #0a1a0f", paddingBottom:6 }}>IN PROGRESS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
          {CERT_PATHS.filter(c => c.status==="active").map(cert => (
            <CertCard key={cert.id} cert={cert} pct={cptsPct} onClick={() => setSubPage(cert.id)} />
          ))}
        </div>
      </div>

      {/* Planned */}
      <div>
        <div style={{ fontSize:9, color:"#1a4a2a", letterSpacing:2, marginBottom:10, borderBottom:"1px solid #0a1a0f", paddingBottom:6 }}>PLANNED</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
          {CERT_PATHS.filter(c => c.status==="planned").map(cert => (
            <CertCard key={cert.id} cert={cert} pct={0} onClick={() => setSubPage(cert.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CertCard({ cert, pct, onClick }) {
  const statusColor = { achieved:"#22c55e", active:"#00ff88", planned:"#2a4a3a" };
  const sc = statusColor[cert.status] || "#2a4a3a";
  return (
    <div onClick={onClick} style={{
      background:"#020f08", border:`1px solid ${cert.status==="active" ? cert.color+"44" : "#0a2015"}`,
      borderRadius:6, padding:16, cursor:"pointer", transition:"all 0.2s",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div>
          <div style={{ fontSize:20, marginBottom:4 }}>{cert.icon}</div>
          <div style={{ fontSize:16, fontWeight:700, color:cert.color }}>{cert.name}</div>
          <div style={{ fontSize:10, color:"#2a5a3a" }}>{cert.provider}</div>
        </div>
        <div>
          <Badge text={cert.status.toUpperCase()} color={sc} />
          {cert.status === "achieved" && <div style={{ fontSize:18, marginTop:6, textAlign:"right" }}>🏅</div>}
        </div>
      </div>
      <div style={{ fontSize:10, color:"#2a4a3a", marginBottom:10, lineHeight:1.6 }}>{cert.description}</div>
      {cert.status !== "planned" && (
        <div>
          <div style={{ height:4, background:"#060f0a", borderRadius:2, overflow:"hidden", marginBottom:4 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:cert.color, borderRadius:2 }} />
          </div>
          <div style={{ fontSize:9, color:"#2a5a3a" }}>{pct}% complete</div>
        </div>
      )}
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
        {cert.skills?.map(sk => <Badge key={sk} text={sk} color={cert.color} />)}
      </div>
    </div>
  );
}

function CertDetail({ cert, state, toggleCPTS, onBack, moduleFilter, setModuleFilter, inp, cptsPct }) {
  if (cert.status === "achieved") {
    return (
      <div>
        <button onClick={onBack} style={{ background:"transparent", border:"1px solid #0d2a1a", color:"#3a6a4a", fontFamily:"'Courier New',monospace", fontSize:10, padding:"6px 12px", borderRadius:3, cursor:"pointer", marginBottom:16 }}>← BACK</button>
        <div style={{ background:"#020f08", border:`1px solid ${cert.color}44`, borderRadius:8, padding:24, textAlign:"center" }}>
          <div style={{ fontSize:56, marginBottom:12 }}>{cert.icon}</div>
          <div style={{ fontSize:22, fontWeight:700, color:cert.color, marginBottom:4 }}>{cert.full}</div>
          <div style={{ fontSize:12, color:"#3a6a4a", marginBottom:16 }}>{cert.provider}</div>
          <div style={{ display:"inline-block", background:"#001a0f", border:`1px solid ${cert.color}`, borderRadius:6, padding:"12px 32px", marginBottom:20 }}>
            <div style={{ fontSize:9, color:"#3a6a4a", marginBottom:4, letterSpacing:2 }}>STATUS</div>
            <div style={{ fontSize:18, fontWeight:700, color:cert.color }}>✓ CERTIFIED</div>
          </div>
          <div style={{ fontSize:12, color:"#2a5a3a", maxWidth:400, margin:"0 auto 20px", lineHeight:1.7 }}>{cert.description}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
            {cert.skills?.map(sk => <Badge key={sk} text={sk} color={cert.color} />)}
          </div>
        </div>
      </div>
    );
  }

  if (cert.id === "cpts") {
    const cats = ["All", ...new Set(CPTS_MODULES.map(m => m.category))];
    const filtered = CPTS_MODULES.filter(m =>
      (moduleFilter.cat === "All" || m.category === moduleFilter.cat) &&
      m.name.toLowerCase().includes(moduleFilter.search.toLowerCase())
    );
    const completedCount = state.cpts_completed.length;
    return (
      <div>
        <button onClick={onBack} style={{ background:"transparent", border:"1px solid #0d2a1a", color:"#3a6a4a", fontFamily:"'Courier New',monospace", fontSize:10, padding:"6px 12px", borderRadius:3, cursor:"pointer", marginBottom:16 }}>← BACK</button>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, background:"#020f08", border:`1px solid ${cert.color}44`, borderRadius:8, padding:18, marginBottom:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:24 }}>{cert.icon}</span>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:cert.color }}>{cert.full}</div>
                <div style={{ fontSize:10, color:"#3a6a4a" }}>{cert.provider}</div>
              </div>
              <Badge text="ACTIVE" color={cert.color} />
            </div>
            <div style={{ height:8, background:"#060f0a", borderRadius:4, overflow:"hidden", border:"1px solid #0d2a1a", marginBottom:6 }}>
              <div style={{ height:"100%", width:`${cptsPct}%`, background:`linear-gradient(90deg,#003322,${cert.color})`, borderRadius:4, transition:"width 0.7s" }} />
            </div>
            <div style={{ display:"flex", gap:16, fontSize:10, color:"#3a6a4a" }}>
              <span>{completedCount}/{CPTS_MODULES.length} modules</span>
              <span>{cptsPct}% complete</span>
              <span>{(CPTS_MODULES.length - completedCount) * 250} XP remaining</span>
            </div>
          </div>
          <ProgressRing pct={cptsPct} size={80} color={cert.color} />
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
          <input value={moduleFilter.search} onChange={e => setModuleFilter(f=>({...f,search:e.target.value}))}
            placeholder="Search modules..." style={{ ...inp, flex:1, minWidth:140 }} />
          <select value={moduleFilter.cat} onChange={e => setModuleFilter(f=>({...f,cat:e.target.value}))} style={{ background:"#020f08", border:"1px solid #0d2a1a", borderRadius:4, padding:"6px 10px", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, outline:"none" }}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ fontSize:9, color:"#1a4a2a", marginBottom:8 }}>{filtered.filter(m=>state.cpts_completed.includes(m.id)).length}/{filtered.length} shown complete</div>

        {filtered.map(m => {
          const done = state.cpts_completed.includes(m.id);
          const date = state.cpts_dates[m.id];
          const color = CAT_COLOR[m.category] || "#00ff88";
          return (
            <div key={m.id} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 12px", marginBottom:5,
              background: done ? "#021a0e":"#020f08",
              border:`1px solid ${done ? "#0d3a1a":"#0a1a0f"}`, borderRadius:4, transition:"all 0.15s",
            }}>
              <input type="checkbox" checked={done} onChange={() => toggleCPTS(m.id)} />
              <span style={{ fontSize:9, color:"#1a3a2a", minWidth:20 }}>#{String(m.id).padStart(2,"0")}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color: done ? "#00ff88":"#3a6a4a", marginBottom:2 }}>{m.name}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <Badge text={m.category} color={color} />
                  <span style={{ fontSize:9, color:"#2a4a3a" }}>+{m.xp} XP</span>
                  {date && <span style={{ fontSize:9, color:"#1a3a2a" }}>{new Date(date).toLocaleDateString()}</span>}
                </div>
              </div>
              <input value={state.cpts_notes[m.id]||""}
                onChange={e => {
                  const v = e.target.value;
                  // inline note update without calling setState from render
                }}
                onBlur={e => {
                  const v = e.target.value;
                  // We use a local ref approach here
                }}
                placeholder="note/path..."
                style={{ width:160, background:"#010a05", border:"1px solid #0a1a0f", borderRadius:3, padding:"3px 7px", color:"#2a6a4a", fontFamily:"'Courier New',monospace", fontSize:9, outline:"none" }} />
            </div>
          );
        })}
      </div>
    );
  }

  // Planned cert
  return (
    <div>
      <button onClick={onBack} style={{ background:"transparent", border:"1px solid #0d2a1a", color:"#3a6a4a", fontFamily:"'Courier New',monospace", fontSize:10, padding:"6px 12px", borderRadius:3, cursor:"pointer", marginBottom:16 }}>← BACK</button>
      <div style={{ background:"#020f08", border:`1px solid ${cert.color}33`, borderRadius:8, padding:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <span style={{ fontSize:36 }}>{cert.icon}</span>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:cert.color }}>{cert.name}</div>
            <div style={{ fontSize:11, color:"#3a6a4a" }}>{cert.full}</div>
            <div style={{ fontSize:10, color:"#2a4a3a" }}>{cert.provider}</div>
          </div>
          <Badge text="PLANNED" color={cert.color} />
        </div>
        <div style={{ fontSize:12, color:"#3a6a4a", lineHeight:1.8, marginBottom:16 }}>{cert.description}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
          {cert.skills?.map(sk => <Badge key={sk} text={sk} color={cert.color} />)}
        </div>
        <div style={{ padding:12, background:"#010a05", border:"1px solid #0a1a0f", borderRadius:4, fontSize:10, color:"#1a4a2a" }}>
          🔒 This path unlocks after CPTS certification. Keep grinding.
        </div>
      </div>
    </div>
  );
}

// ─── CTFs PAGE ────────────────────────────────────────────────────────────────

function CTFsPage({ state, ctfFilter, setCtfFilter, toggleCTF, updateCTF, deleteCTF, setModal, inp, sel }) {
  const ctfs = state.ctfs || [];
  const platforms = ["all", ...new Set(ctfs.map(c => c.platform))];
  const types = ["all","machine","challenge","competition"];
  const diffs = ["all","beginner","easy","medium","hard","insane"];

  const filtered = ctfs.filter(c =>
    (ctfFilter.type === "all" || c.type === ctfFilter.type) &&
    (ctfFilter.diff === "all" || c.difficulty === ctfFilter.diff) &&
    (ctfFilter.platform === "all" || c.platform === ctfFilter.platform) &&
    (ctfFilter.solved === "all" || (ctfFilter.solved === "solved" ? c.solved : !c.solved)) &&
    (c.name.toLowerCase().includes(ctfFilter.search.toLowerCase()) ||
     c.category.toLowerCase().includes(ctfFilter.search.toLowerCase()))
  );

  const solved = ctfs.filter(c => c.solved).length;
  const withWriteups = ctfs.filter(c => c.writeup && c.writeup.trim()).length;

  const selStyle = { background:"#020f08", border:"1px solid #0d2a1a", borderRadius:3, padding:"5px 8px", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:10, outline:"none" };

  return (
    <div>
      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
        {[
          { l:"TOTAL LISTED", v:ctfs.length },
          { l:"SOLVED", v:solved },
          { l:"WRITEUPS", v:withWriteups },
          { l:"XP EARNED", v:ctfs.filter(c=>c.solved).reduce((s,c)=>s+(c.points||0),0).toLocaleString() },
        ].map(x => (
          <div key={x.l} style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:5, padding:"10px 14px", textAlign:"center" }}>
            <div style={{ fontSize:8, color:"#2a5a3a", letterSpacing:1, marginBottom:4 }}>{x.l}</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#00ff88" }}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        <input value={ctfFilter.search} onChange={e => setCtfFilter(f=>({...f,search:e.target.value}))}
          placeholder="Search..." style={{ ...inp, flex:1, minWidth:120 }} />
        {[
          { key:"type", opts:types },
          { key:"diff", opts:diffs },
          { key:"platform", opts:platforms },
          { key:"solved", opts:["all","solved","unsolved"] },
        ].map(({ key, opts }) => (
          <select key={key} value={ctfFilter[key]} onChange={e => setCtfFilter(f=>({...f,[key]:e.target.value}))} style={selStyle}>
            {opts.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
          </select>
        ))}
        <button onClick={() => setModal({ type:"add_ctf" })}
          style={{ background:"#001a0f", border:"1px solid #00ff88", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:10, padding:"5px 14px", borderRadius:3, cursor:"pointer" }}>
          + ADD
        </button>
      </div>
      <div style={{ fontSize:9, color:"#1a4a2a", marginBottom:10 }}>{filtered.length} entries — {filtered.filter(c=>c.solved).length} solved</div>

      {/* Group by type */}
      {["competition","machine","challenge"].map(type => {
        const group = filtered.filter(c => c.type === type);
        if (group.length === 0) return null;
        const typeLabel = { competition:"🏁 CTF COMPETITIONS", machine:"🖥️ HTB MACHINES", challenge:"⚔️ HTB CHALLENGES" };
        return (
          <div key={type} style={{ marginBottom:20 }}>
            <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:8, borderBottom:"1px solid #0a1a0f", paddingBottom:5 }}>{typeLabel[type]}</div>
            {group.map(c => (
              <CTFRow key={c.id} ctf={c} toggleCTF={toggleCTF} updateCTF={updateCTF} deleteCTF={deleteCTF} onDetail={() => setModal({ type:"ctf_detail", data:c })} />
            ))}
          </div>
        );
      })}
      {filtered.length === 0 && (
        <div style={{ textAlign:"center", color:"#1a4a2a", fontSize:12, padding:"40px 0" }}>No entries match your filters.</div>
      )}
    </div>
  );
}

function CTFRow({ ctf, toggleCTF, updateCTF, deleteCTF, onDetail }) {
  const dc = DIFF_COLOR[ctf.difficulty] || "#3a6a4a";
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:10, padding:"8px 12px", marginBottom:5,
      background: ctf.solved ? "#021a0e":"#020f08",
      border:`1px solid ${ctf.solved ? "#0d3a1a":"#0a1a0f"}`, borderRadius:4,
    }}>
      <input type="checkbox" checked={ctf.solved} onChange={() => toggleCTF(ctf.id)} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:2 }}>
          <span style={{ fontSize:11, color: ctf.solved ? "#00ff88":"#3a6a4a", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ctf.name}</span>
          <Badge text={ctf.difficulty} color={dc} />
          <Badge text={ctf.category} color="#3a6a6a" />
        </div>
        <div style={{ fontSize:9, color:"#2a4a3a" }}>{ctf.platform} · {TYPE_ICON[ctf.type]} {ctf.type}</div>
      </div>
      <span style={{ fontSize:10, color:dc, minWidth:40, textAlign:"right" }}>+{ctf.points}</span>
      {ctf.writeup && (
        <a href={ctf.writeup} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
          style={{ fontSize:9, color:"#00cfff", textDecoration:"none", padding:"2px 6px", border:"1px solid #00cfff44", borderRadius:3 }}>WP↗</a>
      )}
      <button onClick={onDetail} style={{ background:"transparent", border:"1px solid #0d2a1a", color:"#2a5a3a", fontFamily:"'Courier New',monospace", fontSize:9, padding:"3px 8px", borderRadius:3, cursor:"pointer" }}>DETAIL</button>
      {ctf.id.startsWith("custom_") && (
        <button onClick={() => deleteCTF(ctf.id)} style={{ background:"transparent", border:"1px solid #3a0a0a", color:"#6a2a2a", fontFamily:"'Courier New',monospace", fontSize:9, padding:"3px 6px", borderRadius:3, cursor:"pointer" }}>✕</button>
      )}
    </div>
  );
}

function CTFDetailModal({ ctf, updateCTF, onClose }) {
  const [local, setLocal] = useState({ writeup: ctf.writeup || "", notes: ctf.notes || "" });
  function save() {
    updateCTF(ctf.id, "writeup", local.writeup);
    updateCTF(ctf.id, "notes", local.notes);
    onClose();
  }
  const dc = DIFF_COLOR[ctf.difficulty] || "#3a6a4a";
  const inp2 = { background:"#010a05", border:"1px solid #0d2a1a", borderRadius:4, padding:"6px 10px", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, outline:"none", width:"100%", boxSizing:"border-box" };
  return (
    <div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        <Badge text={ctf.type} color="#3a8a8a" />
        <Badge text={ctf.difficulty} color={dc} />
        <Badge text={ctf.category} color="#3a6a8a" />
        <Badge text={ctf.platform} color="#8a6a3a" />
        <Badge text={ctf.solved ? "SOLVED ✓" : "UNSOLVED"} color={ctf.solved ? "#22c55e" : "#3a4a3a"} />
      </div>
      {ctf.url && (
        <div style={{ marginBottom:12 }}>
          <a href={ctf.url} target="_blank" rel="noreferrer" style={{ fontSize:10, color:"#00cfff" }}>{ctf.url} ↗</a>
        </div>
      )}
      <div style={{ marginBottom:10 }}>
        <div style={{ fontSize:9, color:"#2a5a3a", marginBottom:5, letterSpacing:1 }}>WRITEUP URL (hosted on your site / Notion / GitHub)</div>
        <input value={local.writeup} onChange={e => setLocal(l=>({...l,writeup:e.target.value}))}
          placeholder="https://yourdomain.np/writeups/..." style={inp2} />
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:9, color:"#2a5a3a", marginBottom:5, letterSpacing:1 }}>NOTES</div>
        <textarea value={local.notes} onChange={e => setLocal(l=>({...l,notes:e.target.value}))}
          rows={5} placeholder="Key findings, techniques used, lessons learned..."
          style={{ ...inp2, resize:"vertical", lineHeight:1.6 }} />
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={save} style={{ flex:1, background:"#001a0f", border:"1px solid #00ff88", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px", borderRadius:4, cursor:"pointer" }}>SAVE</button>
        <button onClick={onClose} style={{ background:"transparent", border:"1px solid #0d2a1a", color:"#3a6a4a", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px 16px", borderRadius:4, cursor:"pointer" }}>CANCEL</button>
      </div>
    </div>
  );
}

function AddCTFModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name:"", type:"machine", platform:"HackTheBox", difficulty:"easy", category:"Web", points:20, url:"", writeup:"", notes:"", solved:false });
  const inp2 = { background:"#010a05", border:"1px solid #0d2a1a", borderRadius:4, padding:"6px 10px", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, outline:"none", width:"100%", boxSizing:"border-box" };
  const f = (k) => e => setForm(x=>({...x,[k]:e.target.value}));
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        {[
          { label:"NAME", key:"name", type:"text", full:true },
          { label:"PLATFORM", key:"platform", type:"text" },
          { label:"CATEGORY", key:"category", type:"text" },
          { label:"POINTS / XP", key:"points", type:"number" },
          { label:"URL", key:"url", type:"text", full:true },
          { label:"WRITEUP URL", key:"writeup", type:"text", full:true },
        ].map(field => (
          <div key={field.key} style={{ gridColumn: field.full ? "1/-1":"auto" }}>
            <div style={{ fontSize:9, color:"#2a5a3a", marginBottom:4, letterSpacing:1 }}>{field.label}</div>
            <input type={field.type} value={form[field.key]} onChange={f(field.key)} style={inp2} />
          </div>
        ))}
        <div>
          <div style={{ fontSize:9, color:"#2a5a3a", marginBottom:4, letterSpacing:1 }}>TYPE</div>
          <select value={form.type} onChange={f("type")} style={{ ...inp2, width:"auto" }}>
            {["machine","challenge","competition"].map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize:9, color:"#2a5a3a", marginBottom:4, letterSpacing:1 }}>DIFFICULTY</div>
          <select value={form.difficulty} onChange={f("difficulty")} style={{ ...inp2, width:"auto" }}>
            {["beginner","easy","medium","hard","insane"].map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginTop:6 }}>
        <button onClick={() => { if(form.name.trim()) onAdd(form); }}
          style={{ flex:1, background:"#001a0f", border:"1px solid #00ff88", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px", borderRadius:4, cursor:"pointer" }}>ADD ENTRY</button>
        <button onClick={onClose} style={{ background:"transparent", border:"1px solid #0d2a1a", color:"#3a6a4a", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px 16px", borderRadius:4, cursor:"pointer" }}>CANCEL</button>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

function SettingsPage({ state, setState, exportData, importData, inp }) {
  const startDate = new Date(state.startDate);
  const cptsDone = state.cpts_completed.length;
  const rate = cptsDone / Math.max(1, Math.ceil((new Date()-startDate)/86400000));

  return (
    <div style={{ maxWidth:520 }}>
      <div style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:6, padding:20, marginBottom:14 }}>
        <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:14 }}>◈ DATA MANAGEMENT</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <button onClick={exportData} style={{ background:"#010a05", border:"1px solid #00ff88", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px 14px", borderRadius:4, cursor:"pointer", textAlign:"left" }}>↓ Export all progress as JSON</button>
          <label style={{ background:"#010a05", border:"1px solid #00ff88", color:"#00ff88", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px 14px", borderRadius:4, cursor:"pointer" }}>
            ↑ Import progress from JSON
            <input type="file" accept=".json" onChange={importData} style={{ display:"none" }} />
          </label>
          <button onClick={() => { if(window.confirm("Reset ALL data?")) setState({ ...INITIAL_STATE, startDate: new Date().toISOString() }); }}
            style={{ background:"#010a05", border:"1px solid #ef4444", color:"#ef4444", fontFamily:"'Courier New',monospace", fontSize:11, padding:"9px 14px", borderRadius:4, cursor:"pointer", textAlign:"left" }}>⚠ Reset all progress</button>
        </div>
      </div>

      <div style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:6, padding:20, marginBottom:14 }}>
        <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:14 }}>◈ HOSTING NOTES — domain.np</div>
        <div style={{ fontSize:11, color:"#3a6a4a", lineHeight:1.8 }}>
          To host on your domain.np:<br />
          1. Push this to a GitHub repo<br />
          2. Enable GitHub Pages (branch: main / folder: /dist)<br />
          3. In domain.np control panel → add CNAME record → target: username.github.io<br />
          4. In GitHub repo Settings → Pages → Custom domain → enter your domain.np<br />
          <br />
          <span style={{ color:"#1a4a2a" }}>Note: LocalStorage data stays on your browser. For multi-device sync, swap localStorage for a Firebase Firestore backend later.</span>
        </div>
      </div>

      <div style={{ background:"#020f08", border:"1px solid #0a2015", borderRadius:6, padding:20 }}>
        <div style={{ fontSize:9, color:"#2a5a3a", letterSpacing:2, marginBottom:14 }}>◈ STATS SNAPSHOT</div>
        {[
          ["Tracking since", startDate.toLocaleDateString()],
          ["CPTS modules done", `${cptsDone}/${CPTS_MODULES.length}`],
          ["Avg pace", `${rate.toFixed(2)} modules/day`],
          ["CTFs solved", `${(state.ctfs||[]).filter(c=>c.solved).length}/${(state.ctfs||[]).length}`],
          ["Writeups logged", (state.ctfs||[]).filter(c=>c.writeup?.trim()).length],
        ].map(([k,v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #0a1a0f", fontSize:11 }}>
            <span style={{ color:"#3a6a4a" }}>{k}</span>
            <span style={{ color:"#00ff88" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
