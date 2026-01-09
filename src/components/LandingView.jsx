import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const LandingView = ({ setView, setSelectedCategory }) => {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16 px-6 max-w-7xl mx-auto mb-20 overflow-x-hidden"
    >
      {/* --- HERO SECTION: Optimized for iPhone Viewport --- */}
      <div className="flex flex-col items-center text-center pt-10 md:pt-20">
        <motion.div variants={fadeUp} className="mb-6">
          <div className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            Your Ultimate Campus Plug
          </div>
        </motion.div>
        
        {/* Adjusted text size for Mobile to prevent overlap */}
        <motion.h1 variants={fadeUp} className="text-5xl md:text-[8rem] font-black tracking-tighter leading-[0.9] mb-6 uppercase">
          STYLE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 italic">MEETS</span> TECH
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-sm md:text-2xl text-zinc-400 font-medium max-w-md mb-10 leading-relaxed">
          At Every Step. Elevate your campus lifestyle with premium gear curated for the modern student.
        </motion.p>
        
        {/* BUTTONS: Stacked for Mobile, Row for Desktop */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => { setView('shop'); setSelectedCategory(null); }}
            className="w-full md:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
          >
            Explore Drops <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => { setView('shop'); setSelectedCategory('Latest'); }}
            className="w-full md:w-auto px-10 py-5 bg-zinc-900 text-white border border-white/10 rounded-2xl font-black text-sm uppercase active:scale-95 transition-all"
          >
            Latest Arrivals
          </button>
        </motion.div>
      </div>

      {/* --- BENTO SECTION: Vertical Stack on Mobile --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Image Card */}
        <motion.div variants={fadeUp} className="md:col-span-2 relative h-[350px] md:h-[400px] rounded-[2.5rem] overflow-hidden group border border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
            alt="Featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 space-y-2">
            <span className="px-3 py-1 bg-blue-600 text-[10px] font-black uppercase rounded-lg">Featured Drop</span>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Performance Pro</h2>
            <p className="text-zinc-400 text-xs">Unleash your study potential.</p>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div variants={fadeUp} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">Speed Verified</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              All our tech is tested for speed and reliability on campus networks.
            </p>
          </div>
          <div className="pt-6 border-t border-white/5">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Quality Guarantee</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};