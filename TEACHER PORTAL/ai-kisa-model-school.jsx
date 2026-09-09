import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, ClipboardList, CalendarCheck, TrendingUp, FileText,
  AlertTriangle, Award, FileSpreadsheet, Calendar as CalendarIcon, Settings,
  HelpCircle, User, GraduationCap, Layers, Bell, ShieldCheck, BarChart3,
  Moon, Sun, LogOut, Search, ChevronRight, ChevronDown, Plus, Check, X,
  Sparkles, BookOpen, Menu, Lock, Palette, Video, Image as ImageIcon,
  Mic, MessageSquare, Code2, Languages, Megaphone, FolderKanban, Ban,
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Eye, ThumbsUp, ThumbsDown,
  ClipboardCheck, Activity, PenSquare, Star
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ============================== LOGO ============================== */
const LOGO_SRC = "data:image/webp;base64,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";

/* ============================== MOCK DATA ============================== */

const CLASS_NUMS = [1,2,3,4,5,6,7,8,9,10];

const FIRST_NAMES = ["Ayesha","Bilal","Hina","Zaid","Sara","Ahmed","Mahnoor","Usman","Fatima","Hamza","Areeba","Talha","Sana","Danish","Iqra","Fahad","Noor","Zainab","Rayyan","Laiba","Umer","Mariam","Kashif","Alishba"];
const LAST_NAMES = ["Khan","Ali","Raza","Malik","Sheikh","Iqbal","Chaudhry","Farooq","Aslam","Baig"];

function seededRand(seed){ let x = Math.sin(seed)*10000; return x - Math.floor(x); }

function buildStudents(){
  const list = [];
  let id = 1;
  for (const cls of CLASS_NUMS){
    const count = 3 + Math.floor(seededRand(cls*7)*3); // 3-5 per class
    for (let i=0;i<count;i++){
      const fn = FIRST_NAMES[(id*3+i)%FIRST_NAMES.length];
      const ln = LAST_NAMES[(id*5+i)%LAST_NAMES.length];
      const attendance = Math.round(70 + seededRand(id*1.7)*29);
      const performance = Math.round(55 + seededRand(id*2.3)*44);
      const tasksCompleted = Math.round(6 + seededRand(id*3.1)*14);
      list.push({
        id, name: `${fn} ${ln}`, class: cls,
        attendance, performance, tasksCompleted,
        strengths: STRENGTH_POOL[id % STRENGTH_POOL.length],
        weakPoints: WEAK_POOL[id % WEAK_POOL.length],
        avatarHue: (id*47)%360,
        present: seededRand(id*9.1) > 0.22,
      });
      id++;
    }
  }
  return list;
}

const STRENGTH_POOL = [
  ["Public speaking","Consistency"], ["Creativity","Fast learner"],
  ["Leadership","Teamwork"], ["Writing","Research"],
  ["Coding logic","Discipline"], ["Design sense","Communication"],
];
const WEAK_POOL = [
  ["Time management"], ["Grammar accuracy"], ["Confidence on camera"],
  ["Attention to detail"], ["Consistency in submissions"], ["Editing speed"],
];

const ALL_STUDENTS = buildStudents();

const TEACHER_NAME = "Ms. Areeba Nadeem";
const TEACHER_CLASSES = [8, 9];
const TEACHER_STUDENTS = ALL_STUDENTS.filter(s => TEACHER_CLASSES.includes(s.class));
const TEACHER_EMAIL = "areeba.nadeem@aikisa.edu.pk";

const TEACHERS = [
  { id:1, name:"Ms. Areeba Nadeem", subject:"English & Digital Media", classes:[8,9], students: TEACHER_STUDENTS.length, rating:4.8, status:"Active" },
  { id:2, name:"Mr. Bilal Hassan", subject:"Computer Science", classes:[6,7], students: ALL_STUDENTS.filter(s=>[6,7].includes(s.class)).length, rating:4.6, status:"Active" },
  { id:3, name:"Mrs. Sana Iqbal", subject:"Mathematics", classes:[3,4,5], students: ALL_STUDENTS.filter(s=>[3,4,5].includes(s.class)).length, rating:4.9, status:"Active" },
  { id:4, name:"Mr. Danish Farooq", subject:"Social Studies", classes:[1,2], students: ALL_STUDENTS.filter(s=>[1,2].includes(s.class)).length, rating:4.5, status:"On Leave" },
  { id:5, name:"Ms. Iqra Malik", subject:"Islamiat & Urdu", classes:[10], students: ALL_STUDENTS.filter(s=>s.class===10).length, rating:4.7, status:"Active" },
];

