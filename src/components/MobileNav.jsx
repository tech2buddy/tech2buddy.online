import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Grid, ShoppingBag } from 'lucide-react';

// Added selectedCategory to the props list below
export const MobileNav = ({ view, setView, selectedCategory, setSelectedCategory, setIsCartOpen, cart }) => {
  return (
    <motion.div 
      initial={{ y: 120 }} 
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-full z-50 px-10 py-5 flex items-center gap-14"
    >
      <button 
        onClick={() => { setView('landing'); setSelectedCategory(null); }} 
        className={view === 'landing' ? 'text-blue-500' : 'text-zinc-500'}
      >
        <Menu size={26} />
      </button>

      <button 
        onClick={() => { setView('shop'); setSelectedCategory(null); }} 
        className={view === 'shop' && !selectedCategory ? 'text-blue-500' : 'text-zinc-500'}
      >
        <Grid size={26} />
      </button>

      <button onClick={() => setIsCartOpen(true)} className="text-zinc-500 relative">
        <ShoppingBag size={26} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 w-2.5 h-2.5 rounded-full border-2 border-zinc-900" />
        )}
      </button>
    </motion.div>
  );
};