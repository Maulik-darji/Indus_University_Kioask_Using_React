import React, { useState } from 'react';
import drRituBhandariImg from '../images/Indus university Governance Image/dr-ritu-bhandari.webp';
import drNageshBhandariImg from '../images/Indus university Governance Image/dr-nagesh-bhandari.webp';
import sandeepChakravortyImg from '../images/Indus university Governance Image/sandeep-chakravorty.webp';
import drRKSinghImg from '../images/Indus university Governance Image/dr-r-k-singh.webp';
import suketuJaniImg from '../images/Indus university Governance Image/suketu-jani.webp';
import award1Img from '../images/Indus Unviersity Awards/awards-and-recognition1.webp';
import award2Img from '../images/Indus Unviersity Awards/awards-and-recognition2.webp';
import award3Img from '../images/Indus Unviersity Awards/awards-and-recognition3.webp';

// Research award gallery imports
import rAward1 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition1.jpg';
import rAward2 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition2.jpg';
import rAward3 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition3.jpg';
import rAward4 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition4.jpg';
import rAward5 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition5.jpg';
import rAward6 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition6.jpg';
import rAward7 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition7.jpg';
import rAward8 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition8.jpg';
import rAward9 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition9.jpg';
import rAward10 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition10.jpg';
import rAward11 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition11.jpg';
import rAward12 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition12.jpg';
import rAward13 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition13.jpg';
import rAward14 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition14.jpg';
import rAward15 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition15.jpg';
import rAward16 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition16.jpg';
import rAward17 from '../images/Indus University Arards in reasearch and innovation/awards-and-recognition17.jpg';
import bestResearcherImg from '../images/Indus Best researcher award/The-Best-Researcher-Award.jpg';

