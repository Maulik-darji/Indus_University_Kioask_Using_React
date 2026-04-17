import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { INDIA_STATES, INDIA_CITIES_BY_STATE } from '../data/indiaLocations';

const PROGRAM_DATA_BASE = {
  UG: {
    "B.Tech": [
      "Civil Engineering", "Automobile Engineering", "Mechanical Engineering", "Metallurgical Engineering",
      "Electrical Engineering", "Electronics and Communication Engineering", "Computer Science Engineering",
      "Computer Engineering", "Information Technology", "Cyber Security", "Information and Communication Technology",
      "Aircraft Maintenance Engineering", "Aeronautical Engineering", "Aerospace Engineering", "Defence Aerospace Engineering"
    ],
    "BCA": ["BCA"],
    "Diploma to Degree": [
      "Civil Engineering", "Automobile Engineering", "Mechanical Engineering", "Metallurgical Engineering",
      "Electrical Engineering", "Electronics and Communication Engineering", "Computer Science Engineering",
      "Computer Engineering", "Information Technology", "Cyber Security", "Information and Communication Technology"
    ],
    "B.Sc": [
      "B.Sc(CA & IT)", "Cyber Security", "Data Science", "Computer Science (AI and ML)",
      "B.Sc Clical Research and HealthCare Management", "B.Sc Mathematics", "B.Sc Physics", "B.Sc Chemistry", "B.Sc Micro Biology"
    ],
    "BBA": ["Aviation", "BBA (General)"],
    "B.Com": ["B.com (HONS)"],
    "Design": ["Product Design", "Interior Design", "Fasion Design", "Communication Design"],
    "Architecture": ["B.Arch (Bachelor of Architecture)"],
    "Pharmacy": ["B.pharm Bachelor of Pharmacy"],
    "BA": ["English"]
  },
  PG: {
    "M.Tech": [
      "CAD/CAM (Mechanical Engineering)", "Construction Project Management (Civil Engineering)",
      "Digital Communication (EC Engineering)", "Electrical Power System", "Industrial Metallury",
      "Structural Engineering (Civil Engineering)", "Data Science (Computer)", "Cyber Security"
    ],
    "MSc": [
      "M.Sc-Cyber Security", "M.Sc-Information Technology", "M.Sc-Chemistry", "M.Sc-Physics",
      "M.Sc-Mathematics", "M.Sc-Clinical Research", "M.Sc-Microbiology"
    ],
    "MCA": ["Master of Computer Application"],
    "MBA": ["Master of Business Administration"],
    "M.Des": ["Fasion Design", "Interior Design", "UI-UX Design"]
  },
  Diploma: {
    "Diploma": [
      "Electrical Engineering", "Computer Engineering", "Civil Engineering", "Automobile Engineering",
      "Mechanical Engineering", "Electronics and Communication Engineering", "Information and Communication Technology"
    ]
  },
  PhD: {
    "Part time": [
      "Computer Science & Application", "Computer Engineering", "Cyber Security", "Civil Engineering",
      "Commerce", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering",
      "Metallurgical Engineering", "Chemistry", "Life Sciences (Clinical Research & Healthcare)",
      "Life Sciences (Microbiology)", "Physics", "Mathematics", "English & Humanities", "Environmental Science",
      "Marketing Manageement", "Finance Management"
    ],
    "Full time": [
      "Computer Science & Application", "Computer Engineering", "Cyber Security", "Civil Engineering",
      "Commerce", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering",
      "Metallurgical Engineering", "Chemistry", "Life Sciences (Clinical Research & Healthcare)",
      "Life Sciences (Microbiology)", "Physics", "Mathematics", "English & Humanities", "Environmental Science",
      "Marketing Manageement", "Finance Management"
    ]
  }
};

const PROGRAM_DATA_WIIA = {
  ...PROGRAM_DATA_BASE,
  UG: {
    ...PROGRAM_DATA_BASE.UG,
    'B.Tech': [
      ...PROGRAM_DATA_BASE.UG['B.Tech'],
      'B.Tech Aeronautical',
      'B.Tech Aerospace',
      'B.Tech Defence Aerospace',
      'B.Tech Aircraft Maintenance Engineering',
      'B1.1 - Aeroplane Turbine',
      'B2 - Avionics',
      'B1.2 - Aeroplane Piston',
      'B1.3 - Helicopter Turbine',
    ],
  },
};

