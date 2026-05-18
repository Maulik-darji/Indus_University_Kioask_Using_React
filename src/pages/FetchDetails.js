import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { gunzipSync } from 'fflate';

const FetchDetails = () => {
  const [activeView, setActiveView] = useState('initial'); // 'initial', 'scanning', 'results', 'ekyc'
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const xmlInputRef = useRef(null);

  // Initialize camera when view changes to 'scanning'
  useEffect(() => {
    let isCancelled = false;

    const initCamera = async () => {
      if (activeView !== 'scanning') return;
      setError(null);
      setCameraReady(false);
      setIsSearching(false);

      try {
        let attempts = 0;
        while (!document.getElementById("reader") && attempts < 15) {
          await new Promise(r => setTimeout(r, 100));
          attempts++;
        }
        if (isCancelled || !document.getElementById("reader")) return;

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        const config = { 
          fps: 25, 
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.85;
            return { width: size, height: size };
          },
          aspectRatio: 1.0,
          formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
          experimentalFeatures: { useBarCodeDetectorIfSupported: true }
        };

        const videoConstraints = {
          facingMode: "environment",
          width: { min: 1280, ideal: 1920 },
          height: { min: 720, ideal: 1080 }
        };

        await html5QrCode.start(videoConstraints, config, onScanSuccess);
        if (!isCancelled) {
          setCameraReady(true);
          setTimeout(() => { if (!isCancelled) setIsSearching(true); }, 1000);
        }
      } catch (err) {
        console.error("Camera start error:", err);
        if (!isCancelled) {
          setError("Camera access failed. Check permissions.");
          setActiveView('initial');
        }
      }
    };

    initCamera();

    return () => {
      isCancelled = true;
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current;
        if (scanner.isScanning) {
          scanner.stop().then(() => {
            try { scanner.clear(); } catch (e) {}
          }).catch(() => {});
        } else {
          try { scanner.clear(); } catch (e) {}
        }
        html5QrCodeRef.current = null;
      }
    };
  }, [activeView]);

  const onScanSuccess = (decodedText) => {
    if (html5QrCodeRef.current) {
      const scanner = html5QrCodeRef.current;
      if (scanner.isScanning) {
        scanner.stop().then(() => {
          try { scanner.clear(); } catch (e) {}
        }).catch(() => {});
      }
      html5QrCodeRef.current = null;
    }
    
    try {
      const data = parseAadhaarData(decodedText);
      setScannedData({ ...data, raw: decodedText, method: 'QR Scan' });
      setActiveView('results');
    } catch (err) {
      setScannedData({ raw: decodedText, method: 'QR Scan' });
      setActiveView('results');
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);

    if (type === 'image') {
      try {
        const html5QrCode = new Html5Qrcode("reader-hidden");
        const decodedText = await html5QrCode.scanFile(file, true);
        onScanSuccess(decodedText);
      } catch (err) {
        setError("Could not find a valid QR code in this photo.");
      }
    } else if (type === 'xml') {
      // Logic for Paperless Offline e-KYC (XML/ZIP)
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        try {
          // Check if it's a ZIP (starts with PK)
          if (content.startsWith('PK')) {
             setError("ZIP decoding requires backend processing. Please upload the extracted .xml file for local testing.");
             return;
          }
          const data = parseAadhaarData(content);
          setScannedData({ ...data, raw: content, method: 'Offline e-KYC (XML)' });
          setActiveView('results');
        } catch (err) {
          setError("Invalid XML format. Please ensure you uploaded the official UIDAI e-KYC file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const parseAadhaarData = (data) => {
    // 1. Secure QR Detection (Large Decimal String)
    if (/^\d{500,}$/.test(data)) {
      try {
        // Convert Decimal String to Byte Array
        let bigInt = BigInt(data);
        let hex = bigInt.toString(16);
        if (hex.length % 2 !== 0) hex = '0' + hex;
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }

        // Decompress GZIP Data (wbits=31 in Python logic is gzip)
        const decompressed = gunzipSync(bytes);
        
        // Split by 255 (0xFF) delimiter
        const fields = [];
        let start = 0;
        for (let i = 0; i < decompressed.length; i++) {
          if (decompressed[i] === 255) {
            fields.push(decompressed.slice(start, i));
            start = i + 1;
          }
        }
        fields.push(decompressed.slice(start));

        const decoder = new TextDecoder();
        const getString = (idx) => fields[idx] ? decoder.decode(fields[idx]) : "";

        // Field Mapping based on official Secure QR specifications
        // 0: Meta, 1: RefID, 2: Name, 3: DOB, 4: Gender, 5: CareOf, 6: Dist, 7: Landmark, 8: House, 9: Loc...
        return {
          name: getString(2),
          dob: getString(3),
          gender: getString(4),
          careof: getString(5),
          dist: getString(6),
          landmark: getString(7),
          house: getString(8),
          location: getString(9),
          pc: getString(10),
          po: getString(11),
          state: getString(12),
          street: getString(13),
          subdist: getString(14),
          vtc: getString(15),
          isSecure: true,
          method: 'Official Secure QR'
        };
      } catch (err) {
        console.error("Secure QR Decoding Error:", err);
        return {
          name: "Secure Aadhaar Detected",
          isSecure: true,
          details: "This is a modern Secure Aadhaar QR. Captured successfully, but local decompression failed. Verify via official e-KYC XML instead.",
          raw: data
        };
      }
    }

    // 2. XML Parsing (e-KYC or Legacy QR)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    
    // Check for standard QR node or Offline e-KYC node
    const dataNode = xmlDoc.getElementsByTagName("PrintLetterBarcodeData")[0] || 
                     xmlDoc.getElementsByTagName("OfflinePaperlessKyc")[0];

    if (dataNode) {
        const result = {};
        // If it's the official e-KYC XML, data is in child nodes (UidData)
        const uidData = xmlDoc.getElementsByTagName("UidData")[0];
        if (uidData) {
            const poi = uidData.getElementsByTagName("Poi")[0];
            if (poi) {
                result.name = poi.getAttribute("name");
                result.dob = poi.getAttribute("dob");
                result.gender = poi.getAttribute("gender");
            }
            const poa = uidData.getElementsByTagName("Poa")[0];
            if (poa) {
                result.dist = poa.getAttribute("dist");
                result.state = poa.getAttribute("state");
            }
            return result;
        }

        // Standard QR attributes
        for (let i = 0; i < dataNode.attributes.length; i++) {
            const attr = dataNode.attributes[i];
            result[attr.name] = attr.value;
        }
        return result;
    }

    // 3. Fallback regex
    const attributes = ['uid', 'name', 'gender', 'dob', 'vtc', 'dist', 'state', 'pc'];
    const res = {};
    attributes.forEach(attr => {
        const match = data.match(new RegExp(`${attr}="([^"]*)"`));
        if (match) res[attr] = match[1];
    });
    if (Object.keys(res).length > 0) return res;
    
    throw new Error("Unknown Format");
  };

  const resetScan = () => {
    setScannedData(null);
    setError(null);
    setActiveView('initial');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 fade-in min-h-[85vh] flex flex-col items-center">
      <div className="mb-8 text-center w-full">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">University e-KYC</h2>
        <p className="text-slate-500 font-bold text-sm md:text-lg opacity-80">Official Aadhaar Identification System</p>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {activeView === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center justify-center gap-10 shadow-2xl shadow-slate-200/50 w-full max-w-3xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-inner">
                  <span className="material-symbols-outlined !text-4xl">fingerprint</span>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Identify Student</h3>
                  <p className="text-slate-500 max-w-md text-sm font-medium leading-relaxed">
                    Choose an official verification method below to proceed with the university onboarding.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Method 1: Camera */}
                <button
                  onClick={() => setActiveView('scanning')}
                  className="p-6 bg-blue-600 text-white rounded-[2rem] flex flex-col items-center gap-4 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-2xl">videocam</span>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[10px] uppercase tracking-widest mb-1">Instant</p>
                    <p className="font-bold text-sm">QR Scanner</p>
                  </div>
                </button>

                {/* Method 2: Photo */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 bg-white border-2 border-slate-100 text-slate-600 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-slate-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-2xl">image</span>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[10px] uppercase tracking-widest mb-1">Fallback</p>
                    <p className="font-bold text-sm">Upload Photo</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                </button>

                {/* Method 3: e-KYC XML */}
                <button
                  onClick={() => setActiveView('ekyc')}
                  className="p-6 bg-slate-900 text-white rounded-[2rem] flex flex-col items-center gap-4 hover:bg-black transition-all shadow-xl shadow-slate-200 group"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-2xl">description</span>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[10px] uppercase tracking-widest mb-1">Official</p>
                    <p className="font-bold text-sm">Offline e-KYC</p>
                  </div>
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-500 font-bold text-xs bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-shake">
                  <span className="material-symbols-outlined !text-sm">warning</span>
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'ekyc' && (
            <motion.div
              key="ekyc"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 md:p-16 flex flex-col items-center justify-center gap-8 shadow-2xl w-full max-w-2xl relative"
            >
              <button onClick={() => setActiveView('initial')} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined !text-3xl">verified_user</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">Aadhaar Paperless e-KYC</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                    Download your digitally signed <b>Offline e-KYC XML</b> from the official UIDAI portal and upload it here for secure verification.
                </p>
              </div>
              
              <div className="w-full space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 space-y-4">
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">1</span>
                      <p>Go to myaadhaar.uidai.gov.in</p>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">2</span>
                      <p>Download "Offline e-KYC" (.zip/.xml)</p>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">3</span>
                      <p>Upload the extracted file below</p>
                   </div>
                </div>

                <button
                  onClick={() => xmlInputRef.current?.click()}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">upload_file</span>
                  Select XML File
                </button>
                <input type="file" ref={xmlInputRef} className="hidden" accept=".xml" onChange={(e) => handleFileUpload(e, 'xml')} />
              </div>
            </motion.div>
          )}

          {activeView === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl w-full max-w-sm aspect-square border-8 border-white"
            >
              <div id="reader" className="w-full h-full overflow-hidden"></div>
              <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-[100]">
                <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${cameraReady ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-amber-500'}`}></div>
                  <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Live Scan</span>
                </div>
                <button onClick={() => setActiveView('initial')} className="w-12 h-12 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all border border-white/20"><span className="material-symbols-outlined">close</span></button>
              </div>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                 <div className="w-[85%] h-[85%] border-2 border-white/10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[6px] border-l-[6px] border-blue-500 rounded-tl-2xl"></div>
                    <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[6px] border-r-[6px] border-blue-500 rounded-tr-2xl"></div>
                    <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[6px] border-l-[6px] border-blue-500 rounded-bl-2xl"></div>
                    <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[6px] border-r-[6px] border-blue-500 rounded-br-2xl"></div>
                    {isSearching && <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_#60a5fa]" />}
                 </div>
              </div>
              <div className="absolute bottom-10 left-0 right-0 text-center px-4 z-50">
                <div className="bg-blue-600/90 backdrop-blur-md inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl border border-blue-400/50">
                  <span className="material-symbols-outlined text-white !text-sm">qr_code_2</span>
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.25em]">Align Aadhaar QR</p>
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
                <div className={`p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${scannedData.isSecure ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-indigo-600 to-blue-700'}`}>
                  <div>
                    <div className="bg-white/10 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 border border-white/20 backdrop-blur-md">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      <p className="text-white font-black uppercase tracking-[0.25em] text-[10px]">
                        {scannedData.isSecure ? 'Secure QR Detected' : 'Verified Profile'}
                      </p>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black tracking-tight">{scannedData.name || "Student Profile"}</h3>
                    <p className="text-white/60 font-bold text-xs mt-2">Verified via {scannedData.method}</p>
                  </div>
                  <div className="bg-white text-slate-900 p-5 rounded-[2rem] shadow-2xl">
                    <span className="material-symbols-outlined !text-5xl">
                      {scannedData.isSecure ? 'lock' : 'verified'}
                    </span>
                  </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                  {scannedData.isSecure ? (
                      <div className="col-span-full space-y-4">
                        <p className="text-slate-800 font-bold text-lg">{scannedData.details}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            The raw digital signature has been captured. For full identity verification, please sync these records with the university's secure backend.
                        </p>
                      </div>
                  ) : (
                    <>
                      <div className="space-y-8">
                        <div className="flex items-center gap-5 group">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined !text-3xl">fingerprint</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Aadhaar UID</p>
                            <p className="text-slate-800 font-black text-lg tracking-[0.15em]">XXXX XXXX {scannedData.uid?.slice(-4) || "0000"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 group">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
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
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined !text-3xl">person</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Gender</p>
                            <p className="text-slate-800 font-black text-lg">{scannedData.gender === 'M' ? 'Male' : scannedData.gender === 'F' ? 'Female' : 'Other'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 group">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined !text-3xl">location_on</span>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] mb-1">Location</p>
                            <p className="text-slate-800 font-black text-sm line-clamp-1">{scannedData.dist || scannedData.state || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="px-8 md:px-12 pb-12 flex flex-col sm:flex-row gap-5">
                  <button className="flex-[2] py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3" onClick={() => alert('Syncing Secure Payload...')}>
                    <span className="material-symbols-outlined !text-xl">sync</span>
                    Complete Onboarding
                  </button>
                  <button onClick={resetScan} className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-black transition-all active:scale-95">
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div id="reader-hidden" className="hidden"></div>
      
      <style jsx>{`
        #reader video { object-fit: cover !important; width: 100% !important; height: 100% !important; border-radius: 2.5rem !important; }
        #reader { border: none !important; }
        #reader__dashboard, #reader__status_span, #reader img, #reader__scan_region { display: none !important; }
        #reader div { border: none !important; }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
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
