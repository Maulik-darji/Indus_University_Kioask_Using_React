import React from 'react';
import indusLogo from '../images/University Logo/Indus_logo.png';
import wiiaLogo from '../images/University Logo/WIIA.png';

export default function AdminSitePicker() {
  return (
    <div className="min-h-screen w-full bg-[#f8f7f5] flex items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white overflow-hidden">
        <div className="p-8 md:p-12 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
          <div className="inline-block px-4 py-2 bg-slate-100 rounded-full mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Administrator Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Choose Management Terminal</h1>
          <p className="text-slate-500 font-bold mt-4 text-sm md:text-base max-w-lg mx-auto">
            Select the industrial site or department you wish to manage today.
          </p>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            type="button"
            onClick={() => {
              window.location.href = '/admin?site=indus';
            }}
            className="text-left p-8 md:p-10 rounded-[2rem] border border-blue-200/50 hover:border-blue-400 hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 to-white group relative overflow-hidden"
          >
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-white shadow-lg border border-white/80 flex items-center justify-center overflow-hidden transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <img src={indusLogo} alt="Indus" className="w-full h-full object-contain p-4" />
            </div>

            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400 mt-8">Primary Campus</div>
            <div className="mt-2 text-3xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">Indus University</div>
            <div className="mt-4 text-slate-500 font-bold text-sm leading-relaxed">
              Full control over academic events, departmental updates, and core program directories.
            </div>
            
            <div className="mt-10 flex items-center text-slate-900 font-black text-[12px] uppercase tracking-[0.2em]">
              Access Console
              <div className="w-10 h-10 ml-4 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:translate-x-3 transition-transform shadow-lg shadow-blue-600/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            
            {/* Background Watermark */}
            <div className="absolute right-[-10%] bottom-[-10%] text-blue-100 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2 .712V17a1 1 0 001 1z" /></svg>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/wiia/admin';
            }}
            className="text-left p-8 md:p-10 rounded-[2rem] border border-sky-200/50 hover:border-sky-400 hover:shadow-2xl transition-all bg-gradient-to-br from-sky-50 to-white group relative overflow-hidden"
          >
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-white shadow-lg border border-white/80 flex items-center justify-center overflow-hidden transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <img src={wiiaLogo} alt="WIIA" className="w-full h-full object-contain p-4" />
            </div>

            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-sky-500 mt-8">Aviation Division</div>
            <div className="mt-2 text-3xl font-black text-slate-900 group-hover:text-sky-700 transition-colors">WIIA Admin</div>
            <div className="mt-4 text-slate-500 font-bold text-sm leading-relaxed">
              Dedicated management for Western India Institute of Aeronautics specialized aircraft programs.
            </div>

            <div className="mt-10 flex items-center text-slate-900 font-black text-[12px] uppercase tracking-[0.2em]">
              Access Console
              <div className="w-10 h-10 ml-4 rounded-full bg-sky-600 text-white flex items-center justify-center group-hover:translate-x-3 transition-transform shadow-lg shadow-sky-600/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Background Watermark */}
            <div className="absolute right-[-10%] bottom-[-10%] text-sky-100 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

}
