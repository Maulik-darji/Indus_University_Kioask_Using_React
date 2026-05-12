import React, { useState, useEffect } from 'react';

function Clock({ onClick }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString();
  const dateString = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      onClick={onClick}
      className="bg-gray-200 p-5 rounded-xl text-center shadow-sm cursor-pointer hover:bg-gray-300 active:scale-95 transition-all"
    >
      <div className="text-2xl font-bold text-gray-800">{timeString}</div>
      <div className="text-gray-600 text-sm font-semibold">{dateString}</div>
      <div className="text-gray-500 text-xs mt-1 font-medium">Ahmedabad, Gujarat</div>
    </div>
  );
}

export default Clock;
