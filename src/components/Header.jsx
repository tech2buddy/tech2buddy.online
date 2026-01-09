import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Settings } from 'lucide-react';

const LOGO_URL = "tfgtf-Photoroom.jpg"; // Replace with your actual logo URL or path

export const Header = ({ view, setView, setSelectedCategory, isAdminUnlocked, setIsCartOpen, cart, setShowUnlockModal, scaleX }) => {
  const lastTapRef = useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      if (isAdminUnlocked) setView('admin');
      else setShowUnlockModal(true);
    }
    lastTapRef.current = now;
  };

  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[100] origin-left" style={{ scaleX }} />
      <nav className="fixed top-0 w-full bg-[#0A0A0B]/80 backdrop-blur-2xl z-50 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img 
              src={LOGO_URL} 
              alt="Tech2Buddy Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-blue-500/10"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tighter uppercase leading-none">Tech2Buddy</span>
              <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-1">Plug. Style. Tech.</span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => { setView('landing'); setSelectedCategory(null); }}
                className={`text-[10px] font-black uppercase tracking-widest transition-all ${view === 'landing' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => { setView('shop'); setSelectedCategory(null); }}
                className={`text-[10px] font-black uppercase tracking-widest transition-all ${view === 'shop' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => { setView('about'); setSelectedCategory(null); }}
                className={`text-[10px] font-black uppercase tracking-widest transition-all ${view === 'about' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}
              >
                About Us
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isAdminUnlocked && (
                <button onClick={() => setView('admin')} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <Settings size={18} />
                </button>
              )}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-white/5 rounded-full border border-white/10 hover:border-white/20 transition-all"
              >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shadow-lg">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
