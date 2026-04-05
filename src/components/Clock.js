import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString();
  const dateString = time.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-200 p-5 rounded-xl text-center shadow-sm">
      <div className="text-2xl font-semibold text-gray-800">{timeString}</div>
      <div className="text-gray-600 text-sm">{dateString}</div>
      <div className="text-gray-500 text-xs mt-1">Ahmedabad, Gujarat</div>
    </div>
  );
}

export default Clock;
