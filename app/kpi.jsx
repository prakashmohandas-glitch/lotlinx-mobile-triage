/* ============================================================
   Lotlinx Mobile — KPI "Today" dashboard (entry screen)
   ============================================================ */

function KpiHeader() {
  return (
    <div style={{ background:'#191919', color:'#fff',
      padding:'calc(14px + env(safe-area-inset-top)) 18px 13px',
      display:'flex', alignItems:'center', justifyContent:'space-between', flex:'none' }}>
      <Logo light h={17} />
      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
        <div style={{ textAlign:'right', lineHeight:1.15 }}>
          <div style={{ fontSize:12, fontWeight:600 }}>Riverside Auto</div>
          <div style={{ fontSize:10.5, color:'#A2A2A2' }}>Group · West</div>
        </div>
        <div style={{ width:30, height:30, borderRadius:'50%', flex:'none',
          background:BRAND, color:'#fff', display:'grid', placeItems:'center',
          fontFamily:'Archivo, sans-serif', fontWeight:800, fontSize:12 }}>RA</div>
      </div>
    </div>
  );
}

function HeroKpi() {
  const k = KPIS.hero;
  return (
    <div style={{ padding:'4px 2px 2px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:7, height:7, borderRadius:2, background:BRAND }} />
        <span style={{ fontSize:12.5, fontWeight:700, color:'#474747',
          letterSpacing:'.02em' }}>{k.label}</span>
      </div>
      <div style={{ display:'flex', alignItems:'flex-end', gap:12, marginTop:2 }}>
        <div style={{ fontFamily:'Archivo, sans-serif', fontWeight:800,
          fontSize:62, lineHeight:.92, letterSpacing:'-0.03em', color:'#191919',
          fontVariantNumeric:'tabular-nums' }}>{k.value}</div>
        <div style={{ paddingBottom:8 }}>
          <Delta dir={k.dir}>{k.delta}</Delta>
          <div style={{ fontSize:11, color:'#A2A2A2', marginTop:2 }}>{k.note}</div>
        </div>
      </div>
    </div>
  );
}

function MiniKpi({ k }) {
  return (
    <div style={{ flex:1, padding:'12px 12px 11px', background:'#fff',
      border:'1px solid #ECECEE', borderRadius:14 }}>
      <div style={{ fontSize:11, color:'#6B6B6E', fontWeight:600, lineHeight:1.2,
        height:26 }}>{k.label}</div>
      <div style={{ fontFamily:'Archivo, sans-serif', fontWeight:800, fontSize:27,
        letterSpacing:'-0.02em', color:'#191919', fontVariantNumeric:'tabular-nums',
        marginTop:3 }}>{k.value}</div>
      <div style={{ marginTop:4 }}><Delta dir={k.dir}>{k.delta}</Delta></div>
    </div>
  );
}

function InventoryCard({ data }) {
  const total = data.rows.reduce((s,r)=>s+r.count,0);
  const down = data.tone==='down';
  const accent = down ? '#E23744' : '#1BA45A';
  return (
    <div style={{ background:'#fff', border:'1px solid #ECECEE', borderRadius:16,
      padding:'13px 15px 6px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:4,
        background:accent }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom:2 }}>
        <span style={{ fontFamily:'Archivo, sans-serif', fontWeight:700,
          fontSize:13.5, color:'#191919', letterSpacing:'.01em' }}>{data.title}</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:4,
          color:accent, fontWeight:800, fontFamily:'Archivo, sans-serif', fontSize:13 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent}
            strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: down?'rotate(180deg)':'none' }}>
            <path d="M12 5 L12 19 M6 11 L12 5 L18 11"/></svg>
          {total} VINs
        </span>
      </div>
      <div style={{ marginLeft:2 }}>
        {data.rows.map((r,i)=>(
          <div key={i} style={{ borderTop: i? '1px solid #F1F1F2':'none' }}>
            <TransitionRow {...r} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SwipeUpCTA({ count, onEnter }) {
  const start = useRef(null);
  const onDown = (e)=>{ start.current = (e.touches?e.touches[0]:e).clientY; };
  const onUp = (e)=>{
    if (start.current==null) return;
    const y = (e.changedTouches?e.changedTouches[0]:e).clientY;
    if (start.current - y > 40) onEnter();
    start.current = null;
  };
  return (
    <div
      onPointerDown={onDown} onPointerUp={onUp} onClick={onEnter}
      style={{ flex:'none', padding:'12px 16px calc(16px + env(safe-area-inset-bottom))',
        cursor:'pointer',
        background:'linear-gradient(180deg, rgba(244,244,245,0) 0%, #F4F4F5 26%)',
        userSelect:'none', touchAction:'none' }}>
      <div style={{ background:'#191919', borderRadius:18, padding:'13px 18px',
        display:'flex', alignItems:'center', gap:14, color:'#fff',
        boxShadow:'0 10px 24px -10px rgba(25,25,25,.5)' }}>
        <div className="ll-bounce" style={{ display:'grid', placeItems:'center',
          width:34, height:34, borderRadius:'50%', background:BRAND, flex:'none' }}>
          <Chevron size={17} color="#fff" up stroke={3.6} />
        </div>
        <div style={{ flex:1, lineHeight:1.2 }}>
          <div style={{ fontFamily:'Archivo, sans-serif', fontWeight:800, fontSize:15 }}>
            {count} vehicles need a decision
          </div>
          <div style={{ fontSize:11.5, color:'#A2A2A2', marginTop:1 }}>
            Swipe up to start reviewing
          </div>
        </div>
        <span style={{ fontSize:10.5, color:'#A2A2A2', fontWeight:700,
          letterSpacing:'.12em', textTransform:'uppercase' }}>Today</span>
      </div>
    </div>
  );
}

function KpiScreen({ onEnter }) {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
      background:'#F4F4F5' }}>
      <KpiHeader />
      <div style={{ flex:1, overflowY:'auto', padding:'16px 16px 4px' }} className="ll-scroll">
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between',
          marginBottom:8 }}>
          <h1 style={{ margin:0, fontFamily:'Archivo, sans-serif', fontWeight:800,
            fontSize:22, letterSpacing:'-0.02em', color:'#191919' }}>Today</h1>
          <span style={{ fontSize:12, color:'#A2A2A2', fontWeight:600 }}>Sat · Jun 7</span>
        </div>

        <div style={{ background:'#fff', border:'1px solid #ECECEE', borderRadius:18,
          padding:'14px 16px 16px', marginBottom:11 }}>
          <HeroKpi />
        </div>

        <div style={{ display:'flex', gap:9, marginBottom:18 }}>
          {KPIS.row.map((k,i)=><MiniKpi key={i} k={k} />)}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <span style={{ fontFamily:'Archivo, sans-serif', fontWeight:700, fontSize:12.5,
            letterSpacing:'.1em', textTransform:'uppercase', color:'#6B6B6E' }}>
            Inventory movement
          </span>
          <span style={{ height:1, flex:1, background:'#E1E1E1' }} />
          <span style={{ fontSize:11, color:'#A2A2A2', fontWeight:600 }}>last 7 days</span>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
          <InventoryCard data={INVENTORY.attention} />
          <InventoryCard data={INVENTORY.control} />
        </div>
      </div>
      <SwipeUpCTA count={VEHICLES.length} onEnter={onEnter} />
    </div>
  );
}

Object.assign(window, { KpiScreen });
