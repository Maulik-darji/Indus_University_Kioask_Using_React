import React, { useState, useEffect } from 'react';
import AdminCategories from './AdminCategories';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { sha256Hex } from '../auth/sha256';

// Custom Modal Component for "Center of the Screen" Popups
const CenterModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-sm p-7 scale-in flex flex-col max-h-[90vh]">
        <h3 className="text-xl font-black text-slate-800 mb-4 text-center tracking-tight uppercase">{title}</h3>
        <div className="overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>
  );
};

export default function Admin({ siteVariant = 'indus' }) {
  const basePath = siteVariant === 'wiia' ? '/wiia' : '/';
  const activePageStorageKey = siteVariant === 'wiia' ? 'wiia_active_page' : 'indus_active_page';
  const adminSessionKey = siteVariant === 'wiia' ? 'wiia_admin_session' : 'indus_admin_session';
  const kioskAllowlistEnabled = String(process.env.REACT_APP_KIOSK_DEVICE_ALLOWLIST || '').toLowerCase() === 'true';
  const passwordSettingsRef = doc(db, 'kiosk_settings', 'global');
  const passwordHashCacheKey = 'indus_kiosk_password_sha256_cache_v1';
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem(adminSessionKey) === 'active';
  });
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  // Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', content: null });

  // Data States
  const [events, setEvents] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [kioskDevices, setKioskDevices] = useState([]);
  const [inquiryNumber, setInquiryNumber] = useState('');
  const [accessPassword, setAccessPassword] = useState('');
  const [accessPasswordConfirm, setAccessPasswordConfirm] = useState('');
  const [accessPasswordBusy, setAccessPasswordBusy] = useState(false);

  // Form States (for creating/editing)
  const [eventForm, setEventForm] = useState({ id: null, month: '', day: '', title: '', desc: '', type: '', isFeatured: false, color: '#f97316', link: '' });
  const [instituteForm, setInstituteForm] = useState({ id: null, name: '', desc: '' });
  const [newAdminForm, setNewAdminForm] = useState({ username: '', pass: '' });
  const [tickerForm, setTickerForm] = useState('');
  const [tickerFormIdx, setTickerFormIdx] = useState(null);
  const [aiLogs, setAiLogs] = useState([]);

  // Initial Load
  useEffect(() => {
    // Events - Realtime Cloud Sync
    const qEvents = query(collection(db, "events_v3"), orderBy("timestamp", "desc"));
    const unsubscribeEvents = onSnapshot(qEvents, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setEvents(items);
    });

    // Institutes - Realtime Cloud Sync
    const qInst = query(collection(db, "institutes_v3"), orderBy("timestamp", "asc"));
    const unsubscribeInst = onSnapshot(qInst, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setInstitutes(items);
    });

    // General Settings (Ticker & Inquiry) - Realtime Cloud Sync
    const qTicker = query(collection(db, "ticker_v3"), orderBy("timestamp", "asc"));
    const unsubscribeTicker = onSnapshot(qTicker, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, text: doc.data().text }));
      setTicker(items);
    });

    let unsubscribeDevices = () => {};
    if (kioskAllowlistEnabled) {
      // Kiosk Devices (Access Allowlist) - Realtime Cloud Sync
      const qDevices = query(collection(db, "kiosk_devices"), orderBy("requestedAt", "desc"));
      unsubscribeDevices = onSnapshot(qDevices, (snapshot) => {
        const items = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        setKioskDevices(items);
      });
    }

    // AI Logs - Realtime Cloud Sync
    const qAi = query(collection(db, "ai_chat_logs"), orderBy("updatedAt", "desc"));
    const unsubscribeAi = onSnapshot(qAi, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setAiLogs(items);
    });

    setInquiryNumber(localStorage.getItem('indus_inquiry_number') || '+91 74054 13342');

    return () => {
      unsubscribeTicker();
      unsubscribeEvents();
      unsubscribeInst();
      unsubscribeDevices();
      unsubscribeAi();
    };
  }, [kioskAllowlistEnabled]);

  const handleAccessPasswordSave = async (e) => {
    e.preventDefault();
    if (accessPasswordBusy) return;

    const next = String(accessPassword || '').trim();
    const nextConfirm = String(accessPasswordConfirm || '').trim();

    if (!next) {
      setModalConfig({
        isOpen: true,
        title: 'Missing Password',
        content: <p className="text-slate-600 mb-6 font-bold text-center">Please enter a new access password.</p>,
      });
      return;
    }

    if (next !== nextConfirm) {
      setModalConfig({
        isOpen: true,
        title: 'Password Mismatch',
        content: <p className="text-slate-600 mb-6 font-bold text-center">New password and confirm password do not match.</p>,
      });
      return;
    }

    setAccessPasswordBusy(true);
    try {
      const hash = await sha256Hex(next);
      await setDoc(passwordSettingsRef, { passwordHash: hash, updatedAt: serverTimestamp() }, { merge: true });
      try {
        localStorage.setItem(passwordHashCacheKey, hash);
      } catch {
        // ignore
      }

      setAccessPassword('');
      setAccessPasswordConfirm('');
      setModalConfig({
        isOpen: true,
        title: 'Access Password Updated',
        content: <p className="text-slate-600 mb-6 font-bold text-center">The kiosk access password has been updated.</p>,
      });
    } catch (err) {
      console.error(err);
      setModalConfig({
        isOpen: true,
        title: 'Update Failed',
        content: <p className="text-slate-600 mb-6 font-bold text-center">Unable to update the access password. Please check network/firestore permissions.</p>,
      });
    } finally {
      setAccessPasswordBusy(false);
    }
  };

  const formatTs = (ts) => {
    try {
      if (!ts) return '—';
      const d = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleString();
    } catch {
      return '—';
    }
  };

  const setDeviceAllowed = async (deviceId, allowed) => {
    try {
      await setDoc(
        doc(db, "kiosk_devices", deviceId),
        { allowed: !!allowed, reviewedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  // --- EVENTS LOGIC ---
  const saveEvent = async (e) => {
    e.preventDefault();
    const type = eventForm.type.toUpperCase();
    const payload = { ...eventForm, type, timestamp: serverTimestamp() };
    delete payload.id; // Hide ID from firestore doc data

    try {
      if (eventForm.id) {
        await updateDoc(doc(db, "events_v3", eventForm.id), payload);
      } else {
        await addDoc(collection(db, "events_v3"), payload);
      }
      setEventForm({ id: null, month: '', day: '', title: '', desc: '', type: '', isFeatured: false, color: '#f97316', link: '' });
    } catch (err) { console.error(err); }
  };

  // --- INSTITUTES LOGIC ---
  const saveInstitute = async (e) => {
    e.preventDefault();
    const payload = { ...instituteForm, timestamp: serverTimestamp() };
    delete payload.id;

    try {
      if (instituteForm.id) {
        await updateDoc(doc(db, "institutes_v3", instituteForm.id), payload);
      } else {
        await addDoc(collection(db, "institutes_v3"), payload);
      }
      setInstituteForm({ id: null, name: '', desc: '' });
    } catch (err) { console.error(err); }
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const confirmDelete = (type, id, title) => {
    setModalConfig({
      isOpen: true,
      title: 'Confirm Deletion',
      content: (
        <div>
          <p className="text-slate-600 mb-8 text-lg font-medium">Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.</p>
          <div className="flex gap-4">
            <button onClick={closeModal} className="flex-1 py-4 bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200">Cancel</button>
            <button
              onClick={async () => {
                try {
                if (type === 'event') await deleteDoc(doc(db, "events_v3", id));
                if (type === 'institute') await deleteDoc(doc(db, "institutes_v3", id));
                if (type === 'ticker') await deleteTickerItem(id);
                if (type === 'ai_log') await deleteDoc(doc(db, "ai_chat_logs", id));
                if (type === 'category') {
                  const storedCats = localStorage.getItem('indus_categories');
                  if (storedCats) {
                    const cats = JSON.parse(storedCats);
                    localStorage.setItem('indus_categories', JSON.stringify(cats.filter(c => c.id !== id)));
                    window.dispatchEvent(new Event('storage')); // trigger update for AdminCategories
                  }
                }
                closeModal();
                } catch(err) { console.error(err); }
              }}
              className="flex-1 py-4 bg-red-500 rounded-xl font-black text-white hover:bg-red-600 shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
            >
              Delete
            </button>
          </div>
        </div>
      )
    });
  };
  const saveTickerItem = async (text) => {
    try {
      await addDoc(collection(db, "ticker_v3"), {
        text,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Error adding ticker: ", e);
    }
  };

  const updateTickerItem = async (id, text) => {
    try {
      const tickerRef = doc(db, "ticker_v3", id);
      await updateDoc(tickerRef, { text });
    } catch (e) {
      console.error("Error updating ticker: ", e);
    }
  };

  const deleteTickerItem = async (id) => {
    try {
      await deleteDoc(doc(db, "ticker_v3", id));
    } catch (e) {
      console.error("Error deleting ticker: ", e);
    }
  };

  const handleSettingsSave = () => {
    localStorage.setItem('indus_inquiry_number', inquiryNumber);
    setModalConfig({
      isOpen: true,
      title: 'Settings Updated',
      content: <p className="text-slate-600 mb-6 font-bold text-center">Your global settings have been saved locally.</p>
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '0000' || localStorage.getItem(`admin_${password}`)) {
      setIsAuth(true);
      localStorage.setItem(adminSessionKey, 'active');
    } else {
      setModalConfig({
        isOpen: true,
        title: 'Authentication Failed',
        content: <p className="text-slate-600 mb-6 font-bold">Invalid password. Please try again.</p>
      });
    }
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    localStorage.setItem(`admin_${newAdminForm.pass}`, newAdminForm.username);
    setModalConfig({
      isOpen: true,
      title: 'Success!',
      content: <p className="text-slate-600 mb-6 font-bold text-center">Admin <strong>{newAdminForm.username}</strong> created successfully!</p>
    });
    setNewAdminForm({ username: '', pass: '' });
  };



  if (!isAuth) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#faf9f8] min-h-screen p-6">
        <div className="bg-white p-12 rounded-[1.5rem] shadow-2xl max-w-md w-full border border-gray-100 text-center relative">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(activePageStorageKey, 'home');
              window.location.href = basePath;
            }}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all flex items-center justify-center"
            aria-label="Exit admin"
            title="Exit admin"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Admin Access</h2>
          <p className="text-slate-500 mb-8 font-medium">Use pin (0000)</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-200 text-center text-3xl tracking-[0.5em] font-black text-slate-900" placeholder="••••" />
            </div>
            <button type="submit" className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-900 active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(30,41,59,0.5)]">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#faf9f8] min-h-screen overflow-y-auto p-6 md:p-12 relative pb-32 font-medium">
      <CenterModal isOpen={modalConfig.isOpen} onClose={closeModal} title={modalConfig.title}>
        {modalConfig.content}
      </CenterModal>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">Institutional Management</h1>
            <p className="text-slate-500 font-bold text-lg italic">
              Welcome to the central control panel • {siteVariant === 'wiia' ? 'WIIA' : 'INDUS'} ADMIN
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => {
                localStorage.setItem(activePageStorageKey, 'home');
                window.location.href = basePath;
              }} 
              className="px-6 py-3 bg-slate-200 border border-slate-300/50 text-slate-800 rounded-xl font-black hover:bg-slate-300 text-sm transition-all shadow-sm uppercase tracking-wider"
            >
              Return to Website
            </button>
              <button
                onClick={() => {
                  setIsAuth(false);
                  localStorage.removeItem(adminSessionKey);
                  setPassword('');
                  localStorage.setItem(activePageStorageKey, 'home');
                  window.location.href = basePath;
                }}
                className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 text-sm transition-colors"
              >
                Terminate Session
              </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 md:flex-wrap overflow-x-auto md:overflow-visible mb-8 md:mb-10 custom-scrollbar">
          {[
            { id: 'events', label: 'News & Events' },
            { id: 'institutes', label: 'Our Institutes' },
            { id: 'categories', label: 'Categories & Courses' },
            { id: 'ai_logs', label: 'AI Chat Logs' },
            ...(kioskAllowlistEnabled ? [{ id: 'devices', label: 'Kiosk Devices' }] : []),
            { id: 'settings', label: 'Global Settings' },
            { id: 'admin', label: 'Personnel Admin' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-8 py-3 md:py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex-none ${activeTab === tab.id ? 'bg-[#13141c] text-white shadow-[0_8px_20px_rgba(43,58,74,0.3)] md:scale-105' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === 'categories' && (
          <AdminCategories confirmDelete={confirmDelete} setModalConfig={setModalConfig} siteVariant={siteVariant} />
        )}

        {activeTab === 'ai_logs' && (
          <div className="bg-white p-10 rounded-[1.5rem] shadow-2xl border border-slate-100 fade-in mt-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">AI Assistant Chat Logs</h3>
                <p className="text-slate-500 font-bold text-sm italic">
                  Review student interactions and AI performance logs.
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Total Sessions: {aiLogs.length}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {aiLogs.map((log) => {
                const extractName = (messages) => {
                  if (!messages || !Array.isArray(messages)) return 'Anonymous Student';
                  const firstUserMsg = messages.find(m => m.role === 'user');
                  if (firstUserMsg) {
                    const txt = firstUserMsg.content.trim();
                    const match = txt.match(/(?:my name is|i am|i'm|this is|call me)\s+([a-zA-Z\s]{2,20})(?:[.,]|$)/i);
                    if (match) return match[1].trim();
                    if (txt.split(' ').length <= 2) return txt; // Likely just typed their name
                  }
                  return 'Anonymous Student';
                };

                return (
                  <div
                    key={log.id}
                    className="rounded-[1.25rem] border border-slate-100 p-6 bg-white hover:border-blue-200 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Student Name / ID</div>
                        <div className="mt-1 font-black text-slate-800 text-sm truncate">{extractName(log.messages)}</div>
                        <div className="mt-1 font-black text-slate-400 text-[9px] truncate">Device: {log.deviceId} | Session: {log.id}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Last Activity</div>
                        <div className="mt-1 font-bold text-slate-600 text-[10px]">{formatTs(log.updatedAt)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-blue-50 px-3 py-1 rounded-lg">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          {log.messages?.length || 0} Messages
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setModalConfig({
                            isOpen: true,
                            title: `Transcript: ${extractName(log.messages)}`,
                            content: (
                              <div className="space-y-4 py-2">
                                {log.messages?.map((msg, i) => (
                                  <div key={i} className={`p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-50 border border-blue-100 ml-4' : 'bg-slate-50 border border-slate-100 mr-4'}`}>
                                    <div className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-50">
                                      {msg.role === 'user' ? 'Student' : 'AI Assistant'}
                                    </div>
                                    <div className="text-xs font-medium text-slate-800 break-words whitespace-pre-wrap">{msg.content}</div>
                                  </div>
                                ))}
                              </div>
                            )
                          });
                        }}
                        className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all shadow-lg shadow-slate-900/10"
                      >
                        View Transcript
                      </button>
                      <button
                        onClick={() => confirmDelete('ai_log', log.id, `Session ${log.id}`)}
                        className="px-6 py-3 rounded-xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-[0.2em] border border-red-100 hover:bg-red-100 active:scale-95 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {aiLogs.length === 0 && (
              <div className="text-center py-20 opacity-30 font-black text-[10px] uppercase tracking-[0.3em]">
                No chat records found yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="bg-white p-10 rounded-[1.5rem] shadow-2xl border border-slate-100 fade-in mt-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-100 pb-8">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Kiosk Device Allowlist</h3>
                <p className="text-slate-500 font-bold text-sm">
                  Approve/deny computers that can unlock the kiosk (even if password is known).
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Total: {kioskDevices.length}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {kioskDevices.map((d) => {
                const allowed = d.allowed === true;
                const deviceId = d.deviceId || d.id;
                return (
                  <div
                    key={d.id}
                    className={`rounded-[1.25rem] border p-6 shadow-sm transition-all bg-white ${
                      allowed ? 'border-emerald-200' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Device ID</div>
                        <div className="mt-1 font-black text-slate-900 text-xs break-all">{deviceId}</div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-500">
                          <div>
                            <div className="uppercase tracking-widest text-slate-400 font-black text-[9px]">Status</div>
                            <div className={`mt-1 font-black ${allowed ? 'text-emerald-700' : 'text-slate-700'}`}>
                              {allowed ? 'Authorized' : 'Not Authorized'}
                            </div>
                          </div>
                          <div>
                            <div className="uppercase tracking-widest text-slate-400 font-black text-[9px]">Requested</div>
                            <div className="mt-1 font-black text-slate-700">{formatTs(d.requestedAt)}</div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          try {
                            navigator.clipboard.writeText(String(deviceId));
                          } catch {
                            // ignore
                          }
                        }}
                        className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-black text-[10px] uppercase tracking-wider hover:bg-white active:scale-95 transition-all shrink-0"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDeviceAllowed(deviceId, true)}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        Allow
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeviceAllowed(deviceId, false)}
                        className="flex-1 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-100 active:scale-95 transition-all"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {kioskDevices.length === 0 && (
              <div className="text-center py-20 opacity-30 font-black text-[10px] uppercase tracking-[0.3em]">
                No device requests yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 fade-in">
            <div className="lg:col-span-4">
              <div className="bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200 lg:sticky lg:top-10">
                <h3 className="text-xl font-black mb-8 text-slate-800 tracking-tight uppercase tracking-widest">{eventForm.id ? 'Edit Event' : 'New Event'}</h3>
                <form onSubmit={saveEvent} className="space-y-6 text-left">
                  <div>
                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Event Date (Auto-syncs Month/Day)</label>
                    <input 
                      type="date" 
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (!isNaN(date)) {
                          const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                          setEventForm({
                            ...eventForm,
                            month: months[date.getMonth()],
                            day: date.getDate().toString().padStart(2, '0')
                          });
                        }
                      }}
                      className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10 mb-4" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Month Override</label>
                      <input required type="text" placeholder="JAN" value={eventForm.month} onChange={(e) => setEventForm({ ...eventForm, month: e.target.value.toUpperCase() })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10 placeholder:text-slate-200 uppercase" maxLength={3} />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Day Override</label>
                      <input required type="text" placeholder="05" value={eventForm.day} onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10 placeholder:text-slate-200" maxLength={2} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Title</label>
                    <input required type="text" placeholder="Event Title..." value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Description</label>
                    <textarea required placeholder="Short exciting description..." value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10 min-h-[120px] resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Flag</label>
                      <input required type="text" placeholder="ACADEMIC" value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value.toUpperCase() })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={eventForm.color}
                          onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
                          className="w-12 h-12 rounded-xl bg-white border border-slate-200 cursor-pointer p-1"
                        />
                        <span className="text-[10px] font-black font-mono text-slate-400 uppercase">{eventForm.color}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Redirection Link (Optional)</label>
                    <input type="text" placeholder="https://example.com/register" value={eventForm.link} onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10" />
                  </div>
                  <div className="flex items-center h-[56px] pl-2 cursor-pointer" onClick={() => setEventForm({ ...eventForm, isFeatured: !eventForm.isFeatured })}>
                    <div className={`w-6 h-6 rounded border-2 border-slate-300 flex items-center justify-center mr-3 transition-colors ${eventForm.isFeatured ? 'bg-slate-900 border-slate-900' : 'bg-white'}`}>
                      {eventForm.isFeatured && (<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>)}
                    </div>
                    <span className="font-black text-slate-600 text-[10px] uppercase tracking-wider">Featured Event Badge</span>
                  </div>
                  <div className="pt-4 flex gap-4">
                    {eventForm.id && <button type="button" onClick={() => setEventForm({ id: null, month: '', day: '', title: '', desc: '', type: '', isFeatured: false, color: '#f97316', link: '' })} className="flex-1 py-4 font-black text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs transition-colors">Cancel</button>}
                    <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-colors text-xs uppercase tracking-widest">{eventForm.id ? 'Save' : 'Publish'}</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-[0.2em] leading-none">News Console</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(ev => (
                  <div key={ev.id} className="bg-white p-5 rounded-[1.25rem] shadow-sm border border-slate-100 border-t-8 transition-all duration-300 group hover:shadow-lg flex flex-col justify-between h-full" style={{ borderTopColor: ev.color }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-slate-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase">{ev.month}</span>
                        <span className="text-2xl font-black text-slate-900 leading-none">{ev.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-black text-slate-900 truncate mb-1">{ev.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black tracking-widest uppercase px-2 py-1 bg-slate-50 rounded text-slate-400" style={{ color: ev.color }}>{ev.type}</span>
                          {ev.isFeatured && <span className="bg-slate-900 text-[8px] font-black text-white px-2 py-1 rounded uppercase tracking-widest">Featured</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-slate-50">
                      <button onClick={() => setEventForm(ev)} className="w-11 h-11 bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center hover:text-slate-900 hover:bg-slate-300 transition-colors border border-slate-300/30 shadow-sm"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                      <button onClick={() => confirmDelete('event', ev.id, ev.title)} className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:text-white hover:bg-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && <div className="col-span-2 text-center py-20 opacity-30 font-black uppercase tracking-widest">No Events Found</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'institutes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 fade-in">
            <div className="lg:col-span-4">
              <div className="bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200 lg:sticky lg:top-10">
                <h3 className="text-xl font-black mb-8 text-slate-800 tracking-tight uppercase tracking-widest">{instituteForm.id ? 'Edit Unit' : 'Add Institute'}</h3>
                <form onSubmit={saveInstitute} className="space-y-6 text-left">
                  <div>
                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Institute Name</label>
                    <input required type="text" placeholder="IITE - Indus Institute..." value={instituteForm.name} onChange={(e) => setInstituteForm({ ...instituteForm, name: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-2">Tagline</label>
                    <textarea required placeholder="Shaping the built environment..." value={instituteForm.desc} onChange={(e) => setInstituteForm({ ...instituteForm, desc: e.target.value })} className="w-full bg-white px-5 py-4 rounded-xl outline-none font-black text-base border border-transparent focus:border-slate-800/10 min-h-[120px] resize-none"></textarea>
                  </div>
                  <div className="pt-4 flex gap-4">
                    {instituteForm.id && <button type="button" onClick={() => setInstituteForm({ id: null, name: '', desc: '' })} className="flex-1 py-4 font-black text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-xs transition-colors">Cancel</button>}
                    <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-black transition-colors text-xs uppercase tracking-widest">{instituteForm.id ? 'Save' : 'Initialize'}</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-[0.2em] leading-none">Units Directory</h3>
              <div className="flex flex-col gap-4 max-h-[60vh] md:max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {institutes.map(inst => (
                  <div key={inst.id} className="bg-white p-6 rounded-[1.25rem] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between border border-slate-100 hover:border-slate-800/10 hover:shadow-lg transition-all group gap-6">
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xl font-black text-slate-900 leading-tight">{inst.name}</h4>
                      <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-2xl">{inst.desc}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 self-end md:self-center">
                      <button onClick={() => setInstituteForm(inst)} className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-300 transition-colors border border-slate-300/30 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => confirmDelete('institute', inst.id, inst.name)} className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:text-white hover:bg-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {institutes.length === 0 && <div className="text-center py-24 opacity-20 font-black text-xs uppercase tracking-[0.4em]">No Units Established</div>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 fade-in">
            <div className="bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200">
              <div className="bg-white p-8 rounded-[1.25rem] shadow-sm border border-slate-100 h-full flex flex-col">
                <h3 className="text-xl font-black mb-8 text-slate-800 uppercase tracking-widest">Institutional Metadata</h3>

                <div className="mb-8 text-left">
                  <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-4">Central Inquiry Number</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">📞</span>
                    <input type="text" value={inquiryNumber} onChange={(e) => setInquiryNumber(e.target.value)} className="w-full bg-slate-50 pl-14 pr-6 py-5 rounded-xl outline-none font-black focus:bg-white focus:ring-2 focus:ring-slate-800/10 text-slate-900 text-xl border border-transparent transition-all" />
                  </div>
                </div>

                <div className="mb-2 text-left">
                  <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-4">Kiosk Access Password</label>
                  <form onSubmit={handleAccessPasswordSave} className="space-y-4">
                    <input
                      type="password"
                      value={accessPassword}
                      onChange={(e) => setAccessPassword(e.target.value)}
                      placeholder="New access password"
                      className="w-full bg-slate-50 px-6 py-4 rounded-xl outline-none font-black focus:bg-white focus:ring-2 focus:ring-slate-800/10 text-slate-900 border border-transparent transition-all"
                      autoComplete="new-password"
                    />
                    <input
                      type="password"
                      value={accessPasswordConfirm}
                      onChange={(e) => setAccessPasswordConfirm(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-slate-50 px-6 py-4 rounded-xl outline-none font-black focus:bg-white focus:ring-2 focus:ring-slate-800/10 text-slate-900 border border-transparent transition-all"
                      autoComplete="new-password"
                    />
                    <button
                      type="submit"
                      disabled={accessPasswordBusy}
                      className={`w-full py-4 rounded-xl font-black shadow-lg uppercase tracking-widest text-xs transition-all ${
                        accessPasswordBusy ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-black'
                      }`}
                    >
                      {accessPasswordBusy ? 'Updating…' : 'Update Access Password'}
                    </button>
                    <p className="text-[11px] text-slate-400 font-bold">
                      This password is shared across both the main site and WIIA.
                    </p>
                  </form>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100">
                  <button onClick={handleSettingsSave} className="w-full py-5 bg-slate-900 text-white rounded-xl font-black shadow-lg shadow-slate-900/10 hover:bg-black transition-all uppercase tracking-widest text-xs">Save Master Settings</button>
                </div>
              </div>
            </div>

            <div className="bg-[#f2f0ee] p-7 rounded-[1.5rem] shadow-sm border border-slate-200">
              <div className="bg-white p-8 rounded-[1.25rem] shadow-sm border border-slate-100 h-full flex flex-col">
                <h3 className="text-xl font-black mb-6 text-slate-800 uppercase tracking-widest">System News Ticker</h3>

                {/* ADD FORM - Now purely for new items */}
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  if (tickerForm) { 
                    saveTickerItem(tickerForm); 
                    setTickerForm(''); 
                  } 
                }} className="flex gap-4 mb-8">
                  <input required type="text" placeholder="News Ticker" value={tickerForm} onChange={(e) => setTickerForm(e.target.value)} className="flex-1 bg-slate-50 px-5 py-4 rounded-xl outline-none font-black text-base focus:ring-2 focus:ring-slate-800/10 border border-transparent focus:bg-white transition-all shadow-inner" />
                  <button type="submit" className="px-10 bg-slate-900 text-white rounded-xl font-black hover:bg-black transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/10 active:scale-95">Add</button>
                </form>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                  {ticker.map((itemObj, idx) => (
                    <div key={itemObj.id} className="flex items-center gap-4 bg-[#f8f9fa] p-5 rounded-[1.25rem] border border-slate-100 shadow-sm hover:shadow-md hover:bg-white transition-all group/t">
                      <p className="flex-1 text-[15px] font-bold text-slate-700 leading-snug">{itemObj.text}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setModalConfig({
                              isOpen: true,
                              title: 'Edit University Update',
                              content: (
                                <div className="space-y-6">
                                  <div className="text-left">
                                    <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-3">Announcement Text</label>
                                    <textarea 
                                      id="ticker-edit-area"
                                      defaultValue={itemObj.text}
                                      className="w-full bg-slate-50 p-5 rounded-2xl outline-none font-bold text-slate-800 border-none focus:ring-2 focus:ring-slate-200 min-h-[150px] resize-none"
                                    />
                                  </div>
                                  <div className="flex gap-4">
                                    <button onClick={closeModal} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">Discard</button>
                                    <button 
                                      onClick={() => {
                                        const newText = document.getElementById('ticker-edit-area').value;
                                        if (newText) {
                                          updateTickerItem(itemObj.id, newText);
                                          closeModal();
                                        }
                                      }}
                                      className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black shadow-xl shadow-slate-900/10"
                                    >
                                      Update News
                                    </button>
                                  </div>
                                </div>
                              )
                            });
                          }} 
                          className="w-11 h-11 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:text-slate-900 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => confirmDelete('ticker', itemObj.id, 'this ticker text')} className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-100/50 shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {ticker.length === 0 && <div className="text-center py-20 opacity-20 font-black text-[10px] uppercase tracking-[0.3em]">No Ticker Feed</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-xl mx-auto bg-white p-12 rounded-[1.5rem] shadow-2xl border border-slate-100 fade-in mt-10">
            <h3 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-8 text-center uppercase tracking-tight">Access Control</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-6 text-left">
              <div>
                <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-3">Admin Full Name</label>
                <input required type="text" placeholder="John Doe" value={newAdminForm.username} onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })} className="w-full bg-slate-50 p-5 rounded-xl outline-none font-black text-lg placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-800/10 transition-all border border-transparent" />
              </div>
              <div>
                <label className="block text-[9px] font-black tracking-widest text-slate-400 uppercase mb-3">Gateway Secret PIN</label>
                <input required type="password" placeholder="••••" value={newAdminForm.pass} onChange={(e) => setNewAdminForm({ ...newAdminForm, pass: e.target.value })} className="w-full bg-slate-50 p-5 rounded-xl outline-none font-black text-2xl placeholder:text-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-800/10 text-center tracking-[0.5em] transition-all border border-transparent" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-xl hover:bg-black transition-all mt-6 shadow-xl shadow-slate-900/10 uppercase tracking-[0.2em] text-xs">Provision Access</button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
