import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ADMIN_PASSCODE } from '../App';

export const UnlockModal = ({ isOpen, onClose, onUnlock, notify }) => {
  const [passcodeInput, setPasscodeInput] = useState('');

  const verifyPasscode = () => {
    if (passcodeInput === ADMIN_PASSCODE) {
      onUnlock();
      setPasscodeInput('');
    } else {
      notify("Invalid Code 🔒");
      setPasscodeInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-zinc-900 border border-white/10 w-full max-w-xs rounded-[4rem] p-12 shadow-2xl space-y-8 text-center"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tighter">Vault Lock</h3>
            <input 
              autoFocus 
              type="password" 
              maxLength={4}
              className="w-full bg-white/5 border-none text-center text-5xl font-black text-white tracking-[1.5rem] py-6 rounded-3xl focus:ring-2 focus:ring-blue-500 placeholder:text-white/5 outline-none"
              placeholder="****"
              value={passcodeInput}
              onChange={e => setPasscodeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyPasscode()}
            />
            <button onClick={verifyPasscode} className="w-full py-5 bg-white text-black rounded-3xl font-black transition-all hover:scale-[1.02] active:scale-95">Authorize</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
