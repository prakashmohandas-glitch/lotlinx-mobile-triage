/* ============================================================
   Lotlinx Mobile — swipe deck engine + summary
   Left = snooze · Right = take action · tap a button = specific
   Bottom bar = swipe-only hint (gesture decisions).
   ============================================================ */

const COMMIT_PX = 108;   // drag distance to commit a decision
const FLY_MS    = 300;   // fly-off animation duration

/* drag overlay badge ("TAKE ACTION" / "SNOOZE") */
function SwipeOverlay({ side, opacity }) {
  const right = side==='right';
  return (
    <div style={{ position:'absolute', top:18,
      left: right?'auto':16, right: right?16:'auto',
      transform:`rotate(${right?-9:9}deg)`, opacity, transition:'opacity .08s',
      pointerEvents:'none', zIndex:5 }}>
      <div style={{ display:'flex', alignItems:'center', gap:7,
        border:`3px solid ${right?BRAND:'#fff'}`, color: right?BRAND:'#fff',
        background: right?'rgba(255,255,255,.86)':'rgba(25,25,25,.5)',
        backdropFilter:'blur(2px)', borderRadius:10, padding:'7px 12px',
        fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:18,
        letterSpacing:'.02em' }}>
        {right ? <Chevron size={18} color={BRAND} stroke={4}/> : null}
        {right ? 'TAKE ACTION' : 'SNOOZE'}
      </div>
    </div>
  );
}

/* dark toast pill shown after each decision */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position:'absolute', top:-26, left:'50%', transform:'translateX(-50%)',
      background:'#191919', color:'#fff', borderRadius:999, padding:'7px 15px',
      fontFamily:'Archivo,sans-serif', fontWeight:700, fontSize:12.5, whiteSpace:'nowrap',
      display:'flex', alignItems:'center', gap:7, boxShadow:'0 8px 20px -8px rgba(0,0,0,.5)',
      zIndex:6 }}>
      {toast.type==='action'
        ? <Chevron size={13} color={BRAND} stroke={4}/>
        : <span style={{width:8,height:8,borderRadius:'50%',background:'#A2A2A2'}}/>}
      {toast.label}
    </div>
  );
}

