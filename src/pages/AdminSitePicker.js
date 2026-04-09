import React from 'react';
import indusLogo from '../images/University Logo/Indus_logo.png';
import wiiaLogo from '../images/University Logo/WIIA.png';

export default function AdminSitePicker() {
  return (
    <div className="min-h-screen w-full bg-[#faf9f8] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[1.75rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-10 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Choose Admin Panel</h1>
          <p className="text-slate-500 font-bold mt-3 text-sm">
            Select which site you want to manage.
          </p>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              window.location.href = '/admin?site=indus';
            }}
            className="text-left p-8 rounded-[1.5rem] border border-blue-200/70 hover:border-blue-300 hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-white group relative overflow-hidden"
          >
            <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/80 border border-white/80 flex items-center justify-center overflow-hidden">
              <img src={indusLogo} alt="Indus" className="w-full h-full object-contain p-2.5" />
            </div>

            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-5">Main Site</div>
            <div className="mt-2 text-2xl font-black text-slate-900">Indus University</div>
            <div className="mt-4 text-slate-500 font-bold text-sm">
              Manage events, institutes, categories and programs for the main website.
            </div>
            <div className="mt-7 flex items-center text-slate-700 font-black text-[11px] uppercase tracking-widest">
              Open Admin
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/wiia/admin';
            }}
            className="text-left p-8 rounded-[1.5rem] border border-sky-200/70 hover:border-sky-300 hover:shadow-xl transition-all bg-gradient-to-br from-sky-50 to-white group relative overflow-hidden"
          >
            <div className="relative z-10 w-20 h-20 rounded-3xl bg-white/80 border border-white/80 flex items-center justify-center overflow-hidden">
              <img src={wiiaLogo} alt="WIIA" className="w-full h-full object-contain p-2.5" />
            </div>

            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mt-5">Aviation Site</div>
            <div className="mt-2 text-2xl font-black text-slate-900">WIIA</div>
            <div className="mt-4 text-slate-500 font-bold text-sm">
              Manage the WIIA variant (Aviation-only Programs view).
            </div>
            <div className="mt-7 flex items-center text-slate-700 font-black text-[11px] uppercase tracking-widest">
              Open Admin
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
