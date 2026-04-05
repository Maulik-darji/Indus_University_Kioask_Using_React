import React, { useState, useEffect } from 'react';

const defaultCategories = [
  { id: 'btech', label: 'B.Tech', badge: 'DEGREE', color: 'border-blue-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', programs: ['Information & Communication Technology (ICT)', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Electrical Engineering', 'Electronics & Communication Engineering', 'Computer Engineering', 'Cyber Security', 'Information Technology', 'Computer Science Engineering', 'Aircraft Maintenance Engineering', 'Aeronautical Engineering', 'Aerospace Engineering', 'Defence Aerospace Engineering'] },
  { id: 'btech-dtd', label: 'B.Tech (D to D)', badge: 'LATERAL', color: 'border-amber-700', bgColor: 'bg-amber-700', lightBg: 'bg-amber-50', programs: ['Information & Communication Technology (ICT)', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Electrical Engineering', 'Electronics & Communication Engineering', 'Computer Engineering', 'Cyber Security', 'Information Technology', 'Computer Science Engineering'] },
  { id: 'diploma', label: 'Diploma', badge: 'TECHNICAL', color: 'border-orange-500', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', programs: ['Information & Communication Technology (ICT)', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Electrical Engineering', 'Electronics & Communication Engineering'] },
  { id: 'mtech', label: 'M.Tech', badge: 'MASTERS', color: 'border-red-600', bgColor: 'bg-red-600', lightBg: 'bg-red-50', programs: ['CAD / CAM (Mechanical Engr.)', 'Construction Project Management (Civil Engg.)', 'Digital Communication (EC Engg.)', 'Electrical Power System', 'Industrial Metallurgy', 'Structural Engineering (Civil Engg.)', 'Data Science (Computer)', 'Cyber Security'] },
  { id: 'bdes', label: 'B.Des', badge: 'DESIGN', color: 'border-yellow-500', bgColor: 'bg-yellow-500', lightBg: 'bg-yellow-50', programs: ['Product Design', 'Interior Design', 'Fashion Design', 'Communication Design - (Graphic Design)'] },
  { id: 'mdes', label: 'M.Des', badge: 'MASTERS', color: 'border-teal-600', bgColor: 'bg-teal-600', lightBg: 'bg-teal-50', programs: ['Fashion Design', 'Interior Design', 'UI-UX Design'] },
  { id: 'bsc', label: 'B.Sc', badge: 'SCIENCE', color: 'border-blue-400', bgColor: 'bg-blue-400', lightBg: 'bg-blue-50', programs: ['Data Science', 'Computer Application (CA) & (IT)', 'Clinical Research (Hons)', 'Mathematics (Hons)', 'Physics (Hons)', 'Chemistry (Hons)', 'Cyber Security (Hons)', 'Microbiology (Hons)', 'Computer Science (AI & ML)'] },
  { id: 'msc', label: 'M.Sc', badge: 'MASTERS', color: 'border-indigo-600', bgColor: 'bg-indigo-600', lightBg: 'bg-indigo-50', programs: ['Information Technology (IT)', 'Clinical Research', 'Mathematics', 'Physics', 'Chemistry', 'Cyber Security', 'Microbiology'] },
  { id: 'mba-avia', label: 'MBA/BBA', badge: 'BUSINESS', color: 'border-purple-600', bgColor: 'bg-purple-600', lightBg: 'bg-purple-50', programs: ['Aviation Management', 'BBA', 'Marketing', 'Finance', 'Human Resource'] },
  { id: 'bca', label: 'BCA', badge: 'COMPUTER', color: 'border-cyan-500', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', programs: ['BCA'] },
  { id: 'mca', label: 'MCA', badge: 'POST-GRAD', color: 'border-rose-500', bgColor: 'bg-rose-500', lightBg: 'bg-rose-50', programs: ['MCA'] }
];

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
    return '37,700';
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

export default function AdminCategories({ confirmDelete, setModalConfig }) {
  const [categories, setCategories] = useState([]);
  const [catForm, setCatForm] = useState({ id: '', label: '', badge: '', color: 'border-blue-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', programs: '' });

  // Navigation State
  const [selectedCategoryNav, setSelectedCategoryNav] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Program Details Editing
  const [programData, setProgramData] = useState({});
  const [selectedProgramEdit, setSelectedProgramEdit] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [originalJsonInput, setOriginalJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  useEffect(() => {
    const loadCategories = () => {
      const storedCat = localStorage.getItem('indus_categories');
      setCategories(storedCat ? JSON.parse(storedCat) : defaultCategories);
    };

    loadCategories();
    const storedProg = localStorage.getItem('indus_programData');
    setProgramData(storedProg ? JSON.parse(storedProg) : {});

    window.addEventListener('storage', loadCategories);
    return () => window.removeEventListener('storage', loadCategories);
  }, []);

  const saveCats = (data) => {
    setCategories(data);
    localStorage.setItem('indus_categories', JSON.stringify(data));
  };
  const saveProgData = (data) => {
    setProgramData(data);
    localStorage.setItem('indus_programData', JSON.stringify(data));
  };

  const saveCategory = (e) => {
    e.preventDefault();
    const id = catForm.id || catForm.label.toLowerCase().replace(/\s+/g, '-');
    const existing = categories.findIndex(c => c.id === id);
    const rawPrograms = catForm.programs || '';
    const newCat = {
      ...catForm,
      id,
      programs: typeof rawPrograms === 'string' ? rawPrograms.split(',').map(s => s.trim()).filter(p => p) : (Array.isArray(rawPrograms) ? rawPrograms : [])
    };

    if (existing >= 0) {
      const updated = [...categories];
      updated[existing] = newCat;
      saveCats(updated);
    } else {
      saveCats([...categories, newCat]);
    }
    setCatForm({ id: '', label: '', badge: '', color: 'border-blue-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', programs: '' });
  };

  const handleProgramSelect = (prog) => {
    setSelectedProgramEdit(prog);
    const catId = categories.find(c => c.programs.includes(prog))?.id;
    const data = programData[prog] || { 'CURRICULUM & LEARNING': { sections: [{ title: 'Overview', items: ['Point 1'] }] } };

    // Auto-seed centralized rules into the raw editor schema if missing
    if (!data['FEES STRUCTURE']) {
       const f = getProgramFee(catId, prog);
       data['FEES STRUCTURE'] = { 
         sections: [{ 
           title: 'Academic Fees Structure', 
           items: [f === 'Being Updated' ? 'Total 1st Semester Fees: Being Updated for 2026' : `Total 1st Semester Fees: ₹${f}`] 
         }] 
       };
    }
    if (!data['ELIGIBILITY']) {
       const e = getProgramEligibility(catId, prog);
       data['ELIGIBILITY'] = { 
         sections: [{ 
           title: 'Academic Eligibility', 
           items: [`Criteria: ${e.text}`, `Duration: ${e.duration}`] 
         }] 
       };
    }

    const serialized = JSON.stringify(data, null, 2);
    setJsonInput(serialized);
    setOriginalJsonInput(serialized);
    setJsonError('');
  };

  const handleJsonSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonError('');
      saveProgData({ ...programData, [selectedProgramEdit]: parsed });
      setOriginalJsonInput(jsonInput);
      setModalConfig({
        isOpen: true,
        title: 'Success!',
        content: <p className="text-slate-600 mb-6 font-bold text-center">Program details updated successfully!</p>
      });
      setSelectedProgramEdit('');
    } catch (err) {
      setJsonError('Invalid JSON format: ' + err.message);
    }
  };

  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;
    const updatedCats = categories.map(c => {
      if (c.id === selectedCategoryNav.id) {
        return { ...c, programs: [...c.programs, newCourseName.trim()] };
      }
      return c;
    });
    saveCats(updatedCats);
    setSelectedCategoryNav(updatedCats.find(c => c.id === selectedCategoryNav.id));
    setNewCourseName('');
    setModalConfig({
      isOpen: true,
      title: 'Success!',
      content: <p className="text-slate-600 mb-6 font-bold text-center">New course added to track!</p>
    });
  };

  const handleRemoveCourse = (courseName) => {
    setModalConfig({
      isOpen: true,
      title: 'Confirm Deletion',
      content: (
        <div>
          <p className="text-slate-600 mb-8 text-lg font-medium">Are you sure you want to delete <strong>{courseName}</strong>? This action cannot be undone.</p>
          <div className="flex gap-4">
            <button onClick={() => setModalConfig({ isOpen: false, title: '', content: null })} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
            <button
              onClick={() => {
                const updatedCats = categories.map(c => {
                  if (c.id === selectedCategoryNav.id) {
                    return { ...c, programs: c.programs.filter(p => p !== courseName) };
                  }
                  return c;
                });
                saveCats(updatedCats);
                setSelectedCategoryNav(updatedCats.find(c => c.id === selectedCategoryNav.id));
                setModalConfig({ isOpen: false, title: '', content: null });
              }}
              className="flex-1 py-4 bg-red-500 rounded-xl font-bold text-white hover:bg-red-600 shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
            >
              Delete
            </button>
          </div>
        </div>
      )
    });
  };

  const [activeMetadataTab, setActiveMetadataTab] = useState('CURRICULUM & LEARNING');

  const metadataTabs = [
    { id: 'CURRICULUM & LEARNING', label: 'Curriculum' },
    { id: 'INDUSTRY EXPOSURE', label: 'Industry' },
    { id: 'CAREER PROSPECTS', label: 'Career' },
    { id: 'WHY CHOOSE US', label: 'Choice' },
    { id: 'ELIGIBILITY', label: 'Eligibility' },
    { id: 'ADMISSION', label: 'Admission' },
    { id: 'FEES STRUCTURE', label: 'Fees' }
  ];

  const updateMethodology = (newContent) => {
    setJsonInput(JSON.stringify(newContent, null, 2));
  };

  const addSection = () => {
    const current = JSON.parse(jsonInput);
    const updated = { ...current };
    if (!updated[activeMetadataTab]) updated[activeMetadataTab] = { sections: [] };
    updated[activeMetadataTab].sections.push({ title: 'New Section', items: ['New Point'] });
    updateMethodology(updated);
  };

  const updateSectionTitle = (sIdx, title) => {
    const updated = JSON.parse(jsonInput);
    updated[activeMetadataTab].sections[sIdx].title = title;
    updateMethodology(updated);
  };

  const addPoint = (sIdx) => {
    const updated = JSON.parse(jsonInput);
    updated[activeMetadataTab].sections[sIdx].items.push('New Point');
    updateMethodology(updated);
  };

  const updatePoint = (sIdx, pIdx, val) => {
    const updated = JSON.parse(jsonInput);
    updated[activeMetadataTab].sections[sIdx].items[pIdx] = val;
    updateMethodology(updated);
  };

  const removePoint = (sIdx, pIdx) => {
    const updated = JSON.parse(jsonInput);
    updated[activeMetadataTab].sections[sIdx].items.splice(pIdx, 1);
    updateMethodology(updated);
  };

  const removeSection = (sIdx) => {
    const updated = JSON.parse(jsonInput);
    updated[activeMetadataTab].sections.splice(sIdx, 1);
    updateMethodology(updated);
  };

  if (selectedProgramEdit) {
    const allData = JSON.parse(jsonInput);
    const activeData = allData[activeMetadataTab] || { sections: [] };

    return (
      <div className="space-y-6 fade-in max-w-6xl mx-auto pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-7 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSelectedProgramEdit('')}
              className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-slate-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <span className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] mb-1 block">Spectrum Manager</span>
              <h4 className="text-3xl font-black text-slate-900 leading-tight">{selectedProgramEdit}</h4>
            </div>
          </div>

          <button 
            onClick={handleJsonSave} 
            disabled={jsonInput === originalJsonInput}
            className={`font-black px-8 py-3.5 rounded-xl transition-all shadow-sm text-[11px] uppercase tracking-widest ${
              jsonInput !== originalJsonInput
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md shadow-blue-600/20'
                : 'bg-slate-100/50 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
            }`}
          >
            {jsonInput !== originalJsonInput ? 'Save Changes' : 'Saved'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 bg-[#f7f6f3] p-8 rounded-[1rem] border border-slate-200 shadow-sm">
           {/* Vertical Metadata Sidebar */}
           <div className="lg:w-64 shrink-0">
             <div className="bg-white/70 backdrop-blur-sm p-3 rounded-[0.75rem] border border-slate-200/60 shadow-sm flex flex-col gap-1 sticky top-10">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-4 px-4 block border-b border-slate-100 pb-2">Management</span>
                {metadataTabs.map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveMetadataTab(tab.id)}
                     className={`w-full text-left px-5 py-3.5 rounded-lg text-sm font-semibold transition-all ${
                       activeMetadataTab === tab.id 
                       ? 'bg-slate-900 text-white shadow-md z-10' 
                       : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                     }`}
                   >
                     {tab.label}
                   </button>
                ))}
             </div>
           </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-px flex-1 bg-slate-200/50"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white/80 px-4 py-1.5 rounded-full border border-slate-200/60 shadow-sm">Context: {activeMetadataTab}</span>
               <div className="h-px flex-1 bg-slate-200/50"></div>
            </div>

            {activeData.sections.length > 0 ? activeData.sections.map((section, sIdx) => (
                <div key={sIdx} className="bg-white p-7 rounded-[1rem] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-slate-200 relative group transition-all">
                   <button 
                     onClick={() => removeSection(sIdx)}
                     className="absolute top-5 right-5 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>

                <div className="mb-8 text-left">
                  <label className="block text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3">Section Heading</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                    className="w-full text-3xl font-black text-slate-800 border-b border-transparent focus:border-slate-800 outline-none pb-2 transition-colors focus:bg-slate-50/30 px-0"
                  />
                </div>

                <div className="space-y-4 text-left">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">Info Points</label>
                  {section.items.map((item, pIdx) => (
                    <div key={pIdx} className="flex gap-4 items-center group/p">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updatePoint(sIdx, pIdx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-transparent focus:border-slate-800/10 px-6 py-5 rounded-2xl font-bold text-slate-900 outline-none focus:bg-white transition-all text-xl"
                      />
                      <button
                        onClick={() => removePoint(sIdx, pIdx)}
                        className="w-8 h-8 bg-red-50 text-red-400 hover:text-white hover:bg-red-500 transition-all rounded-lg flex items-center justify-center shrink-0 opacity-0 group-hover/p:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addPoint(sIdx)}
                    className="mt-4 text-[11px] font-black text-white flex items-center gap-2 uppercase tracking-widest bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-900/20 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    NEW CONTEXT POINT
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-slate-200 p-20 rounded-[1.5rem] text-center">
                <p className="text-slate-400 font-black italic text-xs uppercase tracking-widest">No data for {metadataTabs.find(t => t.id === activeMetadataTab)?.label}.</p>
              </div>
            )}

            <button
              onClick={addSection}
              className="w-full border-2 border-dashed border-slate-400 p-10 rounded-[1.25rem] text-slate-500 font-black flex items-center justify-center gap-3 hover:border-slate-800 hover:text-slate-800 hover:bg-white transition-all uppercase tracking-widest text-xs shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              Add {metadataTabs.find(t => t.id === activeMetadataTab)?.label} Section
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategoryNav) {
    return (
      <div className="space-y-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSelectedCategoryNav(null)}
              className="group flex items-center px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
              BACK TO TRACKS
            </button>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCategoryNav.label} Courses</h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 px-7 py-4 rounded-xl outline-none font-black text-lg w-[350px] shadow-sm focus:border-slate-800 transition-colors"
            />
          </div>
        </div>

        <div className="bg-[#f2f0ee] p-8 rounded-[1.5rem] shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Add New Course Card */}
            <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300 flex flex-col justify-center items-center group hover:bg-white hover:border-slate-800 transition-all duration-500 ease-out">
              <input
                type="text"
                placeholder="Course Name..."
                value={newCourseName}
                onChange={e => setNewCourseName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 mb-3 font-bold text-base outline-none focus:ring-2 ring-slate-800/10"
              />
              <button
                onClick={handleAddCourse}
                className="w-full bg-[#13141c] text-white font-black py-3 rounded-lg hover:bg-black active:scale-95 transition-all text-xs"
              >
                + ADD NEW
              </button>
            </div>

            {selectedCategoryNav.programs
              .filter(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((prog, idx) => (
                <div
                  key={idx}
                  onClick={() => handleProgramSelect(prog)}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-500 ease-out group relative overflow-hidden flex flex-col justify-between cursor-pointer transform-gpu hover:scale-[1.02] ring-1 ring-transparent hover:ring-slate-900/5"
                >
                  <div className="relative z-10 flex items-center justify-between pointer-events-none">
                    <div>
                      <div className="text-[9px] font-black text-slate-300 tracking-widest uppercase mb-1">CONFIGURE</div>
                      <h4 className="text-base font-black text-slate-800 group-hover:text-slate-900 transition-colors leading-tight">{prog}</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#13141c] group-hover:text-white transition-all duration-500 shrink-0 ml-2 shadow-inner">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveCourse(prog); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-50 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-300 flex items-center justify-center shadow-sm z-20 pointer-events-auto opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 fade-in">
      {/* Category Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200/50">
            <h3 className="text-xl font-black mb-6 text-slate-800 border-l-4 border-slate-400 pl-4 leading-tight">{catForm.id ? 'Edit Track Meta' : 'New Category'}</h3>
            <form onSubmit={saveCategory} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Label (B.Tech)</label>
                <input required type="text" value={catForm.label} onChange={e => setCatForm({ ...catForm, label: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Badge (DEGREE)</label>
                <input required type="text" value={catForm.badge} onChange={e => setCatForm({ ...catForm, badge: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black uppercase text-base border border-transparent focus:border-slate-800/10" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Programs</label>
                <textarea placeholder="Civil, Mechanical..." value={typeof catForm.programs === 'string' ? catForm.programs : catForm.programs.join(', ')} onChange={e => setCatForm({ ...catForm, programs: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base min-h-[120px] border border-transparent focus:border-slate-800/10"></textarea>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all shadow-md active:scale-95 text-xs">Save</button>
                {catForm.id && <button type="button" onClick={() => setCatForm({ id: '', label: '', badge: '', color: 'border-blue-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', programs: '' })} className="px-4 bg-slate-200 rounded-xl font-bold text-slate-600 text-xs">Esc</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-9 bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-[0.2em] leading-none">System Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white p-7 rounded-[1.25rem] shadow-sm border border-slate-100 relative group hover:shadow-lg transition-all duration-300 border-t-4 hover:border-t-slate-900 flex flex-col h-full">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-[9px] font-black text-slate-300 tracking-[0.1em] mb-2 uppercase">{cat.badge} • TRACK</div>
                  <h4 className="text-2xl font-black text-slate-900 mb-5 tracking-tight leading-tight">{cat.label}</h4>

                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedCategoryNav(cat)}
                      className="flex-1 min-w-[120px] px-5 py-3 bg-blue-100/50 text-blue-700 text-[11px] font-black rounded-lg hover:bg-blue-100 hover:shadow-md transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-blue-200 shadow-sm active:scale-95"
                    >
                      Manage
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </button>
                    <button
                      onClick={() => setCatForm(cat)}
                      className="px-5 py-3 bg-slate-200 text-slate-800 text-[11px] font-black rounded-lg hover:bg-slate-300 transition-all uppercase tracking-wider border border-slate-300/50 shadow-sm"
                    >
                      Meta
                    </button>
                    <button
                      onClick={() => confirmDelete('category', cat.id, cat.label)}
                      className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <p className="mt-6 text-[10px] font-bold text-slate-400 italic flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    {cat.programs.length} Specialized Programs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
