const START_DATE = '2026-06-21T12:00:00';
const CYCLE_LEN = 28;
const PERIOD_DUR = 5;

function CycleCalendar() {
  const [viewingDate, setViewingDate] = React.useState(new Date());

  const changeMonth = (dir) => {
    const newDate = new Date(viewingDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setViewingDate(newDate);
  };

  const yr = viewingDate.getFullYear();
  const mo = viewingDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const start = new Date(START_DATE);
  
  const ovTarget = CYCLE_LEN - 14;
  const fertS = ovTarget - 4;
  const fertE = ovTarget + 1;
  const today = new Date();
  today.setHours(12,0,0,0);

  const days = [];
  for(let i=0; i<firstDay; i++) days.push(<div key={`empty-${i}`} className="cal-day" style={{background: 'transparent', border: 'none'}}></div>);

  for(let d=1; d<=daysInMonth; d++) {
    const cur = new Date(yr, mo, d, 12, 0, 0);
    const diff = Math.round((cur - start) / 864e5);
    const cycleDay = ((diff % CYCLE_LEN) + CYCLE_LEN) % CYCLE_LEN;
    
    let cls = 'cal-day';
    if (cycleDay < PERIOD_DUR) cls += ' day-period';
    else if (cycleDay === ovTarget) cls += ' day-ovulation';
    else if (cycleDay >= fertS && cycleDay <= fertE) cls += ' day-fertile';
    
    if (cur.getTime() === today.getTime()) cls += ' day-today';
    
    days.push(<div key={d} className={cls}>{d}</div>);
  }

  return (
    <div className="card">
      <div className="card-title" style={{justifyContent: 'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <i className="ti ti-calendar"></i>
          <span>Cycle calendar — {monthNames[mo]} {yr}</span>
        </div>
        <div style={{display:'flex', gap:'8px'}}>
          <button className="icon-btn" onClick={() => changeMonth(-1)}><i className="ti ti-chevron-left"></i></button>
          <button className="icon-btn" onClick={() => changeMonth(1)}><i className="ti ti-chevron-right"></i></button>
        </div>
      </div>
      <div className="cal-header">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>
      <div className="cal-grid">
        {days}
      </div>
      <div className="legend-row">
        <div className="legend-item"><div className="legend-dot" style={{background: 'rgba(255, 77, 109, 0.5)', border: '1px solid var(--primary)'}}></div>Predicted period</div>
        <div className="legend-item"><div className="legend-dot" style={{background: 'rgba(56, 176, 0, 0.4)', border: '1px solid var(--success)'}}></div>Fertile window</div>
        <div className="legend-item"><div className="legend-dot" style={{background: 'rgba(255, 179, 193, 0.6)', border: '2px solid #ffb3c1'}}></div>Ovulation day</div>
        <div className="legend-item"><div className="legend-dot" style={{border: '2px solid #fff'}}></div>Today</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const start = new Date(START_DATE);
  const today = new Date();
  today.setHours(12,0,0,0);
  
  const todayDiff = Math.round((today - start) / 864e5);
  const todayCycleDay = ((todayDiff % CYCLE_LEN) + CYCLE_LEN) % CYCLE_LEN;
  const daysUntilNext = CYCLE_LEN - todayCycleDay;
  const dayOfCycle = todayCycleDay + 1;

  let phaseName = "";
  let phaseDesc = "";
  if (dayOfCycle <= PERIOD_DUR) {
    phaseName = "Menstrual Phase";
    phaseDesc = "Your body is shedding its lining. Energy may be low, focus on rest and self-care.";
  } else if (dayOfCycle < CYCLE_LEN - 14) {
    phaseName = "Follicular Phase";
    phaseDesc = "Estrogen is rising. You might feel a burst of energy and creativity.";
  } else if (dayOfCycle <= CYCLE_LEN - 14 + 3) {
    phaseName = "Ovulatory Phase";
    phaseDesc = "Estrogen peaks. You may feel confident, social, and vibrant.";
  } else {
    phaseName = "Luteal Phase";
    phaseDesc = "Progesterone rises. Energy winds down. Great time for deep focus and nesting.";
  }

  return (
    <React.Fragment>
      <div className="grid-2">
        <div className="stat-card">
          <div className="stat-num">Day {dayOfCycle}</div>
          <div className="stat-label">of your cycle</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{daysUntilNext} days</div>
          <div className="stat-label">until next period</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <i className="ti ti-activity"></i> Current Phase
        </div>
        <h3 style={{fontSize: '1.2rem', marginBottom: '8px', color: '#fff'}}>{phaseName}</h3>
        <p style={{color: 'var(--text-muted)', lineHeight: '1.5'}}>{phaseDesc}</p>
      </div>

      <CycleCalendar />
    </React.Fragment>
  );
}

function SplashScreen({ onComplete }) {
  const [fading, setFading] = React.useState(false);

  const handleEnd = () => {
    setFading(true);
    setTimeout(onComplete, 1500);
  };

  return (
    <div className="splash-container" style={{ opacity: fading ? 0 : 1, visibility: fading ? 'hidden' : 'visible' }}>
      <video 
        src="assets/Recording 2026-06-24 003053.mp4" 
        autoPlay 
        muted 
        playsInline 
        onEnded={handleEnd}
        className="splash-video"
      ></video>
      <div className="splash-overlay">
        <h1>LUNA</h1>
        <p style={{fontSize: '1.2rem', color: '#ffb3c1', letterSpacing: '1px'}}>Your personalized cycle tracker</p>
      </div>
      <button className="skip-btn" onClick={handleEnd}>Skip Intro <i className="ti ti-arrow-right"></i></button>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <React.Fragment>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="app" style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 1s ease 0.5s' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 10px rgba(0,0,0,0.5)', color: '#fff' }}>LUNA</h2>
          <p style={{ color: 'var(--text-muted)' }}>Tracking cycle since June 21, 2026</p>
        </div>
        <Dashboard />
      </div>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
