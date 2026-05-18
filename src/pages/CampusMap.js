import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import campusMapImage from '../images/College MAP/map.png';

const CampusMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fade-in flex flex-col items-center pb-12">
      <div className="w-full">
        <h2 className="text-3xl font-bold mb-6 text-black text-left">Campus Map</h2>
      </div>
      
      {/* Larger interactive map container */}
      <div 
        className="relative bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center p-2 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl group"
        onClick={() => setIsExpanded(true)}
      >
        <img 
          src={campusMapImage} 
          alt="Campus Map" 
          className="w-full h-auto object-contain rounded-xl"
        />
        
        {/* Overlay icon to indicate clickability */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
          <div className="bg-white/90 text-gray-800 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999999] bg-black/90 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 transition-colors z-50 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={campusMapImage} 
              alt="Campus Map Fullscreen" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-zoom-out"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampusMap;
