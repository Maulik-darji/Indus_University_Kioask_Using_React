import React from 'react';

function Events() {
  const defaultEvents = [
    { 
      month: 'JAN', 
      day: '05', 
      title: 'INDUS CUP 2K26', 
      desc: 'Stand a Chance to Win Cash Prizes up to ₹10,00,000', 
      type: 'Sports Fest', 
      accent: 'border-l-orange-500', 
      textColor: 'text-orange-600' 
    },
    { 
      month: 'FEB', 
      day: '15', 
      title: 'Indus Hackathon 2025', 
      desc: 'Exhilarating one-day event organized by the CSE Department.', 
      type: 'Technical', 
      accent: 'border-l-blue-500', 
      textColor: 'text-blue-600', 
      badge: true 
    },
    { 
      month: 'APR', 
      day: '27', 
      title: 'ISTE State Convention', 
      desc: '26th ISTE Faculty Annual State Convention at Indus.', 
      type: 'Academic', 
      accent: 'border-l-brand-brown', 
      textColor: 'text-brand-brown' 
    },
  ];

  const [events, setEvents] = React.useState(() => {
    const savedEvents = localStorage.getItem('indus_events');
    return savedEvents ? JSON.parse(savedEvents) : defaultEvents;
  });

  return (
    <div className="fade-in flex-1 px-4 md:px-8 pb-20">
      <header className="mb-12 text-left">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Activities & Events</h1>
        <p className="text-lg text-slate-500 font-medium italic">Exciting life and opportunities at Indus University</p>
      </header>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {events.map((e, i) => (
          <div 
            key={i} 
            onClick={() => e.link && window.open(e.link.startsWith('http') ? e.link : `https://${e.link}`, '_blank')}
            className={`flex bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-[6px] ${e.link ? 'cursor-pointer' : ''}`}
            style={{ borderLeftColor: e.color || '#f97316' }}
          >
            {/* Left Date Section */}
            <div className="bg-gray-50 py-8 px-8 flex flex-col items-center justify-center border-r border-gray-100 min-w-[120px]">
              <span className="text-sm font-bold text-gray-400 tracking-wider mb-1">{e.month}</span>
              <span className="text-4xl font-black text-gray-800 leading-none">{e.day}</span>
            </div>
            
            {/* Right Info Section */}
            <div className="p-8 flex flex-col justify-center flex-1 text-left">
              <div className="flex items-center gap-3 mb-3">
                 <span 
                   className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100"
                   style={{ color: e.color || '#f97316' }}
                 >
                   {e.type}
                 </span>
                 {(e.isFeatured || e.badge) && (
                   <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded leading-tight uppercase">Featured</span>
                 )}
                 {e.link && (
                   <span className="bg-green-50 text-green-600 text-[9px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase tracking-tighter">Info</span>
                 )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight flex items-center justify-between gap-2">
                {e.title}
                {e.link && <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
