import React from 'react';
import Clock from './Clock';
import logo from '../images/University Logo/Indus_logo.png';
import wiiaLogo from '../images/University Logo/WIIA.png';
import smallLogo from '../images/University Logo/smallicon_sidebar.png';

function Sidebar({ activePage, setActivePage, siteVariant = 'indus', isOpen, setIsOpen, onTerminateSession }) {
  const isWiia = siteVariant === 'wiia';
  const primaryLogo = isWiia ? wiiaLogo : logo;
  const compactLogo = isWiia ? wiiaLogo : smallLogo;
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'home', color: 'text-blue-600 bg-blue-50' },
    { id: 'about', label: 'About Indus', icon: 'info', color: 'text-indigo-600 bg-indigo-50' },
    { id: 'programs', label: 'Programs', icon: 'school', color: 'text-emerald-600 bg-emerald-50' },
    { id: 'institutes', label: 'Institutes', icon: 'apartment', color: 'text-orange-600 bg-orange-50' },
    { id: 'map', label: 'Campus Map', icon: 'map', color: 'text-rose-600 bg-rose-50' },
    { id: 'events', label: 'Events', icon: 'event', color: 'text-violet-600 bg-violet-50' },
  ];

  const handleNavigate = (id) => {
    setActivePage(id);
    // Explicit selection only - sidebar stays in its current state
  };

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white flex flex-col justify-between border-r border-gray-200 transition-all duration-300 ease-in-out md:sticky md:top-0 md:h-screen ${
          isOpen 
            ? 'w-72 p-6 translate-x-0 opacity-100' 
            : 'w-24 p-4 -translate-x-full opacity-100 md:translate-x-0'
        }`}
      >
        <div className={`transition-all duration-300 shrink-0 ${!isOpen ? 'mb-10 px-0 flex justify-center' : 'opacity-100 mb-10 px-2'}`}>
          {/* Logo Image - only visible when expanded */}
          {isOpen ? (
            <img src={primaryLogo} alt={isWiia ? 'WIIA Logo' : 'Indus University Logo'} className="w-full h-auto scale-110 origin-left transition-transform" />
          ) : (
            <img src={compactLogo} alt={isWiia ? 'WIIA Icon' : 'Indus Icon'} className="w-12 h-12 object-contain" />
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const textColorClass = item.color.split(' ')[0]; // Extract 'text-xxx-600'
              return (
                <li
                  key={item.id}
                  className={`rounded-xl cursor-pointer transition-all duration-300 font-bold flex items-center group shadow-sm ${
                    isOpen ? 'p-3 gap-4 mb-2' : 'p-2 justify-center mb-3'
                  } ${
                    activePage === item.id 
                      ? `${item.color.split(' ')[1]} shadow-md ring-1 ring-slate-100` 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  title={!isOpen ? item.label : ""}
                  onClick={() => handleNavigate(item.id)}
                >
                  <div className={`rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${item.color} ${isOpen ? 'w-11 h-11' : 'w-12 h-12'}`}>
                    <span className="material-symbols-outlined !text-[27px]">{item.icon}</span>
                  </div>
                  {isOpen && (
                    <span className={`text-sm md:text-base tracking-tight whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ${
                      activePage === item.id ? textColorClass + ' font-black' : 'text-slate-600'
                    }`}>
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={`transition-all duration-300 shrink-0 mt-10 ${!isOpen ? 'opacity-0 scale-50 h-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => onTerminateSession?.()}
              className="w-full px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.22em] hover:bg-red-100 active:scale-95 transition-all"
            >
              Terminate Session
            </button>
            <Clock />
          </div>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
