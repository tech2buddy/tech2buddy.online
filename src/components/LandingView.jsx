import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Badge } from './Badge';

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
      className="space-y-32 px-6 max-w-7xl mx-auto mb-20"
    >
      <div className="flex flex-col items-center text-center pt-20">
        <motion.div variants={fadeUp} className="mb-6">
          <Badge className="bg-blue-600/20 border-blue-500/30 text-blue-400">
            Your Ultimate Campus Plug
          </Badge>
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] mb-8">
          STYLE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 italic">MEETS</span> TECH
        </motion.h1>
        
        <motion.p variants={fadeUp} className="text-lg md:text-2xl text-zinc-400 font-medium max-w-2xl mb-12">
          At Every Step. Elevate your campus lifestyle with premium gear curated for the modern student.
        </motion.p>
        
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => { setView('shop'); setSelectedCategory(null); }}
            className="px-10 py-5 bg-white text-black rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            Explore Drops <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => { setView('shop'); setSelectedCategory('Latest'); }}
            className="px-10 py-5 bg-zinc-900 text-white border border-white/10 rounded-full font-black text-lg hover:bg-zinc-800 transition-all"
          >
            Latest Arrivals
          </button>
        </motion.div>
      </div>

      {/* Bento Featured Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} className="md:col-span-2 relative h-[400px] rounded-[3rem] overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-10 space-y-2">
            <Badge>Featured Drop</Badge>
            <h2 className="text-4xl font-black">Performance Pro</h2>
            <p className="text-zinc-300">Unleash your study potential.</p>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black">Speed Verified</h3>
            <p className="text-zinc-400 text-sm">All our tech is tested for speed and reliability on campus networks.</p>
          </div>
          <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tech2Buddy Quality Guarantee</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
