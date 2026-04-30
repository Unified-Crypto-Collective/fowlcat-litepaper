import { useEffect, useMemo, useRef, useState } from "react";

const COLORS = {
  bg: "#0a0c08",
  panel: "#0f1209",
  border: "#1e2a10",
  accent: "#7fff00",
  amber: "#ffb700",
  red: "#ff3b3b",
  dim: "#3a4a20",
  text: "#c8d4a0",
  textDim: "#5a6840",
  textBright: "#e8f0c0",
  blue: "#4af",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;800;900&family=Orbitron:wght@400;700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'Share Tech Mono', monospace; min-height: 100vh; overflow: hidden; }
  .hud-root { display: flex; flex-direction: column; height: 100vh; background: ${COLORS.bg}; background-image: linear-gradient(rgba(127,255,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(127,255,0,0.015) 1px, transparent 1px); background-size: 40px 40px; }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 52px; border-bottom: 1px solid ${COLORS.border}; background: ${COLORS.panel}; flex-shrink: 0; position: relative; overflow: hidden; }
  .topbar::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, ${COLORS.accent}, transparent); opacity: 0.4; }
  .topbar-logo { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 18px; color: ${COLORS.accent}; letter-spacing: 4px; text-transform: uppercase; }
  .topbar-logo span { color: ${COLORS.amber}; }
  .topbar-center { display: flex; gap: 4px; align-items: center; }
  .topbar-clock { font-family: 'Orbitron', sans-serif; font-size: 13px; color: ${COLORS.amber}; letter-spacing: 2px; }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: ${COLORS.accent}; box-shadow: 0 0 8px ${COLORS.accent}; animation: pulse 2s infinite; margin-right: 6px; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .topbar-right { display: flex; gap: 16px; align-items: center; font-size: 11px; color: ${COLORS.textDim}; letter-spacing: 1px; }
  .badge { padding: 2px 8px; border: 1px solid ${COLORS.dim}; border-radius: 2px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
  .badge.green { border-color: ${COLORS.accent}; color: ${COLORS.accent}; }
  .badge.amber { border-color: ${COLORS.amber}; color: ${COLORS.amber}; }
  .layout { display: flex; flex: 1; overflow: hidden; }
  .sidebar { width: 64px; background: ${COLORS.panel}; border-right: 1px solid ${COLORS.border}; display: flex; flex-direction: column; align-items: center; padding: 16px 0; gap: 4px; flex-shrink: 0; }
  .nav-btn { width: 48px; height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid transparent; border-radius: 4px; cursor: pointer; background: transparent; color: ${COLORS.textDim}; gap: 3px; transition: all 0.15s; font-size: 9px; letter-spacing: 0.5px; font-family: 'Share Tech Mono', monospace; }
  .nav-btn:hover { background: rgba(127,255,0,0.05); color: ${COLORS.text}; border-color: ${COLORS.dim}; }
  .nav-btn.active { background: rgba(127,255,0,0.08); color: ${COLORS.accent}; border-color: ${COLORS.dim}; box-shadow: inset 0 0 12px rgba(127,255,0,0.05); }
  .nav-icon { font-size: 18px; line-height: 1; }
  .main { flex: 1; overflow-y: auto; padding: 24px; scrollbar-width: thin; scrollbar-color: ${COLORS.dim} transparent; }
  .screen-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid ${COLORS.border}; padding-bottom: 12px; }
  .screen-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 28px; text-transform: uppercase; letter-spacing: 3px; color: ${COLORS.textBright}; }
  .screen-sub { font-size: 11px; color: ${COLORS.textDim}; letter-spacing: 1px; }
  .panel-box { background: ${COLORS.panel}; border: 1px solid ${COLORS.border}; border-radius: 4px; padding: 16px; position: relative; }
  .panel-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${COLORS.textDim}; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
  .panel-label span { color: ${COLORS.accent}; }
  .memory-search { width: 100%; background: ${COLORS.panel}; border: 1px solid ${COLORS.border}; border-radius: 3px; padding: 10px 14px; font-family: 'Share Tech Mono', monospace; font-size: 12px; color: ${COLORS.text}; margin-bottom: 16px; outline: none; transition: border-color 0.15s; }
  .memory-search:focus { border-color: ${COLORS.accent}; }
  .memory-entry { border-left: 2px solid ${COLORS.dim}; padding: 10px 14px; margin-bottom: 10px; background: rgba(255,255,255,0.01); transition: border-color 0.15s; }
  .memory-entry:hover { border-color: ${COLORS.accent}; }
  .memory-date { font-size: 10px; color: ${COLORS.amber}; letter-spacing: 1px; margin-bottom: 4px; }
  .memory-text { font-size: 12px; color: ${COLORS.text}; line-height: 1.6; }
  .memory-tags { margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap; }
  .memory-tag { font-size: 9px; padding: 1px 6px; background: rgba(127,255,0,0.06); color: ${COLORS.textDim}; border-radius: 2px; letter-spacing: 1px; }
`;

const MEMORIES = [
  { date: "2025-01-30 20:41", text: "OpenRouter test succeeded.", tags: ["openrouter", "milestone"] },
  { date: "2025-01-30 18:15", text: "Telegram bot went silent after bot.py rewrite.", tags: ["telegram", "debug"] },
];

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span>{t.toLocaleTimeString("en-US", { hour12: false })} · {t.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</span>
  );
}

function MemoryScreen() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => MEMORIES.filter((m) => !query || m.text.toLowerCase().includes(query) || m.tags.some((t) => t.includes(query))), [query]);

  return (
    <div>
      <div className="screen-header">
        <div className="screen-title">Memory</div>
        <div className="screen-sub">DAILY LOGS + LONG-TERM MEMORY — SEARCHABLE</div>
      </div>
      <input className="memory-search" placeholder="> SEARCH MEMORY..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search memory" />
      {filtered.map((m, i) => (
        <div key={`${m.date}-${i}`} className="memory-entry">
          <div className="memory-date">{m.date}</div>
          <div className="memory-text">{m.text}</div>
          <div className="memory-tags">{m.tags.map((t) => <span key={`${m.date}-${t}`} className="memory-tag">{t}</span>)}</div>
        </div>
      ))}
    </div>
  );
}

export default function FlywheelHUD() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    ctx.fillStyle = "#0a0c08";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return undefined;
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="hud-root">
        <div className="topbar">
          <div className="topbar-logo">FLYWHEEL<span>OS</span></div>
          <div className="topbar-center">
            <div className="status-dot" />
            <div className="topbar-clock"><Clock /></div>
          </div>
          <div className="topbar-right">
            <div className="badge green">BACKEND UP</div>
            <div className="badge amber">OPENROUTER OK</div>
          </div>
        </div>
        <div className="main">
          <MemoryScreen />
          <canvas ref={canvasRef} width={570} height={120} />
        </div>
      </div>
    </>
  );
}