const TASK_TYPES = [
  { key:"canva", label:"Canva Post", icon: PenSquare, color:"#a855f7" },
  { key:"tedx", label:"TEDx Review", icon: Mic, color:"#8b5cf6" },
  { key:"interview_taken", label:"Interview Taken", icon: MessageSquare, color:"#7c3aed" },
  { key:"interview_given", label:"Interview Given", icon: MessageSquare, color:"#6d28d9" },
  { key:"faceless", label:"Faceless Video", icon: Video, color:"#c026d3" },
  { key:"poster", label:"Poster", icon: ImageIcon, color:"#a21caf" },
  { key:"english_lang", label:"English Language", icon: Languages, color:"#9333ea" },
  { key:"story", label:"Story Post", icon: BookOpen, color:"#8b5cf6" },
  { key:"coding", label:"Coding", icon: Code2, color:"#7c3aed" },
  { key:"english_class", label:"English Class", icon: GraduationCap, color:"#a855f7" },
  { key:"no_work", label:"No Work", icon: Ban, color:"#6b7280" },
  { key:"digital_marketing", label:"Digital Marketing", icon: Megaphone, color:"#c026d3" },
  { key:"gemini", label:"Gemini", icon: Sparkles, color:"#f5a623" },
  { key:"project", label:"Project", icon: FolderKanban, color:"#8b5cf6" },
  { key:"other", label:"Other", icon: MoreHorizontal, color:"#9ca3af" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHLY_TREND = MONTHS.slice(0,9).map((m,i)=>({
  month:m,
  attendance: Math.round(78 + Math.sin(i/1.3)*8 + i*0.6),
  performance: Math.round(65 + Math.cos(i/1.6)*6 + i*1.4),
}));

const REPORTS_QUEUE = [
  { id:1, teacher:"Ms. Areeba Nadeem", title:"Class 9 — Monthly Progress Report", submitted:"2 hours ago", status:"Pending" },
  { id:2, teacher:"Mr. Bilal Hassan", title:"Class 6 — Coding Assessment Summary", submitted:"5 hours ago", status:"Pending" },
  { id:3, teacher:"Mrs. Sana Iqbal", title:"Class 4 — Attendance Exception Report", submitted:"Yesterday", status:"Pending" },
  { id:4, teacher:"Ms. Iqra Malik", title:"Class 10 — Weak Point Analysis", submitted:"2 days ago", status:"Pending" },
];

const AUDIT_LOGS = [
  { id:1, actor:"Ms. Areeba Nadeem", action:"Marked attendance", target:"Class 9 · 5 students", time:"Today, 9:12 AM" },
  { id:2, actor:"Super Admin", action:"Approved report", target:"Class 6 Coding Assessment", time:"Today, 8:40 AM" },
  { id:3, actor:"Mr. Bilal Hassan", action:"Assigned daily task", target:"Coding · 4 students", time:"Yesterday, 4:55 PM" },
  { id:4, actor:"Super Admin", action:"Updated class roster", target:"Class 3", time:"Yesterday, 2:10 PM" },
  { id:5, actor:"Mrs. Sana Iqbal", action:"Generated mark sheet", target:"Class 5 · September", time:"2 days ago" },
];

const NOTIFICATIONS = [
  { id:1, title:"New report pending approval", desc:"Class 9 monthly progress report submitted by Ms. Areeba.", time:"10m ago", type:"report" },
  { id:2, title:"Low attendance alert", desc:"Class 6 attendance dropped below 75% this week.", time:"1h ago", type:"alert" },
  { id:3, title:"Mark sheets generated", desc:"September mark sheets are ready for Class 8 & 9.", time:"3h ago", type:"success" },
  { id:4, title:"New teacher onboarded", desc:"Ms. Iqra Malik joined as Islamiat & Urdu teacher.", time:"1d ago", type:"info" },
];

const TEACHER_NAV = [
  { key:"dashboard", label:"Dashboard", icon: LayoutDashboard },
  { key:"students", label:"Students", icon: Users },
  { key:"tasks", label:"Daily Tasks", icon: ClipboardList },
  { key:"attendance", label:"Attendance", icon: CalendarCheck },
  { key:"performance", label:"Performance", icon: TrendingUp },
  { key:"reports", label:"Reports", icon: FileText },
  { key:"weak", label:"Weak Points", icon: AlertTriangle },
  { key:"top", label:"Top Students", icon: Award },
  { key:"marksheet", label:"Mark Sheet", icon: FileSpreadsheet },
  { key:"calendar", label:"Calendar", icon: CalendarIcon },
  { key:"settings", label:"Teacher Settings", icon: Settings },
  { key:"how", label:"How to Use", icon: HelpCircle },
  { key:"profile", label:"Profile", icon: User },
];

const ADMIN_NAV = [
  { key:"dashboard", label:"Dashboard", icon: LayoutDashboard },
  { key:"teachers", label:"Teachers", icon: GraduationCap },
  { key:"students", label:"Students", icon: Users },
  { key:"classes", label:"Classes", icon: Layers },
  { key:"reports", label:"Reports", icon: FileText },
  { key:"approval", label:"Report Approval", icon: ClipboardCheck },
  { key:"analytics", label:"Performance Analytics", icon: BarChart3 },
  { key:"weakAnalytics", label:"Weak Point Analytics", icon: AlertTriangle },
  { key:"top", label:"Top Students", icon: Award },
  { key:"marksheets", label:"Mark Sheets", icon: FileSpreadsheet },
  { key:"calendar", label:"Calendar", icon: CalendarIcon },
  { key:"notifications", label:"Notifications", icon: Bell },
  { key:"audit", label:"Audit Logs", icon: ShieldCheck },
  { key:"settings", label:"Settings", icon: Settings },
  { key:"how", label:"How to Use", icon: HelpCircle },
  { key:"profile", label:"Profile", icon: User },
];

/* ============================== STYLES ============================== */

const GlobalStyles = () => (
  <style>{`
    .app-root { position:relative; width:100%; min-height:100vh; font-family:'Sora','Inter',ui-sans-serif,system-ui,-apple-system,sans-serif; overflow-x:hidden; transition:background .35s ease,color .35s ease; }
    .app-root * { box-sizing:border-box; }

    .app-root.theme-dark {
      --bg:#08060f; --bg2:#0d0a1a; --surface:#12101f; --surface2:#171429;
      --surface-glass: rgba(23,20,41,0.6);
      --border: rgba(139,92,246,0.18); --border-strong: rgba(168,85,247,0.4);
      --text:#f1eefb; --text-dim:#a9a3c6; --text-mute:#726c93;
      --accent:#a855f7; --accent2:#7c3aed; --accent3:#e879f9; --gold:#f5b942;
      --success:#34d399; --danger:#fb7185; --warn:#fbbf24;
      --shadow: 0 8px 30px rgba(0,0,0,0.45);
      --glow: 0 0 24px rgba(168,85,247,0.35);
      background:
        radial-gradient(1100px 700px at 82% -10%, rgba(124,58,237,0.20), transparent 60%),
        radial-gradient(900px 600px at -10% 110%, rgba(192,38,211,0.14), transparent 55%),
        var(--bg);
      color: var(--text);
    }
    .app-root.theme-light {
      --bg:#f6f4fc; --bg2:#ffffff; --surface:#ffffff; --surface2:#faf8ff;
      --surface-glass: rgba(255,255,255,0.7);
      --border: rgba(124,58,237,0.14); --border-strong: rgba(124,58,237,0.3);
      --text:#221d3b; --text-dim:#5c5578; --text-mute:#8a84a6;
      --accent:#7c3aed; --accent2:#9333ea; --accent3:#c026d3; --gold:#c9860f;
      --success:#0d9c6c; --danger:#e11d48; --warn:#b45309;
      --shadow: 0 8px 26px rgba(124,58,237,0.10);
      --glow: 0 0 20px rgba(124,58,237,0.18);
      background:
        radial-gradient(1100px 700px at 82% -10%, rgba(124,58,237,0.08), transparent 60%),
        radial-gradient(900px 600px at -10% 110%, rgba(192,38,211,0.06), transparent 55%),
        var(--bg);
      color: var(--text);
    }

    .orb-field { position:fixed; inset:0; overflow:hidden; pointer-events:none; z-index:0; }
    .orb { position:absolute; border-radius:50%; filter:blur(60px); opacity:0.5; }
    .theme-light .orb { opacity:0.28; }
    .orb-a { width:420px; height:420px; top:-120px; right:-80px; background:radial-gradient(circle, var(--accent), transparent 70%); animation: floatA 22s ease-in-out infinite; }
    .orb-b { width:360px; height:360px; bottom:-100px; left:-60px; background:radial-gradient(circle, var(--accent3), transparent 70%); animation: floatB 26s ease-in-out infinite; }
    .orb-c { width:280px; height:280px; top:40%; left:55%; background:radial-gradient(circle, var(--gold), transparent 72%); opacity:0.18; animation: floatC 30s ease-in-out infinite; }
    @keyframes floatA { 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(-40px,50px) scale(1.08); } }
    @keyframes floatB { 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(50px,-30px) scale(1.1); } }
    @keyframes floatC { 0%,100%{ transform:translate(0,0) scale(1); } 50%{ transform:translate(-30px,-40px) scale(0.9); } }
    @media (prefers-reduced-motion: reduce) { .orb { animation:none !important; } }

    .shell { position:relative; z-index:1; display:flex; min-height:100vh; }

    /* Sidebar */
    .sidebar { width:260px; flex-shrink:0; background:var(--surface-glass); backdrop-filter: blur(18px); border-right:1px solid var(--border); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; transition: width .25s ease, transform .25s ease; z-index:20; }
    .sidebar.collapsed { width:82px; }
    .sb-brand { display:flex; align-items:center; gap:12px; padding:20px 18px; border-bottom:1px solid var(--border); }
    .sb-logo-wrap { width:44px; height:44px; flex-shrink:0; border-radius:14px; display:flex; align-items:center; justify-content:center; background: linear-gradient(145deg, rgba(168,85,247,0.18), rgba(192,38,211,0.08)); border:1px solid var(--border-strong); box-shadow: var(--glow); overflow:hidden; }
    .sb-logo-wrap img { width:120%; height:120%; object-fit:contain; }
    .sb-brand-text { line-height:1.15; overflow:hidden; white-space:nowrap; }
    .sb-brand-text .t1 { font-weight:800; font-size:14.5px; letter-spacing:0.2px; background:linear-gradient(90deg, var(--text), var(--accent3)); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .sb-brand-text .t2 { font-size:11px; color:var(--text-mute); margin-top:2px; }

    .sb-nav { flex:1; overflow-y:auto; padding:14px 12px; display:flex; flex-direction:column; gap:3px; }
    .sb-nav::-webkit-scrollbar{ width:5px; } .sb-nav::-webkit-scrollbar-thumb{ background:var(--border-strong); border-radius:4px; }
    .sb-item { display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:11px; cursor:pointer; color:var(--text-dim); font-size:13.5px; font-weight:600; position:relative; transition: background .18s ease, color .18s ease, transform .12s ease; border:1px solid transparent; white-space:nowrap; overflow:hidden; }
    .sb-item svg { flex-shrink:0; width:18px; height:18px; }
    .sb-item:hover { background: rgba(168,85,247,0.10); color:var(--text); }
    .sb-item.active { background: linear-gradient(90deg, rgba(168,85,247,0.22), rgba(192,38,211,0.08)); color:var(--text); border-color: var(--border-strong); box-shadow: inset 0 0 0 1px rgba(168,85,247,0.08), var(--glow); }
    .sb-item.active::before { content:''; position:absolute; left:-12px; top:50%; transform:translateY(-50%); width:4px; height:18px; border-radius:4px; background: linear-gradient(180deg, var(--accent), var(--accent3)); }
    .sidebar.collapsed .sb-brand-text, .sidebar.collapsed .sb-item span { display:none; }
    .sidebar.collapsed .sb-item { justify-content:center; }

    .sb-foot { padding:14px; border-top:1px solid var(--border); }
    .sb-role-pill { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:12px; background:var(--surface2); border:1px solid var(--border); }
    .sb-role-pill .dot { width:8px; height:8px; border-radius:50%; background:var(--success); box-shadow:0 0 8px var(--success); flex-shrink:0; }
    .sb-role-pill .info { overflow:hidden; }
    .sb-role-pill .info b { display:block; font-size:12.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .sb-role-pill .info span { font-size:11px; color:var(--text-mute); }
    .sidebar.collapsed .sb-role-pill .info { display:none; }

    /* Main */
    .main { flex:1; min-width:0; display:flex; flex-direction:column; }
    .topbar { position:sticky; top:0; z-index:15; display:flex; align-items:center; gap:14px; padding:14px 26px; background:var(--surface-glass); backdrop-filter: blur(16px); border-bottom:1px solid var(--border); }
    .icon-btn { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:var(--surface2); border:1px solid var(--border); color:var(--text-dim); cursor:pointer; transition: all .15s ease; flex-shrink:0; }
    .icon-btn:hover { color:var(--text); border-color:var(--border-strong); box-shadow: var(--glow); }
    .search-wrap { flex:1; max-width:380px; display:flex; align-items:center; gap:8px; background:var(--surface2); border:1px solid var(--border); border-radius:11px; padding:9px 13px; color:var(--text-mute); }
    .search-wrap input { background:none; border:none; outline:none; color:var(--text); font-size:13px; width:100%; font-family:inherit; }
    .topbar-title { display:none; }
    .topbar-right { margin-left:auto; display:flex; align-items:center; gap:10px; }
    .avatar-chip { display:flex; align-items:center; gap:9px; padding:6px 12px 6px 6px; border-radius:30px; background:var(--surface2); border:1px solid var(--border); cursor:pointer; }
    .avatar-circle { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg, var(--accent), var(--accent3)); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:#fff; flex-shrink:0; }
    .avatar-chip b { font-size:12.5px; }
    .avatar-chip span { font-size:10.5px; color:var(--text-mute); display:block; }

    .content { padding:26px; flex:1; }
    .page-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom:22px; flex-wrap:wrap; }
    .page-head h1 { font-size:23px; font-weight:800; margin:0 0 6px 0; letter-spacing:-0.2px; }
    .page-head p { margin:0; color:var(--text-mute); font-size:13.5px; max-width:560px; }

    .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 16px; border-radius:11px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid transparent; transition: all .15s ease; font-family:inherit; }
    .btn-primary { background:linear-gradient(135deg, var(--accent), var(--accent2)); color:#fff; box-shadow: 0 6px 20px rgba(139,92,246,0.35); }
    .btn-primary:hover { transform:translateY(-1px); box-shadow: 0 10px 26px rgba(139,92,246,0.45); }
    .btn-ghost { background:var(--surface2); color:var(--text); border-color:var(--border); }
    .btn-ghost:hover { border-color:var(--border-strong); }
    .btn-sm { padding:7px 12px; font-size:12px; border-radius:9px; }
    .btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }

    .grid { display:grid; gap:18px; }
    .grid-4 { grid-template-columns: repeat(4, 1fr); } .grid-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-2 { grid-template-columns: repeat(2, 1fr); }
    @media (max-width:1200px){ .grid-4{grid-template-columns:repeat(2,1fr);} .grid-3{grid-template-columns:repeat(2,1fr);} }
    @media (max-width:720px){ .grid-4,.grid-3,.grid-2{grid-template-columns:1fr;} }

    .card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:20px; box-shadow: var(--shadow); position:relative; }
    .card-tight { padding:16px; border-radius:14px; }

    .stat-card { display:flex; flex-direction:column; gap:10px; }
    .stat-top { display:flex; align-items:center; justify-content:space-between; }
    .stat-icon { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; background:rgba(168,85,247,0.14); color:var(--accent); border:1px solid var(--border); }
    .stat-trend { font-size:11.5px; font-weight:700; display:flex; align-items:center; gap:3px; }
    .trend-up { color:var(--success); } .trend-down { color:var(--danger); }
    .stat-value { font-size:26px; font-weight:800; letter-spacing:-0.5px; }
    .stat-label { font-size:12.5px; color:var(--text-mute); font-weight:600; }

    .section-title { font-size:15px; font-weight:800; margin:0 0 2px 0; }
    .section-sub { font-size:12px; color:var(--text-mute); margin:0 0 16px 0; }

    table.data-table { width:100%; border-collapse:collapse; font-size:13px; }
    .data-table th { text-align:left; padding:10px 12px; color:var(--text-mute); font-weight:700; font-size:11.5px; text-transform:none; border-bottom:1px solid var(--border); }
    .data-table td { padding:12px; border-bottom:1px solid var(--border); vertical-align:middle; }
    .data-table tr:last-child td { border-bottom:none; }
    .data-table tr:hover td { background: rgba(168,85,247,0.05); }

    .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:30px; font-size:11px; font-weight:700; }
    .badge-purple { background:rgba(168,85,247,0.15); color:var(--accent); border:1px solid rgba(168,85,247,0.3); }
    .badge-green { background:rgba(52,211,153,0.13); color:var(--success); border:1px solid rgba(52,211,153,0.28); }
    .badge-red { background:rgba(251,113,133,0.13); color:var(--danger); border:1px solid rgba(251,113,133,0.28); }
    .badge-gold { background:rgba(245,185,66,0.14); color:var(--gold); border:1px solid rgba(245,185,66,0.3); }
    .badge-gray { background:var(--surface2); color:var(--text-mute); border:1px solid var(--border); }

    .mini-avatar { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:#fff; flex-shrink:0; }

    .progress-track { width:100%; height:7px; border-radius:6px; background:var(--surface2); overflow:hidden; border:1px solid var(--border); }
    .progress-fill { height:100%; border-radius:6px; background:linear-gradient(90deg, var(--accent), var(--accent3)); }

    .chip { display:inline-flex; align-items:center; padding:5px 11px; border-radius:9px; font-size:11.5px; font-weight:600; background:var(--surface2); border:1px solid var(--border); color:var(--text-dim); }

    .task-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
    @media (max-width:1100px){ .task-grid{grid-template-columns:repeat(3,1fr);} }
    @media (max-width:640px){ .task-grid{grid-template-columns:repeat(2,1fr);} }
    .task-card { display:flex; flex-direction:column; align-items:center; gap:8px; padding:16px 10px; border-radius:14px; background:var(--surface); border:1.5px solid var(--border); cursor:pointer; text-align:center; transition: all .15s ease; }
    .task-card:hover { border-color:var(--border-strong); transform:translateY(-2px); }
    .task-card.selected { border-color:var(--accent); background:linear-gradient(160deg, rgba(168,85,247,0.14), rgba(192,38,211,0.05)); box-shadow: var(--glow); }
    .task-card .ic { width:38px; height:38px; border-radius:11px; display:flex; align-items:center; justify-content:center; }
    .task-card .lb { font-size:11.5px; font-weight:700; line-height:1.25; }

    .class-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
    @media (max-width:1100px){ .class-grid{grid-template-columns:repeat(3,1fr);} }
    @media (max-width:640px){ .class-grid{grid-template-columns:repeat(2,1fr);} }
    .class-card { padding:18px; border-radius:16px; background:var(--surface); border:1.5px solid var(--border); cursor:pointer; transition: all .15s ease; }
    .class-card:hover { transform:translateY(-2px); border-color:var(--border-strong); }
    .class-card.selected { border-color:var(--accent); box-shadow:var(--glow); background:linear-gradient(160deg, rgba(168,85,247,0.14), rgba(192,38,211,0.04)); }
    .class-card .num { font-size:26px; font-weight:800; }
    .class-card .lb { font-size:12px; color:var(--text-mute); margin-top:2px; }

    .toggle-pill { display:inline-flex; border-radius:11px; background:var(--surface2); border:1px solid var(--border); padding:3px; gap:2px; }
    .toggle-pill button { border:none; background:transparent; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; color:var(--text-mute); font-family:inherit; transition:all .15s ease; }
    .toggle-pill button.active { background:linear-gradient(135deg, var(--accent), var(--accent2)); color:#fff; }
    .toggle-pill button.active.danger-active { background:linear-gradient(135deg,#fb7185,#e11d48); }

    .howto-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    @media (max-width:900px){ .howto-grid{grid-template-columns:1fr;} }
    .howto-card { padding:18px; border-radius:16px; background:var(--surface); border:1px solid var(--border); }
    .howto-num { width:32px; height:32px; border-radius:9px; background:rgba(168,85,247,0.14); color:var(--accent); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; margin-bottom:10px; }

    .login-wrap { position:relative; z-index:1; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
    .login-card { width:100%; max-width:400px; background:var(--surface-glass); backdrop-filter: blur(20px); border:1px solid var(--border); border-radius:24px; padding:34px 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.35); }
    .login-logo-ring { width:104px; height:104px; margin:0 auto 16px auto; border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative; }
    .login-logo-ring::before { content:''; position:absolute; inset:0; border-radius:50%; background: conic-gradient(from 0deg, var(--accent), var(--accent3), var(--gold), var(--accent)); opacity:0.55; filter:blur(10px); animation: spin 8s linear infinite; }
    @media (prefers-reduced-motion: reduce) { .login-logo-ring::before{ animation:none; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    .login-logo-ring img { position:relative; width:88px; height:88px; object-fit:contain; border-radius:50%; background:var(--bg2); z-index:1; }
    .login-title { text-align:center; font-size:19px; font-weight:800; margin:2px 0 2px 0; }
    .login-sub { text-align:center; font-size:12.5px; color:var(--text-mute); margin-bottom:22px; }
    .field-label { font-size:12px; font-weight:700; color:var(--text-dim); margin:0 0 6px 2px; display:block; }
    .field-input { width:100%; padding:11px 13px; border-radius:11px; background:var(--surface2); border:1px solid var(--border); color:var(--text); font-size:13.5px; outline:none; font-family:inherit; transition:border-color .15s ease; }
    .field-input:focus { border-color:var(--accent); }
    .field-group { margin-bottom:15px; }

    .empty-note { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border-radius:12px; background: rgba(245,185,66,0.08); border:1px solid rgba(245,185,66,0.25); color:var(--gold); font-size:12px; line-height:1.5; margin-bottom:18px; }
    .empty-note svg { flex-shrink:0; margin-top:1px; }

    .scroll-x { overflow-x:auto; }

    .profile-hero { display:flex; gap:20px; align-items:center; flex-wrap:wrap; }
    .profile-avatar { width:76px; height:76px; border-radius:22px; background:linear-gradient(135deg, var(--accent), var(--accent3)); display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; color:#fff; flex-shrink:0; box-shadow: var(--glow); }

    .mobile-overlay { display:none; }
    @media (max-width: 880px){
      .sidebar { position:fixed; left:0; transform:translateX(-105%); box-shadow: 0 0 40px rgba(0,0,0,0.5); }
      .sidebar.mobile-open { transform:translateX(0); }
      .mobile-overlay.show { display:block; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:19; }
      .grid-4,.grid-3,.grid-2 { grid-template-columns:1fr; }
      .content { padding:18px; }
    }
  `}</style>
);

/* ============================== SMALL COMPONENTS ============================== */

function initials(name){
  return name.split(" ").map(p=>p[0]).slice(0,2).join("").toUpperCase();
}

function Avatar({ name, hue, size=32, radius=9 }){
  return (
    <div className="mini-avatar" style={{
      width:size, height:size, borderRadius:radius,
      background:`linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue+50)%360},75%,50%))`
    }}>{initials(name)}</div>
  );
}

function StatCard({ icon:Icon, label, value, trend, trendDir="up", suffix="" }){
  return (
    <div className="card stat-card">
      <div className="stat-top">
        <div className="stat-icon"><Icon size={18}/></div>
        {trend != null && (
          <div className={`stat-trend ${trendDir==="up"?"trend-up":"trend-down"}`}>
            {trendDir==="up" ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
            {trend}
          </div>
        )}
      </div>
      <div className="stat-value">{value}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ProgressBar({ value }){
  return (
    <div className="progress-track"><div className="progress-fill" style={{ width:`${value}%` }}/></div>
  );
}

function SectionHead({ title, sub, right }){
  return (
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:14,flexWrap:"wrap"}}>
      <div><h3 className="section-title">{title}</h3>{sub && <p className="section-sub" style={{marginBottom:0}}>{sub}</p>}</div>
      {right}
    </div>
  );
}

function PageHead({ title, sub, children }){
  return (
    <div className="page-head">
      <div><h1>{title}</h1><p>{sub}</p></div>
      <div style={{display:"flex",gap:10}}>{children}</div>
    </div>
  );
}

function EmptyNote({ children }){
  return <div className="empty-note"><Sparkles size={15}/><div>{children}</div></div>;
}

/* ============================== SHARED PAGES ============================== */

function DashboardPage({ role, students, cssVars }){
  const isTeacher = role==="teacher";
  const avgAttendance = Math.round(students.reduce((a,s)=>a+s.attendance,0)/students.length);
  const avgPerf = Math.round(students.reduce((a,s)=>a+s.performance,0)/students.length);
  const totalTasks = students.reduce((a,s)=>a+s.tasksCompleted,0);
  const topStudent = [...students].sort((a,b)=>b.performance-a.performance)[0];

  const pieData = [
    { name:"Excellent (85+)", value: students.filter(s=>s.performance>=85).length, color:"var(--accent)" },
    { name:"Good (65-84)", value: students.filter(s=>s.performance>=65 && s.performance<85).length, color:"var(--accent3)" },
    { name:"Needs Focus (<65)", value: students.filter(s=>s.performance<65).length, color:"var(--gold)" },
  ];

  return (
    <div>
      <PageHead
        title={isTeacher ? `Welcome back, ${TEACHER_NAME.split(" ")[1]||TEACHER_NAME}` : "School Overview"}
        sub={isTeacher ? `Here's what's happening with Class ${TEACHER_CLASSES.join(" & ")} today.` : "A real-time snapshot across every class, teacher and report."}
      >
        <button className="btn btn-ghost btn-sm"><CalendarIcon size={14}/> Today</button>
        <button className="btn btn-primary btn-sm"><Plus size={14}/> {isTeacher ? "Log Task" : "New Announcement"}</button>
      </PageHead>

      <div className="grid grid-4" style={{marginBottom:18}}>
        <StatCard icon={Users} label={isTeacher?"My Students":"Total Students"} value={students.length} trend="4.2%" />
        <StatCard icon={CalendarCheck} label="Avg Attendance" value={avgAttendance} suffix="%" trend="2.1%" />
        <StatCard icon={TrendingUp} label="Avg Performance" value={avgPerf} suffix="%" trend="5.4%" />
        <StatCard icon={ClipboardList} label={isTeacher?"Tasks Logged":"Tasks Logged (School)"} value={totalTasks} trend="1.8%" trendDir="down" />
      </div>

      <div className="grid" style={{gridTemplateColumns:"1.7fr 1fr", marginBottom:18}}>
        <div className="card">
          <SectionHead title="Attendance & Performance Trend" sub="Last 9 months, school-wide average" />
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradPerf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent3)" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="var(--accent3)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}} />
              <Area type="monotone" dataKey="attendance" stroke="var(--accent)" fill="url(#gradAtt)" strokeWidth={2.5} name="Attendance %"/>
              <Area type="monotone" dataKey="performance" stroke="var(--accent3)" fill="url(#gradPerf)" strokeWidth={2.5} name="Performance %"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHead title="Performance Split" sub="Where students currently stand" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={4}>
                {pieData.map((d,i)=><Cell key={i} fill={d.color} stroke="var(--surface)" strokeWidth={2}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:6}}>
            {pieData.map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                <span style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                <span style={{color:"var(--text-mute)",flex:1}}>{d.name}</span>
                <b>{d.value}</b>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div className="card">
          <SectionHead title="Top Performer This Month" />
          {topStudent && (
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <Avatar name={topStudent.name} hue={topStudent.avatarHue} size={54} radius={16}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15}}>{topStudent.name}</div>
                <div style={{fontSize:12,color:"var(--text-mute)"}}>Class {topStudent.class} · {topStudent.tasksCompleted} tasks completed</div>
                <div style={{marginTop:8}}><ProgressBar value={topStudent.performance}/></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:800,color:"var(--accent)"}}>{topStudent.performance}%</div>
                <span className="badge badge-gold"><Star size={11}/> Top rank</span>
              </div>
            </div>
          )}
        </div>
        <div className="card">
          <SectionHead title={isTeacher ? "Recent Activity" : "Pending Approvals"} />
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {(isTeacher ? [
              { t:"Marked attendance for Class 9", s:"9:12 AM" },
              { t:"Assigned Coding task to 4 students", s:"Yesterday" },
              { t:"Generated September mark sheets", s:"2 days ago" },
            ] : REPORTS_QUEUE.slice(0,3).map(r=>({t:r.title, s:r.submitted}))
            ).map((it,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)",flexShrink:0,boxShadow:"0 0 8px var(--accent)"}}/>
                <div style={{flex:1,fontSize:12.5}}>{it.t}</div>
                <div style={{fontSize:11,color:"var(--text-mute)"}}>{it.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsPage({ students, role }){
  const [q, setQ] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const classes = Array.from(new Set(students.map(s=>s.class))).sort((a,b)=>a-b);
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) &&
    (classFilter==="all" || s.class===Number(classFilter))
  );
  return (
    <div>
      <PageHead title="Students" sub={role==="teacher" ? "Students assigned to your classes." : "Every student enrolled across the school."}>
        <button className="btn btn-primary btn-sm"><Plus size={14}/> Add Student</button>
      </PageHead>
      <div className="card">
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <div className="search-wrap" style={{maxWidth:260}}>
            <Search size={15}/><input placeholder="Search students…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <select className="field-input" style={{width:150}} value={classFilter} onChange={e=>setClassFilter(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map(c=><option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Class</th><th>Attendance</th><th>Performance</th><th>Tasks</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(s=>(
                <tr key={s.id}>
                  <td><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={s.name} hue={s.avatarHue}/><b style={{fontSize:12.5}}>{s.name}</b></div></td>
                  <td>Class {s.class}</td>
                  <td style={{minWidth:110}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:60}}><ProgressBar value={s.attendance}/></div><span style={{fontSize:11.5,color:"var(--text-mute)"}}>{s.attendance}%</span></div></td>
                  <td style={{minWidth:110}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:60}}><ProgressBar value={s.performance}/></div><span style={{fontSize:11.5,color:"var(--text-mute)"}}>{s.performance}%</span></div></td>
                  <td>{s.tasksCompleted}</td>
                  <td>{s.present ? <span className="badge badge-green"><Check size={11}/> Present</span> : <span className="badge badge-red"><X size={11}/> Absent</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DailyTasksPage({ students }){
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id);
  const [selectedTask, setSelectedTask] = useState(null);
  const [log, setLog] = useState([
    { id:1, student: students[0]?.name, task:"Canva Post", time:"9:20 AM" },
    { id:2, student: students[1]?.name, task:"Coding", time:"10:05 AM" },
  ]);

  const assign = () => {
    if (!selectedStudent || !selectedTask) return;
    const st = students.find(s=>s.id===selectedStudent);
    const tk = TASK_TYPES.find(t=>t.key===selectedTask);
    setLog([{ id: Date.now(), student: st.name, task: tk.label, time:"Just now" }, ...log]);
    setSelectedTask(null);
  };

  return (
    <div>
      <PageHead title="Daily Tasks" sub="Assign today's task type to a student and keep a running log." />
      <div className="grid" style={{gridTemplateColumns:"1.4fr 1fr"}}>
        <div className="card">
          <SectionHead title="Assign a Task" sub="Pick a student, then choose today's task type." />
          <label className="field-label">Student</label>
          <select className="field-input" style={{marginBottom:18}} value={selectedStudent} onChange={e=>setSelectedStudent(Number(e.target.value))}>
            {students.map(s=><option key={s.id} value={s.id}>{s.name} · Class {s.class}</option>)}
          </select>
          <label className="field-label" style={{marginBottom:12}}>Task Type</label>
          <div className="task-grid">
            {TASK_TYPES.map(t=>{
              const Icon = t.icon;
              const sel = selectedTask===t.key;
              return (
                <div key={t.key} className={`task-card ${sel?"selected":""}`} onClick={()=>setSelectedTask(t.key)}>
                  <div className="ic" style={{background:`${t.color}22`, color:t.color}}><Icon size={18}/></div>
                  <div className="lb">{t.label}</div>
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary" style={{marginTop:18}} disabled={!selectedTask} onClick={assign}><Check size={14}/> Assign Task</button>
        </div>

        <div className="card">
          <SectionHead title="Today's Log" sub={`${log.length} tasks recorded`} />
          <div style={{display:"flex",flexDirection:"column",gap:10, maxHeight:520, overflowY:"auto"}}>
            {log.map(l=>(
              <div key={l.id} style={{display:"flex",alignItems:"center",gap:10, padding:"10px 12px", background:"var(--surface2)", borderRadius:12, border:"1px solid var(--border)"}}>
                <Avatar name={l.student} hue={(l.student?.length||1)*37} size={30} radius={9}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5,fontWeight:700}}>{l.student}</div>
                  <div style={{fontSize:11,color:"var(--text-mute)"}}>{l.task}</div>
                </div>
                <div style={{fontSize:10.5,color:"var(--text-mute)"}}>{l.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendancePage({ students, attendance, setAttendance }){
  const present = students.filter(s=>attendance[s.id]!==false).length;
  const absent = students.length - present;
  const pct = Math.round((present/students.length)*100);
  const toggle = (id, val) => setAttendance(prev=>({ ...prev, [id]: val }));

  return (
    <div>
      <PageHead title="Attendance" sub="Mark today's attendance — you can edit it anytime.">
        <button className="btn btn-ghost btn-sm"><CalendarIcon size={14}/> Today</button>
      </PageHead>
      <div className="grid grid-3" style={{marginBottom:18}}>
        <StatCard icon={Check} label="Present" value={present} />
        <StatCard icon={X} label="Absent" value={absent} />
        <StatCard icon={Activity} label="Attendance Rate" value={pct} suffix="%" />
      </div>
      <div className="card">
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Class</th><th>Status</th><th>Mark</th></tr></thead>
            <tbody>
              {students.map(s=>{
                const isPresent = attendance[s.id]!==false;
                return (
                  <tr key={s.id}>
                    <td><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={s.name} hue={s.avatarHue}/><b style={{fontSize:12.5}}>{s.name}</b></div></td>
                    <td>Class {s.class}</td>
                    <td>{isPresent ? <span className="badge badge-green"><Check size={11}/> Present</span> : <span className="badge badge-red"><X size={11}/> Absent</span>}</td>
                    <td>
                      <div className="toggle-pill">
                        <button className={isPresent?"active":""} onClick={()=>toggle(s.id,true)}>Present</button>
                        <button className={!isPresent?"active danger-active":""} onClick={()=>toggle(s.id,false)}>Absent</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PerformancePage({ students }){
  const [selected, setSelected] = useState(students[0]?.id);
  const st = students.find(s=>s.id===selected) || students[0];
  const radarData = st ? [
    { subject:"Attendance", value: st.attendance },
    { subject:"Performance", value: st.performance },
    { subject:"Tasks", value: Math.min(100, st.tasksCompleted*5) },
    { subject:"Consistency", value: Math.round((st.attendance+st.performance)/2 - 5) },
    { subject:"Growth", value: Math.min(100, st.performance+8) },
  ] : [];

  const barData = students.map(s=>({ name: s.name.split(" ")[0], performance: s.performance }));

  return (
    <div>
      <PageHead title="Performance" sub="Individual, student-focused analytics instead of one crowded graph." />
      <div className="grid" style={{gridTemplateColumns:"1fr 1.3fr", marginBottom:18}}>
        <div className="card">
          <SectionHead title="Select Student" />
          <div style={{display:"flex",flexDirection:"column",gap:7,maxHeight:360,overflowY:"auto"}}>
            {students.map(s=>(
              <div key={s.id} onClick={()=>setSelected(s.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:11,cursor:"pointer",
                  background: selected===s.id ? "rgba(168,85,247,0.14)" : "transparent",
                  border: selected===s.id ? "1px solid var(--border-strong)" : "1px solid transparent"}}>
                <Avatar name={s.name} hue={s.avatarHue} size={28} radius={8}/>
                <div style={{flex:1,fontSize:12.5,fontWeight:600}}>{s.name}</div>
                <div style={{fontSize:11,color:"var(--text-mute)"}}>{s.performance}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <SectionHead title={st ? `${st.name} — Skill Radar` : "Skill Radar"} sub="Strength distribution across key areas" />
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{fill:"var(--text-mute)", fontSize:11}} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0,100]} />
              <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.35} strokeWidth={2}/>
              <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:"1.4fr 1fr", marginBottom:18}}>
        <div className="card">
          <SectionHead title="Class Comparison" sub="Performance score across all students" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{fill:"var(--text-mute)", fontSize:10.5}} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={50}/>
              <YAxis tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}}/>
              <Bar dataKey="performance" radius={[6,6,0,0]} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <SectionHead title="Strengths & Weak Points" />
          {st && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <div style={{fontSize:11.5,color:"var(--text-mute)",fontWeight:700,marginBottom:8}}>Strengths</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{st.strengths.map((x,i)=><span key={i} className="badge badge-green">{x}</span>)}</div>
              </div>
              <div>
                <div style={{fontSize:11.5,color:"var(--text-mute)",fontWeight:700,marginBottom:8}}>Weak Points</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{st.weakPoints.map((x,i)=><span key={i} className="badge badge-red">{x}</span>)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WeakPointsPage({ students }){
  const tally = {};
  students.forEach(s => s.weakPoints.forEach(w => tally[w] = (tally[w]||0)+1));
  const data = Object.entries(tally).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count);
  const worst = [...students].sort((a,b)=>a.performance-b.performance).slice(0,5);
  return (
    <div>
      <PageHead title="Weak Points" sub="Where students are struggling most, so you know exactly where to focus." />
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div className="card">
          <SectionHead title="Most Common Weak Areas" />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} layout="vertical" margin={{left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" width={140} tick={{fill:"var(--text-dim)", fontSize:11.5}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}}/>
              <Bar dataKey="count" radius={[0,6,6,0]} fill="var(--danger)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <SectionHead title="Students Needing Attention" sub="Lowest performance this month" />
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {worst.map(s=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:11}}>
                <Avatar name={s.name} hue={s.avatarHue}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:12.5,fontWeight:700}}>{s.name}</div>
                  <div style={{fontSize:11,color:"var(--text-mute)"}}>{s.weakPoints.join(", ")}</div>
                </div>
                <span className="badge badge-red">{s.performance}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopStudentsPage({ students }){
  const ranked = [...students].sort((a,b)=>b.performance-a.performance);
  return (
    <div>
      <PageHead title="Top Students" sub="Ranked by overall performance score." />
      <div className="grid grid-3" style={{marginBottom:18}}>
        {ranked.slice(0,3).map((s,i)=>(
          <div key={s.id} className="card" style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:10}}>#{i+1} RANK</div>
            <Avatar name={s.name} hue={s.avatarHue} size={64} radius={18}/>
            <div style={{fontWeight:800,fontSize:14,marginTop:10}}>{s.name}</div>
            <div style={{fontSize:11.5,color:"var(--text-mute)",marginBottom:10}}>Class {s.class}</div>
            <div style={{fontSize:24,fontWeight:800,color:"var(--accent)"}}>{s.performance}%</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Rank</th><th>Student</th><th>Class</th><th>Performance</th><th>Attendance</th><th>Tasks</th></tr></thead>
            <tbody>
              {ranked.map((s,i)=>(
                <tr key={s.id}>
                  <td><b>#{i+1}</b></td>
                  <td><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={s.name} hue={s.avatarHue}/><b style={{fontSize:12.5}}>{s.name}</b></div></td>
                  <td>Class {s.class}</td>
                  <td>{s.performance}%</td>
                  <td>{s.attendance}%</td>
                  <td>{s.tasksCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MarkSheetPage({ students }){
  const [selected, setSelected] = useState(students[0]?.id);
  const s = students.find(x=>x.id===selected) || students[0];
  const grade = s ? (s.performance>=90?"A+":s.performance>=80?"A":s.performance>=70?"B":s.performance>=60?"C":"D") : "-";
  const subjects = [
    { name:"English", marks: s ? Math.min(100, s.performance+Math.round(seededRand(s.id*2)*10-5)) : 0 },
    { name:"Digital Media", marks: s ? Math.min(100, s.performance+Math.round(seededRand(s.id*3)*10-5)) : 0 },
    { name:"Communication", marks: s ? Math.min(100, s.performance+Math.round(seededRand(s.id*4)*10-5)) : 0 },
    { name:"Discipline", marks: s ? Math.min(100, s.attendance) : 0 },
  ];
  return (
    <div>
      <PageHead title="Monthly Mark Sheet" sub="Auto-generated report card summarizing the student's month.">
        <button className="btn btn-ghost btn-sm"><FileText size={14}/> Export PDF</button>
      </PageHead>
      <div className="grid" style={{gridTemplateColumns:"260px 1fr"}}>
        <div className="card" style={{maxHeight:460,overflowY:"auto"}}>
          <SectionHead title="Students" />
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {students.map(st=>(
              <div key={st.id} onClick={()=>setSelected(st.id)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 9px",borderRadius:10,cursor:"pointer",
                background: selected===st.id ? "rgba(168,85,247,0.14)" : "transparent"}}>
                <Avatar name={st.name} hue={st.avatarHue} size={26} radius={8}/>
                <span style={{fontSize:12}}>{st.name}</span>
              </div>
            ))}
          </div>
        </div>
        {s && (
          <div className="card">
            <div className="profile-hero" style={{marginBottom:22}}>
              <div className="profile-avatar" style={{width:64,height:64,fontSize:20,borderRadius:18}}>{initials(s.name)}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:17}}>{s.name}</div>
                <div style={{fontSize:12,color:"var(--text-mute)"}}>Class {s.class} · September 2026 Report</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700}}>GRADE</div>
                <div style={{fontSize:30,fontWeight:800,color:"var(--accent)"}}>{grade}</div>
              </div>
            </div>

            <div className="scroll-x" style={{marginBottom:20}}>
              <table className="data-table">
                <thead><tr><th>Subject</th><th>Marks (/100)</th><th>Grade</th></tr></thead>
                <tbody>
                  {subjects.map((sub,i)=>(
                    <tr key={i}>
                      <td>{sub.name}</td>
                      <td style={{minWidth:140}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:100}}><ProgressBar value={sub.marks}/></div><span>{sub.marks}</span></div></td>
                      <td><span className="badge badge-purple">{sub.marks>=85?"A":sub.marks>=70?"B":"C"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-2" style={{marginBottom:20}}>
              <div>
                <div style={{fontSize:11.5,color:"var(--text-mute)",fontWeight:700,marginBottom:8}}>Strengths</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{s.strengths.map((x,i)=><span key={i} className="badge badge-green">{x}</span>)}</div>
              </div>
              <div>
                <div style={{fontSize:11.5,color:"var(--text-mute)",fontWeight:700,marginBottom:8}}>Weak Points</div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{s.weakPoints.map((x,i)=><span key={i} className="badge badge-red">{x}</span>)}</div>
              </div>
            </div>

            <div>
              <div style={{fontSize:11.5,color:"var(--text-mute)",fontWeight:700,marginBottom:8}}>Teacher Review</div>
              <div style={{padding:14,borderRadius:12,background:"var(--surface2)",border:"1px solid var(--border)",fontSize:12.5,lineHeight:1.6,color:"var(--text-dim)"}}>
                {s.name.split(" ")[0]} has shown {s.performance>=80?"excellent":"steady"} progress this month with {s.attendance}% attendance.
                Continued focus on {s.weakPoints[0]?.toLowerCase()} will help push results even further next term.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarPage(){
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-based

  const startOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const startOffset = startOfMonth.getDay();
  // sample events (could be driven by backend) — use deterministic mapping so demo shows relevant dates
  const events = {};
  if (viewMonth === 8) { // September sample
    events[5] = "Report Deadline"; events[12] = "Parent Meeting"; events[18] = "Mid-term Review"; events[24] = "Mark Sheet Release";
  }
  const cells = Array.from({length:startOffset}, ()=>null).concat(Array.from({length:daysInMonth},(_,i)=>i+1));
  return (
    <div>
      <PageHead title="Calendar" sub="Key dates, deadlines and school events." />
      <div className="grid" style={{gridTemplateColumns:"1fr 280px"}}>
        <div className="card">
          <SectionHead title={`${MONTHS[viewMonth]} ${viewYear}`} />
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>{ const m = viewMonth-1; if (m<0){ setViewMonth(11); setViewYear(viewYear-1); } else setViewMonth(m); }}>Prev</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>{ const m = viewMonth+1; if (m>11){ setViewMonth(0); setViewYear(viewYear+1); } else setViewMonth(m); }}>Next</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8,marginBottom:8}}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:"var(--text-mute)",fontWeight:700}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
            {cells.map((d,i)=>(
              <div key={i} style={{
                aspectRatio:"1", borderRadius:11, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                background: d ? "var(--surface2)" : "transparent", border: d ? "1px solid var(--border)" : "none",
                fontSize:12, fontWeight:600, position:"relative", color: d? "var(--text)" : "transparent"
              }}>
                {d}
                {d && events[d] && <span style={{position:"absolute",bottom:6,width:5,height:5,borderRadius:"50%",background:"var(--accent)",boxShadow:"0 0 6px var(--accent)"}}/>}
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <SectionHead title="Upcoming Events" />
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {Object.entries(events).map(([d,label])=>(
              <div key={d} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:10,background:"rgba(168,85,247,0.14)",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,flexShrink:0}}>{d}</div>
                <div style={{fontSize:12.5,fontWeight:600}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ role, theme, setTheme }){
  const [toggles, setToggles] = useState({ email:true, push:false, weekly:true });
  const t = (k) => setToggles(p=>({...p,[k]:!p[k]}));
  return (
    <div>
      <PageHead title={role==="teacher" ? "Teacher Settings" : "Settings"} sub="Manage preferences for your account and portal." />
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
        <div className="card">
          <SectionHead title="Appearance" sub="Choose how the portal looks to you." />
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="stat-icon"><Palette size={16}/></div>
              <div><div style={{fontSize:13,fontWeight:700}}>Theme</div><div style={{fontSize:11,color:"var(--text-mute)"}}>Dark or light interface</div></div>
            </div>
            <div className="toggle-pill">
              <button className={theme==="dark"?"active":""} onClick={()=>setTheme("dark")}><Moon size={12} style={{marginRight:5}}/>Dark</button>
              <button className={theme==="light"?"active":""} onClick={()=>setTheme("light")}><Sun size={12} style={{marginRight:5}}/>Light</button>
            </div>
          </div>
          {[
            { k:"email", label:"Email notifications", desc:"Reports, approvals and reminders" },
            { k:"push", label:"Push notifications", desc:"Real-time alerts in-browser" },
            { k:"weekly", label:"Weekly summary", desc:"A digest every Monday morning" },
          ].map(row=>(
            <div key={row.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderTop:"1px solid var(--border)"}}>
              <div><div style={{fontSize:13,fontWeight:700}}>{row.label}</div><div style={{fontSize:11,color:"var(--text-mute)"}}>{row.desc}</div></div>
              <div onClick={()=>t(row.k)} style={{width:42,height:24,borderRadius:20,cursor:"pointer",background: toggles[row.k] ? "linear-gradient(135deg, var(--accent), var(--accent2))" : "var(--surface2)", border:"1px solid var(--border)", position:"relative",transition:"all .2s"}}>
                <div style={{position:"absolute",top:2,left: toggles[row.k] ? 20:2, width:18,height:18,borderRadius:"50%",background:"#fff",transition:"all .2s"}}/>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <SectionHead title="Account" />
          <div className="field-group"><label className="field-label">Language</label><select className="field-input"><option>English</option><option>Urdu</option></select></div>
          <div className="field-group"><label className="field-label">Time Zone</label><select className="field-input"><option>Asia/Karachi (PKT)</option></select></div>
          <EmptyNote>Account changes here are for preview only — connect Supabase to persist real settings.</EmptyNote>
          <button className="btn btn-primary btn-sm"><Check size={14}/> Save Changes</button>
        </div>
      </div>
    </div>
  );
}

const TEACHER_GUIDE = [
  { t:"Dashboard", d:"See attendance, performance and task trends for your classes at a glance." },
  { t:"Students", d:"Search and filter your students, and open any profile for details." },
  { t:"Daily Tasks", d:"Pick a student, choose today's task type, and it's added to the log instantly." },
  { t:"Attendance", d:"Mark Present or Absent per student — toggle it any time during the day." },
  { t:"Performance", d:"Select a student to see their individual radar chart, strengths and weak points." },
  { t:"Mark Sheet", d:"Every student gets an auto-built monthly report card with grade and review." },
];
const ADMIN_GUIDE = [
  { t:"Teachers", d:"View every teacher, their assigned classes and current status." },
  { t:"Classes", d:"Browse Class 1 through 10, each with its own roster and stats." },
  { t:"Report Approval", d:"Approve or reject reports submitted by teachers before they go live." },
  { t:"Performance Analytics", d:"School-wide trends across attendance, tasks and scores." },
  { t:"Audit Logs", d:"A timestamped trail of every important action across the portal." },
  { t:"Notifications", d:"Stay on top of alerts, approvals and system updates in one place." },
];

function HowToUsePage({ role }){
  const guide = role==="teacher" ? TEACHER_GUIDE : ADMIN_GUIDE;
  const [open, setOpen] = useState(null);
  const [faqOpen, setFaqOpen] = useState({});
  const FAQS = [
    {q: 'How do I add a new student?', a: 'Go to Students → Add Student. Fill the form and save. In this demo the action is mocked.'},
    {q: 'Can I export reports?', a: 'Yes — use the Export PDF button on the Mark Sheet page.'},
    {q: 'How do I change theme?', a: 'Open Settings → Appearance and select Dark or Light.'},
  ];

  return (
    <div>
      <PageHead title="How to Use the Portal" sub={`A comprehensive feature guide and operational workflow for the ${role==="teacher"?"Teacher":"Super Admin"} Portal.`} />

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:20}}>
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14,marginBottom:18}}>
            {guide.map((g,i)=>(
              <div key={i} className="howto-card" style={{cursor:'pointer'}} onClick={()=>setOpen(open===i?null:i)}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div className="howto-num">{i+1}</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:14}}>{g.t}</div>
                    <div style={{fontSize:12.5,color:'var(--text-mute)',marginTop:6}}>{g.d}</div>
                  </div>
                </div>
                {open===i && (
                  <div style={{marginTop:12,fontSize:13,color:'var(--text-dim)'}}>
                    <b>Quick steps:</b>
                    <ol style={{margin:'8px 0 0 18px',color:'var(--text-mute)'}}>
                      <li>Open the relevant page from the sidebar.</li>
                      <li>Use top actions (Add / Export / Filter) to complete tasks.</li>
                      <li>Hover elements for context, and use the profile menu for account options.</li>
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <div><div style={{fontWeight:800}}>Interactive Workflow</div><div style={{fontSize:12,color:'var(--text-mute)'}}>Follow this step-by-step flow to complete common tasks</div></div>
              <div className="chip">Try Demo</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}><div className="badge badge-purple">1</div><div><b>Create / Select Class</b><div style={{fontSize:12,color:'var(--text-mute)'}}>Choose class on Classes page or create a new one.</div></div></div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}><div className="badge badge-purple">2</div><div><b>Add Student</b><div style={{fontSize:12,color:'var(--text-mute)'}}>Open Students → Add Student to register a student.</div></div></div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}><div className="badge badge-purple">3</div><div><b>Assign Tasks</b><div style={{fontSize:12,color:'var(--text-mute)'}}>Use Daily Tasks to assign and log activities.</div></div></div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}><div className="badge badge-purple">4</div><div><b>Track Attendance & Performance</b><div style={{fontSize:12,color:'var(--text-mute)'}}>Use Attendance and Performance pages to monitor progress.</div></div></div>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:14}}>
            <div style={{fontWeight:800,marginBottom:6}}>FAQ</div>
            {FAQS.map((f,i)=> (
              <div key={i} style={{borderTop: i? '1px solid var(--border)': 'none', padding:'10px 0'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}} onClick={()=>setFaqOpen(p=>({...p,[i]:!p[i]}))}>
                  <div style={{fontWeight:700}}>{f.q}</div>
                  <div style={{color:'var(--text-mute)'}}>{faqOpen[i] ? '−' : '+'}</div>
                </div>
                {faqOpen[i] && <div style={{marginTop:8,color:'var(--text-mute)'}}>{f.a}</div>}
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{fontWeight:800,marginBottom:8}}>Helpful Resources</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <a style={{color:'var(--accent)'}} href="#">User guide (PDF)</a>
              <a style={{color:'var(--accent)'}} href="#">Teacher onboarding checklist</a>
              <a style={{color:'var(--accent)'}} href="#">Support & contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ role }){
  const [email, setEmail] = useState(TEACHER_EMAIL);
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <PageHead title="Profile & Identity" sub="Your verified system credentials and developer identity across the AI KISA Model School portal." />
      <div className="card" style={{maxWidth:760}}>
        <div className="profile-hero" style={{marginBottom:22}}>
          <div className="profile-avatar" style={{width:84,height:84,fontSize:28,borderRadius:20}}>{initials(TEACHER_NAME)}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:19}}>{TEACHER_NAME}</div>
            <div style={{fontSize:12.5,color:"var(--text-mute)"}}>Teacher · English & Digital Media</div>
            <div style={{marginTop:10,display:'flex',gap:10,alignItems:'center'}}>
              <span className="badge badge-purple">Teacher Access</span>
              <div style={{fontSize:12.5,color:'var(--text-mute)'}}>{TEACHER_CLASSES.map(c=>`Class ${c}`).join(' & ')}</div>
            </div>
          </div>
          <div style={{marginLeft:"auto",display:'flex',gap:10}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(e=>!e)}>{editing? 'Cancel' : 'Update Contact Info'}</button>
            <button className="btn btn-primary btn-sm" onClick={()=>alert('Profile updated (demo)')}><Check size={12}/> Save</button>
          </div>
        </div>

        <div className="grid grid-2" style={{marginBottom:18}}>
          <div>
            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:6}}>Portal Tier</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Teacher Portal</div>

            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:6}}>Designed & Developed By</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Abeha Inam</div>

            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:6}}>Official Email</div>
            {!editing ? (
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{TEACHER_EMAIL}</div>
            ) : (
              <input className="field-input" value={email} onChange={e=>setEmail(e.target.value)} />
            )}
          </div>

          <div>
            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:6}}>Assigned Grade</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Class 8 & Class 9</div>

            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:6}}>System Architecture</div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>React.js · PHP PDO API · PostgreSQL</div>

            <div style={{fontSize:11,color:"var(--text-mute)",fontWeight:700,marginBottom:6}}>About This Management System</div>
            <div style={{fontSize:12.5,lineHeight:1.6,color:"var(--text-dim)"}}>AI KISA Model School's management system was designed and built by Abeha Inam to give teachers and administrators one clear, connected place to track student growth — from daily tasks to monthly report cards.</div>
          </div>
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center',marginTop:10}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>navigator.clipboard?.writeText(TEACHER_EMAIL) || alert(TEACHER_EMAIL)}><ClipboardCheck size={12}/> Copy Official Email</button>
          <button className="btn btn-sm" onClick={()=>alert('Core Developer Attribution Protected')} style={{background:'transparent',border:'1px solid var(--border)',color:'var(--text-mute)'}}>Core Developer Attribution Protected</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== ADMIN-ONLY PAGES ============================== */

function TeachersPage(){
  return (
    <div>
      <PageHead title="Teachers" sub="Every teacher on staff, their classes and current status.">
        <button className="btn btn-primary btn-sm"><Plus size={14}/> Add Teacher</button>
      </PageHead>
      <div className="grid grid-3">
        {TEACHERS.map(t=>(
          <div key={t.id} className="card">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <Avatar name={t.name} hue={t.id*63} size={46} radius={13}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:13.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.name}</div>
                <div style={{fontSize:11.5,color:"var(--text-mute)"}}>{t.subject}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:10}}>
              <span style={{color:"var(--text-mute)"}}>Classes</span>
              <span style={{fontWeight:700}}>{t.classes.map(c=>`C${c}`).join(", ")}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:10}}>
              <span style={{color:"var(--text-mute)"}}>Students</span>
              <span style={{fontWeight:700}}>{t.students}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className={`badge ${t.status==="Active"?"badge-green":"badge-gray"}`}>{t.status}</span>
              <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:"var(--gold)"}}><Star size={12} fill="var(--gold)"/> {t.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassesPage(){
  const [sel, setSel] = useState(1);
  const roster = ALL_STUDENTS.filter(s=>s.class===sel);
  const teacher = TEACHERS.find(t=>t.classes.includes(sel));
  return (
    <div>
      <PageHead title="Classes" sub="Class 1 through Class 10 — pick one to view its roster." />
      <div className="class-grid" style={{marginBottom:22}}>
        {CLASS_NUMS.map(c=>{
          const count = ALL_STUDENTS.filter(s=>s.class===c).length;
          return (
            <div key={c} className={`class-card ${sel===c?"selected":""}`} onClick={()=>setSel(c)}>
              <div className="num">{c}</div>
              <div className="lb">Class {c} · {count} students</div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <SectionHead title={`Class ${sel} Roster`} sub={teacher ? `Class teacher: ${teacher.name}` : "No teacher assigned yet"} />
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Attendance</th><th>Performance</th><th>Tasks</th></tr></thead>
            <tbody>
              {roster.map(s=>(
                <tr key={s.id}>
                  <td><div style={{display:"flex",alignItems:"center",gap:10}}><Avatar name={s.name} hue={s.avatarHue}/><b style={{fontSize:12.5}}>{s.name}</b></div></td>
                  <td>{s.attendance}%</td>
                  <td>{s.performance}%</td>
                  <td>{s.tasksCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ role }){
  return (
    <div>
      <PageHead title="Reports" sub={role==="teacher" ? "Reports you've submitted for review." : "All reports submitted across the school."}>
        <button className="btn btn-primary btn-sm"><Plus size={14}/> New Report</button>
      </PageHead>
      <div className="card">
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Report</th><th>Teacher</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {REPORTS_QUEUE.map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:600}}>{r.title}</td>
                  <td>{r.teacher}</td>
                  <td style={{color:"var(--text-mute)"}}>{r.submitted}</td>
                  <td><span className="badge badge-gold">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportApprovalPage(){
  const [items, setItems] = useState(REPORTS_QUEUE.map(r=>({...r})));
  const decide = (id, status) => setItems(prev=>prev.map(r=>r.id===id?{...r,status}:r));
  return (
    <div>
      <PageHead title="Report Approval" sub="Review and approve reports submitted by teachers before they're published." />
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {items.map(r=>(
          <div key={r.id} className="card" style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{width:42,height:42,borderRadius:12,background:"rgba(168,85,247,0.14)",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><FileText size={18}/></div>
            <div style={{flex:1,minWidth:200}}>
              <div style={{fontWeight:700,fontSize:13.5}}>{r.title}</div>
              <div style={{fontSize:11.5,color:"var(--text-mute)"}}>{r.teacher} · {r.submitted}</div>
            </div>
            {r.status==="Pending" ? (
              <div style={{display:"flex",gap:8}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>decide(r.id,"Rejected")}><ThumbsDown size={13}/> Reject</button>
                <button className="btn btn-primary btn-sm" onClick={()=>decide(r.id,"Approved")}><ThumbsUp size={13}/> Approve</button>
              </div>
            ) : (
              <span className={`badge ${r.status==="Approved"?"badge-green":"badge-red"}`}>{r.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage(){
  const byClass = CLASS_NUMS.map(c=>{
    const list = ALL_STUDENTS.filter(s=>s.class===c);
    const perf = Math.round(list.reduce((a,s)=>a+s.performance,0)/list.length);
    const att = Math.round(list.reduce((a,s)=>a+s.attendance,0)/list.length);
    return { name:`C${c}`, performance: perf, attendance: att };
  });
  return (
    <div>
      <PageHead title="Performance Analytics" sub="School-wide trends across every class." />
      <div className="grid grid-4" style={{marginBottom:18}}>
        <StatCard icon={Users} label="Total Students" value={ALL_STUDENTS.length} trend="3.1%" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={TEACHERS.length} trend="0%" trendDir="up"/>
        <StatCard icon={TrendingUp} label="Avg Performance" value={Math.round(ALL_STUDENTS.reduce((a,s)=>a+s.performance,0)/ALL_STUDENTS.length)} suffix="%" trend="4.7%"/>
        <StatCard icon={CalendarCheck} label="Avg Attendance" value={Math.round(ALL_STUDENTS.reduce((a,s)=>a+s.attendance,0)/ALL_STUDENTS.length)} suffix="%" trend="1.2%"/>
      </div>
      <div className="card" style={{marginBottom:18}}>
        <SectionHead title="Performance & Attendance by Class" />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={byClass}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="name" tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}}/>
            <Bar dataKey="performance" fill="var(--accent)" radius={[6,6,0,0]} name="Performance %"/>
            <Bar dataKey="attendance" fill="var(--accent3)" radius={[6,6,0,0]} name="Attendance %"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <SectionHead title="Monthly School Trend" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MONTHLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"var(--text-mute)", fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontSize:12}}/>
            <Line type="monotone" dataKey="performance" stroke="var(--accent)" strokeWidth={2.5} dot={false}/>
            <Line type="monotone" dataKey="attendance" stroke="var(--accent3)" strokeWidth={2.5} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function NotificationsPage(){
  const iconFor = (type) => type==="alert" ? AlertTriangle : type==="success" ? Check : type==="report" ? FileText : Bell;
  const colorFor = (type) => type==="alert" ? "var(--danger)" : type==="success" ? "var(--success)" : "var(--accent)";
  return (
    <div>
      <PageHead title="Notifications" sub="Everything that needs your attention, in one place." />
      <div className="card">
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {NOTIFICATIONS.map((n,i)=>{
            const Icon = iconFor(n.type);
            return (
              <div key={n.id} style={{display:"flex",gap:13,padding:"14px 6px",borderBottom: i<NOTIFICATIONS.length-1 ? "1px solid var(--border)" : "none"}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${colorFor(n.type)}1f`,color:colorFor(n.type),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={16}/></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{n.title}</div>
                  <div style={{fontSize:12,color:"var(--text-mute)",marginTop:2}}>{n.desc}</div>
                </div>
                <div style={{fontSize:11,color:"var(--text-mute)",whiteSpace:"nowrap"}}>{n.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AuditLogsPage(){
  return (
    <div>
      <PageHead title="Audit Logs" sub="A timestamped trail of important actions across the portal." />
      <div className="card">
        <div className="scroll-x">
          <table className="data-table">
            <thead><tr><th>Actor</th><th>Action</th><th>Target</th><th>Time</th></tr></thead>
            <tbody>
              {AUDIT_LOGS.map(l=>(
                <tr key={l.id}>
                  <td style={{fontWeight:600}}>{l.actor}</td>
                  <td>{l.action}</td>
                  <td style={{color:"var(--text-mute)"}}>{l.target}</td>
                  <td style={{color:"var(--text-mute)"}}>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================== LOGIN ============================== */

function LoginPage({ onLogin }){
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo-ring"><img src={LOGO_SRC} alt="AI KISA Model School"/></div>
        <div className="login-title">AI KISA Model School</div>
        <div className="login-sub">Sign in to the AI Teacher Management System</div>

        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div className="toggle-pill">
            <button className={role==="teacher"?"active":""} onClick={()=>setRole("teacher")}>Teacher</button>
            <button className={role==="admin"?"active":""} onClick={()=>setRole("admin")}>Super Admin</button>
          </div>
        </div>

        <div className="field-group">
          <label className="field-label">Email</label>
          <input className="field-input" type="email" placeholder="you@aikisa.edu.pk" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Password</label>
          <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",marginTop:6}} onClick={()=>onLogin(role)}>
          Sign in to {role==="teacher"?"Teacher Portal":"Super Admin Portal"} <ChevronRight size={15}/>
        </button>
        <EmptyNote>Demo mode: sign-in is mocked here. Connect Supabase Authentication to enable real accounts.</EmptyNote>
      </div>
    </div>
  );
}

/* ============================== SHELL ============================== */

export default function App(){
  const [theme, setTheme] = useState("dark");
  const [role, setRole] = useState(null); // null | 'teacher' | 'admin'
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [attendance, setAttendance] = useState({});

  const nav = role==="teacher" ? TEACHER_NAV : ADMIN_NAV;
  const students = role==="teacher" ? TEACHER_STUDENTS : ALL_STUDENTS;

  useEffect(()=>{ setPage("dashboard"); }, [role]);

  if (!role){
    return (
      <div className={`app-root theme-${theme}`}>
        <GlobalStyles/>
        <div className="orb-field"><div className="orb orb-a"/><div className="orb orb-b"/><div className="orb orb-c"/></div>
        <div style={{position:"fixed",top:18,right:18,zIndex:5}}>
          <div className="icon-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</div>
        </div>
        <LoginPage onLogin={(r)=>setRole(r)} />
      </div>
    );
  }

  const renderPage = () => {
    if (role==="teacher"){
      switch(page){
        case "dashboard": return <DashboardPage role="teacher" students={students} />;
        case "students": return <StudentsPage students={students} role="teacher" />;
        case "tasks": return <DailyTasksPage students={students} />;
        case "attendance": return <AttendancePage students={students} attendance={attendance} setAttendance={setAttendance} />;
        case "performance": return <PerformancePage students={students} />;
        case "reports": return <ReportsPage role="teacher" />;
        case "weak": return <WeakPointsPage students={students} />;
        case "top": return <TopStudentsPage students={students} />;
        case "marksheet": return <MarkSheetPage students={students} />;
        case "calendar": return <CalendarPage />;
        case "settings": return <SettingsPage role="teacher" theme={theme} setTheme={setTheme} />;
        case "how": return <HowToUsePage role="teacher" />;
        case "profile": return <ProfilePage role="teacher" />;
        default: return null;
      }
    } else {
      switch(page){
        case "dashboard": return <DashboardPage role="admin" students={students} />;
        case "teachers": return <TeachersPage />;
        case "students": return <StudentsPage students={students} role="admin" />;
        case "classes": return <ClassesPage />;
        case "reports": return <ReportsPage role="admin" />;
        case "approval": return <ReportApprovalPage />;
        case "analytics": return <AnalyticsPage />;
        case "weakAnalytics": return <WeakPointsPage students={students} />;
        case "top": return <TopStudentsPage students={students} />;
        case "marksheets": return <MarkSheetPage students={students} />;
        case "calendar": return <CalendarPage />;
        case "notifications": return <NotificationsPage />;
        case "audit": return <AuditLogsPage />;
        case "settings": return <SettingsPage role="admin" theme={theme} setTheme={setTheme} />;
        case "how": return <HowToUsePage role="admin" />;
        case "profile": return <ProfilePage role="admin" />;
        default: return null;
      }
    }
  };

  const currentLabel = nav.find(n=>n.key===page)?.label || "Dashboard";

  return (
    <div className={`app-root theme-${theme}`}>
      <GlobalStyles/>
      <div className="orb-field"><div className="orb orb-a"/><div className="orb orb-b"/><div className="orb orb-c"/></div>
      <div className={`mobile-overlay ${mobileOpen?"show":""}`} onClick={()=>setMobileOpen(false)} />
      <div className="shell">
        <aside className={`sidebar ${collapsed?"collapsed":""} ${mobileOpen?"mobile-open":""}`}>
          <div className="sb-brand">
            <div className="sb-logo-wrap"><img src={LOGO_SRC} alt="logo"/></div>
            <div className="sb-brand-text">
              <div className="t1">AI KISA Model School</div>
              <div className="t2">{role==="teacher" ? "Teacher Portal" : "Super Admin Portal"}</div>
            </div>
          </div>
          <nav className="sb-nav">
            {nav.map(item=>{
              const Icon = item.icon;
              return (
                <div key={item.key} className={`sb-item ${page===item.key?"active":""}`} onClick={()=>{ setPage(item.key); setMobileOpen(false); }}>
                  <Icon/><span>{item.label}</span>
                </div>
              );
            })}
          </nav>
          <div className="sb-foot">
            <div className="sb-role-pill">
              <span className="dot"/>
              <div className="info">
                <b>{role==="teacher" ? TEACHER_NAME : "Abeha Inam"}</b>
                <span>{role==="teacher" ? "Teacher" : "Super Admin"}</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <div className="icon-btn" onClick={()=>setMobileOpen(true)} style={{display:"none"}} id="mobileMenuBtn"><Menu size={16}/></div>
            <div className="icon-btn" onClick={()=>setCollapsed(c=>!c)}><Menu size={16}/></div>
            <div className="search-wrap"><Search size={15}/><input placeholder={`Search ${currentLabel.toLowerCase()}…`} /></div>
            <div className="topbar-right">
              <div className="icon-btn" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</div>
              <div className="icon-btn" style={{position:"relative"}}>
                <Bell size={16}/>
                <span style={{position:"absolute",top:6,right:6,width:7,height:7,borderRadius:"50%",background:"var(--danger)"}}/>
              </div>
              <div className="avatar-chip">
                <div className="avatar-circle">{role==="teacher" ? "AN" : "AI"}</div>
                <div>
                  <b>{role==="teacher" ? "Areeba Nadeem" : "Abeha Inam"}</b>
                  <span>{role==="teacher" ? "Teacher" : "Super Admin"}</span>
                </div>
              </div>
              <div className="icon-btn" onClick={()=>setRole(null)} title="Log out"><LogOut size={16}/></div>
            </div>
          </div>
          <div className="content">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}
