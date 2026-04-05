import React from 'react';

function SalientFeatures() {
  const features = [
    { title: "Cyber Security Center", text: "India' First AI-Driven Integrated Cyber Security Command and Control Center (ICSCCC)" },
    { title: "Aviation Training", text: "The only campus in India to have BOEING 737-200 on the campus for practical training" },
    { title: "Aircraft Fleet", text: "A fleet of 10 different aircraft' & helicopters on the campus" },
    { title: "Expert Faculty", text: "Well Qualified and Experienced Faculty Members" },
    { title: "Hands-On Training", text: "Practical and Hands-On Field Training for Skill Enhancement" },
    { title: "Industry Connections", text: "Regular Industry Internships & Expert Interactions" },
    { title: "Professional Workshops", text: "Frequent Conduction of Workshops, Seminars, Industry Visits" },
    { title: "Holistic Development", text: "Focused Holistic Development along with National Cadet Corps (NCC)" },
    { title: "Incubation Centre", text: "Student Start-Up & Incubation Centre" },
    { title: "Placements", text: "Highly Promising Training & Placement Package" },
    { title: "Research & Innovation", text: "Research and Innovation Development" },
    { title: "NEP-2020 Compliance", text: "Incorporation of Indian Knowledge System (IKS) in regular Curriculum (as per New National Education Policy, NEP-2020, Govt. of India)" },
    { title: "Modern Library", text: "Well-Stocked Library Covering Multiple Disciplines, Software like AR, VR, AI, ML" },
    { title: "Transportation", text: "Smooth Mode of Commute/Transportation" },
    { title: "Hostel Facilities", text: "On Campus Separate Boy's and Girl's Hostels" },
    { title: "Sports & Culture", text: "National Sports & Cultural Activities" },
    { title: "Social Service", text: "NSS with self Defense Program" }
  ];

  return (
    <div className="fade-in pb-20 px-10 md:px-16">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-4">
          Salient Features
        </h1>
        <p className="text-lg text-gray-500">Discover what makes Indus University stand out</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-center"
          >
            <h3 className="text-black font-bold text-lg mb-2 uppercase tracking-wide border-b border-gray-100 pb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalientFeatures;
