import React from 'react';
import Clock from './Clock';
import logo from '../images/logo.png';

function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }) {
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Indus' },
    { id: 'programs', label: 'Programs' },
    { id: 'institutes', label: 'Institutes' },
    { id: 'map', label: 'Campus Map' },
    { id: 'events', label: 'Events' },
  ];

  const handleNavigate = (id) => {
    setActivePage(id);
    setIsOpen(false);
  };

  return (
    <>
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 flex flex-col justify-between border-r border-gray-200 transition-transform duration-300 md:sticky md:top-0 md:h-full md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="mb-10 px-2">
            {/* Logo Image */}
            <img src={logo} alt="Indus University Logo" className="w-full h-auto scale-110 origin-left transition-transform" />
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 font-bold ${
                  activePage === item.id 
                    ? 'bg-[#e5e7eb] text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => handleNavigate(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <Clock />
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
