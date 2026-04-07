import React from 'react';

function Home({ setActivePage }) {
  const cards = [
    { id: 'programs', title: 'Explore Programs', desc: 'Undergraduate, Postgraduate & Ph.D', icon: 'school', color: 'text-blue-900', border: 'border-blue-300', bg: 'bg-blue-100/60', hover: 'hover:bg-blue-200/60' },
    { id: 'institutes', title: 'Our Institutes', desc: 'Discover our specialized schools', icon: 'apartment', color: 'text-rose-900', border: 'border-rose-300', bg: 'bg-rose-100/60', hover: 'hover:bg-rose-200/60' },
    { id: 'facilities', title: 'Facilities', desc: 'Discover Salient Features of Indus University.', icon: 'corporate_fare', color: 'text-emerald-900', border: 'border-emerald-300', bg: 'bg-emerald-100/60', hover: 'hover:bg-emerald-200/60' },
    { id: 'placements', title: 'Placements & Stats', desc: '6000+ Students & Elite Placements', icon: 'trending_up', color: 'text-amber-900', border: 'border-amber-300', bg: 'bg-amber-100/60', hover: 'hover:bg-amber-200/60' },
    { id: 'admission', title: 'Admission 2026', desc: 'Tap here to apply and enroll', icon: 'person_add', color: 'text-purple-900', border: 'border-purple-300', bg: 'bg-purple-100/60', hover: 'hover:bg-purple-200/60' },
    { id: 'University', title: 'Visit Site', desc:'Tap here to visit the official website', icon: 'language', color: 'text-cyan-900', border: 'border-cyan-300', bg: 'bg-cyan-100/60', hover: 'hover:bg-cyan-200/60' }
  ];

  return (
    <div className="fade-in">
      <header className="mb-12 px-4 md:px-0">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
          Welcome to<br />Indus University
        </h1>
        <p className="text-xl text-gray-500 font-medium leading-relaxed">Where Practice Meets Theory</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {cards.map((card) => (
          <div 
            key={card.id}
            className={`group p-10 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 ${card.border} ${card.bg} ${card.hover} min-h-[220px] flex flex-col justify-center relative overflow-hidden`}
            onClick={() => {
              if (card.id === 'University') {
                window.open('https://indusuni.ac.in/', '_blank');
              } else {
                setActivePage(card.id);
              }
            }}
          >
            {/* Background Icon Watermark */}
            <div className={`absolute -right-6 -bottom-6 opacity-10 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 ${card.color}`}>
              <span className="material-symbols-outlined !text-[140px]">{card.icon}</span>
            </div>

            <div className="relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${card.bg.replace('/60', '')} ${card.color} border border-white/50 transition-transform duration-300 group-hover:scale-110`}>
                <span className="material-symbols-outlined !text-[32px]">{card.icon}</span>
              </div>
              <h3 className={`text-2xl font-black mb-3 transition-colors ${card.color} leading-snug`}>{card.title}</h3>
              <p className="text-slate-700 text-base font-semibold leading-relaxed max-w-[90%]">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
