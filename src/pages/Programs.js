import React, { useState } from 'react';


// Common B.Tech Eligibility
const commonBtechEligibility = {
  sections: [
    { title: 'Eligibility Criteria', items: ['10 + 2 SCIENCE WITH MIN 45% IN PCM OR EQUIVALENT FROM A RECOGNIZED BOARD'] },
    { title: 'Program Duration', items: ['4 Years (8 Semesters)'] }
  ],
  showApply: true
};

const commonBtechFees = {
  sections: [
    { title: 'Academic Fees Structure', items: ['Total 1st Semester Fees: ₹60,220'] }
  ]
};

const commonDiplomaFees = {
  sections: [
    { title: 'Academic Fees Structure', items: ['Total 1st Semester Fees: ₹32,106'] }
  ]
};

const getProgramFee = (categoryId, programName) => {
  if (categoryId === 'diploma') return '32,106';
  if (categoryId === 'btech' || categoryId === 'btech-dtd') return '60,220';
  if (categoryId === 'mtech') return '78,058';
  if (categoryId === 'mca') return '54,353';
  if (categoryId === 'bca') return '37,700';
  
  if (categoryId === 'mba-avia') {
    if (programName === 'BBA') return '37,850';
    if (programName === 'Aviation Management' || programName === 'Marketing' || programName === 'Finance' || programName === 'Human Resource') return '58,453'; 
    return 'Being Updated'; 
  }
  
  if (categoryId === 'bdes') return '159,000';
  if (categoryId === 'mdes') return '56,750';

  if (categoryId === 'bsc') {
    if (programName.includes('Data Science') || programName.includes('Computer Science')) return '43,200';
    if (programName.includes('Cyber Security')) return '59,700';
    if (programName.includes('Clinical Research')) return '54,350';
    if (programName.includes('Chemistry') || programName.includes('Mathematics') || programName.includes('Physics')) return '26,800';
    if (programName.includes('Microbiology')) return '37,800';
    return '37,700'; // Default for CA/IT or unlisted B.Sc
  }
  
  if (categoryId === 'msc') {
    if (programName.includes('Cyber Security')) return '67,150';
    if (programName.includes('Information Technology')) return '56,150';
    if (programName.includes('Chemistry')) return '39,100';
    if (programName.includes('Clinical Research')) return '78,150';
    if (programName.includes('Mathematics')) return '28,050';
    if (programName.includes('Physics')) return '33,850';
    if (programName.includes('Microbiology')) return '42,750';
    return 'Being Updated';
  }
  
  return 'Being Updated';
};

