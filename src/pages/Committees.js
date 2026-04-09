import React, { useState } from 'react';

function Committees() {
  const committeeData = [
    { 
      id: 'sac', 
      title: 'Students Affairs Committee', 
      short: 'SAC',
      objective: "The objective of SAC (Student Affairs Committee) is to provide a platform for student's activity in co-curricular and extracurricular activities, fostering their personal goal and enhancing their overall university experience.",
      formation: "The formation of the Student Affairs Committee aims to enhance student engagement, foster a vibrant campus culture, and provide opportunities for personal growth and skill development. Indus University has constituted the Student Affairs Committee for the year 2025-2027 with the following members.",
      members: [
        { name: "Dr. Ketan Lakhtaria (Dean, Student Affairs)", profession: "Chairman" },
        { name: "Dr. Miloni Ganatra", profession: "Member" },
        { name: "Asst. Prof. Ruchit Soni", profession: "Member" },
        { name: "Dr. Hinal Shah", profession: "Member" },
        { name: "Dr. Monil Salot", profession: "Member" },
        { name: "Asst. Prof. Abhishek Vaghela", profession: "Member" },
        { name: "Asst. Prof. Hiren Mer", profession: "Member" },
        { name: "Asst. Prof. Shruti Jaiswal", profession: "Member" },
        { name: "Dr. Parul Shah", profession: "Member" },
        { name: "Asst. Prof. Mansi Mehta", profession: "Member" },
        { name: "Asst. Prof. Nisha Thankachen", profession: "Member" },
        { name: "Asst. Prof. Naitik Vakharia", profession: "Member" },
        { name: "Mr. Sumit Sarvaiya", profession: "Member" },
        { name: "Ms. Aditi Mehta", profession: "Member" },
        { name: "Mrs. Meeta Agarwal", profession: "Member Secretary" },
      ],
      color: "bg-[#ffae4f]"
    },
    { 
      id: 'activity', 
      title: 'Students Activity Cell', 
      short: 'Cell', 
      objective: "Providing a platform for student's activity in co-curricular and extracurricular activities, fostering their personal goals and enhancing their overall university experience.",
      members: [
        { name: "Sneh Bansia", profession: "President (IITE)" },
        { name: "Krishnarajsinh Rajput", profession: "General Secretary (IIICT)" },
        { name: "Shubham Patel", profession: "Head - Cultural (IITE)" },
        { name: "Mahir Patel", profession: "Head - Cultural (IIICT)" },
        { name: "Devmitra Vedbandhu Sharma", profession: "Head - Cultural (IITE)" },
        { name: "Preksha Thacker", profession: "Head - Cultural (IITE)" },
        { name: "Dhruvesh N Shah", profession: "Coordinator - Cultural (IITE)" },
        { name: "Mitanshi Wadhwani", profession: "Coordinator - Cultural (IITE)" },
        { name: "Vedant T Shah", profession: "Head - Decoration (IITE)" },
        { name: "Patel Yatri Alkeshkumar", profession: "Head - Decoration (IITE)" },
        { name: "Hetvi Shah", profession: "Head - Decoration (IDEA)" },
        { name: "Riya Shah", profession: "Head - Decoration (IITE)" },
        { name: "Devanshi Jain", profession: "Head - Content (IITE)" },
        { name: "Aarya Tiwari", profession: "Head - Content (IITE)" },
        { name: "Mallika gupta", profession: "Head - Content (IITE)" },
        { name: "Vrushti Shastri", profession: "Head - Content (IDEA)" },
        { name: "Rhea Shah", profession: "Head - Content (IDEA)" },
        { name: "Aman Rajani", profession: "Head - Design (IITE)" },
        { name: "Het.A.Patel", profession: "Head - Design (IITE)" },
        { name: "Pranjal Kemkar", profession: "Head - Design (IITE)" },
        { name: "Tarak Siddhpura", profession: "Coordinator - Design (IITE)" },
        { name: "Bhavin", profession: "Coordinator - Design (IIICT)" },
        { name: "Yutika Gol", profession: "Head - Marketing (IITE)" },
        { name: "Yashvi Mistry", profession: "Head - Marketing (IITE)" },
        { name: "Kunj Patel", profession: "Head - Marketing (IIICT)" },
        { name: "Yash Thakkar", profession: "Head - Marketing (IITE)" },
        { name: "Rahul Borana", profession: "Head - Production (IITE)" },
        { name: "Abhishek mandalia", profession: "Head - Production (IIICT)" },
        { name: "Urmedsingh Rajput", profession: "Coordinator - Production (IITE)" },
        { name: "Jenish Patoliya", profession: "Coordinator - Production (IITE)" },
        { name: "Jeel Patel", profession: "Coordinator - Production (IITE)" },
        { name: "Kunal Gosalia", profession: "Head - Photography (IITE)" },
        { name: "Anshal Malvi", profession: "Head - Photography (IIICT)" },
        { name: "Vedant Domadiya", profession: "Head - Technical (IITE)" },
        { name: "Mihir Patel", profession: "Head - Technical (IITE)" },
        { name: "Darsh Shah", profession: "Coordinator - Technical (IITE)" },
        { name: "Avi Patel", profession: "Head - Sports (IITE)" },
        { name: "Soladhara Dhwani", profession: "Head - Sports (IIICT)" },
        { name: "Aryan Shah", profession: "Head - Sports (IDEA)" },
        { name: "Namrata Vinchhi", profession: "Coordinator - Sports (IIMS)" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'counseling', 
      title: 'Student Counseling & Mentoring Cell', 
      short: 'Mentoring', 
      objective: "Dedicated to providing comprehensive and confidential support to all the students, ensuring their emotional well-being personal growth and academic success.",
      formation: "As per the directives of UGC, a Student Counselling Cell is established under the Student Affairs Committee (SAC) for the year 2024-25 and 2025-26 with a view to address the common concerns of students ranging from anxiety, stress, fear of change and failure to home sickness as well as for the on-campus safety of students.",
      members: [
        { name: "Dr. Ketan Lakhtaria (Dean, Student Affairs)", profession: "Chairman" },
        { name: "Asst. Prof. Ritesh Patel", profession: "Member" },
        { name: "Dr. Payal Mehta", profession: "Member" },
        { name: "Dr. Hinal Shah", profession: "Member" },
        { name: "Dr. Akshara Dave", profession: "Member" },
        { name: "Mrs. Meeta Agarwal", profession: "Coordinator" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'grievance', 
      title: 'University Student Grievance Redressal Committee', 
      short: 'Redressal', 
      objective: "To ensure the wellbeing of students and provide a dedicated platform for addressing any grievances they may encounter during their academic journey.",
      formation: "The establishment of University Student Grievance at Indus University is a significant step towards fostering an environment that prioritizes student well-being and ensures a fair and transparent process for addressing grievances for the period 2024-26.",
      members: [
        { name: "Director IITE", profession: "Chairman" },
        { name: "Director IISHLS", profession: "Member" },
        { name: "Principal IIPR", profession: "Member" },
        { name: "Dean SAC", profession: "Member" },
        { name: "Director IIICT", profession: "Member" },
        { name: "Director I/c. IIMS", profession: "Member" },
        { name: "Vraj Mitesh Shah", profession: "Student Representative" },
        { name: "Prof. IIPR", profession: "Member Secretary" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'scst', 
      title: 'SC/ST Committee', 
      short: 'Equality', 
      objective: "Effective implementation of reservation policy and programmes for the SC/ST students and staff members in the University as per AICTE directives.",
      formation: "The SC-ST cell will serve as an essential support system to promote the welfare, inclusivity and empowerment of SC and ST students, faculty, and staff on campus for the period 2024-25 & 2025-26.",
      members: [
        { name: "Mr. Amol Bagesar", profession: "Chairman" },
        { name: "Mr. Madhusudan Barot", profession: "Member" },
        { name: "Ms. Dipali Jitiya", profession: "Member" },
        { name: "Dr. Vineeta Chauhan", profession: "Member" },
        { name: "Dr. Ashwin Patani", profession: "Cell Coordinator" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'anti-ragging', 
      title: 'Anti-Ragging Committee', 
      short: 'Safety', 
      objective: "Serving as a beacon of hope and protection for students, promoting a culture of respect, inclusivity, and zero tolerance for ragging, both physical and psychological.",
      formation: "As per the directives of Supreme Court of India / UGC, Anti-Ragging Committee has been constituted for the Academic Year 2024-25 and 2025-26. Toll free no. 1800 180 5522",
      members: [
        { name: "Director IITE", profession: "Chairman" },
        { name: "Dr. Seema Mahajan", profession: "Member (Teaching)" },
        { name: "Dr. Samir J. Patel", profession: "Member (Teaching)" },
        { name: "Lt. Parshva Shah", profession: "Member (Teaching)" },
        { name: "Raj M. Panchal (IU235200006) IIMS", profession: "Student Representative" },
        { name: "Rushi Avnish Bhatt (IU2241230009) IITE", profession: "Student Representative" },
        { name: "Jha Rakshita Rupesh (IU2441230456) IITE", profession: "Student Representative" },
        { name: "Aditi Yagnik (IU2380820013) IICT", profession: "Student Representative" },
        { name: "PI of Santej Police Station", profession: "Member" },
        { name: "Mr. Hari Nair", profession: "NGO Representative" },
        { name: "Ms. Bhagwati Patel", profession: "Parent Representative" },
        { name: "Mrs. Meeta Agarwal", profession: "Member Secretary" },
        { name: "Mr. Arpit Mehta", profession: "Media" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'anti-squad', 
      title: 'Anti-Ragging Squad', 
      short: 'Squad', 
      objective: "Specialized and dedicated to preventing and addressing ragging, fostering a positive and respectful atmosphere within the university through active monitoring and campus coordination.",
      formation: "As per the directives of Supreme Court of India / UGC, Anti-Ragging Squad has been constituted comprising of the following members for the Academic Year 2024-25 and 2025-26.",
      members: [
        { name: "Director IITE", profession: "Chairman" },
        { name: "Dr. Mitesh Mungla", profession: "Member" },
        { name: "Dr. Ashwin Patani", profession: "Member" },
        { name: "Asst. Prof. Monil Salot", profession: "Member" },
        { name: "Asst. Prof. Vineeta Chauhan", profession: "Member" },
        { name: "Asst. Prof. Kirtan Rathod", profession: "Member" },
        { name: "Asst. Prof. Pratik Zaveri", profession: "Member" },
        { name: "Dr. Parth Pandya", profession: "Member" },
        { name: "Asst. Prof. Rohit Kumar", profession: "Member" },
        { name: "Asst. Prof. Paras Patel", profession: "Member" },
        { name: "Dr. Daisy Kurian", profession: "Member" },
        { name: "Asst. Prof. Nitinkumar Upwar", profession: "Member" },
        { name: "Mrs. Meeta Agarwal", profession: "Member Secretary" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'internal', 
      title: 'Internal Complaint Committee', 
      short: 'ICC', 
      objective: "To create a conducive environment that promotes gender equality, prevents harassment, and handles complaints impartially and confidentially within university premises.",
      formation: "In line with the policy of Indus University and according to AICTE, the Internal Complaint Committee has been constituted for the year 2024-27.",
      members: [
        { name: "Dr. Dipti Sethi", profession: "Presiding Officer" },
        { name: "Dr. Ketan Lakhtaria", profession: "Member" },
        { name: "Dr. Miloni Ganatra", profession: "Member" },
        { name: "Mr. Jiten Thakkar", profession: "Member" },
        { name: "Mr. Hari Nair", profession: "NGO Representative" },
        { name: "Mr. Aman B. Rajani", profession: "Student Representative" },
        { name: "Ms. Dhwani Salodhara", profession: "Student Representative" },
        { name: "Mr. Harsh Kumar", profession: "Student Representative" },
        { name: "Ms. Alpana Shah", profession: "Member" },
        { name: "Mrs. Meeta Agarwal", profession: "Member Secretary" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'women', 
      title: 'Women\'s Development Cell', 
      short: 'WDC', 
      objective: "Focuses on gender-sensitization in the organization which aims at creating a harmonious environment for women on campus.",
      formation: "In compliance with the directions issued by the UGC and MHRD, WDC deals with cases/complaints of sexual harassment and implements women's policies in general.",
      members: [
        { name: "Dr. Dipti Sethi", profession: "Chairperson" },
        { name: "Dr. Akshara Dave", profession: "Member" },
        { name: "Dr. Sweta Shah", profession: "Member" },
        { name: "Dr. Falguni Tandel", profession: "Member" },
        { name: "Mrs. Meeta Agarwal", profession: "Member Secretary" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'staff', 
      title: 'Staff Grievance and Redressal Committee', 
      short: 'Staff', 
      objective: "Ensuring that concerns raised by our valued staff members are resolved in a timely and effective manner for a positive and respectful work environment.",
      formation: "The revised composition of the Staff Welfare and Grievance Committee for the term 2024-25 to 2025-26.",
      members: [
        { name: "Deputy Registrar", profession: "Chairman" },
        { name: "HR Manager", profession: "Member" },
        { name: "Ms. Bhavana Hotchandani", profession: "Member" },
        { name: "Dr. Vrushank Shah", profession: "Member" },
        { name: "Assistant Registrar", profession: "Member Secretary" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'advisory', 
      title: 'Student Advisory', 
      short: 'Advisory', 
      objective: "Consultative body for student life and portal for grievance submissions.",
      formation: "Students can submit their concerns via offline or online pathways provided below.",
      members: [
        { id: 'offline', name: "Offline Form Submission", profession: "Registrar Section", link: "https://indusuni.ac.in/wp-content/uploads/2019/05/Forms-for-Students-9.7.16-1-1.pdf" },
        { id: 'online', name: "Online Portal Submission", profession: "Student Services", link: "https://indusuni.ac.in/student/student-services.php" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'iqac', 
      title: 'IQAC Committee', 
      short: 'IQAC', 
      objective: "To ensure quality assurance and maintenance of academic standards through continuous monitoring and improvement of institutional processes.",
      formation: "IQAC Committee has been constituted comprising of the following members:",
      members: [
        { guideline: "Chairperson", name: "Prof. Dr. Sandeep Chakravorty\nDr. Suketu Jani", profession: "Executive President(I/c.)\nDeputy Registrar" },
        { guideline: "A Few Senior Administrative Officer", name: "Prof. Dr. Ishbir Singh\nProf. Dr. K.C. Roy\nMr. Amol Bagesar\nDr. Umang Patdiwala\nDr. K Shanty\nMr. Amit Singh\nMr. Deepak Upadhyay\nMr. Neel Patel", profession: "Director IITE\nDean, Research\nController of Examination\nHOD, IIMS\nASSO Dean, R&D\nDeputy TPO - Training & Placement Cell\nExecutive Assistant\nSystem Dept." },
        { guideline: "Three to Eight Teacher", name: "Asst. Prof. Bhavana Hotchandani\nProf. Dr. Seema Mahajan\nDr. Tejal Shah\nProf. Zalak Trivedi\nDr. Ketan Lakhtaria\nDr. Shruti B Yagnik\nDr. Falguni Tandel\nDr. Naresh Chhatwani", profession: "I/c. HOD, BCA-MA IICT\nHOD, Computer Eng.\nAsst. Prof. IIMS\nHOD, Computer Sci. & Eng.\nChairman SAC\nIT HOD\nPrincipal, IIPR\nAsso. Prof. IIDEA" },
        { guideline: "One Member from the Management", name: "Dr. R K Singh", profession: "Registrar" },
        { guideline: "One / Two nominees from local society students and Alumni", name: "Mr. Jenil Shah (IICT)\nMs. Khoosi Joshi (IICT)\nMr. Harsh Sharma (IITE)\nMs. Nidhi Raja (IITE)\nMr. Jay Barot (IISHLS)\nMs. Jainee Jain (IISHLS)\nMs. Malvika Pillai (IIMS)\nMs. Navya Shah (IIMS)\nMr. Monil Salot (Alumni) Ms. Nirali Shah (Alumni)", profession: "Alumni" },
        { guideline: "One / Two nominees from Employers / Industrialists / Stake Holders", name: "Mr. Nilesh Ranpura (E-infochips)\nMr. Rajkumar Terwani\nMs. Radhika Bhandari\nMr. Mihir Palkhiwala", profession: "Director Semi-Conductor\nGM, HR Harsha Engg.\nDirector WIIA\nAlumni" },
        { guideline: "One of the Senior Teachers as the coordinator / Director of the IQAC", name: "Prof. (Dr.) Rajeev Mathur", profession: "IQAC, Director" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'purchase', 
      title: 'Purchase Committee', 
      short: 'Procurement', 
      objective: "Responsible for reviewing, recommending, and overseeing procurement requests to ensure transparency, efficiency, and compliance with university policies.",
      formation: "The committee is responsible for tasks including reviewing purchase requests, evaluating budgetary implications, assessing technical specifications, and conducting cost-benefit analyses.",
      members: [
        { name: "DGM Administration", profession: "Chairman" },
        { name: "Jr. Engineer", profession: "Member" },
        { name: "Dy. Manager (Store)", profession: "Member" },
        { name: "Head of Account Department", profession: "Member" },
        { name: "HOD of the intending branch", profession: "Member" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'industry', 
      title: 'Institution Industry Cell', 
      short: 'IIC', 
      objective: "To keep the motto for strong linkages and collaboration between the industries across the country for promotion of industrial research and development activities, trainings and other joint initiatives.",
      formation: "The Institution Industry Cell (IIC) Committee is constituted for the year 2024-25 & 2025-26 comprising of the following members:",
      members: [
        { name: "Director - IITE", profession: "Chairman" },
        { name: "Dr. Sujoy Chaudhary", profession: "Member" },
        { name: "Dr. Umang Patdiwala", profession: "Member" },
        { name: "Dr. Vrushank Shah", profession: "Member" },
        { name: "Mr. Bibekananda Das", profession: "Member" },
        { name: "Mr. Vijay Pandey", profession: "Member" },
        { name: "Mr. Shalin Thakkar", profession: "Member" },
      ],
      color: "bg-slate-300" 
    },
    { 
      id: 'ombuds', 
      title: 'Appointment of Ombudsperson', 
      short: 'Ombuds', 
      objective: "As per the guidelines provided by the University Grant commission (UGC), Prof. (Dr.) Pankajkumar P Pandya is appointed as the Ombudsperson from June 22, 2024.",
      formation: "The Ombudsperson will serve as an independent and impartial authority to address grievances and complaints from students, faculty, and staff. The appointment is commitment for fair and transparent academic environment.",
      color: "bg-slate-300" 
    },
  ];

  const [activeTab, setActiveTab] = useState('sac');
  const activeCommittee = committeeData.find(c => c.id === activeTab) || committeeData[0];

  return (
    <div className="fade-in w-full h-full flex flex-col">
      {/* Top Tabs Grid */}
      <div className="flex gap-3 md:flex-wrap overflow-x-auto md:overflow-visible mb-8 md:mb-10 bg-slate-100/50 p-2 rounded-2xl custom-scrollbar">
        {committeeData.map((comm) => (
          <button
            key={comm.id}
            onClick={() => setActiveTab(comm.id)}
            style={{ 
              backgroundColor: activeTab === comm.id ? '#fecd55' : 'white',
              borderColor: activeTab === comm.id ? '#fecd55' : 'transparent'
            }}
            className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-black tracking-tight rounded-2xl transition-all flex-none md:flex-1 whitespace-nowrap border-2
              ${activeTab === comm.id 
                ? 'text-slate-900 shadow-lg shadow-[#fecd55]/20 transform -translate-y-1' 
                : 'text-slate-500 hover:bg-slate-50 hover:border-slate-200'}
            `}
          >
            {comm.title}
          </button>
        ))}
      </div>

      {/* Main Detail Area */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col items-stretch flex-1 min-h-0">
        {/* Header Ribbon */}
        <div 
          style={{ backgroundColor: activeCommittee.color || '#fecd55' }}
          className="h-14 md:h-16 flex items-center px-4 md:px-10 relative overflow-hidden shrink-0 shadow-md border-b border-black/5"
        >
             <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase drop-shadow-sm">{activeCommittee.title}</h2>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex-1">
          <div className="max-w-full space-y-8 px-0 md:px-2">
            <p className="text-xl font-bold text-slate-800 leading-relaxed italic opacity-90">
              "{activeCommittee.objective}"
            </p>
            
            {activeCommittee.formation && (
              <p className="text-lg text-slate-600 font-medium leading-relaxed leading-[1.8]">
                 {activeCommittee.formation}
              </p>
            )}

            {/* Members Table */}
            {activeCommittee.members && (
              <div className="mt-12 rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <div className="min-w-[720px]">
                    <div 
                      style={{ backgroundColor: `${activeCommittee.color}30` }}
                      className={`grid ${activeCommittee.id === 'iqac' ? 'grid-cols-3' : 'grid-cols-2'} p-6 border-b border-black/5`}
                    >
                      {activeCommittee.id === 'iqac' ? (
                        <>
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Guidelines</span>
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Nominations</span>
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 text-right">Remarks</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700">Name of the Member</span>
                          <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 text-right">Profession</span>
                        </>
                      )}
                    </div>
                    <div className="divide-y divide-slate-100">
                      {activeCommittee.members.map((member, idx) => (
                        <div key={idx} className={`grid ${activeCommittee.id === 'iqac' ? 'grid-cols-3' : 'grid-cols-2'} py-4 px-6 items-start hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-200/40'}`}>
                       {activeCommittee.id === 'iqac' ? (
                         <>
                           <span className="font-bold text-slate-600 text-xs uppercase tracking-tight pr-4">{member.guideline}</span>
                           <div className="font-extrabold text-slate-900 text-sm whitespace-pre-line leading-relaxed">
                              {member.name}
                           </div>
                           <div className="text-slate-500 font-bold text-right text-xs uppercase tracking-wider whitespace-pre-line leading-relaxed">
                              {member.profession}
                           </div>
                         </>
                       ) : (
                         <>
                           <span className="font-extrabold text-slate-900 text-sm">{member.name}</span>
                           <div className="flex justify-end items-center gap-3">
                              {member.link && (
                                 <a 
                                     href={member.link} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="px-3 py-1 bg-[#ffae4f] text-slate-900 text-[10px] font-black uppercase rounded-lg hover:scale-105 transition-transform shadow-sm"
                                 >
                                     {member.id === 'online' ? 'Submit Online' : 'Check Links'}
                                 </a>
                              )}
                              <span className="text-slate-500 font-bold text-right text-xs uppercase tracking-wider">{member.profession}</span>
                           </div>
                         </>
                       )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!activeCommittee.members && (
              <div className="py-20 text-center opacity-30 italic font-bold text-slate-400">
                Committee membership details are being updated for 2026.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Committees;
