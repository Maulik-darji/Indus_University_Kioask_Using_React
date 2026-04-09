import React, { useState } from 'react';
import { INDIA_STATES, INDIA_CITIES_BY_STATE } from '../data/indiaLocations';

const programData = {
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

function Admission({ admissionData, setAdmissionData }) {
  const [level, setLevel] = useState('');
  const [program, setProgram] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [state, setState] = useState('');
  const [customState, setCustomState] = useState('');
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [contactedBy, setContactedBy] = useState('');
  const [customContactedBy, setCustomContactedBy] = useState('');

  React.useEffect(() => {
    if (admissionData) {
      const { categoryId, programName } = admissionData;
      
      let newLevel = '';
      let newProgram = '';
      let newSpec = programName.trim();

      // Explicit Mapping Overrides for known variations
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

      // Map category ID to Admission Form structure
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

      // String Normalization for Specializations
      const normalize = (str) => str?.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '').trim();
      const normalizedQuery = normalize(newSpec);

      if (newLevel && newProgram && programData[newLevel] && programData[newLevel][newProgram]) {
        const options = programData[newLevel][newProgram];
        // Try exact match first
        let match = options.find(opt => opt === newSpec);
        
        // Try normalized match
        if (!match) {
          match = options.find(opt => normalize(opt) === normalizedQuery);
        }
        
        // Try partial match
        if (!match) {
          match = options.find(opt => normalizedQuery.includes(normalize(opt)) || normalize(opt).includes(normalizedQuery));
        }
        
        if (match) {
          newSpec = match;
        }
      }

      setLevel(newLevel);
      setProgram(newProgram);
      setSpecialization(newSpec);
    }
  }, [admissionData]);

  // Clean up selection data on unmount
  React.useEffect(() => {
    return () => {
      if(setAdmissionData) setAdmissionData(null);
    };
  }, [setAdmissionData]);

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setProgram('');
    setSpecialization('');
  };

  const handleProgramChange = (e) => {
    setProgram(e.target.value);
    setSpecialization('');
  };

  const inputClasses = "w-full p-4 border border-gray-200 rounded-xl bg-white focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/10 outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-1";
  const citiesForState = state && state !== '__other__' ? (INDIA_CITIES_BY_STATE[state] || []) : [];

  return (
    <div className="fade-in w-full max-w-5xl mx-auto px-4 md:px-0 md:-mt-8">
      <header className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          2026 Admission
        </div>
        <h1 className="text-3xl md:text-5xl font-black mb-1 tracking-tight leading-tight uppercase" style={{ color: '#6f5c4e' }}>
          Indus University
        </h1>
        <div className="text-lg md:text-xl font-bold text-slate-500 tracking-tight">
          Where Practice Meets Theory
        </div>
      </header>

      <form className="bg-white p-7 md:p-10 rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-slate-100" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-1.5">
            <label className={labelClasses}>Full Name</label>
            <input type="text" className={`${inputClasses} py-3`} placeholder="As per Marksheet" required />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Email Address *</label>
            <input type="email" className={`${inputClasses} py-3`} placeholder="example@email.com" required />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Mobile Number *</label>
            <input type="tel" className={`${inputClasses} py-3`} placeholder="+91 XXXXX XXXXX" required />
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Date of Birth *</label>
            <div className="grid grid-cols-3 gap-3">
              <select className={`${inputClasses} py-3 text-xs`} required>
                <option value="">Day</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <select className={`${inputClasses} py-3 text-xs`} required>
                <option value="">Mo</option>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                  <option key={m} value={i+1}>{m}</option>
                ))}
              </select>
              <select className={`${inputClasses} py-3 text-xs`} required>
                <option value="">Year</option>
                {Array.from({ length: 33 }, (_, i) => 2012 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

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
              {level && Object.keys(programData[level]).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select Specialization *</label>
            <select className={`${inputClasses} py-3 transition-opacity duration-300 ${!program ? 'opacity-40' : 'opacity-100'}`} value={specialization} onChange={(e) => setSpecialization(e.target.value)} required disabled={!program}>
              <option value="">Area of focus</option>
              {level && program && programData[level][program].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select State *</label>
            <select
              className={`${inputClasses} py-3`}
              value={state}
              onChange={(e) => {
                const nextState = e.target.value;
                setState(nextState);
                setCity('');
                setCustomCity('');
                if (nextState !== '__other__') setCustomState('');
              }}
              required
            >
              <option value="">Select State</option>
              {INDIA_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="__other__">Other (Type Manually)</option>
            </select>

            {state === '__other__' && (
              <input
                type="text"
                className={`${inputClasses} py-3 mt-3`}
                placeholder="Enter your state"
                value={customState}
                onChange={(e) => setCustomState(e.target.value)}
                required
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Select City *</label>
            {state && state !== '__other__' ? (
              <>
                <select
                  className={`${inputClasses} py-3 transition-opacity duration-300 ${!state ? 'opacity-40' : 'opacity-100'}`}
                  value={city}
                  onChange={(e) => {
                    const nextCity = e.target.value;
                    setCity(nextCity);
                    if (nextCity !== '__other__') setCustomCity('');
                  }}
                  required
                  disabled={!state}
                >
                  <option value="">Select City</option>
                  {citiesForState.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__other__">Other (Type Manually)</option>
                </select>

                {city === '__other__' && (
                  <input
                    type="text"
                    className={`${inputClasses} py-3 mt-3`}
                    placeholder="Enter your city"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    required
                  />
                )}
              </>
            ) : (
              <input
                type="text"
                className={`${inputClasses} py-3 transition-opacity duration-300 ${!state ? 'opacity-40' : 'opacity-100'}`}
                placeholder="Enter your city"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                required={!!state}
                disabled={!state}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className={labelClasses}>Contacted By</label>
            <select
              className={`${inputClasses} py-3 text-slate-500`}
              value={contactedBy}
              onChange={(e) => {
                const next = e.target.value;
                setContactedBy(next);
                if (next !== '__other__') setCustomContactedBy('');
              }}
            >
              <option value="">Select Referrer</option>
              <option value="Rajesh Vaghela" className="text-slate-800 font-medium">Rajesh Vaghela</option>
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

            {contactedBy === '__other__' && (
              <input
                type="text"
                className={`${inputClasses} py-3 mt-3`}
                placeholder="Enter referrer name"
                value={customContactedBy}
                onChange={(e) => setCustomContactedBy(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-slate-400 font-bold max-w-sm">
             By submitting, you agree to our <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span> and <span className="text-blue-500 hover:underline cursor-pointer">Terms</span>.
          </p>
          <button 
            type="submit" 
            className="w-full md:w-auto px-12 py-4 bg-slate-900 hover:bg-black text-white text-[13px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 shrink-0"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}

export default Admission;
