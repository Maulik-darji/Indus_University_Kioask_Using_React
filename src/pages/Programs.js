import React, { useState } from 'react';


const PROGRAM_KEY_ALIASES = {
  'Information & Communication Technology (ICT)': 'Information and Communication Technology',
  'Information & Communication Technology (ICT) ': 'Information and Communication Technology',
  'Information & Communication Technology': 'Information and Communication Technology',
  'Electronics & Communication Engineering': 'Electronics and Communication Engineering',
  'Electronics & Communication Engineering ': 'Electronics and Communication Engineering',
  'Fasion Design': 'Fashion Design',
  'B.Sc Clical Research and HealthCare Management': 'B.Sc Clinical Research and Healthcare Management',
  'B.Sc Micro Biology': 'B.Sc Microbiology',
  'Industrial Metallury': 'Industrial Metallurgy',
};

const normalizeProgramName = (programName) => {
  if (!programName) return '';
  return String(programName).trim().replace(/\s+/g, ' ');
};

const normalizeText = (val) => String(val ?? '').trim().toLowerCase();

const CATEGORY_PROGRAM_KEY_OVERRIDES = {
  bdes: {
    'Product Design': 'B.Des Product Design',
    'Interior Design': 'B.Des Interior Design',
    'Fashion Design': 'B.Des Fashion Design',
    'Communication Design': 'B.Des Communication Design',
  },
  mdes: {
    'Fashion Design': 'M.Des Fashion Design',
    'Interior Design': 'M.Des Interior Design',
    'UI-UX Design': 'M.Des UI-UX Design',
  },
  bsc: {
    'Data Science': 'B.Sc Data Science',
    'B.Sc(CA & IT)': 'B.Sc (CA & IT)',
    'B.Sc Clinical Research and Healthcare Management': 'B.Sc Clinical Research and Healthcare Management',
    'B.Sc Mathematics': 'B.Sc Mathematics',
    'B.Sc Physics': 'B.Sc Physics',
    'B.Sc Chemistry': 'B.Sc Chemistry',
    'Cyber Security': 'B.Sc Cyber Security',
    'B.Sc Microbiology': 'B.Sc Microbiology',
    'Computer Science (AI and ML)': 'B.Sc Computer Science (AI and ML)',
  },
  msc: {
    'M.Sc-Information Technology': 'M.Sc Information Technology',
    'M.Sc-Clinical Research': 'M.Sc Clinical Research',
    'M.Sc-Mathematics': 'M.Sc Mathematics',
    'M.Sc-Physics': 'M.Sc Physics',
    'M.Sc-Chemistry': 'M.Sc Chemistry',
    'M.Sc-Cyber Security': 'M.Sc Cyber Security',
    'M.Sc-Microbiology': 'M.Sc Microbiology',
  },
  mtech: {
    'Cyber Security': 'M.Tech Cyber Security',
    'Industrial Metallurgy': 'M.Tech Industrial Metallurgy',
    'CAD/CAM (Mechanical Engineering)': 'M.Tech CAD/CAM (Mechanical Engineering)',
    'Construction Project Management (Civil Engineering)': 'M.Tech Construction Project Management (Civil Engineering)',
    'Digital Communication (EC Engineering)': 'M.Tech Digital Communication (EC Engineering)',
    'Electrical Power System': 'M.Tech Electrical Power System',
    'Structural Engineering (Civil Engineering)': 'M.Tech Structural Engineering (Civil Engineering)',
    'Data Science (Computer)': 'M.Tech Data Science (Computer)',
  },
  'mba-avia': {
    Aviation: 'BBA Aviation',
    'BBA (General)': 'BBA General',
    Marketing: 'MBA Marketing',
    Finance: 'MBA Finance',
    'Human Resource': 'MBA Human Resource',
    MBA: 'MBA',
    'Master of Business Administration': 'MBA',
  },
  bca: {
    BCA: 'BCA',
  },
  mca: {
    'Master of Computer Application': 'MCA',
    MCA: 'MCA',
  },
  barch: {
    'B.Arch (Bachelor of Architecture)': 'B.Arch',
    'B.Arch': 'B.Arch',
  },
  bcom: {
    'B.com (HONS)': 'B.Com (Hons.)',
    'B.Com (Hons)': 'B.Com (Hons.)',
    'B.Com (Hons.)': 'B.Com (Hons.)',
  },
  ba: {
    English: 'B.A. English (Hons.)',
    'English (Hons)': 'B.A. English (Hons.)',
    'B.A. English (Hons.)': 'B.A. English (Hons.)',
  },
  bpharm: {
    'B.pharm Bachelor of Pharmacy': 'B.Pharm',
    'B.Pharm': 'B.Pharm',
  },
};

const isPlaceholderSectionData = (sectionData) => {
  if (!sectionData || typeof sectionData !== 'object') return true;
  const sections = sectionData.sections;
  if (!Array.isArray(sections) || sections.length === 0) return true;

  const hasMeaningfulItem = sections.some((section) => {
    const items = Array.isArray(section?.items) ? section.items : [];
    return items.some((it) => {
      const t = normalizeText(it);
      return t && t !== 'point 1' && t !== 'new point';
    });
  });

  if (!hasMeaningfulItem) return true;

  if (sections.length !== 1) return false;

  const section = sections[0] || {};
  const title = normalizeText(section.title);
  const items = Array.isArray(section.items) ? section.items : [];
  const normalizedItems = items.map(normalizeText).filter(Boolean);

  const titleLooksPlaceholder = title === 'overview' || title === 'new section';
  const itemsLookPlaceholder =
    normalizedItems.length > 0 &&
    normalizedItems.every((it) => it === 'point 1' || it === 'new point');

  return titleLooksPlaceholder && itemsLookPlaceholder;
};

const resolveProgramKey = (programData, categoryId, programName) => {
  const cleaned = normalizeProgramName(programName);
  if (!cleaned) return cleaned;

  const aliased = PROGRAM_KEY_ALIASES[cleaned] || cleaned;

  const categoryOverrides = CATEGORY_PROGRAM_KEY_OVERRIDES[categoryId] || null;
  if (categoryOverrides) {
    const overrideKey =
      categoryOverrides[cleaned] ||
      categoryOverrides[aliased] ||
      categoryOverrides[aliased.replace(/\s*&\s*/g, ' and ')] ||
      categoryOverrides[aliased.replace(/\sand\s/gi, ' & ')];
    if (overrideKey) return overrideKey;
  }
  const candidates = [
    cleaned,
    aliased,
    aliased.replace(/\s*&\s*/g, ' and '),
    aliased.replace(/\sand\s/gi, ' & '),
  ];

  for (const key of candidates) {
    if (programData && Object.prototype.hasOwnProperty.call(programData, key)) return key;
  }

  // Fall back to normalized key matching (handles saved keys with trailing spaces, etc.)
  if (programData && typeof programData === 'object') {
    const keys = Object.keys(programData);
    for (const candidate of candidates) {
      const candidateNorm = normalizeProgramName(candidate);
      const match = keys.find((k) => normalizeProgramName(k) === candidateNorm);
      if (match) return match;
    }
  }

  return aliased;
};

const mergeCategories = (saved, defaults) => {
  if (!Array.isArray(saved) || saved.length === 0) return defaults;
  const merged = saved.map((c) => ({ ...c }));

  for (const def of defaults || []) {
    const existingIndex = merged.findIndex((c) => c?.id === def.id);
    if (existingIndex === -1) {
      merged.push(def);
      continue;
    }

    const existing = merged[existingIndex];
    if (!Array.isArray(existing.programs) || existing.programs.length === 0) {
      merged[existingIndex] = { ...existing, programs: def.programs };
    }
  }

  return merged;
};

const mergeProgramData = (saved, defaults) => {
  const merged = { ...(saved || {}) };

  for (const programName of Object.keys(defaults || {})) {
    if (!merged[programName]) {
      merged[programName] = defaults[programName];
      continue;
    }

    const savedProgram = merged[programName] || {};
    const defaultProgram = defaults[programName] || {};
    const mergedProgram = { ...savedProgram };

    for (const sectionName of Object.keys(defaultProgram)) {
      if (!mergedProgram[sectionName] || isPlaceholderSectionData(mergedProgram[sectionName])) {
        mergedProgram[sectionName] = defaultProgram[sectionName];
      }
    }

    merged[programName] = mergedProgram;
  }

  return merged;
};

// Common B.Tech Eligibility
const commonBtechEligibility = {
  sections: [
    {
      title: 'Eligibility Criteria',
      items: [
        'Candidate must have passed 10+2 (Higher Secondary) examination in the Science stream from a recognized board.',
        'Physics, Chemistry, and Mathematics (PCM) must be compulsory subjects.',
      ],
    },
    { title: 'Program Duration', items: ['4 Years (8 Semesters)'] }
  ],
  showApply: true
};

const commonBtechFees = {
  sections: [
    {
      title: 'Fees Structure',
      items: [
        'Fees are as per the latest Indus University fee circular. Please contact the Admissions Office for the current semester-wise fee structure.',
      ],
    }
  ]
};

const commonDiplomaFees = {
  sections: [
    {
      title: 'Fees Structure',
      items: [
        'Fees are as per the latest Indus University fee circular. Please contact the Admissions Office for the current semester-wise fee structure.',
      ],
    }
  ]
};

const commonAdmission = {
  sections: [
    {
      title: 'Admission Process',
      items: [
        'Fill the application form and submit required documents.',
        'Admission is as per eligibility, merit/selection process, and university norms.',
        'Complete document verification and fee payment to confirm the seat.',
      ],
    },
  ],
  showApply: true,
};

const FIRST_SEMESTER_FEES = {
  btech: { default: 60220 },
  'btech-dtd': { default: 60220 },
  diploma: { default: 32106 },
  mtech: { default: 78058 },
  mca: { default: 54353 },
  bca: { default: 37700 },
  bdes: { default: 159000 },
  mdes: { default: 56750 },
  barch: { default: 72346 },
  bcom: { default: 33600 },
  ba: { default: 15250 },
  bpharm: { default: 48393 },
  bsc: {
    'B.Sc Data Science': 43200,
    'B.Sc Computer Science (AI and ML)': 43200,
    'B.Sc (CA & IT)': 37700,
    'B.Sc Cyber Security': 59700,
    'B.Sc Clinical Research and Healthcare Management': 54350,
    'B.Sc Mathematics': 26800,
    'B.Sc Physics': 26800,
    'B.Sc Chemistry': 26800,
    'B.Sc Microbiology': 37800,
    default: 37700,
  },
  msc: {
    'M.Sc Information Technology': 56150,
    'M.Sc Cyber Security': 67150,
    'M.Sc Clinical Research': 78150,
    'M.Sc Chemistry': 39100,
    'M.Sc Mathematics': 28050,
    'M.Sc Physics': 33850,
    'M.Sc Microbiology': 42750,
  },
  'mba-avia': {
    'BBA Aviation': 37850,
    'BBA General': 37850,
    MBA: 58453,
    'MBA Marketing': 58453,
    'MBA Finance': 58453,
    'MBA Human Resource': 58453,
  },
};

