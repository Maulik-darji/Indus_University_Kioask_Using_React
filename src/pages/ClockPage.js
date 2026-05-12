import React, { useState, useEffect } from 'react';

function ClockPage({ onBack }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f2f0ee] fade-in">
      {/* Subtle Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-10 left-10 w-16 h-16 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all group"
        title="Go Back"
      >
        <span className="material-symbols-outlined !text-4xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
      </button>

      <div className="text-[18rem] font-medium text-slate-800 leading-none tracking-tight mb-12 flex items-baseline justify-center">
        {timeString.split(' ')[0]}
        <span className="text-8xl ml-10 text-slate-400 font-light uppercase tracking-widest">{timeString.split(' ')[1]}</span>
      </div>
      
      <div className="h-0.5 w-64 bg-blue-500/20 mb-14 rounded-full"></div>
      
      <div className="text-9xl font-medium text-slate-700 tracking-tight mb-8 text-center">
        {dateString}
      </div>
      
      <div className="flex items-center justify-center gap-4 text-4xl font-normal text-slate-400 uppercase tracking-[0.5em]">
        <span className="material-symbols-outlined !text-6xl">location_on</span>
        Ahmedabad, Gujarat
      </div>
    </div>
  );
}

export default ClockPage;
