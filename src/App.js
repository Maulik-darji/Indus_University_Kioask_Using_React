import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import AdminSitePicker from './pages/AdminSitePicker';
import { getOrCreateDeviceId } from './auth/deviceId';
import { clearKioskSession, getKioskSession, isKioskSessionValid } from './auth/kioskSession';
import AIAssistant from './components/AI/AIAssistant';
import normalFavicon from './images/University Logo/smallicon_sidebar.png';
import wiiaFavicon from './images/University Logo/WIIA.png';
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
  const groupRef = React.useRef(null);

  React.useEffect(() => {
    // Real-time Cloud Synchronization
    const q = query(collection(db, "ticker_v3"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push(doc.data().text);
      });
      const nextSignature = items.join('\u0001');
      setTickerItems((prev) => {
        const prevItems = Array.isArray(prev) ? prev : [];
        const prevSignature = prevItems.join('\u0001');
        if (prevSignature === nextSignature) return prevItems;

        if (items.length > 0) {
          try {
            localStorage.setItem('indus_ticker_items_cache', JSON.stringify(items));
          } catch {
            // ignore storage write failures
          }
        }

        return items;
      });
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    const el = groupRef.current;
    if (!el) return;

    // Compute duration from the rendered width (avoid pausing/restarting loops).
    const SPEED_PX_PER_SEC = 140;

    const computeOnce = () => {
      const groupWidth = el.scrollWidth || 0;
      if (groupWidth <= 0) return;
      const seconds = Math.min(120, Math.max(12, Math.round((groupWidth / SPEED_PX_PER_SEC) * 10) / 10));
      setDurationSec((prev) => (Math.abs(prev - seconds) >= 0.2 ? seconds : prev));
    };

    // Measure after paint and after fonts settle (no continuous observers = no flicker).
    requestAnimationFrame(() => computeOnce());
    const fontsReady = document.fonts?.ready;
    if (fontsReady && typeof fontsReady.then === 'function') {
      fontsReady.then(() => computeOnce()).catch(() => {});
    }
  }, [tickerItems.join('||')]);

  const content = React.useMemo(() => {
    const items = Array.isArray(tickerItems) ? tickerItems : [];
    const REPEAT_MULTIPLIER = 6; // fixed => stable width, smooth loop
    const out = [];
    for (let r = 0; r < REPEAT_MULTIPLIER; r++) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        out.push(
          <div key={`${r}-${i}`} className="flex items-center">
            <span className="text-slate-800 font-bold text-[13.5px] tracking-wide uppercase whitespace-nowrap hover:text-blue-700 transition-colors">
              {item}
            </span>
            <span className="mx-10 text-slate-300 font-light opacity-60">|</span>
          </div>
        );
      }
    }
    return out;
  }, [tickerItems]);
  
  return (
    <div className="ticker-viewport h-full">
      <div
        className="ticker-track h-full"
        style={{
          '--ticker-duration': `${durationSec}s`,
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
  const adminTarget = React.useMemo(() => {
    const pathname = window.location.pathname || '/';
    const isAdminPath = pathname.endsWith('/admin') || window.location.hash === '#/admin';
    if (!isAdminPath) return null;

    const params = new URLSearchParams(window.location.search || '');
    const site = (params.get('site') || '').toLowerCase();

    if (pathname === '/admin' && !site) return 'picker';
    if (pathname.startsWith('/wiia')) return 'wiia';
    if (site === 'wiia') return 'wiia';
    return 'indus';
  }, []);

  const siteVariant = React.useMemo(() => {
    const pathname = window.location.pathname || '/';
    const hash = window.location.hash || '';
    if (pathname.startsWith('/wiia')) return 'wiia';
    if (hash.startsWith('#/wiia') || hash.includes('/wiia')) return 'wiia';
    if (adminTarget === 'wiia') return 'wiia';
    return 'indus';
  }, [adminTarget]);

  // Dynamically set favicon based on site variant (normal or WIIA)
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = siteVariant === 'wiia' ? wiiaFavicon : normalFavicon;
    document.head.appendChild(link);
  }, [siteVariant]);

  const activePageStorageKey = siteVariant === 'wiia' ? 'wiia_active_page' : 'indus_active_page';

  const deviceId = React.useMemo(() => getOrCreateDeviceId(), []);
  const [isKioskAuth, setIsKioskAuth] = useState(() => {
    const session = getKioskSession();
    return isKioskSessionValid(session, deviceId);
  });

  const terminateKioskSession = React.useCallback(() => {
    clearKioskSession();
    setIsKioskAuth(false);
  }, []);

  const [terminatePromptOpen, setTerminatePromptOpen] = React.useState(false);
  const requestTerminate = React.useCallback(() => setTerminatePromptOpen(true), []);
  const cancelTerminate = React.useCallback(() => setTerminatePromptOpen(false), []);
  const confirmTerminate = React.useCallback(() => {
    setTerminatePromptOpen(false);

    // Always reset to Home after unlocking again
    try {
      localStorage.setItem('indus_active_page', 'home');
      localStorage.setItem('wiia_active_page', 'home');
    } catch {
      // ignore storage failures
    }

    const pathname = window.location.pathname || '/';
    const hash = window.location.hash || '';
    const wasWiia = pathname.startsWith('/wiia') || hash.startsWith('#/wiia') || hash.includes('/wiia');

    terminateKioskSession();

    // When terminating inside /wiia, route to the common "/" lock screen.
    if (wasWiia) {
      window.location.href = '/';
    }
  }, [terminateKioskSession]);

  const [activePage, setActivePage] = useState(() => {
    // 1. Check if we're explicitly hitting the admin path
    const pathname = window.location.pathname || '/';
    if (window.location.hash === '#/admin' || pathname.endsWith('/admin')) return 'admin';
     
    // 2. Try to recover from localStorage
    const saved = localStorage.getItem(activePageStorageKey);
    return saved || 'home';
  });

  const switchSiteVariant = React.useCallback(() => {
    const targetVariant = siteVariant === 'wiia' ? 'indus' : 'wiia';
    const targetKey = targetVariant === 'wiia' ? 'wiia_active_page' : 'indus_active_page';
    const targetPath = targetVariant === 'wiia' ? '/wiia' : '/';
    try {
      localStorage.setItem(targetKey, activePage);
    } catch {
      // ignore
    }
    window.location.href = targetPath;
  }, [activePage, siteVariant]);

  // Persist page changes
  React.useEffect(() => {
    localStorage.setItem(activePageStorageKey, activePage);
  }, [activePage, activePageStorageKey]);

   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const [isAiOpen, setIsAiOpen] = useState(false);
   const [admissionData, setAdmissionData] = useState(null);

  useEffect(() => {
    const handleSync = () => {
      // Threshold 1370px to cover 7-12 inch tablets including high-res ones (like iPad Pro 12.9" at 1024 or 1366 scales)
      if (window.innerWidth < 1370) {
        setIsSidebarOpen(!isAiOpen);
      }
    };

    handleSync();
    
    // Add resize listener to ensure it stays synced during orientation changes
    window.addEventListener('resize', handleSync);
    return () => window.removeEventListener('resize', handleSync);
  }, [isAiOpen]);

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

  // Preserve scroll position per page (so returning to a page doesn't force re-scrolling)
  const scrollSaveTimeoutRef = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = document.getElementById('main-scroll-container');
    if (!el) return;

    const storageKey = `${siteVariant}_scroll_${activePage}`;

    const restore = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const n = raw == null ? null : Number(raw);
        if (Number.isFinite(n)) {
          const prevBehavior = el.style.scrollBehavior;
          el.style.scrollBehavior = 'auto';
          el.scrollTop = n;
          el.style.scrollBehavior = prevBehavior;
        }
      } catch {
        // ignore storage read failures
      }
    };

    const save = () => {
      try {
        localStorage.setItem(storageKey, String(el.scrollTop || 0));
      } catch {
        // ignore storage write failures
      }
    };

    restore();

    const onScroll = () => {
      if (scrollSaveTimeoutRef.current) clearTimeout(scrollSaveTimeoutRef.current);
      scrollSaveTimeoutRef.current = setTimeout(save, 150);
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (scrollSaveTimeoutRef.current) clearTimeout(scrollSaveTimeoutRef.current);
      save();
    };
  }, [activePage, siteVariant]);



  if (!isKioskAuth) {
    return <AccessGate siteVariant={siteVariant} onAuthenticated={() => setIsKioskAuth(true)} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home setActivePage={setActivePage} />;
      case 'admission': return <Admission admissionData={admissionData} setAdmissionData={setAdmissionData} siteVariant={siteVariant} />;
      case 'about': return <About setActivePage={setActivePage} />;
      case 'programs': return <Programs setActivePage={setActivePage} setAdmissionData={setAdmissionData} siteVariant={siteVariant} />;
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
              Comming Soon...
            </div>
          </div>
        );
      case 'admin':
        if (adminTarget === 'picker') return <AdminSitePicker />;
        return <Admin siteVariant={adminTarget || siteVariant} />;
      default: return <Home setActivePage={setActivePage} />;
    }
  };

  if (activePage === 'admin') {
    if (adminTarget === 'picker') return <AdminSitePicker />;
    return <Admin siteVariant={adminTarget || siteVariant} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[#f2f0ee] selection:bg-blue-100">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 text-2xl hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>&#9776;</button>
          <div className="font-bold text-gray-900 tracking-tight">INDUS UNIVERSITY</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={switchSiteVariant}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-wider text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
            title={siteVariant === 'wiia' ? 'Switch to Indus' : 'Switch to WIIA'}
          >
            {siteVariant === 'wiia' ? 'Indus' : 'WIIA'}
          </button>
          <button
            onClick={() => {
              requestTerminate();
            }}
            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all"
          >
            Terminate
          </button>
        </div>
      </header>

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        siteVariant={siteVariant}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onTerminateSession={() => {
          requestTerminate();
        }}
      />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative">
        {/* Main Content Workspace - Shrinks on XL screens when AI is open */}
        <motion.div 
          layout
          className={`flex-1 min-w-0 flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out origin-right 
            ${isAiOpen ? 'md:mr-[450px] lg:mr-[500px] xl:mr-[510px] xl:scale-[0.99] xl:rounded-2xl xl:shadow-[0_10px_40px_rgba(0,0,0,0.08)] xl:my-2 xl:ml-2 xl:border xl:border-white/30 bg-[#f2f0ee]' : 'bg-[#f2f0ee]'}`}
        >
          <main className="flex-1 min-w-0 w-full overflow-hidden flex flex-col relative">
            <div
              id="main-scroll-container"
              className="w-full flex-1 overflow-y-auto scroll-smooth"
            >
              <div className={`w-full max-w-[1920px] mx-auto px-4 md:px-10 lg:px-12 ${
                activePage === 'programs' ? 'pt-2 md:pt-4 pb-32 md:pb-48' : 'pt-4 md:pt-8 pb-40 md:pb-56'
              }`}>
              {/* Responsive Header Row */}
              <div className={`flex flex-col xl:flex-row xl:items-center justify-between ${activePage === 'programs' ? 'mb-2 md:mb-3 gap-3 md:gap-4' : 'mb-6 md:mb-8 gap-4 md:gap-6'}`}>
                <div className="flex items-center gap-4 flex-wrap">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex items-center justify-center p-3 bg-white border border-gray-100 shadow-sm rounded-2xl text-gray-700 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 transition-all outline-none active:scale-95 transition-all"
                    title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>

                  {activePage !== 'home' && (
                    <button 
                      onClick={() => {
                        if (activePage === 'committees') setActivePage('about');
                        else setActivePage('home');
                      }}
                      className="flex items-center gap-2 md:gap-3 bg-white border border-gray-100 shadow-sm px-4 md:px-6 py-2.5 md:py-3.5 rounded-2xl text-gray-700 hover:text-blue-600 font-bold text-xs md:text-sm tracking-wider uppercase hover:shadow-md hover:-translate-y-0.5 transition-all outline-none group active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span>{activePage === 'committees' ? 'About' : 'Home'}</span>
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

                <div className="flex justify-end xl:w-64 gap-3">
                  <button
                    type="button"
                    onClick={switchSiteVariant}
                    className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
                    title={siteVariant === 'wiia' ? 'Switch to Indus' : 'Switch to WIIA'}
                  >
                    {siteVariant === 'wiia' ? 'Indus Mode' : 'WIIA Mode'}
                  </button>
                  <button
                    onClick={() => {
                      requestTerminate();
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
            </div>
          </main>

          {/* Ticker Section - Dedicated Footer Space */}
          <div className="h-16 md:h-18 bg-[#fcfbf9] border-t border-gray-100 flex items-center z-50 flex-shrink-0 relative overflow-hidden">
            <div className="flex-1 overflow-hidden h-full flex items-center">
              <ScrollingTicker />
            </div>
          </div>
        </motion.div>
        
        <AIAssistant isOpen={isAiOpen} setIsOpen={setIsAiOpen} />
      </div>
 
       {/* Unified Intelligent Scroll Controls */}
       <div className={`fixed bottom-20 flex flex-col gap-3 md:gap-4 z-[1000000] transition-all duration-300 ${isAiOpen ? 'right-[525px]' : 'right-4 md:right-10 md:bottom-24'}`}>
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
          className="w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-slate-200 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
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
          className="w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-slate-200 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {terminatePromptOpen && (
        <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={cancelTerminate} />
          <div
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-[0_40px_120px_rgba(0,0,0,0.35)] border border-slate-200 p-7 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terminate-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="terminate-title" className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  Terminate Session?
                </h3>
                <p className="mt-2 text-slate-600 font-bold text-sm">
                  Terminate this session and lock the kiosk?
                </p>
              </div>
              <button
                type="button"
                onClick={cancelTerminate}
                className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all flex items-center justify-center"
                aria-label="Close"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={cancelTerminate}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTerminate}
                className="px-5 py-3 rounded-2xl bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 active:scale-95 transition-all shadow-sm"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