const formatINR = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('en-IN');
};

const getFirstSemesterFee = (categoryId, programName, programKey) => {
  const config = FIRST_SEMESTER_FEES[categoryId];
  if (!config) return null;
  if (typeof config === 'number') return config;

  const cleanedName = normalizeProgramName(programName);
  const aliasedName = PROGRAM_KEY_ALIASES[cleanedName] || cleanedName;

  const candidateKeys = [
    programKey,
    cleanedName,
    aliasedName,
    aliasedName.replace(/\s*&\s*/g, ' and '),
    aliasedName.replace(/\sand\s/gi, ' & '),
  ].filter(Boolean);

  for (const key of candidateKeys) {
    if (Object.prototype.hasOwnProperty.call(config, key)) return config[key];
  }

  return Object.prototype.hasOwnProperty.call(config, 'default') ? config.default : null;
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
  } else if (categoryId === 'bdes') {
    e = { text: '10+2 OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '4 Years (8 Semesters)' };
  } else if (categoryId === 'mdes') {
    e = { text: 'GRADUATION IN DESIGN / ALLIED DISCIPLINES OR EQUIVALENT FROM A RECOGNIZED UNIVERSITY', duration: '2 Years (4 Semesters)' };
  } else if (categoryId === 'bca') {
    e = { text: '10+2 OR EQUIVALENT FROM A RECOGNIZED BOARD (SCIENCE/COMMERCE/ARTS)', duration: '3 Years (6 Semesters)' };
  } else if (categoryId === 'mca') {
    e = { text: 'ANY GRADUATE FROM ANY RECOGNIZED UNIVERSITY WITH MIN 50% FOR GENEREAL 45% FOR SC/ST/SEBC/EWS', duration: '2 Years (4 Semesters)' };
  } else if (categoryId === 'mba-avia') {
    if (programName === 'BBA' || programName === 'BBA (General)' || programName === 'Aviation') {
      e = { text: '10+2 WITH MATHS OR STATICS AS A SUBJECT OR EQUIVALENT', duration: '3 Years (6 Semesters)' };
    } else {
      e = { text: 'ANY GRADUATE OR EQUIVALENT WITH MIN 50% FROM A RECOGNIZED UNIVERSITY', duration: '2 Years (4 Semesters)' };
    }
  } else if (categoryId === 'bsc') {
    if (programName.includes('Clinical Research') || programName.includes('Microbiology') || programName.includes('Micro Biology')) {
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
  } else if (categoryId === 'barch') {
    e = { text: '10+2 (PCM) OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '5 Years (10 Semesters)' };
  } else if (categoryId === 'bcom') {
    e = { text: '10+2 OR EQUIVALENT FROM A RECOGNIZED BOARD (COMMERCE PREFERRED)', duration: '3 Years (6 Semesters)' };
  } else if (categoryId === 'ba') {
    e = { text: '10+2 OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '3 Years (6 Semesters)' };
  } else if (categoryId === 'bpharm') {
    e = { text: '10+2 (PCB/PCM) OR EQUIVALENT FROM A RECOGNIZED BOARD', duration: '4 Years (8 Semesters)' };
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
  // Alias key used by AdminCategories / saved categories in some kiosks
  'Information & Communication Technology (ICT)': {
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
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines of the Admission Committee for Professional Courses (ACPC) and university norms.', 'A portion of seats is filled through centralized merit-based admission, while remaining seats are filled under Management Quota as per applicable regulations.'] }],
      showApply: true
    }
  },
  'Automobile Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Engine systems and combustion technology', 'Fluid mechanics and aerodynamics', 'Automotive electronics and control systems', 'CAD/CAM and vehicle design'] },
        { title: 'Advanced / Emerging Areas', items: ['Electric and hybrid vehicle technologies', 'Smart mobility systems', 'Embedded automotive applications'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory practice and workshops', 'Internships and live projects', 'Vehicle design simulations', 'Major engineering projects', 'Industry interaction activities'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Research & Development Engineer', 'Electric Vehicle Engineer', 'Vehicle Design Engineer', 'Testing and Quality Engineer', 'Automotive Electronics Engineer'] },
        { title: 'Career Sectors', items: ['Automobile manufacturing industry', 'Electric vehicle sector', 'Automotive R&D organizations'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-aligned curriculum', 'Strong practical laboratory training', 'Experienced faculty mentorship', 'Project-based learning approach', 'Focus on future mobility technologies'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines of the Admission Committee for Professional Courses (ACPC) and university norms.', 'A portion of seats is filled through centralized merit-based admission, while remaining seats are filled under Management Quota as per applicable regulations.'] }],
      showApply: true
    }
  },
  'Civil Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Structural engineering', 'Geotechnical and foundation engineering', 'Transportation engineering', 'Environmental and water resources engineering', 'Surveying and geomatics', 'Construction management'] },
        { title: 'Advanced / Emerging Areas', items: ['Sustainable infrastructure', 'Smart construction practices'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industrial training and internships', 'Site visits', 'Live projects and mini-projects', 'Final year capstone project'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Structural Engineer', 'Site Engineer', 'Construction Engineer', 'Project Engineer'] },
        { title: 'Career Sectors', items: ['Construction and infrastructure companies', 'Government departments', 'Real estate and urban development', 'Transportation projects'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Modern laboratories and infrastructure', 'Industry visits and live projects', 'Experienced faculty and mentorship', 'Focus on sustainability and innovation'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines of the Admission Committee for Professional Courses (ACPC) and university norms.', 'A portion of seats is filled through centralized merit-based admission, while remaining seats are filled under Management Quota as per applicable regulations'] }],
      showApply: true
    }
  },
  'Computer Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming and data structures', 'Database management systems', 'Operating systems', 'Computer networks', 'Software engineering'] },
        { title: 'Advanced / Emerging Areas', items: ['Artificial Intelligence and Machine Learning', 'Cloud computing', 'Cyber security', 'Data science'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory-based learning', 'Mini and major projects', 'Internships', 'Workshops and expert lectures', 'Industry interaction activities'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Developer', 'Data Analyst', 'AI Engineer', 'Network Administrator', 'Cyber Security Professional', 'Technology Consultant'] },
        { title: 'Career Sectors', items: ['IT industry', 'Software development companies', 'Technology consulting organizations', 'Research and academic institutions'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Experienced and research-oriented faculty', 'Well-equipped computer laboratories', 'Industry-aligned curriculum', 'Research and innovation ecosystem', 'Professional skill development focus'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines of the Admission Committee for Professional Courses (ACPC) and university norms.', 'A portion of seats is filled through centralized merit-based admission, while remaining seats are filled under Management Quota as per applicable regulations.'] }],
      showApply: true
    }
  },
  'Computer Science Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming and data structures', 'Database management systems', 'Operating systems', 'Computer networks', 'Software engineering', 'Design and analysis of algorithms'] },
        { title: 'Advanced / Emerging Areas', items: ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Cyber Security', 'Internet of Things', 'Cloud Computing'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory sessions and mini-projects', 'Industrial internships', 'Technical workshops', 'Hackathons and coding competitions', 'Final semester industrial project'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Engineer', 'System Analyst', 'Data Analyst', 'AI Engineer', 'Cyber Security Analyst', 'Cloud Engineer'] },
        { title: 'Career Sectors', items: ['IT services industry', 'Software development companies', 'Technology startups', 'Research organizations'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Comprehensive industry-aligned curriculum', 'Hands-on laboratory and project learning', 'Internship and industrial exposure', 'Innovation and research-oriented learning'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Electrical Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Electrical power systems', 'Electrical machines', 'Electronics fundamentals', 'Engineering mathematics and sciences', 'Power generation and transmission'] },
        { title: 'Advanced / Emerging Areas', items: ['Renewable energy systems', 'Energy efficiency technologies', 'Electric mobility applications'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory experiments and practical sessions', 'Technical training activities', 'Engineering application-based learning'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Electrical Engineer', 'Maintenance Engineer', 'Power System Engineer', 'Design Engineer'] },
        { title: 'Career Sectors', items: ['Power generation and distribution', 'Engineering services', 'Railways and aerospace industries', 'Energy management and auditing'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-aligned curriculum', 'Practical and laboratory-based learning', 'Exposure to renewable energy systems', 'Engineering programming applications'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Electronics and Communication Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Analog and digital communication', 'Digital logic and circuits', 'Signal processing', 'Microprocessors and microcontrollers', 'RF engineering and networking'] },
        { title: 'Advanced / Emerging Areas', items: ['Embedded systems', 'Communication technologies'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory experiments', 'Mini-projects', 'Industry-oriented assignments', 'Practical sessions aligned with industry trends'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Communication Engineer', 'Electronics Engineer', 'Network Engineer', 'RF Engineer', 'R&D Engineer'] },
        { title: 'Career Sectors', items: ['Telecommunications', 'Electronics industries', 'Public sector enterprises', 'Communication technology organizations'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-relevant curriculum', 'Hands-on laboratory and project learning', 'Mini-projects and practical assignments', 'Exposure to research and innovation'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Information Technology': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming', 'Networking', 'Database systems', 'Software development', 'Computer support systems'] },
        { title: 'Advanced / Emerging Areas', items: ['Artificial Intelligence', 'Cloud computing', 'Data analytics', 'Web and mobile application development'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industry training and projects', 'Guest lectures and workshops', 'Industry visits', 'Technical seminars'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Developer', 'Network Administrator', 'Data Analyst', 'Cloud Engineer', 'IT Consultant', 'Machine Learning Engineer'] },
        { title: 'Career Sectors', items: ['IT industry', 'Banking and finance', 'Healthcare technology', 'Automation and robotics'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Application-oriented learning approach', 'Industry-focused curriculum', 'Hands-on laboratories and real-time projects', 'Placement-oriented training'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Mechanical Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Fluid mechanics', 'Thermodynamics', 'Design and dynamics of machines', 'Manufacturing and production engineering', 'Metrology and instrumentation'] },
        { title: 'Advanced / Emerging Areas', items: ['Robotics', 'CAD/CAM technologies', 'Industrial automation applications'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Mechanical workshop training', 'Machine shop practice', 'Laboratory experiments', 'Engineering projects', 'Industry interaction and internships'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Design Engineer', 'Product Engineer', 'Research & Development Engineer', 'Technical Consultant', 'Project Engineer'] },
        { title: 'Career Sectors', items: ['Automotive industry', 'Aerospace industry', 'Manufacturing sector', 'Energy and heavy engineering industries'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-oriented curriculum', 'Strong hands-on laboratory training', 'CAD/CAM and robotics exposure', 'Practical manufacturing and production learning'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Metallurgical Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Metals extraction and processing', 'Alloy design', 'Materials characterization', 'Foundry engineering'] },
        { title: 'Advanced / Emerging Areas', items: ['Advanced materials', 'Nanostructured materials', 'Materials recycling technologies'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Practical laboratory training', 'Materials processing experiments', 'Industry-oriented projects'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Metallurgical Engineer', 'Materials Scientist', 'Foundry Engineer', 'Product Development Engineer', 'R&D Engineer'] },
        { title: 'Career Sectors', items: ['Steel industry', 'Automotive sector', 'Aerospace industry', 'Energy and manufacturing industries'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong foundation in materials science', 'Hands-on training in foundry engineering', 'Exposure to advanced materials and alloys', 'Research and higher study preparation'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Cyber Security': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Network security', 'Cryptography', 'Algorithms', 'Cyber crime investigation', 'Intrusion detection systems'] },
        { title: 'Advanced / Emerging Areas', items: ['Ethical hacking', 'Digital forensics', 'Malware analysis', 'Enterprise security frameworks'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory-based cybersecurity training', 'Industry workshops', '24-week industry training', 'Capstone project'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Cyber Security Analyst', 'Network Security Engineer', 'Ethical Hacker', 'Cyber Forensics Expert', 'Security Consultant'] },
        { title: 'Career Sectors', items: ['IT services', 'Banking and finance', 'Healthcare', 'Government organizations', 'Telecommunications'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Specialized cybersecurity curriculum', 'Hands-on laboratory training', 'Industry-oriented practical learning', 'Cyber forensics and investigation exposure'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Aircraft Maintenance Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        {
          title: 'Core Aviation Engineering Areas',
          items: ['Aerodynamics', 'Propulsion systems', 'Aircraft structures', 'Avionics and electrical systems', 'Airworthiness and safety regulations'],
        },
        {
          title: 'Applied Technical Areas',
          items: ['Aircraft maintenance practices', 'Engine systems', 'Electrical and hydraulic systems', 'Communication and navigation systems'],
        },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [
        {
          title: 'Industry Exposure & Practical Learning',
          items: [
            'Workshops and laboratory sessions',
            'Aircraft maintenance and inspection training',
            'Hands-on training with aircraft components',
            'Industry visits and internships',
            'Use of aviation safety and regulatory compliance tools',
          ],
        },
      ],
    },
    'CAREER PROSPECTS': {
      sections: [
        {
          title: 'Job Roles',
          items: [
            'Aircraft Maintenance Engineer',
            'Avionics Technician',
            'Airline Maintenance Supervisor',
            'Quality Assurance Engineer',
            'Aircraft Inspection Engineer',
            'Aviation Safety Officer',
          ],
        },
        {
          title: 'Career Sectors',
          items: [
            'Airlines',
            'Aerospace and aircraft manufacturing companies',
            'Maintenance, Repair and Overhaul (MRO) organizations',
            'Government aviation agencies',
            'Defence aviation services',
          ],
        },
      ],
    },
    'WHY CHOOSE US': {
      sections: [
        {
          title: 'Why Choose This Program at Indus University',
          items: [
            'Curriculum aligned with DGCA standards',
            'Hands-on training with real aircraft equipment',
            'Placement support with aviation industry partnerships',
            'Experienced faculty with industry background',
            'Aviation-specific labs and workshops',
            'Opportunities for internships and certifications',
          ],
        },
      ],
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [
        {
          title: 'Admission Process',
          items: [
            'Admission is conducted through merit-based selection and entrance examination scores as per university guidelines.',
            'Candidates can apply online or visit the campus for counseling and interaction with the admission committee.',
          ],
        },
      ],
      showApply: true,
    },
  },
  'Aeronautical Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        {
          title: 'Core Technical Areas',
          items: ['Aerodynamics and fluid mechanics', 'Aircraft structures and materials', 'Propulsion systems', 'Flight mechanics and control', 'Aerospace instrumentation'],
        },
        {
          title: 'Advanced / Emerging Areas',
          items: ['Computational Fluid Dynamics (CFD)', 'Aircraft design and simulation', 'UAV and drone technology', 'Satellite and space systems', 'Aviation safety and regulations'],
        },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [
        {
          title: 'Industry Exposure & Practical Learning',
          items: [
            'Wind tunnel testing and simulation labs',
            'Aircraft design projects and CAD modeling',
            'Workshops and industrial training programs',
            'Internships with aerospace and aviation companies',
            'Research-based mini and major projects',
          ],
        },
      ],
    },
    'CAREER PROSPECTS': {
      sections: [
        {
          title: 'Job Roles',
          items: ['Aerospace Engineer', 'Aircraft Design Engineer', 'Flight Test Engineer', 'Avionics Engineer', 'Aerodynamicist', 'System Safety Management Engineer'],
        },
        {
          title: 'Career Sectors',
          items: ['Aircraft manufacturing companies', 'Aerospace R&D organizations', 'Defence and aviation sector', 'Airlines and MRO organizations', 'Space research agencies'],
        },
      ],
    },
    'WHY CHOOSE US': {
      sections: [
        {
          title: 'Why Choose This Program at Indus University',
          items: [
            'Industry-relevant curriculum',
            'Exposure to aerospace simulation and design labs',
            'Strong industry partnerships for internships and projects',
            'Faculty with aerospace expertise',
            'Career opportunities in aviation and defence sectors',
          ],
        },
      ],
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [
        {
          title: 'Admission Process',
          items: [
            'Admission is conducted based on entrance examination scores and merit as per university guidelines.',
            'Candidates can apply online or visit the campus for counseling and interaction with the admission committee.',
          ],
        },
      ],
      showApply: true,
    },
  },
  'Aerospace Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        {
          title: 'Core Aerospace Engineering Areas',
          items: [
            'Aerodynamics and flight mechanics',
            'Aircraft structures and materials',
            'Propulsion systems',
            'Avionics and control systems',
            'Space technology and satellite systems',
            'Computational methods and simulation',
          ],
        },
        {
          title: 'Aircraft Maintenance Engineering Areas',
          items: [
            'Airframe and engine maintenance',
            'Aircraft inspection and quality assurance',
            'Aviation safety regulations and compliance',
            'Maintenance management and planning',
            'Aircraft electrical and hydraulic systems',
            'Communication and navigation systems',
          ],
        },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [
        {
          title: 'Industry Exposure & Practical Learning',
          items: [
            'Aircraft maintenance workshops and labs',
            'Aerospace simulation and design tools',
            'Internships with airlines, aerospace companies, and MRO organizations',
            'Industrial visits and expert sessions',
            'Major projects and capstone design experience',
          ],
        },
      ],
    },
    'CAREER PROSPECTS': {
      sections: [
        {
          title: 'Civil Aviation Sector',
          items: [
            'Aircraft Maintenance Engineer',
            'Avionics Technician',
            'Airline Maintenance Supervisor',
            'Quality Assurance Engineer',
            'Aircraft Inspection Engineer',
            'Aviation Safety Officer',
          ],
        },
        {
          title: 'Aerospace Engineering Roles',
          items: ['Aerospace Engineer', 'Aircraft Design Engineer', 'Flight Test Engineer', 'Propulsion Engineer', 'Avionics Engineer'],
        },
        {
          title: 'Defence & Government Sector',
          items: ['DRDO', 'HAL', 'ISRO', 'Indian Air Force'],
        },
      ],
    },
    'WHY CHOOSE US': {
      sections: [
        {
          title: 'Why Choose This Program at Indus University',
          items: [
            'Integrated Aerospace + AME curriculum',
            'Hands-on training with aircraft maintenance labs',
            'Career opportunities in civil aviation and defence sector',
            'Industry partnerships for internships and placements',
            'International standards and aviation regulatory training',
          ],
        },
      ],
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [
        {
          title: 'Admission Process',
          items: [
            'Admission is conducted based on entrance examination scores and merit as per university guidelines.',
            'Candidates can apply online or visit the campus for counseling and interaction with the admission committee.',
          ],
        },
      ],
      showApply: true,
    },
  },
  'Defence Aerospace Engineering': {
    'CURRICULUM & LEARNING': {
      sections: [
        {
          title: 'Core Defence Aerospace Areas',
          items: [
            'Aerospace systems and flight mechanics',
            'Aircraft structures, materials, and maintenance fundamentals',
            'Avionics, control systems, and communication systems',
            'Propulsion systems',
            'Aviation safety regulations and compliance',
          ],
        },
        {
          title: 'Advanced / Applied Areas',
          items: ['Systems integration and testing', 'Quality assurance and inspection practices', 'Defence aviation operations and maintenance planning'],
        },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [
        {
          title: 'Industry Exposure & Practical Learning',
          items: [
            'Aircraft maintenance workshops and labs',
            'Aerospace simulation and design tools',
            'Industrial visits and expert sessions',
            'Major projects and capstone experience',
          ],
        },
      ],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Aerospace Engineer', 'Avionics Engineer', 'Maintenance Planning Engineer', 'Quality Assurance Engineer', 'Inspection Engineer', 'Safety & Compliance Officer'] },
        { title: 'Career Sectors', items: ['Defence aviation services', 'Government aerospace organizations', 'Aerospace and aircraft manufacturing', 'MRO organizations'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [
        {
          title: 'Why Choose This Program at Indus University',
          items: ['Defence-focused aerospace learning', 'Hands-on labs and workshops', 'Industry interaction and projects', 'Career pathways in defence and aviation sectors'],
        },
      ],
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonBtechFees,
    'ADMISSION': {
      sections: [
        {
          title: 'Admission Process',
          items: [
            'Admission is conducted based on entrance examination scores and merit as per university guidelines.',
            'Candidates can apply online or visit the campus for counseling and interaction with the admission committee.',
          ],
        },
      ],
      showApply: true,
    },
  },
  
  // Diploma Programs
  'Information & Communication Technology (ICT) ': { 
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
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Civil Engineering ': { 
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Structural engineering', 'Geotechnical and foundation engineering', 'Transportation engineering', 'Environmental and water resources engineering', 'Surveying and geomatics', 'Construction management'] },
        { title: 'Advanced / Emerging Areas', items: ['Sustainable infrastructure', 'Smart construction practices'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industrial training and internships', 'Site visits', 'Live projects and mini-projects', 'Final year capstone project'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Structural Engineer', 'Site Engineer', 'Construction Engineer', 'Project Engineer'] },
        { title: 'Career Sectors', items: ['Construction and infrastructure companies', 'Government departments', 'Real estate and urban development', 'Transportation projects'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-aligned curriculum', 'Laboratory-based practical learning', 'Site visits and industrial training', 'Exposure to modern engineering software'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Automobile Engineering ': { 
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Vehicle design and development', 'Manufacturing and maintenance', 'Mechanical systems integration', 'Electrical and electronics systems'] },
        { title: 'Advanced / Emerging Areas', items: ['Electric and hybrid vehicle technologies', 'Software-driven vehicles', 'Connected mobility technologies', 'Sustainable mobility technologies'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['CAD/CAM and simulation-based learning', 'Industry interaction and internships', 'Project-based education', 'Practical laboratory and workshop training'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Research & Development Engineer', 'Electric Vehicle Engineer', 'Vehicle Design Engineer', 'Testing and Quality Engineer', 'Automotive Electronics Engineer'] },
        { title: 'Career Sectors', items: ['Automobile manufacturing industry', 'Electric vehicle sector', 'Automotive R&D organizations'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-aligned curriculum', 'Focus on electric and hybrid vehicle technologies', 'Experienced faculty and advanced laboratory infrastructure', 'Innovation and research emphasis'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Mechanical Engineering ': { 
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Fluid mechanics', 'Thermodynamics', 'Design and dynamics of machines', 'Manufacturing and production engineering', 'Metrology and instrumentation'] },
        { title: 'Advanced / Emerging Areas', items: ['Robotics', 'CAD/CAM technologies', 'Industrial automation applications'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Mechanical workshop training', 'Machine shop practice', 'Laboratory experiments', 'Engineering projects', 'Industry interaction and internships'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Design Engineer', 'Product Engineer', 'Research & Development Engineer', 'Technical Consultant', 'Project Engineer'] },
        { title: 'Career Sectors', items: ['Automotive industry', 'Aerospace industry', 'Manufacturing sector', 'Energy and heavy engineering industries'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-oriented curriculum', 'Strong hands-on laboratory training', 'CAD/CAM and robotics exposure', 'Practical manufacturing and production learning'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Computer Engineering ': { 
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming and data structures', 'Database management systems', 'Operating systems', 'Computer networks', 'Software engineering'] },
        { title: 'Advanced / Emerging Areas', items: ['Artificial Intelligence and Machine Learning', 'Cloud computing', 'Cyber security', 'Data science'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory-based learning', 'Mini and major projects', 'Internships', 'Workshops and expert lectures', 'Industry interaction activities'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Developer', 'Data Analyst', 'AI Engineer', 'Network Administrator', 'Cyber Security Professional', 'Technology Consultant'] },
        { title: 'Career Sectors', items: ['IT industry', 'Software development companies', 'Technology consulting organizations', 'Research and academic institutions'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Outcome-based industry-relevant curriculum', 'Project-based and experiential learning', 'Integration of emerging technologies', 'Industry interaction and professional exposure', 'Research and innovation focus'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Electrical Engineering ': { 
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Electrical power systems', 'Electrical machines', 'Electronics fundamentals', 'Engineering mathematics and sciences', 'Power generation and transmission'] },
        { title: 'Advanced / Emerging Areas', items: ['Renewable energy systems', 'Energy efficiency technologies', 'Electric mobility applications'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory experiments and practical sessions', 'Technical training activities', 'Engineering application-based learning'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Electrical Engineer', 'Maintenance Engineer', 'Power System Engineer', 'Design Engineer'] },
        { title: 'Career Sectors', items: ['Power generation and distribution', 'Engineering services', 'Railways and aerospace industries', 'Energy management and auditing'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-aligned curriculum', 'Practical and laboratory-based learning', 'Exposure to renewable energy systems', 'Engineering programming applications'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'Electronics & Communication Engineering ': { 
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Analog and digital communication', 'Digital logic and circuits', 'Signal processing', 'Microprocessors and microcontrollers', 'RF engineering and networking'] },
        { title: 'Advanced / Emerging Areas', items: ['Embedded systems', 'Communication technologies'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory experiments', 'Mini-projects', 'Industry-oriented assignments', 'Practical sessions aligned with industry trends'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Communication Engineer', 'Electronics Engineer', 'Network Engineer', 'RF Engineer', 'R&D Engineer'] },
        { title: 'Career Sectors', items: ['Telecommunications', 'Electronics industries', 'Public sector enterprises', 'Communication technology organizations'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-relevant curriculum', 'Hands-on laboratory and project learning', 'Mini-projects and practical assignments', 'Exposure to research and innovation'] }]
    },
    'ELIGIBILITY': commonBtechEligibility,
    'FEES STRUCTURE': commonDiplomaFees,
    'ADMISSION': {
      sections: [{ title: 'Admission Process', items: ['Admissions are conducted as per guidelines...', 'A portion of seats is filled through centralized merit-based admission...'] }],
      showApply: true
    }
  },
  'M.Tech CAD/CAM (Mechanical Engineering)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Advanced CAD/CAE', 'Computer Aided Manufacturing', 'CNC and automation', 'Manufacturing systems and optimization'] },
        { title: 'Project / Research', items: ['Simulation-driven design projects', 'Industry problem statements', 'Dissertation / capstone work'] }
      ]
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Advanced CAD/CAE tool practice', 'Industry-oriented projects', 'Workshops on modern manufacturing', 'Internship / industry interaction'] }]
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['CAD/CAE Engineer', 'Manufacturing Engineer', 'Automation Engineer', 'Product Development Engineer'] },
        { title: 'Career Sectors', items: ['Automotive and manufacturing', 'Design and engineering services', 'Industrial automation', 'R&D labs'] }
      ]
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Hands-on training with modern tools', 'Project-focused learning', 'Faculty mentorship for research', 'Exposure to industry workflows'] }]
    }
  },
  'M.Tech Construction Project Management (Civil Engineering)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Project planning and scheduling', 'Construction contracts and claims', 'Quality, safety and risk management', 'Cost estimation and control'] },
        { title: 'Tools & Practices', items: ['Project management software', 'Case studies and site-based learning', 'Project report / dissertation'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Site visits and case studies', 'Live project planning exercises', 'Guest lectures from industry professionals', 'Industry-aligned dissertation topics'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Project Manager (Construction)', 'Planning Engineer', 'Contracts Engineer', 'Quantity Surveyor'] },
        { title: 'Career Sectors', items: ['Infrastructure and construction firms', 'Real estate and urban development', 'Consulting and project management services'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Practical project management approach', 'Industry case-based learning', 'Strong focus on planning and controls', 'Career-oriented specialization'] }],
    },
  },
  'M.Tech Digital Communication (EC Engineering)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Digital modulation and coding', 'DSP and signal analysis', 'Wireless communication systems', 'Information theory'] },
        { title: 'Advanced / Emerging Areas', items: ['5G/next-gen communication concepts', 'Communication system simulation', 'Software-defined radio basics'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Simulation-based labs', 'Mini projects in communication systems', 'Workshops on wireless technologies', 'Industry talks and seminars'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Communication Engineer', 'DSP Engineer', 'Wireless Engineer', 'R&D Engineer'] },
        { title: 'Career Sectors', items: ['Telecom and networking', 'Electronics and embedded industries', 'Defense and satellite communication', 'R&D organizations'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong fundamentals with practical simulations', 'Exposure to modern wireless trends', 'Research and project guidance', 'Skill-building labs'] }],
    },
  },
  'M.Tech Electrical Power System': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Power system analysis', 'Protection and control', 'High voltage engineering', 'Power electronics and drives'] },
        { title: 'Advanced / Emerging Areas', items: ['Renewable integration', 'Smart grid concepts', 'Energy management'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Power system simulation labs', 'Protection & measurement practicals', 'Industry interactions', 'Dissertation with applied focus'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Power System Engineer', 'Protection Engineer', 'Energy Analyst', 'Electrical Design Engineer'] },
        { title: 'Career Sectors', items: ['Utilities and power distribution', 'Renewable energy companies', 'Industrial power systems', 'Consulting and EPC'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Applied learning with simulations', 'Focus on modern power systems', 'Mentored dissertation work', 'Industry-aligned outcomes'] }],
    },
  },
  'M.Tech Industrial Metallurgy': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Extractive metallurgy', 'Metal casting and forming', 'Heat treatment', 'Materials characterization'] },
        { title: 'Applied Learning', items: ['Lab-based materials testing', 'Process optimization projects', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Foundry / plant visits', 'Materials testing and analysis', 'Industry case studies', 'Guest sessions by professionals'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Metallurgical Engineer', 'Process Engineer', 'Quality / Testing Engineer', 'R&D Engineer'] },
        { title: 'Career Sectors', items: ['Steel and metal industries', 'Foundries and fabrication', 'Automotive materials', 'Research labs'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong lab and practical orientation', 'Industry-focused metallurgy learning', 'Research guidance', 'Career-ready skill development'] }],
    },
  },
  'M.Tech Structural Engineering (Civil Engineering)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Advanced structural analysis', 'Design of RCC/steel structures', 'Earthquake engineering basics', 'Foundation engineering'] },
        { title: 'Applied Learning', items: ['Design projects and case studies', 'Software tools for structural analysis', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Design project work', 'Industry interaction for real projects', 'Workshops on structural software', 'Site visits and case studies'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Structural Engineer', 'Design Engineer', 'Project Engineer', 'Consulting Engineer'] },
        { title: 'Career Sectors', items: ['Construction and infrastructure', 'Structural consulting', 'Real estate and EPC', 'Government and private projects'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Design-oriented curriculum', 'Hands-on projects and tools', 'Industry-relevant specialization', 'Mentored dissertation work'] }],
    },
  },
  'M.Tech Data Science (Computer)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Machine learning fundamentals', 'Data mining and analytics', 'Data engineering basics', 'Statistics for data science'] },
        { title: 'Advanced / Emerging Areas', items: ['Big data concepts', 'Deep learning overview', 'Applied AI projects'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Capstone projects with real datasets', 'Tool-driven labs and assignments', 'Hackathons / workshops', 'Industry mentor sessions'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Data Analyst', 'Data Scientist (Associate)', 'ML Engineer (Junior)', 'Business Intelligence Developer'] },
        { title: 'Career Sectors', items: ['IT and software services', 'Finance and analytics', 'Healthcare and research', 'Product and e-commerce companies'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Applied learning with projects', 'Focus on modern analytics skills', 'Mentored capstone and research', 'Industry interaction and exposure'] }],
    },
  },
  'M.Tech Cyber Security': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Network and system security', 'Cryptography basics', 'Security testing and auditing', 'Digital forensics overview'] },
        { title: 'Applied Learning', items: ['Security labs and simulations', 'Case studies and incident analysis', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Security tool practice and labs', 'Workshops / guest talks', 'Industry-aligned projects', 'Exposure to SOC workflows'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Security Analyst', 'SOC Analyst', 'VAPT Engineer', 'Forensics Analyst (Junior)'] },
        { title: 'Career Sectors', items: ['IT security services', 'Banking and fintech', 'Government / defense', 'Product and SaaS companies'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Hands-on security learning', 'Project and research guidance', 'Industry-relevant skills', 'Exposure to modern security practices'] }],
    },
  },
  'B.Des Product Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Design Areas', items: ['Design thinking and ideation', 'Sketching and visualization', 'Product form and ergonomics', 'Materials and manufacturing basics'] },
        { title: 'Studio & Tools', items: ['CAD and prototyping', 'Model making and mockups', 'User research basics', 'Portfolio development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Studio projects with real briefs', 'Workshops and design reviews', 'Internship / live projects', 'Industry interactions and talks'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Product Designer', 'Industrial Designer', 'UX Research Assistant', 'Design Consultant (Junior)'] },
        { title: 'Career Sectors', items: ['Consumer products', 'Design studios', 'Startups and product companies', 'Manufacturing and innovation teams'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Studio-based learning', 'Hands-on prototyping approach', 'Portfolio-focused mentoring', 'Exposure to design workflows'] }],
    },
  },
  'B.Des Interior Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Design Areas', items: ['Space planning and design', 'Materials and finishes', 'Lighting and building services basics', 'Drawing and visualization'] },
        { title: 'Studio & Tools', items: ['Design studios and juries', '3D visualization tools', 'Model making', 'Portfolio development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Site visits and case studies', 'Studio projects with real contexts', 'Workshops and guest sessions', 'Internship opportunities'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Interior Designer', 'Space Planner', 'Visualization Artist', 'Design Coordinator'] },
        { title: 'Career Sectors', items: ['Interior design firms', 'Architecture and planning studios', 'Real estate and retail', 'Hospitality and commercial projects'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Studio and portfolio emphasis', 'Practical site-based learning', 'Mentoring by experienced faculty', 'Industry exposure through projects'] }],
    },
  },
  'B.Des Fashion Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Design Areas', items: ['Fashion illustration and design', 'Pattern making and garment construction', 'Textiles and surface development', 'Fashion communication'] },
        { title: 'Studio & Skills', items: ['Design studio projects', 'Collection development', 'Portfolio building', 'Presentation and styling basics'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Workshops and industry talks', 'Live projects / internships', 'Design reviews and showcases', 'Hands-on studio practice'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Fashion Designer', 'Apparel Designer (Junior)', 'Fashion Illustrator', 'Merchandising Assistant'] },
        { title: 'Career Sectors', items: ['Apparel and fashion brands', 'Fashion studios', 'Retail and merchandising', 'Entrepreneurship / boutiques'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Hands-on studio culture', 'Collection and portfolio focus', 'Exposure to industry workflows', 'Creative mentoring'] }],
    },
  },
  'B.Des Communication Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Design Areas', items: ['Visual communication', 'Typography and layout', 'Branding basics', 'Illustration fundamentals'] },
        { title: 'Digital Tools', items: ['Design software workflows', 'UI basics and prototyping', 'Motion / multimedia basics', 'Portfolio development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Studio projects and critiques', 'Workshops with professionals', 'Live projects / internships', 'Participation in design events'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Graphic Designer', 'Brand Designer (Junior)', 'UI Designer (Junior)', 'Content / Visual Designer'] },
        { title: 'Career Sectors', items: ['Advertising and branding agencies', 'Product companies', 'Digital media and publishing', 'Design studios'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Studio-led creative learning', 'Strong portfolio focus', 'Exposure to digital design tools', 'Industry interaction'] }],
    },
  },
  'M.Des Fashion Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Advanced Design Areas', items: ['Design research and methodology', 'Advanced collection development', 'Fashion forecasting and strategy', 'Sustainable fashion concepts'] },
        { title: 'Thesis / Capstone', items: ['Independent design project', 'Portfolio and professional practice', 'Industry / research-driven dissertation'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industry mentoring and critiques', 'Advanced studio projects', 'Workshops and seminars', 'Internship / live collaboration'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Senior Fashion Designer (Associate)', 'Design Strategist (Junior)', 'Fashion Consultant', 'Brand Development Specialist'] },
        { title: 'Career Sectors', items: ['Fashion brands and studios', 'Retail strategy and merchandising', 'Entrepreneurship', 'Design research'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Research-driven design learning', 'Thesis and portfolio mentoring', 'Industry exposure', 'Focus on contemporary design practice'] }],
    },
  },
  'M.Des Interior Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Advanced Design Areas', items: ['Advanced space design', 'Sustainability and building systems', 'Design management basics', 'Research methods'] },
        { title: 'Thesis / Capstone', items: ['Studio + dissertation work', 'Real-world case studies', 'Portfolio development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Design studio with industry briefs', 'Workshops / expert sessions', 'Site-based case studies', 'Professional practice exposure'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Interior Designer (Senior/Associate)', 'Space Planning Consultant', 'Design Project Coordinator', 'Visualization Specialist'] },
        { title: 'Career Sectors', items: ['Design and architecture firms', 'Corporate and retail projects', 'Hospitality design', 'Consulting and project management'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Advanced studio practice', 'Research + design approach', 'Portfolio and career focus', 'Industry interaction'] }],
    },
  },
  'M.Des UI-UX Design': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core UX Areas', items: ['User research and usability', 'Interaction design', 'Information architecture', 'Design systems basics'] },
        { title: 'Applied Learning', items: ['Prototyping and testing', 'Product case studies', 'Capstone / dissertation'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Product-style studio projects', 'Live usability testing', 'Workshops with practitioners', 'Internship / industry collaboration'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['UX Designer', 'UI Designer', 'UX Researcher (Junior)', 'Product Designer (Associate)'] },
        { title: 'Career Sectors', items: ['Product companies', 'IT and software services', 'Design studios', 'Startups'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Project-first UX learning', 'Research and testing mindset', 'Portfolio-oriented mentoring', 'Industry exposure'] }],
    },
  },
  'B.Sc Data Science': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming for data analysis', 'Statistics and probability', 'Machine learning fundamentals', 'Data visualization'] },
        { title: 'Applied Learning', items: ['Projects with real datasets', 'Tools and workflow practice', 'Capstone project'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Hands-on labs and assignments', 'Live projects / internships', 'Workshops and seminars', 'Hackathons / competitions'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Data Analyst', 'Business Analyst (Junior)', 'BI Developer (Junior)', 'Data Engineer (Junior)'] },
        { title: 'Career Sectors', items: ['IT and analytics', 'Finance and banking', 'Healthcare and research', 'E-commerce and product companies'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Project-based data learning', 'Tool-driven practical approach', 'Mentoring and guidance', 'Industry exposure opportunities'] }],
    },
  },
  'B.Sc (CA & IT)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming fundamentals', 'Database management', 'Web technologies', 'Computer networks basics'] },
        { title: 'Applied Learning', items: ['Lab sessions and mini projects', 'Software development practices', 'Capstone project'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Lab-based practicals', 'Project work and presentations', 'Workshops and certifications', 'Industry interaction sessions'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Developer (Junior)', 'Web Developer', 'System Support Engineer', 'Database Assistant'] },
        { title: 'Career Sectors', items: ['IT services', 'Software development', 'Web and digital services', 'Support and operations'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong computing foundations', 'Hands-on labs and projects', 'Career-oriented skills', 'Support for internships and placements'] }],
    },
  },
  'B.Sc Clinical Research and Healthcare Management': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Clinical trial fundamentals', 'Regulatory and ethics basics', 'Biostatistics overview', 'Healthcare management basics'] },
        { title: 'Applied Learning', items: ['Case studies and documentation practice', 'Seminars and presentations', 'Project work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Guest lectures and seminars', 'Industry / hospital interactions', 'Internship / live exposure', 'Project-based learning'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Clinical Research Associate (Trainee)', 'Clinical Data Coordinator', 'Regulatory Affairs Assistant', 'Healthcare Operations Assistant'] },
        { title: 'Career Sectors', items: ['Pharma and CROs', 'Hospitals and healthcare organizations', 'Regulatory and compliance', 'Research and academics'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Interdisciplinary healthcare focus', 'Case-based learning approach', 'Industry exposure support', 'Career-ready skill development'] }],
    },
  },
  'B.Sc Mathematics': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Calculus and differential equations', 'Linear algebra', 'Discrete mathematics', 'Probability and statistics'] },
        { title: 'Applied Learning', items: ['Mathematical modeling basics', 'Problem-solving seminars', 'Project / presentation work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Workshops on applications', 'Seminars and problem-solving sessions', 'Projects with applied focus'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Analyst (Junior)', 'Data / Statistics Assistant', 'Teaching Assistant', 'Research Assistant'] },
        { title: 'Career Sectors', items: ['Analytics and data', 'Education and training', 'Finance and risk', 'Research institutions'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong fundamentals', 'Applied problem-solving focus', 'Supportive academic mentoring', 'Pathways to higher studies'] }],
    },
  },
  'B.Sc Physics': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Mechanics and electromagnetism', 'Optics and modern physics', 'Quantum basics', 'Mathematical physics'] },
        { title: 'Laboratory Learning', items: ['Physics experiments and instrumentation', 'Data analysis for experiments', 'Project / seminar work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Laboratory-driven learning', 'Seminars and workshops', 'Exposure to instrumentation concepts', 'Project work'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Lab Assistant', 'Research Assistant', 'Technical Support (Junior)', 'Teaching Assistant'] },
        { title: 'Career Sectors', items: ['Education and research', 'Laboratories and instrumentation', 'Technology organizations', 'Higher studies / academia'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Hands-on lab exposure', 'Strong fundamentals', 'Seminar-based learning', 'Support for higher studies'] }],
    },
  },
  'B.Sc Chemistry': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Organic, inorganic, and physical chemistry', 'Analytical chemistry basics', 'Chemical bonding and reactions', 'Instrumental methods overview'] },
        { title: 'Laboratory Learning', items: ['Chemical analysis labs', 'Titration and synthesis experiments', 'Safety and good lab practices', 'Project work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Lab-based experiments', 'Workshops / seminars', 'Exposure to analytical instrumentation', 'Project-based learning'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Lab Technician (Trainee)', 'Quality Control Assistant', 'Research Assistant', 'Teaching Assistant'] },
        { title: 'Career Sectors', items: ['Chemical and pharma industries', 'Quality testing labs', 'Research and academics'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong lab orientation', 'Concept + practical focus', 'Mentored projects', 'Pathways to higher studies'] }],
    },
  },
  'B.Sc Cyber Security': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Security Areas', items: ['Networking fundamentals', 'System and application security basics', 'Ethical hacking overview', 'Digital forensics basics'] },
        { title: 'Applied Learning', items: ['Hands-on labs and simulations', 'Security case studies', 'Mini projects and capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Tool-based labs', 'Workshops and guest sessions', 'Project work with security focus', 'Exposure to industry practices'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['SOC Analyst (Trainee)', 'Security Analyst (Junior)', 'VAPT Assistant', 'IT Support (Security)'] },
        { title: 'Career Sectors', items: ['IT services', 'Banking and fintech', 'Enterprise security teams', 'Security consulting'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Hands-on security learning', 'Practical labs and projects', 'Industry exposure opportunities', 'Career-oriented skill development'] }],
    },
  },
  'B.Sc Microbiology': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Microbial physiology and genetics', 'Immunology basics', 'Molecular biology overview', 'Food / industrial microbiology basics'] },
        { title: 'Laboratory Learning', items: ['Culture techniques and staining', 'Microscopy and lab safety', 'Microbial analysis practicals', 'Project work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Hands-on microbiology labs', 'Workshops and seminars', 'Exposure to lab protocols', 'Internship / project exposure'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Microbiology Lab Technician (Trainee)', 'Quality Control Assistant', 'Research Assistant', 'Clinical Lab Assistant'] },
        { title: 'Career Sectors', items: ['Healthcare and diagnostics', 'Food and pharma industries', 'Research labs', 'Biotechnology organizations'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong laboratory exposure', 'Skill-focused practical learning', 'Mentored projects', 'Support for higher studies and careers'] }],
    },
  },
  'B.Sc Computer Science (AI and ML)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming and data structures', 'Algorithms and problem solving', 'Machine learning fundamentals', 'Database and web basics'] },
        { title: 'AI / ML Focus', items: ['Supervised and unsupervised learning', 'Model evaluation basics', 'Applied ML projects', 'Intro to deep learning'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Projects and lab assignments', 'Hackathons / workshops', 'Internship opportunities', 'Industry talks and mentorship'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Developer (Junior)', 'ML Engineer (Trainee)', 'Data Analyst', 'AI Support Engineer'] },
        { title: 'Career Sectors', items: ['IT services', 'AI/ML startups', 'Product companies', 'Research teams'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['AI-enabled computing curriculum', 'Project-first learning', 'Mentoring and skill building', 'Exposure to modern tools'] }],
    },
  },
  'M.Sc Information Technology': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Advanced programming concepts', 'Database and systems', 'Networking and security basics', 'Software engineering practices'] },
        { title: 'Applied Learning', items: ['Mini projects and seminars', 'Capstone / dissertation', 'Professional skill development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Project work and presentations', 'Industry interaction sessions', 'Workshops and certifications', 'Internship opportunities'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Engineer', 'System Analyst', 'IT Consultant (Junior)', 'Database / Network Associate'] },
        { title: 'Career Sectors', items: ['IT services', 'Product companies', 'Enterprise IT', 'Research and academics'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Advanced IT skill development', 'Capstone / research focus', 'Industry exposure', 'Career readiness'] }],
    },
  },
  'M.Sc Clinical Research': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Clinical research methodology', 'Regulatory guidelines and ethics', 'Clinical data management basics', 'Biostatistics overview'] },
        { title: 'Applied Learning', items: ['Case studies and documentation', 'Seminars and presentations', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industry / hospital interactions', 'Guest lectures and workshops', 'Internship / project exposure', 'Research-driven learning'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Clinical Research Associate', 'Clinical Data Analyst (Junior)', 'Regulatory Affairs Associate', 'Medical Writing Assistant'] },
        { title: 'Career Sectors', items: ['Pharma and CROs', 'Healthcare organizations', 'Regulatory and compliance', 'Research institutions'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Research + practice orientation', 'Industry exposure opportunities', 'Capstone / dissertation mentoring', 'Career-focused curriculum'] }],
    },
  },
  'M.Sc Mathematics': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Advanced algebra and analysis', 'Numerical methods', 'Probability and statistics', 'Mathematical modeling'] },
        { title: 'Applied Learning', items: ['Seminars and problem-solving', 'Dissertation / capstone', 'Research methodology basics'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Workshops on applications', 'Seminars and presentations', 'Projects with applied focus'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Analyst', 'Research Assistant', 'Teaching / Academic roles', 'Statistics Assistant'] },
        { title: 'Career Sectors', items: ['Analytics and data', 'Education and research', 'Finance and risk', 'Higher studies / academia'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong research mentoring', 'Applied modeling approach', 'Seminar-based learning', 'Pathways to Ph.D. and research'] }],
    },
  },
  'M.Sc Physics': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Advanced electromagnetism', 'Quantum mechanics basics', 'Solid state / materials basics', 'Mathematical physics'] },
        { title: 'Applied Learning', items: ['Advanced laboratory / instrumentation', 'Seminars and presentations', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Instrumentation exposure', 'Lab-based research learning', 'Workshops and seminars', 'Project / dissertation work'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Research Associate', 'Lab / Instrumentation Specialist (Junior)', 'Academic roles', 'Technical Analyst'] },
        { title: 'Career Sectors', items: ['Research and academia', 'Labs and instrumentation', 'Technology organizations', 'Higher studies / Ph.D.'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Research-oriented learning', 'Advanced lab exposure', 'Mentored dissertation work', 'Strong academic foundation'] }],
    },
  },
  'M.Sc Chemistry': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Advanced organic and inorganic chemistry', 'Spectroscopy and analytical techniques', 'Physical chemistry concepts', 'Research methodology'] },
        { title: 'Applied Learning', items: ['Advanced lab experiments', 'Seminars and presentations', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Analytical lab exposure', 'Workshops and seminars', 'Project / dissertation with applied focus', 'Industry interaction sessions'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Analytical Chemist (Junior)', 'QC/QA Associate', 'Research Associate', 'Lab Supervisor (Trainee)'] },
        { title: 'Career Sectors', items: ['Pharma and chemical industries', 'Testing and analytical labs', 'Research and academics'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Advanced lab learning', 'Research and dissertation mentoring', 'Industry exposure', 'Strong academic foundation'] }],
    },
  },
  'M.Sc Cyber Security': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Security Areas', items: ['Network security and monitoring', 'Application security basics', 'Incident response overview', 'Forensics and audit basics'] },
        { title: 'Applied Learning', items: ['Security labs and tool practice', 'Case studies and simulations', 'Capstone / dissertation'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Hands-on lab sessions', 'Workshops / guest sessions', 'Project work with security focus', 'Industry interaction'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Security Analyst', 'SOC Analyst', 'Risk / Compliance Associate', 'VAPT Engineer (Junior)'] },
        { title: 'Career Sectors', items: ['IT security services', 'Finance and banking', 'Enterprise security teams', 'Government / critical infrastructure'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Practical tool-based learning', 'Project + research focus', 'Exposure to industry practices', 'Career-ready skills'] }],
    },
  },
  'M.Sc Microbiology': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Advanced microbiology concepts', 'Molecular biology basics', 'Immunology and virology overview', 'Research methodology'] },
        { title: 'Laboratory Learning', items: ['Advanced lab techniques', 'Instrumentation basics', 'Dissertation / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Lab-focused training', 'Workshops and seminars', 'Research / industry project exposure', 'Professional interactions'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Microbiologist (Junior)', 'QC/QA Associate', 'Research Associate', 'Clinical Lab Specialist (Junior)'] },
        { title: 'Career Sectors', items: ['Healthcare and diagnostics', 'Food and pharma industries', 'Biotech and research labs', 'Academia'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong research and lab exposure', 'Mentored dissertation work', 'Industry interaction opportunities', 'Career and higher studies support'] }],
    },
  },
  'BBA Aviation': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Fundamentals of management', 'Aviation industry overview', 'Airport and airline operations basics', 'Customer service and communication'] },
        { title: 'Applied Learning', items: ['Case studies and simulations', 'Industry interaction sessions', 'Project work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industry talks and seminars', 'Operational case studies', 'Internship / live exposure', 'Field visits (where applicable)'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Airport Operations Executive', 'Airline Customer Service Executive', 'Ground Staff Supervisor (Junior)', 'Logistics / Operations Associate'] },
        { title: 'Career Sectors', items: ['Airports and airlines', 'Ground handling services', 'Aviation logistics', 'Travel and hospitality'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-focused curriculum', 'Practical case-based learning', 'Skill and personality development', 'Career readiness support'] }],
    },
  },
  'BBA General': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Principles of management', 'Accounting and finance basics', 'Marketing fundamentals', 'Business communication'] },
        { title: 'Skill Development', items: ['Presentations and teamwork', 'Case studies and projects', 'Entrepreneurship basics'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industry interactions and guest talks', 'Workshops and seminars', 'Project-based learning', 'Internship opportunities'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Management Trainee', 'Business Development Associate', 'Operations Executive (Junior)', 'Sales / Marketing Associate'] },
        { title: 'Career Sectors', items: ['Corporate and services', 'Retail and sales', 'Operations and administration', 'Startups'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong management foundation', 'Practical learning approach', 'Skill-building focus', 'Pathway to MBA and specialization'] }],
    },
  },
  MBA: {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Management principles', 'Marketing and finance basics', 'Operations and HR fundamentals', 'Business analytics overview'] },
        { title: 'Applied Learning', items: ['Case studies and simulations', 'Industry projects', 'Internship / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Corporate talks and seminars', 'Live projects', 'Internship opportunities', 'Workshops and skill sessions'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Management Trainee', 'Business Analyst (Junior)', 'Operations Executive', 'Associate Consultant (Junior)'] },
        { title: 'Career Sectors', items: ['Corporate management', 'Consulting and services', 'Banking and finance', 'Operations and supply chain'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Industry-oriented learning', 'Case-based approach', 'Career-focused mentoring', 'Professional skill development'] }],
    },
  },
  'MBA Marketing': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Consumer behavior basics', 'Brand management', 'Digital marketing overview', 'Sales and distribution'] },
        { title: 'Applied Learning', items: ['Live marketing projects', 'Case studies and simulations', 'Industry-based assignments'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Industry interaction sessions', 'Live projects', 'Workshops on digital tools', 'Internship / capstone'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Marketing Executive', 'Brand Associate (Junior)', 'Digital Marketing Associate', 'Sales Manager (Trainee)'] },
        { title: 'Career Sectors', items: ['FMCG and consumer brands', 'Digital marketing agencies', 'Sales and retail', 'Product companies'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Practical marketing exposure', 'Modern digital focus', 'Project-first learning', 'Industry interaction'] }],
    },
  },
  'MBA Finance': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Financial management basics', 'Corporate finance', 'Investment analysis overview', 'Accounting and taxation basics'] },
        { title: 'Applied Learning', items: ['Case studies and financial modeling', 'Projects and presentations', 'Internship / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Workshops on finance tools', 'Industry interactions', 'Live projects', 'Internship opportunities'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Finance Executive', 'Analyst (Junior)', 'Banking Associate', 'Accounts / Audit Associate'] },
        { title: 'Career Sectors', items: ['Banking and financial services', 'Corporate finance', 'Investment and insurance', 'Accounting and audit'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Finance skills with practical exposure', 'Case-based learning approach', 'Career mentoring support', 'Industry interaction opportunities'] }],
    },
  },
  'MBA Human Resource': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['HR management basics', 'Talent acquisition and development', 'Performance management', 'Labor laws overview'] },
        { title: 'Applied Learning', items: ['HR case studies', 'Role-play and simulations', 'Internship / capstone'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Guest sessions and workshops', 'Live projects', 'Industry internships', 'Professional skill development'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['HR Executive', 'Recruitment Associate', 'Training Coordinator', 'HR Operations Associate'] },
        { title: 'Career Sectors', items: ['Corporate HR', 'Recruitment and staffing', 'Training and development', 'Operations and administration'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Practical HR learning', 'Case studies and simulations', 'Career readiness focus', 'Industry interaction'] }],
    },
  },
  BCA: {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Programming fundamentals', 'Web technologies', 'Database management', 'Operating systems basics'] },
        { title: 'Applied Learning', items: ['Lab sessions and mini projects', 'Software development practices', 'Capstone project'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Hands-on labs', 'Projects and presentations', 'Workshops / certifications', 'Internship opportunities'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Developer (Junior)', 'Web Developer', 'System Support Engineer', 'QA Tester (Junior)'] },
        { title: 'Career Sectors', items: ['IT services', 'Software development', 'Web and digital services', 'Operations and support'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong foundation in computing', 'Project-based learning', 'Industry-oriented skills', 'Support for internships and placements'] }],
    },
  },
  MCA: {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Technical Areas', items: ['Advanced programming concepts', 'Software engineering', 'Database and systems', 'Web / mobile app development basics'] },
        { title: 'Applied Learning', items: ['Mini projects', 'Capstone / dissertation', 'Professional development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Project-first learning', 'Industry interaction sessions', 'Workshops and seminars', 'Internship opportunities'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Software Engineer', 'Full Stack Developer', 'System Analyst', 'Database / Cloud Associate'] },
        { title: 'Career Sectors', items: ['IT services', 'Product companies', 'Enterprise IT', 'Startups'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Advanced skill development', 'Capstone focus', 'Industry exposure', 'Career-oriented learning'] }],
    },
  },
  'B.Arch': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Architectural design studios', 'Building construction and materials', 'Structural systems basics', 'History and theory of architecture'] },
        { title: 'Tools & Practice', items: ['Architectural drawing and graphics', '3D visualization basics', 'Model making', 'Portfolio development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Studio juries and reviews', 'Site visits and case studies', 'Workshops and guest sessions', 'Internship / professional practice exposure'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Architect (Trainee)', 'Junior Architect', 'Architectural Draftsperson', 'Visualization Artist'] },
        { title: 'Career Sectors', items: ['Architecture firms', 'Interior and design studios', 'Construction and real estate', 'Urban and planning services'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Studio-based learning culture', 'Hands-on design practice', 'Portfolio and project guidance', 'Exposure to professional workflows'] }],
    },
  },
  'B.Com (Hons.)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Financial accounting', 'Business economics', 'Corporate law basics', 'Taxation fundamentals'] },
        { title: 'Applied Learning', items: ['Case studies and projects', 'Presentation and communication skills', 'Industry-oriented skill development'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Guest lectures and seminars', 'Workshops on practical finance', 'Internship opportunities', 'Projects with business context'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Accounts Executive (Junior)', 'Audit Assistant', 'Tax Associate (Junior)', 'Business Operations Associate'] },
        { title: 'Career Sectors', items: ['Accounting and audit firms', 'Corporate finance teams', 'Banking and financial services', 'Business operations'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong commerce fundamentals', 'Practical, career-oriented learning', 'Skill development focus', 'Pathways to professional courses'] }],
    },
  },
  'B.A. English (Hons.)': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['English literature', 'Language and linguistics basics', 'Writing and communication', 'Critical and cultural studies'] },
        { title: 'Applied Learning', items: ['Presentations and seminars', 'Research and writing projects', 'Skill development activities'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Workshops and talks', 'Projects and publications (where applicable)', 'Skill development for careers', 'Internship / practical exposure (where applicable)'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Content Writer', 'Copywriter (Junior)', 'Editor (Assistant)', 'Communication / PR Associate'] },
        { title: 'Career Sectors', items: ['Media and publishing', 'Corporate communication', 'Education and training', 'Digital content and marketing'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong writing and communication focus', 'Seminar-based learning', 'Skill development for careers', 'Support for higher studies'] }],
    },
  },
  'B.Pharm': {
    'CURRICULUM & LEARNING': {
      sections: [
        { title: 'Core Areas', items: ['Pharmaceutics basics', 'Pharmacology overview', 'Pharmaceutical chemistry', 'Pharmacognosy basics'] },
        { title: 'Laboratory Learning', items: ['Formulation and analysis labs', 'Quality control basics', 'Good laboratory practices', 'Project work'] },
      ],
    },
    'INDUSTRY EXPOSURE': {
      sections: [{ title: 'Industry Exposure & Practical Learning', items: ['Pharmacy labs and practicals', 'Industry / hospital exposure (where applicable)', 'Guest lectures and workshops', 'Internship / training'] }],
    },
    'CAREER PROSPECTS': {
      sections: [
        { title: 'Job Roles', items: ['Pharmacist (as per norms)', 'Quality Control Associate (Trainee)', 'Production Associate (Trainee)', 'Medical Representative'] },
        { title: 'Career Sectors', items: ['Pharmaceutical companies', 'Hospitals and clinical settings', 'Quality testing labs', 'Regulatory and research'] },
      ],
    },
    'WHY CHOOSE US': {
      sections: [{ title: 'Why Choose This Program at Indus University', items: ['Strong practical and lab exposure', 'Industry-relevant curriculum', 'Mentored projects', 'Career and higher studies support'] }],
    },
  },
};

const defaultCategories = [
  { id: 'btech', label: 'B.Tech', badge: 'Undergraduate', color: 'border-blue-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', programs: ['Information and Communication Technology', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Computer Engineering', 'Cyber Security', 'Information Technology', 'Computer Science Engineering', 'Aircraft Maintenance Engineering', 'Aeronautical Engineering', 'Aerospace Engineering', 'Defence Aerospace Engineering'] },
  { id: 'btech-dtd', label: 'B.Tech (D to D)', badge: 'Undergraduate (Lateral)', color: 'border-amber-700', bgColor: 'bg-amber-700', lightBg: 'bg-amber-50', programs: ['Information and Communication Technology', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Metallurgical Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering', 'Computer Engineering', 'Cyber Security', 'Information Technology', 'Computer Science Engineering'] },
  { id: 'diploma', label: 'Diploma', badge: 'Diploma Program', color: 'border-orange-500', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', programs: ['Information and Communication Technology', 'Civil Engineering', 'Automobile Engineering', 'Mechanical Engineering', 'Computer Engineering', 'Electrical Engineering', 'Electronics and Communication Engineering'] },
  { id: 'mtech', label: 'M.Tech', badge: 'Post Graduate', color: 'border-red-600', bgColor: 'bg-red-600', lightBg: 'bg-red-50', programs: ['CAD/CAM (Mechanical Engineering)', 'Construction Project Management (Civil Engineering)', 'Digital Communication (EC Engineering)', 'Electrical Power System', 'Industrial Metallurgy', 'Structural Engineering (Civil Engineering)', 'Data Science (Computer)', 'Cyber Security'] },
  { id: 'bdes', label: 'B.Des', badge: 'Undergraduate', color: 'border-yellow-500', bgColor: 'bg-yellow-500', lightBg: 'bg-yellow-50', programs: ['Product Design', 'Interior Design', 'Fashion Design', 'Communication Design'] },
  { id: 'mdes', label: 'M.Des', badge: 'Post Graduate', color: 'border-teal-600', bgColor: 'bg-teal-600', lightBg: 'bg-teal-50', programs: ['Fashion Design', 'Interior Design', 'UI-UX Design'] },
  { id: 'bsc', label: 'B.Sc', badge: 'Undergraduate', color: 'border-blue-400', bgColor: 'bg-blue-400', lightBg: 'bg-blue-50', programs: ['Data Science', 'B.Sc(CA & IT)', 'B.Sc Clinical Research and Healthcare Management', 'B.Sc Mathematics', 'B.Sc Physics', 'B.Sc Chemistry', 'Cyber Security', 'B.Sc Microbiology', 'Computer Science (AI and ML)'] },
  { id: 'msc', label: 'M.Sc', badge: 'Post Graduate', color: 'border-indigo-600', bgColor: 'bg-indigo-600', lightBg: 'bg-indigo-50', programs: ['M.Sc-Information Technology', 'M.Sc-Clinical Research', 'M.Sc-Mathematics', 'M.Sc-Physics', 'M.Sc-Chemistry', 'M.Sc-Cyber Security', 'M.Sc-Microbiology'] },
  { id: 'mba-avia', label: 'MBA/BBA', badge: 'Undergraduate / Post Graduate', color: 'border-purple-600', bgColor: 'bg-purple-600', lightBg: 'bg-purple-50', programs: ['Aviation', 'BBA (General)', 'MBA', 'Marketing', 'Finance', 'Human Resource'] },
  { id: 'bca', label: 'BCA', badge: 'Undergraduate', color: 'border-cyan-500', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', programs: ['BCA'] },
  { id: 'mca', label: 'MCA', badge: 'Post Graduate', color: 'border-rose-500', bgColor: 'bg-rose-500', lightBg: 'bg-rose-50', programs: ['Master of Computer Application'] },
  { id: 'barch', label: 'B.Arch', badge: 'Undergraduate', color: 'border-fuchsia-600', bgColor: 'bg-fuchsia-600', lightBg: 'bg-fuchsia-50', programs: ['B.Arch (Bachelor of Architecture)'] },
  { id: 'bcom', label: 'B.Com (Hons.)', badge: 'Undergraduate', color: 'border-emerald-600', bgColor: 'bg-emerald-600', lightBg: 'bg-emerald-50', programs: ['B.Com (Hons.)'] },
  { id: 'ba', label: 'B.A', badge: 'Undergraduate', color: 'border-sky-600', bgColor: 'bg-sky-600', lightBg: 'bg-sky-50', programs: ['English (Hons)'] },
  { id: 'bpharm', label: 'B.Pharm', badge: 'Undergraduate', color: 'border-green-700', bgColor: 'bg-green-700', lightBg: 'bg-green-50', programs: ['B.Pharm'] }
];

function Programs({ setActivePage, setAdmissionData }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDetailSection, setSelectedDetailSection] = useState('CURRICULUM & LEARNING');
  const [searchQuery, setSearchQuery] = useState('');
  const detailContentRef = React.useRef(null);

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('indus_categories');
    if (!saved) return defaultCategories;
    try {
      return mergeCategories(JSON.parse(saved), defaultCategories);
    } catch {
      return defaultCategories;
    }
  });

  const [programData, setProgramData] = useState(() => {
    const saved = localStorage.getItem('indus_programData');
    if (!saved) return defaultProgramData;
    try {
      return mergeProgramData(JSON.parse(saved), defaultProgramData);
    } catch {
      return defaultProgramData;
    }
  });

  const [inquiryNumber, setInquiryNumber] = useState(() => {
    return localStorage.getItem('indus_inquiry_number') || '+91 74054 13342';
  });

  const selectedProgramKey = selectedProgram ? resolveProgramKey(programData, selectedCategory?.id, selectedProgram) : '';

  React.useEffect(() => {
    setProgramData((prev) => {
      const merged = mergeProgramData(prev, defaultProgramData);
      try {
        localStorage.setItem('indus_programData', JSON.stringify(merged));
      } catch {
        // ignore write failures (private mode / storage restrictions)
      }
      return merged;
    });
  }, []);

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
      <div className="w-full flex-1 h-full overflow-hidden px-4 md:px-6 lg:px-8 pb-8 md:pb-10 fade-in">
        {/* Categories Cards Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 md:gap-10 overflow-y-visible px-4 md:px-8 pt-5 md:pt-8 pb-16 md:pb-24 -mx-4 md:-mx-8 content-start items-start">
          {categories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-[2.5rem] p-6 md:p-7 lg:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] border-t-[22px] md:border-t-[28px] ${cat.color} ${cat.lightBg || 'bg-slate-100'} relative overflow-hidden group hover:shadow-2xl transition-all duration-700 cursor-pointer hover:-translate-y-2 aspect-[4/3] md:aspect-square flex flex-col justify-between`}
            >
              <div className={`absolute inset-0 ${cat.bgColor} opacity-10 group-hover:opacity-20 transition-opacity duration-700`}></div>
               
              <div className="relative z-10 flex-1 flex flex-col">
                <div className={`text-[10px] font-black tracking-[0.15em] mb-3 uppercase mt-1 ${cat.color.replace('border-', 'text-')}`}>
                  {cat.badge}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-[1.1] mb-2 tracking-tight">
                  {cat.label}
                </h3>
              </div>

              <div className="relative z-10 flex items-center text-slate-600 font-black text-[11px] group-hover:text-slate-900 transition-colors tracking-widest pt-3 border-t border-slate-900/5 mt-2">
                <span>EXPLORE COURSES</span>
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-4 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${cat.bgColor} rounded-full opacity-20 group-hover:scale-125 transition-transform duration-[1000ms]`}></div>
            </div>
          ))}
        </div>
        <p className="mt-12 md:mt-16 text-center text-slate-300 text-sm font-black tracking-widest uppercase italic border-t border-slate-100 pt-8 md:pt-10">"Where Practice Meets Theory"</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="w-full flex-1 h-full overflow-hidden px-4 md:px-10 lg:px-12 pt-0 md:pt-2 lg:pt-3 pb-16 md:pb-20 fade-in">
      {/* Detail Header with Back Button */}
      <div className="mb-2 grid grid-cols-1 md:grid-cols-3 items-center gap-3 md:gap-0">
        <div className="md:justify-self-start">
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

        <div className="w-full max-w-none md:justify-self-end md:max-w-[320px]">
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
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 overflow-y-visible px-0 md:px-10 pt-4 md:pt-8 pb-16 md:pb-24 -mx-0 md:-mx-10 content-start items-start">
        {selectedCategory.programs
          .filter(prog => prog.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((prog, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedProgram(prog)}
              className={`p-5 md:p-6 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-700 group cursor-pointer relative overflow-hidden flex flex-col hover:-translate-y-1`}
              style={{ 
                backgroundColor: 'white',
                borderTop: `8px solid ${selectedCategory.color.includes('blue') ? '#3b82f6' : selectedCategory.color.includes('amber') ? '#b45309' : selectedCategory.color.includes('orange') ? '#f97316' : selectedCategory.color.includes('red') ? '#dc2626' : selectedCategory.color.includes('yellow') ? '#eab308' : selectedCategory.color.includes('teal') ? '#0d9488' : selectedCategory.color.includes('indigo') ? '#4f46e5' : selectedCategory.color.includes('purple') ? '#9333ea' : selectedCategory.color.includes('cyan') ? '#0891b2' : selectedCategory.color.includes('rose') ? '#e11d48' : '#64748b'}`
              }}
            >
              {/* Vibrant background layer */}
              <div className={`absolute inset-0 ${selectedCategory.bgColor} opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700`}></div>
              
              <div className="relative z-10">
                <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-slate-900 transition-colors uppercase tracking-tight break-words">{prog}</h4>
              </div>
               
              <div className={`mt-4 flex items-center text-[9px] font-black tracking-[0.1em] group-hover:text-slate-900 transition-colors uppercase pt-3 border-t border-slate-900/5 ${selectedCategory.color.replace('border-', 'text-')} mt-auto`}>
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
           <div className="px-4 md:px-10 py-3 md:py-4 border-b border-gray-100 bg-[#fcfbf9]/95 z-20">
             <div className="flex items-center justify-center relative">
               <button 
                 onClick={() => setSelectedProgram(null)}
                 className="absolute left-0 p-2.5 md:p-3 bg-rose-50 border border-rose-100 rounded-full shadow-sm hover:bg-rose-100 hover:scale-110 active:scale-95 transition-all group shrink-0"
               >
                 <svg className="w-5 h-5 text-rose-500 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
               
              <h2 className="text-2xl font-black text-slate-900 leading-tight text-center">{selectedProgram}</h2>
            </div>
            
             <p className="text-[12px] text-slate-400 font-bold opacity-80 tracking-tight mt-1 text-center">Academic Methodology & Specialization Insights</p>
           </div>

          {/* Main Content Area - Grid of Detail Squares */}
          <div id="modal-details-container" className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-10 pb-32 md:pb-64 relative h-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 md:pt-10 pb-4">
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
                    relative h-20 md:h-28 p-3 md:p-4 flex flex-col items-center justify-center text-center
                    rounded-2xl cursor-pointer transition-all duration-300 group
                    hover:scale-[1.02] hover:-translate-y-1
                    ${item.color} 
                    ${selectedDetailSection === item.id ? 'shadow-lg scale-[1.03] -translate-y-1 z-10 border-2 border-white' : 'shadow-sm hover:shadow-md hover:z-10'}
                  `}
                >
                  <h3 className="text-[13px] md:text-[15px] font-bold text-slate-900 leading-tight">
                    {item.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                  </h3>
                </div>
              ))}
            </div>

            {/* Detail Content (Populated with actual data) */}
            <div ref={detailContentRef} className="mt-4 px-5 md:px-8 py-5 md:py-6 bg-white rounded-3xl border border-slate-100 min-h-[360px] shadow-sm relative overflow-hidden">
                {((selectedProgramKey && programData[selectedProgramKey] && programData[selectedProgramKey][selectedDetailSection]) || selectedDetailSection === 'FEES STRUCTURE' || selectedDetailSection === 'ELIGIBILITY' || selectedDetailSection === 'ADMISSION') ? (
                  <div className="fade-in">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 pb-3 border-b border-gray-50">
                      {selectedDetailSection === 'CURRICULUM & LEARNING' ? 'Curriculum & Learning Areas' : 
                       selectedDetailSection === 'INDUSTRY EXPOSURE' ? 'Industry Exposure & Practical Learning' : 
                       selectedDetailSection === 'CAREER PROSPECTS' ? 'Career Opportunities' :
                       selectedDetailSection === 'ADMISSION' ? 'Admission Process' :
                       selectedDetailSection}
                    </h3>
                    <div className="space-y-6">
                      {/* Smart Data Resolution */}
                      {(() => {
                        let activeSectionData = selectedProgramKey ? programData[selectedProgramKey]?.[selectedDetailSection] : null;

                        // Always compute FEES STRUCTURE from the fee table (prevents stale/saved values from localStorage)
                        if (selectedDetailSection === 'FEES STRUCTURE') activeSectionData = null;
                         
                         // Seed dynamic fallbacks just-in-time if standard JSON is missing
                         if (!activeSectionData && selectedDetailSection === 'FEES STRUCTURE') {
                          const fee = getFirstSemesterFee(selectedCategory.id, selectedProgram, selectedProgramKey);
                          activeSectionData = {
                            sections: [
                              {
                                title: 'Total Amount of 1st Semester',
                                items: [
                                  fee ? `Total Amt. of 1st Semester: ₹${formatINR(fee)}` : 'Total Amt. of 1st Semester: Being Updated',
                                ],
                              },
                            ],
                          };
                         } else if (!activeSectionData && selectedDetailSection === 'ELIGIBILITY') {
                          const e = getProgramEligibility(selectedCategory.id, selectedProgram);
                          activeSectionData = { 
                            sections: [{ 
                              title: 'Academic Eligibility', 
                              items: [`Criteria: ${e.text}`, `Duration: ${e.duration}`] 
                            }] 
                          };
                        } else if (!activeSectionData && selectedDetailSection === 'ADMISSION') {
                          activeSectionData = commonAdmission;
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
          <div className="px-4 md:px-10 py-3 bg-white border-t border-slate-100 flex items-center justify-between z-[40]">
            <div>
              <p className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase mb-0.5">Inquiry Support</p>
              <p className="text-lg font-black text-slate-900 leading-tight">{inquiryNumber}</p>
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
              className="px-8 py-3 bg-[#ff4d20] text-white text-[13px] font-black uppercase tracking-widest rounded-xl shadow-[0_10px_22px_rgba(255,77,32,0.30)] hover:scale-105 active:scale-95 transition-all"
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