function Admission({ admissionData, setAdmissionData, siteVariant = 'indus' }) {
  const programData = React.useMemo(() => (siteVariant === 'wiia' ? PROGRAM_DATA_WIIA : PROGRAM_DATA_BASE), [siteVariant]);
  
  // Storage Helper
  const loadStored = (key, fallback = '') => {
    try {
      const val = localStorage.getItem(`indus_form_${key}`);
      return val !== null ? val : fallback;
    } catch { return fallback; }
  };

  // Form Identity States
  const [fullName, setFullName] = useState(() => loadStored('fullName'));
  const [email, setEmail] = useState(() => loadStored('email'));
  const [mobile, setMobile] = useState(() => loadStored('mobile'));
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Field States
  const [level, setLevel] = useState(() => loadStored('level'));
  const [program, setProgram] = useState(() => loadStored('program'));
  const [specialization, setSpecialization] = useState(() => loadStored('specialization'));
  const [state, setState] = useState(() => loadStored('state'));
  const [customState, setCustomState] = useState(() => loadStored('customState'));
  const [city, setCity] = useState(() => loadStored('city'));
  const [customCity, setCustomCity] = useState(() => loadStored('customCity'));
  const [contactedBy, setContactedBy] = useState(() => loadStored('contactedBy'));
  const [customContactedBy, setCustomContactedBy] = useState(() => loadStored('customContactedBy'));
  const [dobDay, setDobDay] = useState(() => loadStored('dobDay'));
  const [dobMonth, setDobMonth] = useState(() => loadStored('dobMonth'));
  const [dobYear, setDobYear] = useState(() => loadStored('dobYear'));

  const [lastActivity, setLastActivity] = useState(Date.now());

  // Persistence Sync
  useEffect(() => {
    const data = { fullName, email, mobile, level, program, specialization, state, customState, city, customCity, contactedBy, customContactedBy, dobDay, dobMonth, dobYear };
    Object.entries(data).forEach(([key, val]) => {
      localStorage.setItem(`indus_form_${key}`, val || '');
    });
  }, [fullName, email, mobile, level, program, specialization, state, customState, city, customCity, contactedBy, customContactedBy, dobDay, dobMonth, dobYear]);

  const handleClearForm = useCallback(() => {
    setFullName('');
    setEmail('');
    setMobile('');
    setLevel('');
    setProgram('');
    setSpecialization('');
    setState('');
    setCustomState('');
    setCity('');
    setCustomCity('');
    setContactedBy('');
    setCustomContactedBy('');
    setDobDay('');
    setDobMonth('');
    setDobYear('');
    // Clear storage
    const keys = ['fullName', 'email', 'mobile', 'level', 'program', 'specialization', 'state', 'customState', 'city', 'customCity', 'contactedBy', 'customContactedBy', 'dobDay', 'dobMonth', 'dobYear'];
    keys.forEach(k => localStorage.removeItem(`indus_form_${k}`));
  }, []);

  // Inactivity Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (Date.now() - lastActivity > 60000) { // 60 seconds
        handleClearForm();
        setLastActivity(Date.now());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastActivity, handleClearForm]);

  const recordActivity = () => setLastActivity(Date.now());

  React.useEffect(() => {
    if (admissionData) {
      const { categoryId, programName } = admissionData;
      let newLevel = '';
      let newProgram = '';
      let newSpec = programName.trim();
      const overrides = {
        'Marketing': { level: 'PG', program: 'MBA', spec: 'Master of Business Administration' },
        'Finance': { level: 'PG', program: 'MBA', spec: 'Master of Business Administration' },
        'Human Resource': { level: 'PG', program: 'MBA', spec: 'Master of Business Administration' }
      };
      if (overrides[newSpec]) {
        setLevel(overrides[newSpec].level);
        setProgram(overrides[newSpec].program);
        setSpecialization(overrides[newSpec].spec);
        return;
      }
      if (categoryId === 'btech') {
        newLevel = 'UG';
        newProgram = 'B.Tech';
      } else if (categoryId === 'btech-dtd') {
        newLevel = 'UG';
        newProgram = 'Diploma to Degree';
      } else if (categoryId === 'diploma') {
        newLevel = 'Diploma';
        newProgram = 'Diploma';
      } else if (categoryId === 'mtech') {
        newLevel = 'PG';
        newProgram = 'M.Tech';
      } else if (categoryId === 'bdes') {
        newLevel = 'UG';
        newProgram = 'Design';
      } else if (categoryId === 'mdes') {
        newLevel = 'PG';
        newProgram = 'M.Des';
      } else if (categoryId === 'bsc') {
        newLevel = 'UG';
        newProgram = 'B.Sc';
      } else if (categoryId === 'msc') {
        newLevel = 'PG';
        newProgram = 'MSc';
      } else if (categoryId === 'mba-avia') {
        if (programName === 'BBA' || programName === 'BBA (General)') {
          newLevel = 'UG';
          newProgram = 'BBA';
          newSpec = 'BBA (General)';
        } else if (programName === 'Aviation') {
          newLevel = 'UG';
          newProgram = 'BBA';
          newSpec = 'Aviation';
        } else {
          newLevel = 'PG';
          newProgram = 'MBA';
          newSpec = 'Master of Business Administration';
        }
      } else if (categoryId === 'bca') {
        newLevel = 'UG';
        newProgram = 'BCA';
        newSpec = 'BCA';
      } else if (categoryId === 'mca') {
        newLevel = 'PG';
        newProgram = 'MCA';
        newSpec = 'Master of Computer Application';
      }
      const normalize = (str) => str?.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '').trim();
      const normalizedQuery = normalize(newSpec);
      if (newLevel && newProgram && programData[newLevel] && programData[newLevel][newProgram]) {
        const options = programData[newLevel][newProgram];
        let match = options.find(opt => opt === newSpec);
        if (!match) match = options.find(opt => normalize(opt) === normalizedQuery);
        if (!match) match = options.find(opt => normalizedQuery.includes(normalize(opt)) || normalize(opt).includes(normalizedQuery));
        if (match) newSpec = match;
      }
      setLevel(newLevel);
      setProgram(newProgram);
      setSpecialization(newSpec);
    }
  }, [admissionData, programData]);

  React.useEffect(() => {
    return () => {
      if(setAdmissionData) setAdmissionData(null);
    };
  }, [setAdmissionData]);

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setProgram('');
    setSpecialization('');
    recordActivity();
  };

  const handleProgramChange = (e) => {
    setProgram(e.target.value);
    setSpecialization('');
    recordActivity();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const sId = localStorage.getItem('indus_ai_session_id');
    if (sId && fullName) {
      try {
        await updateDoc(doc(db, "ai_chat_logs", sId), {
          userName: fullName.trim(),
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Failed to link student name to session:", err);
      }
    }

    setTimeout(() => {
      setIsSubmitted(false);
      handleClearForm();
    }, 4000);
  };

  const inputClasses = "w-full p-4 border border-gray-200 rounded-xl bg-white focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/10 outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-1";
  const citiesForState = state && state !== '__other__' ? (INDIA_CITIES_BY_STATE[state] || []) : [];
  const isDirty = (fullName || email || mobile || level || program).length > 0;

  return (
    <div className="fade-in w-full max-w-5xl mx-auto px-4 md:px-0 md:-mt-8" onMouseMove={recordActivity} onKeyDown={recordActivity}>
      <header className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          2026 Admission
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase" style={{ color: '#6f5c4e' }}>
            Indus University
          </h1>
        </div>
        <div className="text-lg md:text-xl font-bold text-slate-500 tracking-tight mt-1">
          Where Practice Meets Theory
        </div>
      </header>

      <form className="relative bg-white p-7 md:p-10 rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden" onSubmit={handleSubmit}>
        <AnimatePresence>
          {isSubmitted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center p-8 text-center"
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <span className="material-symbols-outlined !text-4xl animate-bounce">check_circle</span>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Application Submitted</h2>
                  <p className="text-slate-500 font-bold mt-2 text-lg italic">Please wait while we process your request...</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-1.5">
            <label className={labelClasses}>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`${inputClasses} py-3`} placeholder="As per Marksheet" required />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Email Address *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClasses} py-3`} placeholder="example@email.com" required />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Mobile Number *</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className={`${inputClasses} py-3`} placeholder="+91 XXXXX XXXXX" required />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Date of Birth *</label>
            <div className="grid grid-cols-3 gap-3">
              <select className={`${inputClasses} py-3 text-xs`} value={dobDay} onChange={(e)=> {setDobDay(e.target.value); recordActivity();}} required><option value="">Day</option>{[...Array(31)].map((_, i) => (<option key={i+1} value={String(i+1)}>{i+1}</option>))}</select>
              <select className={`${inputClasses} py-3 text-xs`} value={dobMonth} onChange={(e)=> {setDobMonth(e.target.value); recordActivity();}} required><option value="">Mo</option>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (<option key={m} value={String(i+1)}>{m}</option>))}</select>
              <select className={`${inputClasses} py-3 text-xs`} value={dobYear} onChange={(e)=> {setDobYear(e.target.value); recordActivity();}} required><option value="">Year</option>{Array.from({ length: 33 }, (_, i) => 2012 - i).map(y => (<option key={y} value={String(y)}>{y}</option>))}</select>
            </div>
          </div>

          {/* ... other selects ... */}
          <div className="space-y-1.5">
            <label className={labelClasses}>Program Level *</label>
            <select className={`${inputClasses} py-3`} value={level} onChange={handleLevelChange} required>
              <option value="">Select Level</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
              <option value="PhD">Ph.D</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select Program *</label>
            <select className={`${inputClasses} py-3 transition-opacity duration-300 ${!level ? 'opacity-40' : 'opacity-100'}`} value={program} onChange={handleProgramChange} required disabled={!level}>
              <option value="">Select Program</option>
              {level && programData[level] && Object.keys(programData[level]).map(p => (<option key={p} value={p}>{p}</option>))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select Specialization *</label>
            <select className={`${inputClasses} py-3 transition-opacity duration-300 ${!program ? 'opacity-40' : 'opacity-100'}`} value={specialization} onChange={(e) => {setSpecialization(e.target.value); recordActivity();}} required disabled={!program}>
              <option value="">Area of focus</option>
              {level && program && programData[level][program] && programData[level][program].map(s => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select State *</label>
            <select className={`${inputClasses} py-3`} value={state} onChange={(e) => { const nextState = e.target.value; setState(nextState); setCity(''); if (nextState !== '__other__') setCustomState(''); recordActivity(); }} required>
              <option value="">Select State</option>
              {INDIA_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
              <option value="__other__">Other (Type Manually)</option>
            </select>
            {state === '__other__' && <input type="text" className={`${inputClasses} py-3 mt-3`} placeholder="Enter your state" value={customState} onChange={(e) => {setCustomState(e.target.value); recordActivity();}} required />}
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select City *</label>
            {state && state !== '__other__' ? (
              <>
                <select className={`${inputClasses} py-3 transition-opacity duration-300 ${!state ? 'opacity-40' : 'opacity-100'}`} value={city} onChange={(e) => { const nextCity = e.target.value; setCity(nextCity); if (nextCity !== '__other__') setCustomCity(''); recordActivity(); }} required disabled={!state}>
                  <option value="">Select City</option>
                  {citiesForState.map((c) => (<option key={c} value={c}>{c}</option>))}
                  <option value="__other__">Other (Type Manually)</option>
                </select>
                {city === '__other__' && <input type="text" className={`${inputClasses} py-3 mt-3`} placeholder="Enter your city" value={customCity} onChange={(e) => {setCustomCity(e.target.value); recordActivity();}} required />}
              </>
            ) : (
              <input type="text" className={`${inputClasses} py-3 transition-opacity duration-300 ${!state ? 'opacity-40' : 'opacity-100'}`} placeholder="Enter your city" value={customCity} onChange={(e) => {setCustomCity(e.target.value); recordActivity();}} required={!!state} disabled={!state} />
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Contacted By</label>
            <select
              className={`${inputClasses} py-3 text-slate-800 font-medium`}
              value={contactedBy}
              onChange={(e) => { const next = e.target.value; setContactedBy(next); if (next !== '__other__') setCustomContactedBy(''); recordActivity(); }}
            >
              <option value="Rajesh Vaghela">Rajesh Vaghela</option>
              <option value="Bhavin Chaudhary">Bhavin Chaudhary</option>
              <option value="Swapnil Kachewar">Swapnil Kachewar</option>
              <option value="Nidhi Shah">Nidhi Shah</option>
              <option value="Neeru Chaudhary">Neeru Chaudhary</option>
              <option value="Shaifali Soni">Shaifali Soni</option>
              <option value="Manish Valand">Manish Valand</option>
              <option value="Ketan Prajapati">Ketan Prajapati</option>
              <option value="Kinjal Parmar">Kinjal Parmar</option>
              <option value="Riddhi Sharma">Riddhi Sharma</option>
              <option value="Hewant Pasi">Hewant Pasi</option>
              <option value="__other__">Other (Type Manually)</option>
            </select>
            {contactedBy === '__other__' && <input type="text" className={`${inputClasses} py-3 mt-3`} placeholder="Enter referrer name" value={customContactedBy} onChange={(e) => {setCustomContactedBy(e.target.value); recordActivity();}} />}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-400 font-bold max-w-sm">By submitting, you agree to our <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span> and <span className="text-blue-500 hover:underline cursor-pointer">Terms</span>.</p>
            {isDirty && !isSubmitted && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={handleClearForm}
                className="w-fit text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined !text-sm">refresh</span>
                Start New Application
              </motion.button>
            )}
          </div>
          <button type="submit" className="w-full md:w-auto px-12 py-4 bg-slate-900 hover:bg-black text-white text-[13px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 shrink-0">Submit Application</button>
        </div>
      </form>
    </div>
  );
}

export default Admission;
