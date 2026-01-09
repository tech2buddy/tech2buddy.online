import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export const Notification = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div 
          initial={{ y: 60, opacity: 0, scale: 0.8 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 60, opacity: 0, scale: 0.8 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-full shadow-2xl z-[200] flex items-center gap-5 border border-white/10"
        >
          <div className="bg-blue-600 rounded-full p-1 text-white shadow-lg"><Check size={16} /></div>
          <span className="font-black tracking-tight text-sm uppercase">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
