import React, { useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import Programs from './pages/Programs';
import Institutes from './pages/Institutes';
import Events from './pages/Events';
import SalientFeatures from './pages/SalientFeatures';
import Placements from './pages/Placements';
import Committees from './pages/Committees';
import Admin from './pages/Admin';
import AccessGate from './pages/AccessGate';
import { getOrCreateDeviceId } from './auth/deviceId';
import { clearKioskSession, getKioskSession, isKioskSessionValid } from './auth/kioskSession';

function ScrollingTicker() {
  const [tickerItems, setTickerItems] = React.useState(() => {
    const cached = localStorage.getItem('indus_ticker_items_cache');
    if (!cached) return [];
    try {
      const parsed = JSON.parse(cached);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [durationSec, setDurationSec] = React.useState(40);
  const [isReady, setIsReady] = React.useState(false);
  const viewportRef = React.useRef(null);
  const groupRef = React.useRef(null);
  const baseWidthRef = React.useRef(0);
  const [repeatCount, setRepeatCount] = React.useState(1);

  React.useEffect(() => {
    // Real-time Cloud Synchronization
    const q = query(collection(db, "ticker_v3"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push(doc.data().text);
      });
      if (items.length > 0) {
        setTickerItems(items);
        try {
          localStorage.setItem('indus_ticker_items_cache', JSON.stringify(items));
        } catch {
          // ignore storage write failures
        }
      }
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    const SPEED_PX_PER_SEC = 140;

    const recompute = () => {
      const groupWidth = el.scrollWidth || 0;
      const viewportWidth = viewportRef.current?.clientWidth || 0;
      if (groupWidth <= 0 || viewportWidth <= 0) {
        setIsReady(false);
        return;
      }

      // Ensure the group is at least as wide as the viewport to avoid blank space.
      if (!baseWidthRef.current || repeatCount === 1) {
        baseWidthRef.current = groupWidth;
      }
      const baseWidth = baseWidthRef.current || groupWidth;
      const neededRepeats = Math.max(1, Math.ceil((viewportWidth + 200) / baseWidth));
      if (neededRepeats !== repeatCount) {
        setRepeatCount(neededRepeats);
        setIsReady(false);
        return;
      }

      // Keep a consistent scroll speed; avoid forcing a high minimum duration (which makes short tickers feel slow).
      const seconds = Math.min(120, Math.max(8, Math.round((groupWidth / SPEED_PX_PER_SEC) * 10) / 10));
      setDurationSec(seconds);
      setIsReady(true);
    };

    recompute();

    // Fonts can change measured widths after initial paint
    const fontsReady = document.fonts?.ready;
    if (fontsReady && typeof fontsReady.then === 'function') {
      fontsReady.then(recompute).catch(() => {});
    }

    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);

    window.addEventListener('resize', recompute);
    return () => {
      window.removeEventListener('resize', recompute);
      ro.disconnect();
    };
  }, [tickerItems, repeatCount]);

  React.useEffect(() => {
    baseWidthRef.current = 0;
    setRepeatCount(1);
  }, [tickerItems.join('||')]);

  const content = React.useMemo(() => {
    const items = Array.isArray(tickerItems) ? tickerItems : [];
    const repeats = Math.max(1, repeatCount || 1);
    const out = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        out.push(
          <div key={`${r}-${i}`} className="flex items-center group">
            <span className="text-slate-800 font-bold text-[13.5px] tracking-wide uppercase whitespace-nowrap hover:text-blue-700 transition-colors">
              {item}
            </span>
            <span className="mx-10 text-slate-300 font-light opacity-60">|</span>
          </div>
        );
      }
    }
    return out;
  }, [repeatCount, tickerItems]);
  
  return (
    <div ref={viewportRef} className="ticker-viewport h-full">
      <div
        className="ticker-track h-full"
        style={{
          '--ticker-duration': `${durationSec}s`,
          animationPlayState: isReady ? 'running' : 'paused',
          opacity: tickerItems.length > 0 ? 1 : 0,
        }}
      >
        <div ref={groupRef} className="ticker-group h-full" aria-label="News ticker">
          {content}
        </div>
        <div className="ticker-group h-full" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}

function App() {
  const deviceId = React.useMemo(() => getOrCreateDeviceId(), []);
  const [isKioskAuth, setIsKioskAuth] = useState(() => {
    const session = getKioskSession();
    return isKioskSessionValid(session, deviceId);
  });

  const terminateKioskSession = React.useCallback(() => {
    clearKioskSession();
    setIsKioskAuth(false);
  }, []);

  const [activePage, setActivePage] = useState(() => {
    // 1. Check if we're explicitly hitting the admin path
    if (window.location.hash === '#/admin' || window.location.pathname === '/admin') return 'admin';
    
    // 2. Try to recover from localStorage
    const saved = localStorage.getItem('indus_active_page');
    return saved || 'home';
  });

  // Persist page changes
  React.useEffect(() => {
    localStorage.setItem('indus_active_page', activePage);
  }, [activePage]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [admissionData, setAdmissionData] = useState(null);

  React.useEffect(() => {
    const handleScroll = (e) => {
      // Only handle if no modal is open (modals handle their own kiosk-scroll)
      const modalOpen = !!document.getElementById('modal-details-container');
      if (modalOpen) return;

      const mainEl = document.getElementById('main-scroll-container');
      if (mainEl) {
        try {
          mainEl.scrollBy({ top: e.detail.delta, behavior: 'smooth' });
        } catch (err) {
          mainEl.scrollTop += e.detail.delta;
        }
      }
    };
    window.addEventListener('kiosk-scroll', handleScroll);
    return () => window.removeEventListener('kiosk-scroll', handleScroll);
  }, []);



  if (!isKioskAuth) {
    return <AccessGate onAuthenticated={() => setIsKioskAuth(true)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home setActivePage={setActivePage} />;
      case 'admission': return <Admission admissionData={admissionData} setAdmissionData={setAdmissionData} />;
      case 'about': return <About setActivePage={setActivePage} />;
      case 'programs': return <Programs setActivePage={setActivePage} setAdmissionData={setAdmissionData} />;
      case 'institutes': return <Institutes />;
      case 'events': return <Events />;
      case 'committees': return <Committees />;
      case 'facilities': return <SalientFeatures />;
      case 'placements': return <Placements />;
      case 'map':
        return (
          <div className="fade-in">
            <h2 className="text-3xl font-bold mb-6 text-black">Campus Map</h2>
            <div className="bg-gray-200 h-96 rounded-2xl flex items-center justify-center text-gray-500 italic">
              Interactive Map Loading...
            </div>
          </div>
        );
      case 'admin': return <Admin />;
      default: return <Home setActivePage={setActivePage} />;
    }
  };

  if (activePage === 'admin') return <Admin />;

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-[#f2f0ee]">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 text-2xl hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>&#9776;</button>
          <div className="font-bold text-gray-900 tracking-tight">INDUS UNIVERSITY</div>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Terminate this session and lock the kiosk?')) terminateKioskSession();
          }}
          className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all"
        >
          Terminate
        </button>
      </header>

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onTerminateSession={() => {
          if (window.confirm('Terminate this session and lock the kiosk?')) terminateKioskSession();
        }}
      />

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 min-w-0 h-full w-full overflow-hidden flex flex-col relative">
          <div
            id="main-scroll-container"
            className={`w-full max-w-[1920px] mx-auto h-full overflow-y-auto px-4 md:px-10 lg:px-12 pb-28 md:pb-40 scroll-smooth ${
              activePage === 'programs' ? 'pt-3 md:pt-4' : 'pt-5 md:pt-8'
            }`}
          >
            {/* Responsive Header Row */}
            <div className={`flex flex-col xl:flex-row xl:items-center justify-between ${activePage === 'programs' ? 'mb-2 md:mb-3 gap-3 md:gap-4' : 'mb-6 md:mb-8 gap-4 md:gap-6'}`}>
              <div className="flex items-center gap-4 flex-wrap">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden md:flex items-center justify-center p-3.5 bg-white border border-gray-100 shadow-sm rounded-2xl text-gray-700 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all outline-none active:scale-95"
                  title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>

                {activePage !== 'home' && (
                  <button 
                    onClick={() => {
                      if (activePage === 'committees') setActivePage('about');
                      else setActivePage('home');
                    }}
                    className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-6 py-3.5 rounded-2xl text-gray-700 hover:text-blue-600 font-bold text-sm tracking-wider uppercase hover:shadow-md hover:-translate-y-0.5 transition-all outline-none group active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>{activePage === 'committees' ? 'About Indus' : 'Home'}</span>
                  </button>
                )}
              </div>
              
              <div className="flex-1 flex justify-center xl:justify-center">
                <h1 className="text-xl md:text-2xl 2xl:text-3xl font-extrabold text-gray-900 tracking-tight text-center">
                  {activePage === 'programs' && "Academic Categories"}
                  {activePage === 'about' && "About Indus"}
                  {activePage === 'institutes' && "Our Institutes"}
                  {activePage === 'committees' && "University Committees"}
                  {activePage === 'events' && "University Events"}
                </h1>
              </div>

              <div className="flex justify-end xl:w-48">
                <button
                  onClick={() => {
                    if (window.confirm('Terminate this session and lock the kiosk?')) terminateKioskSession();
                  }}
                  className="px-5 py-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 active:scale-95 transition-all shadow-sm"
                  title="Terminate kiosk session"
                >
                  Terminate Session
                </button>
              </div>
            </div>
            
            <div className="fade-in max-w-full">
              {renderPage()}
            </div>
          </div>
        </main>

        {/* Ticker Section - Dedicated Footer Space */}
        <div className="h-16 md:h-18 bg-[#fcfbf9] border-t border-gray-100 flex items-center z-50 flex-shrink-0 relative overflow-hidden">
          <div className="flex-1 overflow-hidden h-full flex items-center">
            <ScrollingTicker />
          </div>
        </div>
      </div>

      {/* Unified Intelligent Scroll Controls */}
      <div className="fixed bottom-20 right-4 md:bottom-24 md:right-10 flex flex-col gap-3 md:gap-4 z-[1000000]">
        <button 
          onPointerDown={(e) => {
            e.preventDefault();
            const modalEl = document.getElementById('modal-details-container');
            const mainEl = document.getElementById('main-scroll-container');
            
            // Determine active target with "chained" logic
            let target = null;
            if (modalEl) {
              // If modal is NOT at the top, scroll modal. Otherwise, scroll main.
              if (modalEl.scrollTop > 5) {
                target = modalEl;
              } else {
                target = mainEl;
              }
            } else {
              target = mainEl;
            }

            if (target) {
              const start = target.scrollTop;
              target.scrollBy({ top: -400, behavior: 'smooth' });
              setTimeout(() => { if (target.scrollTop === start) target.scrollTop -= 400; }, 40);
            }
          }}
          className="w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button 
          onPointerDown={(e) => {
            e.preventDefault();
            const modalEl = document.getElementById('modal-details-container');
            const mainEl = document.getElementById('main-scroll-container');
            
            let target = null;
            if (modalEl) {
              // If modal is NOT at bottom, scroll modal. Otherwise, scroll main.
              const isAtBottom = modalEl.scrollTop + modalEl.clientHeight >= modalEl.scrollHeight - 10;
              if (!isAtBottom) {
                target = modalEl;
              } else {
                target = mainEl;
              }
            } else {
              target = mainEl;
            }

            if (target) {
              const start = target.scrollTop;
              target.scrollBy({ top: 400, behavior: 'smooth' });
              setTimeout(() => { if (target.scrollTop === start) target.scrollTop += 400; }, 40);
            }
          }}
          className="w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
