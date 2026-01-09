import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import { Badge } from './Badge';

export const AboutView = ({ setView }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 max-w-5xl mx-auto space-y-24 mb-32"
    >
      <div className="text-center pt-20 space-y-8">
        <Badge className="bg-blue-600/20 border-blue-500/30 text-blue-400">Our Story</Badge>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">
          YOUR BUDDY IN <br/> <span className="text-zinc-600 italic">STYLE & TECH.</span>
        </h1>
        <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
          Founded with a singular mission: to ensure that every student has access to the high-performance tech they need, without sacrificing the style they want.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-10 bg-zinc-900/50 rounded-[3rem] border border-white/5 space-y-6">
          <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500">
            <Palette size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Pure Style</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">We believe tech shouldn't be boring. Our collections are hand-picked to match the aesthetic of the modern campus lifestyle.</p>
        </div>
        <div className="p-10 bg-zinc-900/50 rounded-[3rem] border border-white/5 space-y-6">
          <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Vetted Tech</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Quality is our baseline. Every laptop, phone, and accessory is speed-verified and tested for durability on campus.</p>
        </div>
        <div className="p-10 bg-zinc-900/50 rounded-[3rem] border border-white/5 space-y-6">
          <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <HeartHandshake size={24} />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Student-First</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">We started this for students. From payment links to WhatsApp support, every step of our process is built for your convenience.</p>
        </div>
      </div>

      <div className="relative rounded-[4rem] bg-gradient-to-br from-blue-600 to-blue-900 p-12 md:p-20 overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48 transition-transform group-hover:scale-110" />
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">THE TECH2BUDDY PROMISE.</h2>
          <p className="text-xl md:text-2xl font-medium text-blue-100/80 max-w-2xl leading-relaxed">
            "Style Meets Tech At Every Step" isn't just a slogan; it's how we operate. We source the gear, we verify the quality, and we deliver it with the style you deserve.
          </p>
          <button 
            onClick={() => setView('shop')}
            className="px-10 py-5 bg-white text-black rounded-full font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            Start Shopping <Zap size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
