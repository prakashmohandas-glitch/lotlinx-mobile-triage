/* ============================================================
   Lotlinx Mobile — shared atoms
   (Logo, Chevron, action icons, delta pill, health pills, rows)
   ============================================================ */
const { useState, useRef, useEffect, useCallback } = React;

/* ---- Brand chevron (the Lotlinx mark), CSS-drawn so it tints ---- */
function Chevron({ size=14, color=BRAND, up=false, stroke=3.2 }) {
  const r = up ? -90 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         style={{ transform:`rotate(${r}deg)`, display:'block' }}>
      <path d="M8 4 L17 12 L8 20" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Lotlinx lockup (wordmark in type + red chevron mark) ----
   Placeholder: swap for the official Lotlinx SVG from the brand system. */
function Logo({ light=false, h=18 }) {
  const ink = light ? '#FFFFFF' : '#191919';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0,
      fontFamily:'Archivo, sans-serif', fontWeight:800, fontSize:h,
      letterSpacing:'-0.02em', color:ink, lineHeight:1 }}>
      <span>Lotlin</span>
      <span style={{ position:'relative', display:'inline-block', width:h*0.62, height:h }}>
        <span style={{ position:'absolute', inset:0, color:ink }}>x</span>
        <span style={{ position:'absolute', right:-h*0.04, top:'50%',
          transform:'translateY(-50%)' }}>
          <Chevron size={h*0.66} color={BRAND} stroke={4} />
        </span>
      </span>
    </div>
  );
}

/* ---- Action icons (simple monoline) ---- */
function ActionIcon({ kind, size=20, color='currentColor', sw=1.7 }) {
  const common = { width:size, height:size, viewBox:'0 0 24 24', fill:'none',
    stroke:color, strokeWidth:sw, strokeLinecap:'round', strokeLinejoin:'round' };
  if (kind==='assign') return (
    <svg {...common}><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c0-3 2.5-4.8 5.5-4.8 1.2 0 2.3.3 3.2.8"/><path d="M17 14v6M14 17h6"/></svg>);
  if (kind==='pm') return (
    <svg {...common}><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="3.4" height="6" rx="1.3"/><rect x="17.6" y="13" width="3.4" height="6" rx="1.3"/><path d="M20 19v.5a3 3 0 0 1-3 3h-2.5"/></svg>);
  if (kind==='merch') return (
    <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2.2"/><circle cx="8.5" cy="10" r="1.6"/><path d="M4 17l4.5-4 3 2.6L16 11l4 4.5"/></svg>);
  if (kind==='price') return (
    <svg {...common}><path d="M4 4h6.2L20 13.8a2 2 0 0 1 0 2.8l-3.4 3.4a2 2 0 0 1-2.8 0L4 10.2V4z"/><circle cx="8.4" cy="8.4" r="1.3" fill={color} stroke="none"/></svg>);
  return null;
}

/* ---- small up/down delta pill ---- */
function Delta({ dir, children }) {
  const up = dir==='up';
  const c = up ? '#1BA45A' : '#E23744';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3,
      color:c, fontWeight:700, fontSize:12.5, fontFamily:'Archivo, sans-serif' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c}
        strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: up?'none':'rotate(180deg)' }}>
        <path d="M12 5 L12 19 M6 11 L12 5 L18 11"/></svg>
      {children}
    </span>
  );
}

/* ---- health dot + pill ---- */
function HealthDot({ k, size=10, ring=false }) {
  const h = HEALTH[k];
  return <span style={{ width:size, height:size, borderRadius:'50%',
    background:h.color, display:'inline-block', flex:'none',
    boxShadow: ring?`0 0 0 3px ${h.soft}`:'none' }} />;
}
function HealthPill({ k, dark=false }) {
  const h = HEALTH[k];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6,
      padding:'5px 11px 5px 8px', borderRadius:999,
      background: dark ? 'rgba(12,12,14,.6)' : h.soft,
      color: dark ? '#fff' : h.ink,
      fontFamily:'Archivo, sans-serif', fontWeight:800, fontSize:11.5,
      letterSpacing:'.05em', textTransform:'uppercase',
      backdropFilter: dark?'blur(5px)':'none',
      boxShadow: dark?'0 1px 4px rgba(0,0,0,.25)':'none' }}>
      <span style={{ width:9, height:9, borderRadius:'50%', background:h.color,
        boxShadow: dark?`0 0 0 2px rgba(255,255,255,.3)`:'none' }} />
      {h.label}
    </span>
  );
}

/* ---- transition chip e.g. Green → Yellow ---- */
function TransitionRow({ from, to, count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0' }}>
      <HealthDot k={from} size={11} />
      <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="#A2A2A2"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none'}}>
        <path d="M3 8h15M14 3l5 5-5 5"/></svg>
      <HealthDot k={to} size={11} />
      <span style={{ fontSize:13.5, color:'#474747', fontWeight:500, flex:1,
        whiteSpace:'nowrap' }}>
        {HEALTH[from].label} <span style={{color:'#A2A2A2'}}>to</span> {HEALTH[to].label}
      </span>
      <span style={{ fontFamily:'Archivo, sans-serif', fontWeight:800,
        fontSize:17, color:'#191919' }}>{count}</span>
    </div>
  );
}

Object.assign(window, { Chevron, Logo, ActionIcon, Delta, HealthDot, HealthPill, TransitionRow });