/* ---- "All caught up" summary ---- */
function Summary({ decisions, onBack, onReset }) {
  const acted   = decisions.filter(d=>d.type==='action').length;
  const snoozed = decisions.filter(d=>d.type==='snooze').length;
  const byAction = {};
  decisions.filter(d=>d.type==='action').forEach(d=>{
    byAction[d.action] = (byAction[d.action]||0)+1; });
  return (
    <div style={{ position:'absolute', inset:0, background:'#F4F4F5', display:'flex',
      flexDirection:'column',
      padding:'calc(30px + env(safe-area-inset-top)) 22px calc(22px + env(safe-area-inset-bottom))' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ width:62, height:62, borderRadius:'50%', background:'#191919',
          display:'grid', placeItems:'center', marginBottom:20 }}>
          <Chevron size={26} color={BRAND} stroke={3.6} />
        </div>
        <h2 style={{ margin:0, fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:27,
          letterSpacing:'-0.02em', color:'#191919' }}>All caught up.</h2>
        <p style={{ margin:'8px 0 24px', fontSize:14, color:'#6B6B6E', lineHeight:1.5 }}>
          You reviewed {decisions.length} vehicles. Actions are queued for your team.
        </p>
        <div style={{ display:'flex', gap:11, marginBottom:20 }}>
          <div style={{ flex:1, background:'#fff', border:'1px solid #ECECEE',
            borderRadius:16, padding:'15px 16px' }}>
            <div style={{ fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:32,
              color:BRAND }}>{acted}</div>
            <div style={{ fontSize:12, color:'#6B6B6E', fontWeight:600 }}>actions taken</div>
          </div>
          <div style={{ flex:1, background:'#fff', border:'1px solid #ECECEE',
            borderRadius:16, padding:'15px 16px' }}>
            <div style={{ fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:32,
              color:'#6B6B6E' }}>{snoozed}</div>
            <div style={{ fontSize:12, color:'#6B6B6E', fontWeight:600 }}>snoozed</div>
          </div>
        </div>
        {acted>0 && (
          <div style={{ background:'#fff', border:'1px solid #ECECEE', borderRadius:16,
            padding:'6px 16px' }}>
            {Object.keys(byAction).map((k,i)=>(
              <div key={k} style={{ display:'flex', alignItems:'center', gap:11,
                padding:'11px 0', borderTop:i?'1px solid #F1F1F2':'none' }}>
                <ActionIcon kind={k} size={18} color="#474747" />
                <span style={{ flex:1, fontSize:13.5, color:'#191919', fontWeight:600 }}>
                  {ACTIONS[k].label}</span>
                <span style={{ fontFamily:'Archivo,sans-serif', fontWeight:800,
                  color:'#191919' }}>{byAction[k]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <button onClick={onBack} style={{ width:'100%', padding:'14px', borderRadius:14,
          border:'none', background:'#191919', color:'#fff', cursor:'pointer',
          fontFamily:'Archivo,sans-serif', fontWeight:700, fontSize:15 }}>
          Back to Today</button>
        <button onClick={onReset} style={{ width:'100%', padding:'12px', borderRadius:14,
          border:'1px solid #E1E1E1', background:'#fff', color:'#474747', cursor:'pointer',
          fontFamily:'Archivo,sans-serif', fontWeight:700, fontSize:14 }}>
          Review again</button>
      </div>
    </div>
  );
}

/* ---- the deck ---- */
function SwipeDeck({ onBack }) {
  const total = VEHICLES.length;
  const [idx, setIdx] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flying, setFlying] = useState(null);
  const [toast, setToast] = useState(null);
  const start = useRef(null);
  const moved = useRef(false);
  const busy  = useRef(false);

  const v = VEHICLES[idx];

  const commit = useCallback((type, action) => {
    if (busy.current || !VEHICLES[idx]) return;
    busy.current = true;
    const dir = type==='snooze' ? -1 : 1;
    setFlying({ dir });
    setDragging(false);
    setToast({ type, label: type==='snooze' ? 'Snoozed for now'
      : `${ACTIONS[action].label} · queued` });
    setTimeout(()=>{
      setDecisions(d=>[...d, { id:VEHICLES[idx].id, type, action }]);
      setIdx(i=>i+1);
      setDx(0); setFlying(null);
      busy.current = false;
    }, FLY_MS);
    setTimeout(()=>setToast(null), 1400);
  }, [idx]);

  const onPick = (key)=>commit('action', key);

  const onDown = (e)=>{
    if (busy.current) return;
    start.current = (e.touches?e.touches[0]:e).clientX;
    moved.current = false;
    setDragging(true);
  };
  const onMove = (e)=>{
    if (start.current==null || busy.current) return;
    const x = (e.touches?e.touches[0]:e).clientX;
    const d = x - start.current;
    if (Math.abs(d)>5) moved.current = true;
    setDx(d);
  };
  const onUp = ()=>{
    if (start.current==null) return;
    start.current = null;
    setDragging(false);
    if (dx>COMMIT_PX) commit('action', v && v.action);
    else if (dx<-COMMIT_PX) commit('snooze');
    else setDx(0);
  };

  const undo = ()=>{
    if (!decisions.length || busy.current) return;
    setDecisions(d=>d.slice(0,-1));
    setIdx(i=>Math.max(0,i-1));
    setDx(0); setFlying(null);
  };

  const reset = ()=>{ setDecisions([]); setIdx(0); setDx(0); setFlying(null); };

  if (idx>=total) return <Summary decisions={decisions} onBack={onBack} onReset={reset} />;

  const next = VEHICLES[idx+1];
  const transform = flying
    ? `translate(${flying.dir*660}px,-30px) rotate(${flying.dir*16}deg)`
    : `translate(${dx}px,0) rotate(${dx/24}deg)`;
  const rightOp = flying?.dir===1  ? 1 : Math.max(0, Math.min(1,  dx/95));
  const leftOp  = flying?.dir===-1 ? 1 : Math.max(0, Math.min(1, -dx/95));

  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
      background:'#EDEDEE' }}>
      {/* header */}
      <div style={{ flex:'none',
        padding:'calc(12px + env(safe-area-inset-top)) 14px 10px',
        display:'flex', alignItems:'center', gap:12, background:'#EDEDEE' }}>
        <button onClick={onBack} aria-label="Back to Today"
          style={{ width:34, height:34, borderRadius:'50%', border:'none', background:'#fff',
            cursor:'pointer', display:'grid', placeItems:'center',
            boxShadow:'0 2px 6px -3px rgba(0,0,0,.3)' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#191919"
            strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline',
            marginBottom:5 }}>
            <span style={{ fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:13,
              color:'#191919' }}>Vehicle {idx+1}<span style={{color:'#A2A2A2'}}> / {total}</span></span>
            <span style={{ fontSize:11, color:'#6B6B6E', fontWeight:600, whiteSpace:'nowrap' }}>
              {total-idx} left to review</span>
          </div>
          <div style={{ height:4, background:'#DCDCDE', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(idx/total)*100}%`, background:'#191919',
              borderRadius:2, transition:'width .3s' }} />
          </div>
        </div>
        <button onClick={undo} disabled={!decisions.length} aria-label="Undo last decision"
          style={{ width:34, height:34, borderRadius:'50%', border:'none', background:'#fff',
            cursor:decisions.length?'pointer':'default', opacity:decisions.length?1:.45,
            display:'grid', placeItems:'center', boxShadow:'0 2px 6px -3px rgba(0,0,0,.3)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#191919"
            strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9h11a5 5 0 1 1 0 10h-3"/><path d="M8 5L4 9l4 4"/></svg>
        </button>
      </div>

      {/* card stack */}
      <div style={{ flex:1, position:'relative', padding:'4px 14px 6px', minHeight:0 }}>
        {next && (
          <div style={{ position:'absolute', inset:'4px 14px 6px',
            transform:'scale(.95) translateY(10px)', transformOrigin:'top center',
            filter:'brightness(.99)', opacity:.85, pointerEvents:'none' }}>
            <div style={{ height:'100%', borderRadius:24, overflow:'hidden',
              boxShadow:'0 8px 26px -16px rgba(0,0,0,.4)' }}>
              <VehicleCard v={next} onPick={()=>{}} />
            </div>
          </div>
        )}
        <div
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          onPointerCancel={onUp} onPointerLeave={()=>dragging&&onUp()}
          style={{ position:'absolute', inset:'4px 14px 6px', touchAction:'pan-y',
            transform, transition: dragging?'none':`transform ${FLY_MS/1000}s cubic-bezier(.22,.61,.36,1)`,
            cursor:'grab', zIndex:2, boxShadow:'0 14px 36px -18px rgba(0,0,0,.5)',
            borderRadius:24 }}>
          <div style={{ height:'100%', position:'relative', borderRadius:24 }}>
            <SwipeOverlay side="right" opacity={rightOp} />
            <SwipeOverlay side="left"  opacity={leftOp} />
            <VehicleCard v={v} onPick={onPick} />
          </div>
        </div>
      </div>

      {/* bottom bar — swipe-only hint */}
      <div style={{ flex:'none', position:'relative',
        padding:'10px 16px calc(16px + env(safe-area-inset-bottom))', background:'#EDEDEE' }}>
        <Toast toast={toast} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'#fff', border:'1px solid #E1E1E1', borderRadius:14, padding:'11px 16px' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, color:'#6B6B6E',
            fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:12.5,
            letterSpacing:'.04em' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B6B6E"
              strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 6l-7 6 7 6"/></svg>
            SNOOZE
          </span>
          <span style={{ width:1, height:16, background:'#E1E1E1' }} />
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, color:BRAND,
            fontFamily:'Archivo,sans-serif', fontWeight:800, fontSize:12.5,
            letterSpacing:'.04em' }}>
            TAKE ACTION
            <Chevron size={15} color={BRAND} stroke={4} />
          </span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SwipeDeck, Summary });
