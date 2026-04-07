import React, { useState } from 'react';
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

function ScrollingTicker() {
  const [tickerItems, setTickerItems] = React.useState(() => {
    const stored = localStorage.getItem('indus_ticker_v3');
    return stored ? JSON.parse(stored) : [
      "🎓 Admissions Open for 2026-27! Register today for B.Tech, M.Tech, and Designing courses.",
      "🚀 INDUS CUP 2026: Regional sports meet registrations are now live! Participate & Win big prizes.",
      "🏢 Placement Success: Direct on-campus hiring for Google, Meta, and Microsoft starts next week.",
      "⭐ Research & Innovation: Congratulations to our PhD scholars for the recent Science Journal publication."
    ];
  });

  React.useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('indus_ticker_v3');
      if (stored) setTickerItems(JSON.parse(stored));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('ticker-update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('ticker-update', handleStorage);
    };
  }, []);

  const content = tickerItems.map((item, idx) => (
    <div key={idx} className="flex items-center group">
       <span className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-8 flex-shrink-0 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
       <span className="text-slate-800 font-bold text-[13.5px] tracking-wide uppercase whitespace-nowrap hover:text-blue-700 transition-colors">
          {item}
       </span>
       <span className="mx-14 text-slate-300 font-light opacity-60">|</span>
    </div>
  ));
  
  return (
    <div className="flex animate-marquee-slower whitespace-nowrap items-center py-2 h-full">
      {content}{content}{content}{content}
    </div>
  );
}

function App() {
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
      </header>

      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 h-full w-full overflow-hidden flex flex-col relative">
          <div id="main-scroll-container" className="w-full max-w-[1920px] mx-auto h-full overflow-y-auto px-4 md:px-10 lg:px-12 py-6 md:py-10 pb-40 scroll-smooth">
            {/* Responsive Header Row */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-6">
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
                <h1 className="text-xl md:text-2xl 2xl:text-3xl font-black text-gray-900 tracking-tight text-center uppercase">
                  {activePage === 'programs' && "Academic Categories"}
                  {activePage === 'about' && "About Indus"}
                  {activePage === 'institutes' && "Our Institutes"}
                  {activePage === 'committees' && "University Committees"}
                  {activePage === 'events' && "University Events"}
                </h1>
              </div>

              <div className="hidden xl:block w-48"></div> {/* Visual balancer for centered title */}
            </div>
            
            <div className="fade-in max-w-full">
              {renderPage()}
            </div>
          </div>
        </main>

        {/* Ticker Section - Dedicated Footer Space */}
        <div className="h-16 md:h-18 bg-white border-t border-gray-100 flex items-center z-50 flex-shrink-0">
          <div className="bg-slate-900 h-full px-8 flex items-center z-20 shadow-[10px_0_30px_rgba(0,0,0,0.1)]">
            <span className="text-white font-black text-[10px] tracking-[0.2em] uppercase whitespace-nowrap flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Updates
            </span>
          </div>
          <div className="flex-1 overflow-hidden h-full flex items-center bg-[#fcfbf9]/50">
            <ScrollingTicker />
          </div>
        </div>
      </div>

      {/* Unified Intelligent Scroll Controls */}
      <div className="fixed bottom-24 right-10 flex flex-col gap-4 z-[1000000]">
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
          className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
