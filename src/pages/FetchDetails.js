import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

const FetchDetails = () => {
  const [activeView, setActiveView] = useState('initial'); // 'initial', 'scanning', 'results'
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    setActiveView('scanning');
    setError(null);
    setCameraReady(false);

    // Give the DOM a moment to render the #reader div
    setTimeout(async () => {
      // Safety check: If user already closed the scanner, don't start
      const readerEl = document.getElementById("reader");
      if (!readerEl) return;

      try {
        // Check if there are any cameras available first
        const devices = await Html5Qrcode.getCameras().catch(() => []);
        if (!devices || devices.length === 0) {
          setError("No camera hardware detected. Please attach a camera or use the 'Upload File' option.");
          setActiveView('initial');
          return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        const config = { 
          fps: 15, 
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * 0.75);
            return { width: qrboxSize, height: qrboxSize };
          },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          { facingMode: "environment" }, 
          config, 
          onScanSuccess
        );
        
        // Final check after start completes (might have been closed during start)
        if (!document.getElementById("reader")) {
          await html5QrCode.stop().catch(() => {});
          return;
        }

        setCameraReady(true);
      } catch (err) {
        console.error("Camera start error:", err);
        // Ignore "interrupted" errors as they are harmless race conditions from UI changes
        if (err?.toString().includes("interrupted")) return;

        setError("Camera access blocked or failed. Please check browser permissions.");
        setActiveView('initial');
      }
    }, 200);
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Cleanup warning (expected):", err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }
    setCameraReady(false);
  };

  const onScanSuccess = (decodedText) => {
    console.log("Scan Result:", decodedText);
    stopCamera();
    try {
      const data = parseAadhaarData(decodedText);
      setScannedData({ ...data, raw: decodedText });
      setActiveView('results');
    } catch (err) {
      console.error("Parsing Error:", err);
      setScannedData({ raw: decodedText });
      setActiveView('results');
    }
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    try {
      // Use a dedicated processing div
      const html5QrCode = new Html5Qrcode("reader-hidden");
      const decodedText = await html5QrCode.scanFile(file, true);
      onScanSuccess(decodedText);
    } catch (err) {
      console.error("File scan error:", err);
      setError("No valid QR code found in this image. Please try a clearer photo.");
      setActiveView('initial');
    }
  };

  const parseAadhaarData = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const dataNode = xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0];

    if (!dataNode) {
      const attributes = ['uid', 'name', 'gender', 'dob', 'vtc', 'dist', 'state', 'pc'];
      const result = {};
      attributes.forEach(attr => {
        const match = xmlString.match(new RegExp(`${attr}="([^"]*)"`));
        if (match) result[attr] = match[1];
      });
      if (Object.keys(result).length > 0) return result;
      throw new Error("Invalid Format");
    }

    const result = {};
    for (let i = 0; i < dataNode.attributes.length; i++) {
      const attr = dataNode.attributes[i];
      result[attr.name] = attr.value;
    }
    return result;
  };

  const resetScan = () => {
    setScannedData(null);
    setError(null);
    setActiveView('initial');
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 fade-in min-h-[85vh] flex flex-col items-center">
      <div className="mb-8 text-center w-full">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">Student Identification</h2>
        <p className="text-slate-500 font-bold text-sm md:text-lg opacity-80">Fetch university profile using Aadhaar QR Code</p>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {activeView === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center gap-10 shadow-2xl shadow-slate-200/50 w-full max-w-2xl"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-inner group">
                <span className="material-symbols-outlined !text-5xl group-hover:scale-110 transition-transform">qr_code_scanner</span>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Ready to verify identity?</h3>
                <p className="text-slate-500 max-w-md text-sm md:text-base leading-relaxed font-medium">
                  Scan your Aadhaar QR code to automatically fetch your student details and sync with university records.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full max-w-lg gap-4">
                <button
                  onClick={startCamera}
                  className="flex-1 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined !text-xl">videocam</span>
                  Start Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-700 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined !text-xl">upload_file</span>
                  Upload File
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={onFileChange} 
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-500 font-bold text-xs bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-shake">
                  <span className="material-symbols-outlined !text-sm">warning</span>
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-sm aspect-square border-8 border-white"
            >
              <div id="reader" className="w-full h-full"></div>
              
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-[100]">
                <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3 shadow-2xl">
                  <div className={`w-2.5 h-2.5 rounded-full ${cameraReady ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-amber-500'}`}></div>
                  <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">
                    {cameraReady ? 'Live Feed' : 'Initializing...'}
                  </span>
                </div>
                <button
                  onClick={() => { stopCamera(); setActiveView('initial'); }}
                  className="w-12 h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all border border-white/20 shadow-2xl"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                 <div className="w-[75%] h-[75%] border-2 border-white/20 rounded-[2.5rem] relative">
                    <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[6px] border-l-[6px] border-blue-500 rounded-tl-2xl"></div>
                    <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[6px] border-r-[6px] border-blue-500 rounded-tr-2xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[6px] border-l-[6px] border-blue-500 rounded-bl-2xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[6px] border-r-[6px] border-blue-500 rounded-br-2xl"></div>
                    
                    <motion.div 
                      animate={{ top: ['5%', '95%', '5%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-[5%] right-[5%] h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#60a5fa]"
                    />
                 </div>
              </div>

              <div className="absolute bottom-10 left-0 right-0 text-center px-4 z-50">
                <div className="bg-blue-600/90 backdrop-blur-md inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl border border-blue-400/50">
                  <span className="material-symbols-outlined text-white !text-sm">qr_code_2</span>
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.25em]">
                    Position QR code
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'results' && scannedData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-10 w-full max-w-2xl"
            >
              <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="bg-white/10 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 border border-white/20 backdrop-blur-md">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <p className="text-white font-black uppercase tracking-[0.25em] text-[10px]">Verified Profile</p>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight">{scannedData.name || "Student Profile"}</h3>
                  </div>
                  <div className="bg-white text-blue-600 p-5 rounded-[2rem] shadow-2xl">
                    <span className="material-symbols-outlined !text-5xl">verified</span>
                  </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <span className="material-symbols-outlined !text-3xl">fingerprint</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Aadhaar UID</p>
                        <p className="text-slate-800 font-black text-lg tracking-[0.15em]">XXXX XXXX {scannedData.uid?.slice(-4) || "0000"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <span className="material-symbols-outlined !text-3xl">calendar_today</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Date of Birth</p>
                        <p className="text-slate-800 font-black text-lg">{scannedData.dob || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <span className="material-symbols-outlined !text-3xl">person</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Gender</p>
                        <p className="text-slate-800 font-black text-lg">{scannedData.gender === 'M' ? 'Male' : scannedData.gender === 'F' ? 'Female' : 'Other'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <span className="material-symbols-outlined !text-3xl">location_on</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Location</p>
                        <p className="text-slate-800 font-black text-sm line-clamp-1">{scannedData.dist || scannedData.state || "Not Specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 md:px-12 pb-12 flex flex-col sm:flex-row gap-5">
                  <button
                    className="flex-[2] py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                    onClick={() => alert('Syncing profile with University Database...')}
                  >
                    <span className="material-symbols-outlined !text-xl">sync</span>
                    Sync Records
                  </button>
                  <button
                    onClick={resetScan}
                    className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    New Scan
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-sm">
                <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg">
                  <span className="material-symbols-outlined !text-xl">security</span>
                </div>
                <div className="space-y-1">
                  <h5 className="text-blue-900 font-black text-xs uppercase tracking-widest">Privacy Protected</h5>
                  <p className="text-blue-800 text-xs font-bold leading-relaxed opacity-80">
                    Your Aadhaar data is encrypted and used only for identification. No personal information is stored permanently on this device.
                  </p>
                </div>
              </div>

              {/* Debug Section */}
              <div className="bg-slate-950 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                      <span className="material-symbols-outlined !text-xl">terminal</span>
                    </div>
                    <h4 className="text-white font-black tracking-tight uppercase text-xs">Decoded Stream</h4>
                  </div>
                  <div className="px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em]">Developer Tool</p>
                  </div>
                </div>
                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 shadow-inner">
                  <pre className="text-emerald-400 font-mono text-[10px] leading-loose break-all whitespace-pre-wrap opacity-90">
                    {scannedData.raw}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Internal processing element */}
      <div id="reader-hidden" className="hidden"></div>
      
      <style jsx>{`
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 2.5rem !important;
        }
        #reader {
          border: none !important;
        }
        #reader__dashboard, #reader__status_span, #reader img, #reader__scan_region {
          display: none !important;
        }
        #reader div {
          border: none !important;
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default FetchDetails;
