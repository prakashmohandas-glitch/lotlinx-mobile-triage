/* ============================================================
   Lotlinx Mobile — the vehicle card (Dossier Split / Layout B)
   Approved direction, demo defaults baked in:
     band 40% · health = topbar · evidence = chips · heading = plain
     VIN detail row on · actions = row · accent = brand red · radius 24
   ============================================================ */

const CARD_RADIUS = 24;
const PHOTO_BAND  = 40;   // % of card height

function softTint(hex, a) {
  const n = hex.replace('#','');
  const r = parseInt(n.slice(0,2),16),
        g = parseInt(n.slice(2,4),16),
        b = parseInt(n.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ---- vehicle photo with striped fallback ---- */
function CarPhoto({ v, style, children }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ position:'relative', overflow:'hidden', background:'#222', ...style }}>
      {!err ? (
        <img src={v.photo} alt="" draggable={false} onError={()=>setErr(true)}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block',
            userSelect:'none', pointerEvents:'none' }} />
      ) : (
        <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center',
          background:`repeating-linear-gradient(135deg,#2b2b2e 0 12px,#242427 12px 24px)`,
          color:'#9a9a9e', font:'600 11px ui-monospace,monospace', letterSpacing:'.1em' }}>
          VEHICLE&nbsp;PHOTO
        </div>
      )}
      {children}
    </div>
  );
}

/* ---- Year Make Model + trim / stock, over the photo scrim ---- */
function TitleBlock({ v, light=false }) {
  const c = light ? '#fff' : '#191919';
  const sub = light ? 'rgba(255,255,255,.82)' : '#6B6B6E';
  return (
    <div style={{ lineHeight:1.05 }}>
      <div style={{ fontFamily:'Archivo, sans-serif', fontWeight:800,
        fontSize:18, letterSpacing:'-0.02em', color:c }}>
        {v.year} {v.make} {v.model}
      </div>
      <div style={{ fontSize:12.5, color:sub, marginTop:3, fontWeight:500 }}>
        {v.trim} · Stock #{v.stock}
      </div>
    </div>
  );
}

/* ---- "LOTLINX RECOMMENDS" callout (tinted to the brand accent) ---- */
function RecCallout({ v }) {
  return (
    <div style={{ background:softTint(BRAND,.07), border:`1px solid ${softTint(BRAND,.22)}`,
      borderRadius:13, padding:'11px 13px', display:'flex', gap:10 }}>
      <div style={{ flex:'none', marginTop:1 }}>
        <Chevron size={15} color={BRAND} stroke={4} />
      </div>
      <div style={{ minWidth:0 }}>
        <div style={{ fontSize:10.5, fontWeight:800, color:BRAND,
          letterSpacing:'.09em', textTransform:'uppercase', marginBottom:3 }}>
          Lotlinx recommends
        </div>
        <div style={{ fontSize:13, color:'#2A2A2C', lineHeight:1.4, fontWeight:500 }}>
          {v.rec}
        </div>
      </div>
    </div>
  );
}

/* ---- evidence chips: Age / VDPs / Opps / Sales ---- */
function EvidenceChips({ v }) {
  const items = [
    { lab:'Age',   val:`${v.days}d` },
    { lab:'VDPs',  val:v.vdps.toLocaleString() },
    { lab:'Opps',  val:v.opps },
    { lab:'Sales', val:'0' },
  ];
  return (
    <div style={{ display:'flex', gap:7 }}>
      {items.map((it,i)=>(
        <div key={i} style={{ flex:1, background:'#F6F6F7', borderRadius:11,
          padding:'8px 6px', textAlign:'center' }}>
          <div style={{ fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:16,
            color:'#191919', fontVariantNumeric:'tabular-nums' }}>{it.val}</div>
          <div style={{ fontSize:9.5, color:'#A2A2A2', fontWeight:700,
            letterSpacing:'.06em', textTransform:'uppercase', marginTop:1 }}>{it.lab}</div>
        </div>
      ))}
    </div>
  );
}

/* ---- row of 4 action buttons ----
   DEMO: shown but inactive (greyed out, non-interactive). The card stays fully
   swipeable across this area. To re-enable, restore the button/onPick handlers
   from git history (commit before "grey out action buttons"). */
function ActionRow({ v, onPick }) {
  return (
    <div style={{ display:'flex', gap:7, pointerEvents:'none', userSelect:'none' }}>
      {ACTION_ORDER.map(k=>(
        <div key={k} aria-disabled="true"
          style={{ display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:5, padding:'10px 4px', flex:1,
            borderRadius:12, fontFamily:'Archivo,sans-serif',
            border:'1px solid #ECECEE', background:'#F4F4F5', opacity:.65 }}>
          <ActionIcon kind={k} size={19} color="#BFC0C5" />
          <span style={{ fontWeight:700, fontSize:10.5, lineHeight:1.1, textAlign:'center',
            color:'#B6B7BC' }}>{ACTIONS[k].label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- the card ---- */
function VehicleCard({ v, onPick }) {
  const h = HEALTH[v.health];
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column',
      background:'#fff', borderRadius:CARD_RADIUS, overflow:'hidden' }}>

      {/* photo band */}
      <CarPhoto v={v} style={{ height:PHOTO_BAND+'%' }}>
        {/* health marker = top bar */}
        <div style={{ position:'absolute', left:0, right:0, top:0, height:5,
          background:h.color }} />
        <div style={{ position:'absolute', top:11, left:12 }}>
          <HealthPill k={v.health} dark />
        </div>
        <div style={{ position:'absolute', left:0, right:0, bottom:0,
          padding:'30px 14px 11px',
          background:'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.8))',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <TitleBlock v={v} light />
          <div style={{ color:'#fff', fontFamily:'Archivo,sans-serif', fontWeight:800,
            fontSize:15 }}>{v.price}</div>
        </div>
      </CarPhoto>

      {/* body */}
      <div style={{ flex:1, padding:'14px 16px 15px', display:'flex',
        flexDirection:'column', gap:13, minHeight:0, justifyContent:'space-between' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {/* headline */}
          <div>
            <div style={{ fontSize:10.5, fontWeight:800, color:'#A2A2A2',
              letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>
              What's happening
            </div>
            <div style={{ fontFamily:'Archivo,sans-serif', fontWeight:700, fontSize:17.5,
              letterSpacing:'-0.01em', color:'#191919', lineHeight:1.22 }}>
              {v.primary}
            </div>
          </div>

          <EvidenceChips v={v} />
          <RecCallout v={v} />

          {/* VIN detail row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'1px 2px 0' }}>
            <span style={{ fontSize:11.5, color:'#8A8A8E', fontWeight:600 }}>
              {v.miles} · listed {v.days} days ago
            </span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11.5,
              color:'#191919', fontWeight:700 }}>
              VIN detail
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#191919"
                strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6"/></svg>
            </span>
          </div>
        </div>

        <ActionRow v={v} onPick={onPick} />
      </div>
    </div>
  );
}

Object.assign(window, { softTint, CarPhoto, TitleBlock, RecCallout, EvidenceChips, ActionRow, VehicleCard });