function About({ setActivePage }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [expandedAward, setExpandedAward] = useState(null);

  const researchGallery = [
    rAward1, rAward2, rAward3, rAward4, rAward5, rAward6, rAward7, rAward8, rAward9, 
    rAward10, rAward11, rAward12, rAward13, rAward14, rAward15, rAward16, rAward17
  ];

  const cards = [
    { title: 'Governance', content: 'Information regarding the leadership and administrative structure of the university.', icon: 'account_balance', color: 'border-blue-600', lightBg: 'bg-blue-50', textColor: 'text-blue-700' },
    { title: 'Awards and Recognition', content: 'Discover our accreditations, rankings, and major achievements.', icon: 'emoji_events', color: 'border-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-700' },
    { title: 'Committees', content: 'Details about various institutional committees and their organizational functions.', icon: 'groups', color: 'border-emerald-600', lightBg: 'bg-emerald-50', textColor: 'text-emerald-700' },
  ];

  if (selectedCard === 'Governance') {
    return (
      <div className="fade-in h-full overflow-y-auto custom-scrollbar pr-2 md:pr-4 pb-10 flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <div className="mb-10 shrink-0">
          <button 
            onClick={() => setSelectedCard(null)}
            className="flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all font-bold text-gray-600 group w-fit"
          >
            <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12 uppercase tracking-wide shrink-0">INDUS UNIVERSITY GOVERNANCE</h1>

        <div className="w-[calc(100%+3rem)] -mx-6 md:-mx-10 lg:-mx-12 bg-[#d3d3d3] py-16 px-10 md:px-24 flex flex-col md:flex-row items-center md:items-start gap-12 flex-none">
          <div className="w-[300px] h-[340px] shrink-0 shadow-sm overflow-hidden flex items-center justify-center">
             <img src={drRituBhandariImg} alt="Dr. Ritu Bhandari" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 mt-4 md:mt-2">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dr. Ritu Bhandari</h2>
             <h3 className="text-sm md:text-base font-bold text-brand-brown mb-6 tracking-wider uppercase">Presidential Secretariat</h3>
             <p className="text-base md:text-lg text-gray-800 leading-relaxed text-justify">
               Studied and trained in management for several years and is interested in human psychology. She has oriented high morale measures for every family member of INDUS University. She believes in encouraging the standard of education and discipline to foster our country's quality and cultural life. Her education, experience, and personal attributes offer 360-degree development to the professionals and students.
             </p>
          </div>
        </div>

        <div className="w-[calc(100%+3rem)] -mx-6 md:-mx-10 lg:-mx-12 bg-white py-16 px-10 md:px-24 flex flex-col-reverse md:flex-row items-center md:items-start gap-12 flex-none border-b border-gray-100">
          <div className="flex-1 mt-4 md:mt-2">
             <div className="text-right">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dr. Nagesh Bhandari</h2>
               <h3 className="text-sm md:text-base font-bold text-brand-brown mb-6 tracking-wider uppercase">Presidential Secretariat</h3>
             </div>
             <div className="space-y-5 text-base md:text-lg text-gray-800 leading-relaxed text-left">
               <p>Indus management, staff & students are honored to have Dr. Nagesh Bhandari as part of the Presidential Secretariat of Indus University. He is a Doctor by profession, a Spine Surgery Specialist. He earned his medical degree from the globally acclaimed spine center 'Rehabilitations Krankenhaus,' Germany. Furthermore, Dr. Bhandari has been trained under the guidance of Professor J. Hans, the world-famous spine surgeon.</p>
               <p>Dr. Nagesh has shared the space with the world's celebrated spine surgeons in his comprehensive career as a spine specialist. He has worked with some surgeons across the globe - Dr. C. S Ranawat (from the USA), Dr. Peter Fowler (from Canada), Dr. H. W Pia (from Germany), Professor B. G Weber (from Switzerland), and Professor M. Michon (from France). Furthermore, he worked as a visiting doctor in leading hospitals of Ahmedabad and Indore.</p>
               <p>Talking about his contributions in the field of Research, Dr. Bhandari has contributed immensely at national and international levels. Dr. Bhandari is a recipient of the Gold Medal for the 'Best Poster' presentation at the 40th Annual Conference of Indian Orthopedic Association, held in Ahmedabad in 2001.</p>
               <p>Dr. Nagesh has also significantly contributed to developing novel instrumentation systems, eventually adding to the cost-effective treatment procedures in his chosen field. He is actively involved in philanthropic and charity works through Bhandari Charitable Trust. Dr. Bhandari is also the founder of Ahmedabad Aviation Aeronautics Ltd & Western India Institute of Aeronautics at Ahmedabad.</p>
             </div>
          </div>
          <div className="w-[300px] h-[340px] shrink-0 shadow-sm overflow-hidden flex items-center justify-center">
             <img src={drNageshBhandariImg} alt="Dr. Nagesh Bhandari" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-[calc(100%+3rem)] -mx-6 md:-mx-10 lg:-mx-12 bg-[#d3d3d3] py-16 px-10 md:px-24 flex flex-col md:flex-row items-center md:items-start gap-12 flex-none">
          <div className="w-[300px] h-[340px] shrink-0 shadow-sm overflow-hidden flex items-center justify-center">
             <img src={sandeepChakravortyImg} alt="Prof. (Dr.) Sandeep Chakravorty" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 mt-4 md:mt-2">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Prof. (Dr.) Sandeep Chakravorty</h2>
             <h3 className="text-sm md:text-base font-bold text-brand-brown mb-6 tracking-wider uppercase">Executive President</h3>
             <div className="space-y-5 text-base md:text-lg text-gray-800 leading-relaxed text-left">
               <p>Prof. (Dr.) Sandeep Chakravorty is Ph.D in (Power System), M.E. Software Engineering from Intitute of Technology, Mesra, and Gold Medalist in B.E Electrical and Electronics Engineering.</p>
               <p>He has contributed to the field of Power System Planning, Multi-Criteria Decision Making Tools, and Soft Computing and have published articles in refreed journals and conferences.</p>
               <p>He is also in the advising and reviewing committee of many International and National Journals. His other notable achievements include framing of Industry oriented courses, design and installation of PV stand-alone systems, etc.</p>
             </div>
          </div>
        </div>

        <div className="w-[calc(100%+3rem)] -mx-6 md:-mx-10 lg:-mx-12 bg-white py-16 px-10 md:px-24 flex flex-col-reverse md:flex-row items-center md:items-start gap-12 flex-none border-b border-gray-100">
          <div className="flex-1 mt-4 md:mt-2">
             <div className="text-right">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dr. R.K. Singh</h2>
               <h3 className="text-sm md:text-base font-bold text-brand-brown mb-6 tracking-wider uppercase">Registrar</h3>
             </div>
             <div className="space-y-5 text-base md:text-lg text-gray-800 leading-relaxed text-left">
               <p>Dr. R.K. Singh is a Science Graduate from Gujarat University with a Master's Degree in Business Administration (MBA) with an HR specialization. He is also the holder of a Doctorate Degree (Ph.D) in Management.</p>
               <p>Over 3 decades of experience, he has held top management and administrative positions in esteemed organizations in his comprehensive career span.</p>
               <p>Dr. R.K. Singh has in-depth knowledge of higher education rules, regulations, practices, and conventions advocated by agencies such as the UGC, AICTE, NBA, and NAAC.</p>
             </div>
          </div>
          <div className="w-[300px] h-[340px] shrink-0 shadow-sm overflow-hidden flex items-center justify-center">
             <img src={drRKSinghImg} alt="Dr. R.K. Singh" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-[calc(100%+3rem)] -mx-6 md:-mx-10 lg:-mx-12 bg-[#d3d3d3] py-16 px-10 md:px-24 flex flex-col md:flex-row items-center md:items-start gap-12 flex-none">
          <div className="w-[300px] h-[340px] shrink-0 shadow-sm overflow-hidden flex items-center justify-center">
             <img src={suketuJaniImg} alt="Dr. Suketu Jani" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 mt-4 md:mt-2">
             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dr. Suketu Jani</h2>
             <h3 className="text-sm md:text-base font-bold text-brand-brown mb-6 tracking-wider uppercase">Deputy Registrar</h3>
             <div className="space-y-5 text-base md:text-lg text-gray-800 leading-relaxed text-left">
               <p>Dr. Suketu Jani currently serves as the Deputy Registrar at Indus University, where he plays a pivotal role in managing admissions, human resources, recruitment, training and placement, and student discipline.</p>
               <p>Dr. Jani brings over 17 years of combined experience in teaching and academic administration. He holds a Bachelor's, Master's, and Ph.D. in Mechanical Engineering.</p>
               <p>A prolific contributor to academic research, Dr. Jani has authored more than 20 research papers published in national and international journals and conferences.</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCard === 'Awards and Recognition') {
    const awards = [
      { title: "Awards Related to Research / Innovation AY 2017-22" },
      { title: "The Best Researcher Award (July 2023-2024 & July 2024-2025)" }
    ];

    return (
      <div className="fade-in h-full overflow-y-auto custom-scrollbar pr-2 md:pr-4 pb-20 flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        <div className="mb-10 shrink-0">
          <button 
            onClick={() => {
              setSelectedCard(null);
              setExpandedAward(null);
            }}
            className="flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all font-bold text-gray-600 group w-fit"
          >
            <svg className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK
          </button>
        </div>

        <div className="w-full">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-8 tracking-tight uppercase">AWARDS AND RECOGNITION</h1>
            <div className="space-y-4 text-[14px] md:text-[15px] text-gray-800 leading-relaxed max-w-6xl mx-auto text-left font-medium px-4">
              <p>Indus University has been established to make a noteworthy contribution to our country's social, economic, and cultural life. Having belief in the power of education, the builders of this university intend to impart wisdom to society's youngsters.</p>
              <p>The founders of Indus University strive to furnish the best quality education to their students. Noticeable steps are taken to equip students with valuable knowledge for the commercial industry worldwide. Every activity at Indus is practiced to elevate education.</p>
            </div>
          </header>

          <div className="space-y-2 px-2 mb-12">
             {/* Award 1 (Research Achievements) */}
             <div className="w-full">
                <button 
                  onClick={() => setExpandedAward(expandedAward === 0 ? null : 0)}
                  className="w-full bg-[#d3d3d3] hover:bg-[#c0c0c0] transition-colors p-4 md:px-8 flex items-center justify-between text-left group"
                >
                  <span className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-tight">{awards[0].title}</span>
                  <svg className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${expandedAward === 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedAward === 0 ? 'max-h-[20000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-white p-6 md:p-10 border border-gray-100 rounded-b-xl shadow-inner mx-4">
                    <div className="flex flex-col items-center gap-12">
                       {researchGallery.map((img, i) => (
                         <div key={i} className="bg-white p-3 shadow-xl rounded-lg border border-gray-100 w-full max-w-[800px] transform hover:scale-[1.01] transition-transform">
                            <img src={img} alt={`Research Award ${i+1}`} className="w-full h-auto" />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
             </div>

             {/* Award 2 (Best Researcher) */}
             <div className="w-full">
                <button 
                   onClick={() => setExpandedAward(expandedAward === 1 ? null : 1)}
                   className="w-full bg-[#d3d3d3] hover:bg-[#c0c0c0] transition-colors p-4 md:px-8 flex items-center justify-between text-left group"
                >
                  <span className="text-base md:text-lg font-bold text-gray-800 uppercase tracking-tight">{awards[1].title}</span>
                  <svg className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${expandedAward === 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedAward === 1 ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-white p-6 md:p-10 border border-gray-100 rounded-b-xl shadow-inner mx-4">
                    <div className="flex justify-center">
                       <div className="bg-white p-3 shadow-xl rounded-lg border border-gray-100 w-full max-w-[800px] transform hover:scale-[1.01] transition-transform">
                          <img src={bestResearcherImg} alt="Best Researcher Award" className="w-full h-auto" />
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-[#e0e0e0] p-8 md:p-12 rounded-xl mb-10 mx-2">
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 shadow-2xl rounded-sm transform hover:scale-[1.02] transition-transform">
                <img src={award1Img} alt="City Icon Award" className="w-full h-auto max-w-[450px]" />
              </div>
              <p className="mt-4 text-[11px] font-bold text-gray-600 text-center leading-relaxed max-w-[450px]">
                The Ahmedabad city icon award for excellence in TECHNOLOGY, MANAGEMENT & DESIGN EDUCATION for 2020.
              </p>
            </div>
            <div className="flex flex-col gap-14">
              <div className="flex flex-col items-center lg:items-start">
                <div className="bg-white p-3 shadow-2xl rounded-sm w-full max-w-[400px] transform hover:scale-[1.02] transition-transform">
                  <img src={award2Img} alt="Excellence Plaque" className="w-full h-auto" />
                </div>
                <p className="mt-4 text-[11px] font-bold text-gray-600 text-left leading-relaxed max-w-[400px]">
                  Excellence in Technology, Management & Design Education
                </p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="bg-white p-3 shadow-2xl rounded-sm w-full max-w-[400px] transform hover:scale-[1.02] transition-transform">
                  <img src={award3Img} alt="Campus Award" className="w-full h-auto" />
                </div>
                <p className="mt-4 text-[11px] font-bold text-gray-600 text-left leading-relaxed max-w-[400px]">
                  The 10 most promising campuses in India for research and innovation - 2020, Recognised by siliconindia education magazine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in h-full overflow-y-auto custom-scrollbar px-10 md:px-16 pb-10" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">About Indus University</h1>
        <p className="text-lg text-gray-500">Knowledge Enlightens the World</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16 px-4">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className={`${card.lightBg} p-10 md:p-12 rounded-[2.5rem] shadow-sm border-t-[20px] ${card.color} flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden`} 
            onClick={() => {
              if (card.title === 'Committees' && typeof setActivePage === 'function') {
                setActivePage('committees');
              } else {
                setSelectedCard(card.title);
              }
            }}
          >
            <div className="relative z-10 flex flex-col gap-6">
              <div className={`w-16 h-16 rounded-2xl ${card.textColor.replace('text-', 'bg-').replace('700', '100')} flex items-center justify-center`}>
                <span className={`material-symbols-outlined !text-[36px] ${card.textColor}`}>{card.icon}</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{card.title}</h3>
                <p className="text-gray-700 leading-relaxed text-base font-bold mb-8">{card.content}</p>
              </div>
            </div>
            
            <button className={`mt-auto py-4 px-6 text-sm bg-white border border-gray-100 rounded-2xl font-black ${card.textColor} group-hover:bg-slate-900 group-hover:text-white transition-all w-full text-center uppercase tracking-widest shadow-sm`}>
              Discover More
            </button>

            {/* Decorative element */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${card.textColor.replace('text-', 'bg-').replace('700', '500')} opacity-5 group-hover:scale-150 transition-transform duration-700`}></div>
          </div>
        ))}
      </div>
      <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Courses Indus Offers</h2>
          <p className="text-gray-700 leading-relaxed mb-4">Undergraduate and postgraduate courses are available in the following areas:</p>
          <p className="text-sm font-semibold text-gray-800 leading-relaxed bg-brand-light p-5 rounded-2xl">
            Engineering • Design & Architecture • Computer Science • Business Management • Aviation Technology • Clinical Research • Skill Development • Indology • Indic studies • Sustainability • Arts and Humanities • Commerce • Pharmaceutical Science • Pure Science • Applied Science • Legal Education
          </p>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Management Mission</h2>
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Vision of the University</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>To be an internationally acclaimed university for Academic Excellence, Professional Relevance, Research & Innovation.</li>
              <li>To seamlessly integrate Indian Values & Global Ethos.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Mission of the University</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>To offer quality technical and management education through creative and innovative teaching learning processes.</li>
              <li>To encompass "Where Practice Meets Theory" via state-of-the-art infrastructure.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