const getProgramEligibility = (categoryId, programName) => {
  let e = { text: 'Being Updated', duration: 'Being Updated' };

  if (categoryId === 'btech') {
    e = { text: '10 + 2 SCIENCE WITH MIN 45% IN PCM OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '4 Years (8 Semesters)' };
  } else if (categoryId === 'btech-dtd') {
    e = { text: 'ANY DIPLOMA ENGINEERING WITH MIN 50% OR EQUIVALENT WITH DDCET EXAM FROM A RECOGNIZED UNIVERSITY', duration: '3 Years (6 Semesters)' };
  } else if (categoryId === 'diploma') {
    e = { text: '10TH PASS WITH MIN 45% OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '3 Years (6 Semesters)' };
  } else if (categoryId === 'mtech') {
    e = { text: 'B.E/BTECH WITH MIN 50% IN RELEVANT FIELD OR EQUIVALENT FROM A RECOGNIZED UNIVERSITY', duration: '2 Years (4 Semesters)' };
  } else if (categoryId === 'bca') {
    e = { text: '10+2 OR EQUIVALENT FROM A RECOGNIZED BOARD (SCIENCE/COMMERCE/ARTS)', duration: '5 Years (10 Semesters)' };
  } else if (categoryId === 'mca') {
    e = { text: 'ANY GRADUATE FROM ANY RECOGNIZED UNIVERSITY WITH MIN 50% FOR GENEREAL 45% FOR SC/ST/SEBC/EWS', duration: '2 Years (4 Semesters)' };
  } else if (categoryId === 'mba-avia') {
    if (programName === 'BBA') {
      e = { text: '10+2 WITH MATHS OR STATICS AS A SUBJECT OR EQUIVALENT', duration: '3 Years (6 Semesters)' };
    } else {
      e = { text: 'ANY GRADUATE OR EQUIVALENT WITH MIN 50% FROM A RECOGNIZED UNIVERSITY', duration: '2 Years (4 Semesters)' };
    }
  } else if (categoryId === 'bsc') {
    if (programName.includes('Clinical Research') || programName.includes('Microbiology')) {
      e = { text: '10+2 OR EQUIVALENT WITH PCB ONLY FROM A RECOGNIZED BOARD', duration: '3 Years (6 Semesters)' };
    } else if (programName.includes('Mathematics') || programName.includes('Physics') || programName.includes('Chemistry')) {
      e = { text: '10+2 OR EQUIVALENT WITH PCM ONLY FROM A RECOGNIZED BOARD', duration: '3 Years (6 Semesters)' };
    } else {
      e = { text: '10+2 WITH MATHS OR STATICS AS A SUBJECT OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '3 Years (6 Semesters)' };
    }
  } else if (categoryId === 'msc') {
    if (programName.includes('Cyber Security')) {
      e = { text: 'ANY GRADUATE FROM ANY RECOGNIZED UNIVERSITY WITH MIN 50% FOR GENEREAL 45% FOR SC/ST/SEBC/EWS', duration: '2 Years (4 Semesters)' };
    } else if (programName.includes('Information Technology')) {
      e = { text: 'GRADUATE FROM (BSC IT,BSC CS,BSC DS,BCA,BSC CYBER SECURITY) RECOGNIZED UNIVERSITY WITH MIN 50% FOR GENEREAL, 45% FOR SC/ST/SEBC/EWS', duration: '2 Years (4 Semesters)' };
    } else if (programName.includes('Microbiology')) {
      e = { text: 'BSC MICROBIOLOGY OR EQUIVALENT WITH MIN 50%', duration: '2 Years (4 Semesters)' };
    } else {
      e = { text: 'BSC IN RELEVANT FIELD OR EQUIVALENT FROM A RECOGNIZED UNIVERSITY WITH MIN 50%', duration: '2 Years (4 Semesters)' };
    }
  }
  return e;
};

const defaultProgramData = {
  'Information and Communication Technology': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Data management', 'Networking and protocols', 'Software development', 'Programming languages'] },
        { title: 'Advanced / Emerging Areas', items: ['Artificial Intelligence', 'Cybersecurity', 'Blockchain', 'Internet of Things'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Hands-on laboratory sessions', 'Industry visits', 'Technical workshops', 'Project-based learning'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Digital Technology Engineer', 'Network Planning Engineer', 'Cybersecurity Analyst', 'Service Engineer', 'Robotics Engineer'] },
        { title: 'Career Sectors', items: ['IT services', 'Telecommunications', 'Software development', 'Healthcare IT'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-oriented curriculum', 'Practical learning environment', 'Exposure to emerging ICT technologies', 'Holistic technical development'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Civil Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Automobile Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Mechanical Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Metallurgical Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Electrical Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Electronics and Communication Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Computer Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Cyber Security': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Information Technology': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Computer Science Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Aircraft Maintenance Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Aeronautical Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Aerospace Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  'Defence Aerospace Engineering': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonBtechFees },
  
  // Diploma Programs
  'Information & Communication Technology (ICT) ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
  'Civil Engineering ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
  'Automobile Engineering ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
  'Mechanical Engineering ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
  'Computer Engineering ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
  'Electrical Engineering ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
  'Electronics & Communication Engineering ': { 'ELIGIBILITY': commonBtechEligibility, 'FEES STRUCTURE': commonDiplomaFees },
};

const defaultCategories = [
  { id: 'btech', label: 'B.Tech', badge: 'Undergraduate', color: 'border-blue-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', programs: ['Information and Communication Technology', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Computer Engineering', 'Cyber Security', 'Information Technology', 'Computer Science Engineering', 'Aircraft Maintenance Engineering', 'Aeronautical Engineering', 'Aerospace Engineering', 'Defence Aerospace Engineering'] },
  { id: 'btech-dtd', label: 'B.Tech (D to D)', badge: 'Undergraduate (Lateral)', color: 'border-amber-700', bgColor: 'bg-amber-700', lightBg: 'bg-amber-50', programs: ['Information and Communication Technology', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Computer Engineering', 'Cyber Security', 'Information Technology', 'Computer Science Engineering'] },
  { id: 'diploma', label: 'Diploma', badge: 'Diploma Program', color: 'border-orange-500', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', programs: ['Information and Communication Technology', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering'] },
  { id: 'mtech', label: 'M.Tech', badge: 'Post Graduate', color: 'border-red-600', bgColor: 'bg-red-600', lightBg: 'bg-red-50', programs: ['CAD/CAM (Mechanical Engineering)', 'Construction Project Management (Civil Engineering)', 'Digital Communication (EC Engineering)', 'Electrical Power System', 'Industrial Metallury', 'Structural Engineering (Civil Engineering)', 'Data Science (Computer)', 'Cyber Security'] },
  { id: 'bdes', label: 'B.Des', badge: 'Undergraduate', color: 'border-yellow-500', bgColor: 'bg-yellow-500', lightBg: 'bg-yellow-50', programs: ['Product Design', 'Interior Design', 'Fasion Design', 'Communication Design'] },
  { id: 'mdes', label: 'M.Des', badge: 'Post Graduate', color: 'border-teal-600', bgColor: 'bg-teal-600', lightBg: 'bg-teal-50', programs: ['Fasion Design', 'Interior Design', 'UI-UX Design'] },
  { id: 'bsc', label: 'B.Sc', badge: 'Undergraduate', color: 'border-blue-400', bgColor: 'bg-blue-400', lightBg: 'bg-blue-50', programs: ['Data Science', 'B.Sc(CA & IT)', 'B.Sc Clical Research and HealthCare Management', 'B.Sc Mathematics', 'B.Sc Physics', 'B.Sc Chemistry', 'Cyber Security', 'B.Sc Micro Biology', 'Computer Science (AI and ML)'] },
  { id: 'msc', label: 'M.Sc', badge: 'Post Graduate', color: 'border-indigo-600', bgColor: 'bg-indigo-600', lightBg: 'bg-indigo-50', programs: ['M.Sc-Information Technology', 'M.Sc-Clinical Research', 'M.Sc-Mathematics', 'M.Sc-Physics', 'M.Sc-Chemistry', 'M.Sc-Cyber Security', 'M.Sc-Microbiology'] },
  { id: 'mba-avia', label: 'MBA/BBA', badge: 'Undergraduate / Post Graduate', color: 'border-purple-600', bgColor: 'bg-purple-600', lightBg: 'bg-purple-50', programs: ['Aviation', 'BBA (General)', 'Marketing', 'Finance', 'Human Resource'] },
  { id: 'bca', label: 'BCA', badge: 'Undergraduate', color: 'border-cyan-500', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', programs: ['BCA'] },
  { id: 'mca', label: 'MCA', badge: 'Post Graduate', color: 'border-rose-500', bgColor: 'bg-rose-500', lightBg: 'bg-rose-50', programs: ['Master of Computer Application'] }
];

function Programs({ setActivePage, setAdmissionData }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDetailSection, setSelectedDetailSection] = useState('CURRICULUM & LEARNING');
  const [searchQuery, setSearchQuery] = useState('');
  const detailContentRef = React.useRef(null);

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('indus_categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [programData, setProgramData] = useState(() => {
    const saved = localStorage.getItem('indus_programData');
    return saved ? JSON.parse(saved) : defaultProgramData;
  });

  const [inquiryNumber, setInquiryNumber] = useState(() => {
    return localStorage.getItem('indus_inquiry_number') || '+91 74054 13342';
  });

  React.useEffect(() => {
    if (selectedProgram) {
      const el = document.getElementById('modal-details-container');
      if (el) el.scrollTop = 0;
    }
  }, [selectedProgram]);

  const handleDetailClick = (id) => {
    setSelectedDetailSection(id);
    setTimeout(() => {
      detailContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (!selectedCategory) {
    return (
      <div className="w-full flex-1 h-full overflow-hidden px-4 md:px-6 lg:px-8 pb-10 fade-in">
        {/* Categories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-10 min-h-[85vh] h-full overflow-y-visible px-4 md:px-8 pt-8 pb-32 -mx-4 md:-mx-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-[2.5rem] p-8 lg:p-9 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border-t-[28px] ${cat.color} relative overflow-hidden group hover:shadow-2xl transition-all duration-700 cursor-pointer hover:-translate-y-2 aspect-square flex flex-col justify-between`}
              style={{ backgroundColor: `rgba(${cat.id === 'btech' ? '59, 130, 246' : cat.id === 'btech-dtd' ? '180, 83, 9' : cat.id === 'diploma' ? '249, 115, 22' : '150, 150, 150'}, 0.12)` }}
            >
              <div className={`absolute inset-0 ${cat.bgColor} opacity-10 group-hover:opacity-20 transition-opacity duration-700`}></div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className={`text-[10px] font-black tracking-[0.15em] mb-3 uppercase mt-1 ${cat.color.replace('border-', 'text-')}`}>
                  {cat.badge}
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-[1.1] mb-2 tracking-tight">
                  {cat.label}
                </h3>
              </div>

              <div className="relative z-10 flex items-center text-slate-600 font-black text-[11px] group-hover:text-slate-900 transition-colors tracking-widest pt-4 border-t border-slate-900/5 mt-2">
                <span>EXPLORE COURSES</span>
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-4 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${cat.bgColor} rounded-full opacity-20 group-hover:scale-125 transition-transform duration-[1000ms]`}></div>
            </div>
          ))}
        </div>
        <p className="mt-24 text-center text-slate-300 text-sm font-black tracking-widest uppercase italic border-t border-slate-100 pt-12">"Where Practice Meets Theory"</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="w-full flex-1 h-full overflow-hidden p-6 md:p-10 lg:p-12 pb-24 md:pb-24 fade-in">
      {/* Detail Header with Back Button */}
      <div className="mb-4 grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setSelectedProgram(null);
            }}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-x-1 transition-all font-bold text-slate-600 group w-fit text-sm"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedCategory.label} Courses</h1>
          <p className={`text-xs font-bold ${selectedCategory.color.replace('border-', 'text-')} tracking-wider uppercase`}>Available Specializations</p>
        </div>

        <div className="justify-self-end w-full max-w-[320px]">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search programs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6 min-h-[60vh] h-full overflow-y-visible px-10 pt-10 pb-32 -mx-10">
        {selectedCategory.programs
          .filter(prog => prog.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((prog, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedProgram(prog)}
              className={`p-6 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-700 group cursor-pointer relative overflow-hidden flex flex-col justify-between h-full hover:-translate-y-1`}
              style={{ 
                backgroundColor: 'white',
                borderTop: `10px solid ${selectedCategory.color.includes('blue') ? '#3b82f6' : selectedCategory.color.includes('amber') ? '#b45309' : selectedCategory.color.includes('orange') ? '#f97316' : selectedCategory.color.includes('red') ? '#dc2626' : selectedCategory.color.includes('yellow') ? '#eab308' : selectedCategory.color.includes('teal') ? '#0d9488' : selectedCategory.color.includes('indigo') ? '#4f46e5' : selectedCategory.color.includes('purple') ? '#9333ea' : selectedCategory.color.includes('cyan') ? '#0891b2' : selectedCategory.color.includes('rose') ? '#e11d48' : '#64748b'}`
              }}
            >
              {/* Vibrant background layer */}
              <div className={`absolute inset-0 ${selectedCategory.bgColor} opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700`}></div>
              
              <div className="relative z-10">
                <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-slate-900 transition-colors uppercase tracking-tight">{prog}</h4>
              </div>
              
              <div className={`mt-6 flex items-center text-[9px] font-black tracking-[0.1em] group-hover:text-slate-900 transition-colors uppercase pt-4 border-t border-slate-900/5 ${selectedCategory.color.replace('border-', 'text-')}`}>
                <span>Program Details</span>
                <svg className="w-5 h-5 ml-3 group-hover:translate-x-3 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Decorative circle */}
              <div className={`absolute -bottom-10 -right-10 w-24 h-24 ${selectedCategory.bgColor} rounded-full opacity-10 group-hover:scale-150 transition-all duration-1000`}></div>
            </div>
          ))}

        {selectedCategory.programs.filter(prog => prog.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
          <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 mt-10">No matching programs</h3>
            <p className="text-slate-400 font-bold">Try searching for another keyword</p>
          </div>
        )}
      </div>

    </div>
    </div>

    {/* Program Details Sidebar */}
    {selectedProgram && (
      <div 
        className="fixed inset-0 bottom-18 z-[999999] flex flex-col bg-[#fcfbf9] animate-[fadeIn_0.5s_ease-out_forwards]"
        aria-labelledby="modal-title" 
        role="dialog" 
        aria-modal="true"
      >
        {/* Full Page Content Container */}
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Header / Top Bar */}
          <div className="px-10 pt-10 pb-6 flex justify-between items-start border-b border-gray-100 bg-[#fcfbf9]/95 z-20">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-1">{selectedProgram}</h2>
              <p className="text-[13px] text-slate-400 font-bold opacity-80 tracking-tight">Academic Methodology & Specialization Insights</p>
            </div>
            
            <button 
              onClick={() => setSelectedProgram(null)}
              className="mt-2 p-4 bg-rose-50 border border-rose-100 rounded-full shadow-sm hover:bg-rose-100 hover:scale-110 active:scale-95 transition-all group shrink-0"
            >
              <svg className="w-6 h-6 text-rose-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Content Area - Grid of Detail Squares */}
          <div id="modal-details-container" className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-64 relative h-full">
            <div className="grid grid-cols-4 gap-4 pt-16 pb-4">
              {[
                { title: 'CURRICULUM & LEARNING', color: 'bg-[#ffae4f]', id: 'CURRICULUM & LEARNING' },
                { title: 'INDUSTRY EXPOSURE', color: 'bg-[#c9d09e]', id: 'INDUSTRY EXPOSURE' },
                { title: 'CAREER PROSPECTS', color: 'bg-[#ff7a4d]', id: 'CAREER PROSPECTS' },
                { title: 'WHY CHOOSE US', color: 'bg-[#ffae4f]', id: 'WHY CHOOSE US' },
                { title: 'ELIGIBILITY', color: 'bg-[#c9d09e]', id: 'ELIGIBILITY' },
                { title: 'ADMISSION', color: 'bg-[#ff7a4d]', id: 'ADMISSION' },
                { title: 'FEES STRUCTURE', color: 'bg-[#ffae4f]', id: 'FEES STRUCTURE', shadow: true, pointer: true }
              ].map((item, i) => (
                <div 
                  key={i}
                  onClick={() => handleDetailClick(item.id)}
                  className={`
                    relative h-28 p-4 flex flex-col items-center justify-center text-center
                    rounded-2xl cursor-pointer transition-all duration-300 group
                    hover:scale-[1.02] hover:-translate-y-1
                    ${item.color} 
                    ${selectedDetailSection === item.id ? 'shadow-lg scale-[1.03] -translate-y-1 z-10 border-2 border-white' : 'shadow-sm hover:shadow-md hover:z-10'}
                  `}
                >
                  <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                    {item.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </h3>
                </div>
              ))}
            </div>

            {/* Detail Content (Populated with actual data) */}
            <div ref={detailContentRef} className="mt-4 p-8 bg-white rounded-3xl border border-slate-100 min-h-[300px] shadow-sm relative overflow-hidden">
               {(programData[selectedProgram] && programData[selectedProgram][selectedDetailSection]) || selectedDetailSection === 'FEES STRUCTURE' || selectedDetailSection === 'ELIGIBILITY' ? (
                 <div className="fade-in">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-gray-50">
                      {selectedDetailSection === 'CURRICULUM & LEARNING' ? 'Curriculum & Learning Areas' : 
                       selectedDetailSection === 'INDUSTRY EXPOSURE' ? 'Industry Exposure & Practical Learning' : 
                       selectedDetailSection === 'CAREER PROSPECTS' ? 'Career Opportunities' :
                       selectedDetailSection === 'ADMISSION' ? 'Admission Process' :
                       selectedDetailSection}
                    </h3>
                    <div className="space-y-6">
                      {/* Smart Data Resolution */}
                      {(() => {
                        let activeSectionData = programData[selectedProgram]?.[selectedDetailSection];
                        
                        // Seed dynamic fallbacks just-in-time if standard JSON is missing
                        if (!activeSectionData && selectedDetailSection === 'FEES STRUCTURE') {
                          const f = getProgramFee(selectedCategory.id, selectedProgram);
                          activeSectionData = { 
                            sections: [{ 
                              title: 'Academic Fees Structure', 
                              items: [f === 'Being Updated' ? 'Total 1st Semester Fees: Being Updated for 2026' : `Total 1st Semester Fees: ₹${f}`] 
                            }] 
                          };
                        } else if (!activeSectionData && selectedDetailSection === 'ELIGIBILITY') {
                          const e = getProgramEligibility(selectedCategory.id, selectedProgram);
                          activeSectionData = { 
                            sections: [{ 
                              title: 'Academic Eligibility', 
                              items: [`Criteria: ${e.text}`, `Duration: ${e.duration}`] 
                            }] 
                          };
                        }

                        if (!activeSectionData) return null;

                        return activeSectionData.sections.map((section, idx) => (
                          <div key={idx}>
                            <h4 className="font-bold text-slate-800 text-lg mb-3 tracking-tight">
                              {section.title}
                            </h4>
                            <ul className="space-y-4 ml-1">
                              {section.items.map((item, i) => (
                                <li key={i} className="flex items-start text-lg text-slate-600 font-bold mb-4">
                                  <span className="w-2 h-2 rounded-full bg-brand-brown mt-2.5 mr-4 opacity-80 shrink-0"></span>
                                  <span className="leading-[1.6]">
                                    {/* Make Criteria/Duration boldly highlighted if they match standard patterns */}
                                    {item.startsWith('Criteria:') ? (
                                      <><strong className="text-slate-800">Criteria:</strong> {item.replace('Criteria:', '')}</>
                                    ) : item.startsWith('Duration:') ? (
                                      <><strong className="text-slate-800">Duration:</strong> {item.replace('Duration:', '')}</>
                                    ) : (
                                      item
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ));
                      })()}
                    </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-16">
                    <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-base text-slate-500 font-bold italic leading-relaxed">
                      Detailed information for "{selectedDetailSection}" <br/> is being updated for {selectedProgram}.
                    </p>
                 </div>
               )}
            </div>
          </div>

          {/* Bottom Contact / Action Bar */}
          <div className="px-10 pt-6 pb-12 bg-white border-t border-slate-100 flex items-center justify-between z-[40]">
            <div>
              <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">Inquiry Support</p>
              <p className="text-xl font-black text-slate-900">{inquiryNumber}</p>
            </div>
            <button 
              onClick={() => {
                if(setAdmissionData) {
                  setAdmissionData({
                    categoryId: selectedCategory.id,
                    programName: selectedProgram
                  });
                }
                if(setActivePage) setActivePage('admission');
              }}
              className="px-12 py-5 bg-[#ff4d20] text-white text-[15px] font-black uppercase tracking-widest rounded-2xl shadow-[0_15px_40px_rgba(255,77,32,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default Programs;
