import React from 'react';

function Home({ setActivePage }) {
  const cards = [
    { id: 'programs', title: 'Explore Programs', desc: 'Undergraduate, Postgraduate & Ph.D' },
    { id: 'institutes', title: 'Our Institutes', desc: 'Discover our specialized schools' },
    { id: 'facilities', title: 'Facilities', desc: 'Discover Salient Features of Indus University.' },
    { id: 'placements', title: 'Placements & Stats', desc: '6000+ Students & Elite Placements' },
    { id: 'admission', title: 'Admission 2026', desc: 'Tap here to apply and enroll' },
    { id: 'University', title: 'Visit Site', desc:'Tap here to visit the official website'}
  ];

  return (
    <div className="fade-in">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-[#6f5c4e] leading-tight mb-4">
          Welcome to<br />Indus University
        </h1>
        <p className="text-lg text-gray-500">Where Practice Meets Theory</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div 
            key={card.id}
            className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer border border-gray-100 min-h-[160px] flex flex-col justify-center"
            onClick={() => {
              if (card.id === 'University') {
                window.open('https://indusuni.ac.in/', '_blank');
              } else {
                setActivePage(card.id);
              }
            }}
          >
            <h3 className="text-xl font-semibold mb-2 transition-colors">{card.title}</h3>
            <p className="text-gray-500">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
