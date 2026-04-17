import React from 'react';

function SalientFeatures() {
  const features = [
    { title: "Cyber Security Center", icon: "security", bg: "from-slate-700 to-slate-900", text: "India' First AI-Driven Integrated Cyber Security Command and Control Center (ICSCCC)" },
    { title: "Aviation Training", icon: "flight_takeoff", bg: "from-blue-500 to-sky-600", text: "The only campus in India to have BOEING 737-200 on the campus for practical training" },
    { title: "Aircraft Fleet", icon: "flight", bg: "from-sky-400 to-blue-500", text: "A fleet of 10 different aircraft' & helicopters on the campus" },
    { title: "Expert Faculty", icon: "school", bg: "from-orange-400 to-rose-500", text: "Well Qualified and Experienced Faculty Members" },
    { title: "Hands-On Training", icon: "build", bg: "from-emerald-400 to-teal-500", text: "Practical and Hands-On Field Training for Skill Enhancement" },
    { title: "Industry Connections", icon: "hub", bg: "from-indigo-500 to-purple-600", text: "Regular Industry Internships & Expert Interactions" },
    { title: "Professional Workshops", icon: "groups", bg: "from-pink-500 to-rose-500", text: "Frequent Conduction of Workshops, Seminars, Industry Visits" },
    { title: "Holistic Development", icon: "self_improvement", bg: "from-lime-500 to-emerald-600", text: "Focused Holistic Development along with National Cadet Corps (NCC)" },
    { title: "Incubation Centre", icon: "rocket_launch", bg: "from-amber-400 to-orange-500", text: "Student Start-Up & Incubation Centre" },
    { title: "Placements", icon: "work", bg: "from-fuchsia-500 to-purple-600", text: "Highly Promising Training & Placement Package" },
    { title: "Research & Innovation", icon: "biotech", bg: "from-cyan-500 to-blue-600", text: "Research and Innovation Development" },
    { title: "NEP-2020 Compliance", icon: "menu_book", bg: "from-blue-600 to-indigo-700", text: "Incorporation of Indian Knowledge System (IKS) in regular Curriculum (as per New National Education Policy, NEP-2020, Govt. of India)" },
    { title: "Modern Library", icon: "local_library", bg: "from-violet-500 to-fuchsia-500", text: "Well-Stocked Library Covering Multiple Disciplines, Software like AR, VR, AI, ML" },
    { title: "Transportation", icon: "directions_bus", bg: "from-teal-500 to-emerald-500", text: "Smooth Mode of Commute/Transportation" },
    { title: "Hostel Facilities", icon: "apartment", bg: "from-rose-400 to-red-500", text: "On Campus Separate Boy's and Girl's Hostels" },
    { title: "Sports & Culture", icon: "sports_basketball", bg: "from-orange-500 to-amber-600", text: "National Sports & Cultural Activities" },
    { title: "Social Service", icon: "volunteer_activism", bg: "from-red-500 to-pink-600", text: "NSS with self Defense Program" }
  ];

  return (
    <div className="fade-in pb-20 px-4 md:px-10 lg:px-16">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-4 tracking-tight">
          Salient Features
        </h1>
        <p className="text-lg text-slate-500 font-medium">Discover what makes Indus University stand out</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${feature.bg} p-8 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative`}
          >
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-150 transition-transform duration-500 ease-out">
              <span className="material-symbols-outlined text-[150px]">{feature.icon}</span>
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/20">
                <span className="material-symbols-outlined text-white text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-white font-black text-xl mb-3 tracking-wide leading-tight">
                {feature.title}
              </h3>
              <p className="text-white/90 font-medium leading-relaxed text-sm">
                {feature.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalientFeatures;
