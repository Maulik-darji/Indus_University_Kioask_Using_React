import React from 'react';

function Institutes() {
  const defaultInstitutes = [
    { id: 1, name: 'IITE', fullName: 'Indus Institute of Technology & Engineering', desc: 'Leading technical education with industry-ready curriculum and research.', color: 'bg-blue-500' },
    { id: 2, name: 'IAS', fullName: 'Indus Architecture School', desc: 'Excellence in architectural design, sustainable planning, and urban theory.', color: 'bg-orange-700' },
    { id: 3, name: 'IDS', fullName: 'Indus Design School', desc: 'Fostering creativity across communication, product, and fashion specialization.', color: 'bg-yellow-500' },
    { id: 4, name: 'IIICT', fullName: 'Indus Institute of Info. & Comm. Technology', desc: 'Specialized computing tracks including AI, Data Science, and Cybersecurity.', color: 'bg-indigo-600' },
    { id: 5, name: 'IIMS', fullName: 'Indus Institute of Management Studies', desc: 'Where Practice Meets Theory in business strategy, finance, and entrepreneurship.', color: 'bg-red-600' },
    { id: 6, name: 'IISHLS', fullName: 'Indus Institute of Sci. Humanities & Lib. Studies', desc: 'The interdisciplinary core of basic sciences, languages, and liberal arts.', color: 'bg-emerald-600' },
    { id: 7, name: 'IISS', fullName: 'Indus Institute of Special Studies', desc: 'Unique industry-aligned programs integrating traditional values and ethos.', color: 'bg-slate-700' },
    { id: 8, name: 'IIPR', fullName: 'Indus Institute of Pharmacy and Research', desc: 'Pharmaceutical research and professional pharmacy education excellence.', color: 'bg-teal-500' },
    { id: 9, name: 'IIATE', fullName: 'Indus Institute of Aviation Tech & Engineering', desc: 'Premium training in aircraft maintenance, aviation, and aerospace engineering.', color: 'bg-sky-500' },
    { id: 10, name: 'IMIC', fullName: 'Indus Management & Information Center', desc: 'Integrating modern management techniques with information precision.', color: 'bg-purple-600' },
    { id: 11, name: 'IAGNI', fullName: 'Indus Advance Green Nanotechnology Institute', desc: 'Sustainable research center for futuristic nanotechnology advancement.', color: 'bg-green-700' },
  ];

  const [institutes, setInstitutes] = React.useState(() => {
    const saved = localStorage.getItem('indus_institutes');
    if (!saved) return defaultInstitutes;
    
    // Safety check: Ensure all items have the required new properties (fullName, color)
    const parsed = JSON.parse(saved);
    if (parsed.length > 0 && (!parsed[0].fullName || !parsed[0].color)) {
      localStorage.removeItem('indus_institutes'); // Clear legacy data format
      return defaultInstitutes;
    }
    return parsed;
  });

  return (
    <div className="fade-in w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 max-h-[calc(100vh-180px)] overflow-y-auto px-10 pt-4 pb-20 -mx-10 custom-scrollbar">
        {institutes.map((inst, i) => (
          <div 
            key={i} 
            className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex gap-8 items-start cursor-default hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
          >
            {/* Left Color Bar */}
            <div className={`w-3 h-full absolute left-0 top-0 ${inst.color || 'bg-slate-200'} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex-1 pl-4">
              <div className="mb-4">
                <span className={`inline-block px-4 py-1.5 rounded-xl ${inst.color || 'bg-slate-200'} bg-opacity-10 text-[11px] font-black tracking-[0.2em] uppercase ${inst.color?.replace('bg-', 'text-') || 'text-slate-400'}`}>
                  {inst.name}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3 leading-tight tracking-tight">{inst.fullName || inst.name}</h3>
              </div>
              <p className="text-slate-500 font-medium text-[15px] leading-relaxed line-clamp-2 md:line-clamp-none">
                {inst.desc}
              </p>
            </div>
            
            <div className="text-4xl text-slate-100 transition-all transform group-hover:text-blue-500/20 group-hover:translate-x-2 font-light">
              ›
            </div>
          </div>
        ))}

        {/* Closing Quote for Institutes */}
        <div className="col-span-full py-16 text-center">
           <p className="text-slate-300 text-sm font-black tracking-widest uppercase italic border-t border-slate-50 pt-16">
             The Foundation of Educational Excellence
           </p>
        </div>
      </div>
    </div>
  );
}

export default Institutes;
