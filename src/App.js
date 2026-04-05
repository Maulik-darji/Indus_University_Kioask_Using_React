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
    const stored = localStorage.getItem('indus_ticker');
    return stored ? JSON.parse(stored) : ["⭐ INDUS CUP 2K26! Win Cash Prizes up to ₹10,00,000! ⭐", "🚀 Hackathon 2025 by CSE Department - Register Now! 🚀"];
  });

  React.useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('indus_ticker');
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
    <div key={idx} className="flex items-center">
      <span className="mx-16 text-slate-800 font-bold text-sm tracking-wide uppercase whitespace-nowrap">
         {item}
      </span>
    </div>
  ));
  
  return <>{content}{content}{content}</>;
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home setActivePage={setActivePage} />;
      case 'admission': return <Admission />;
      case 'about': return <About setActivePage={setActivePage} />;
      case 'programs': return <Programs setActivePage={setActivePage} />;
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
        <div className="font-bold text-gray-900 tracking-tight">INDUS UNIVERSITY</div>
        <button className="p-2 text-2xl hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>&#9776;</button>
      </header>

      <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 h-full w-full overflow-hidden p-6 md:p-10 lg:p-12 pb-24 md:pb-24">
        <div className="w-full max-w-full mx-auto h-full overflow-y-auto pb-20">
          <div className="grid grid-cols-3 items-center mb-4 gap-6 px-4 md:px-0">
            <div className="flex justify-start">
              {activePage !== 'home' && (
                <button 
                  onClick={() => {
                    if (activePage === 'committees') setActivePage('about');
                    else setActivePage('home');
                  }}
                  className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-6 py-3 rounded-xl text-gray-700 hover:text-blue-600 font-bold text-xs md:text-sm tracking-wider uppercase hover:shadow-md hover:-translate-y-0.5 transition-all outline-none group w-fit h-fit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {activePage === 'committees' ? 'About Indus' : 'Home'}
                </button>
              )}
            </div>
            
            <div className="flex justify-center flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {activePage === 'programs' && "Academic Categories"}
                {activePage === 'about' && "About Indus"}
                {activePage === 'institutes' && "Our Institutes"}
                {activePage === 'committees' && "University Committees"}
                {activePage === 'events' && "University Events"}
              </h1>
            </div>

            <div className="flex justify-end hidden md:flex">
              {/* Spacer/Third column element if needed */}
            </div>
          </div>
          {renderPage()}
        </div>
      </main>

      {/* Ticker Section */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 h-16 overflow-hidden flex items-center shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-40">
        <div className="flex animate-marquee whitespace-nowrap min-w-full items-center">
          <ScrollingTicker />
        </div>
      </div>
    </div>
  );
}

export default App;
