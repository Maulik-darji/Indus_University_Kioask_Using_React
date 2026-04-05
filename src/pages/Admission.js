import React, { useState } from 'react';

const programData = {
  UG: {
    "B.Tech": [
      "Civil Engineering", "Automobile Engineering", "Mechanical Engineering", "Metallurgical Engineering",
      "Electrical Engineering", "Electronics and Communication Engineering", "Computer Science Engineering",
      "Computer Engineering", "Information Technology", "Cyber Security", "Information and Communication Technology",
      "Aircraft Maintenance Engineering", "Aeronautical Engineering", "Aerospace Engineering", "Defence Aerospace Engineering"
    ],
    "BCA": ["BCA"],
    "Diploma to Degree": [],
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

function Admission() {
  const [level, setLevel] = useState('');
  const [program, setProgram] = useState('');
  const [specialization, setSpecialization] = useState('');

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

  return (
    <div className="fade-in max-w-4xl">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Admission Registration 2026</h1>
        <p className="text-lg text-gray-500">Begin your journey at Indus University</p>
      </header>

      <form className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={labelClasses}>Full Name</label>
            <input type="text" className={inputClasses} placeholder="Enter your name as per marksheet" required />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Email Address</label>
            <input type="email" className={inputClasses} placeholder="Enter your email" required />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Mobile Number</label>
            <input type="tel" className={inputClasses} placeholder="Enter mobile number" required />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Date of Birth</label>
            <input type="date" className={inputClasses} required />
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Program Level *</label>
            <select className={inputClasses} value={level} onChange={handleLevelChange} required>
              <option value="">Select Level</option>
              <option value="UG">Undergraduate (UG)</option>
              <option value="PG">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
              <option value="PhD">Ph.D</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Select Program *</label>
            <select className={`${inputClasses} ${!level ? 'opacity-50' : ''}`} value={program} onChange={handleProgramChange} required disabled={!level}>
              <option value="">Select Program</option>
              {level && Object.keys(programData[level]).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>Select Specialization *</label>
            <select className={`${inputClasses} ${!program ? 'opacity-50' : ''}`} value={specialization} onChange={(e) => setSpecialization(e.target.value)} required disabled={!program}>
              <option value="">Select Specialization</option>
              {level && program && programData[level][program].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClasses}>City</label>
            <input type="text" className={inputClasses} placeholder="Enter your city" />
          </div>
        </div>

        <div className="mt-12 flex justify-center md:justify-start">
          <button 
            type="submit" 
            className="px-10 py-4 bg-brand-brown hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-brown/20 hover:shadow-xl hover:shadow-brand-brown/30 translate-y-0 active:scale-95"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}

export default Admission;
