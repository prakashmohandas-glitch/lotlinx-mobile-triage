/* ============================================================
   Lotlinx Mobile — app shell
   Two screens that slide vertically: KPI "Today"  ⇄  swipe deck.
   ============================================================ */

function App() {
  const [screen, setScreen] = useState('kpi'); // 'kpi' | 'deck'
  const deck = screen==='deck';
  const slide = 'transform .44s cubic-bezier(.7,0,.2,1)';
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background:'#000' }}>
      <div style={{ position:'absolute', inset:0,
        transform: deck?'translateY(-100%)':'translateY(0)', transition:slide }}>
        <KpiScreen onEnter={()=>setScreen('deck')} />
      </div>
      <div style={{ position:'absolute', inset:0,
        transform: deck?'translateY(0)':'translateY(100%)', transition:slide }}>
        <SwipeDeck onBack={()=>setScreen('kpi')} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
