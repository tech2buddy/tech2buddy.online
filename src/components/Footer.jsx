import React from 'react';
import { Instagram, Twitter, Facebook, Phone, Mail, MapPin } from 'lucide-react';

const LOGO_URL = "tfgtf-Photoroom.jpg"; // Replace with your actual logo URL or path
const WHATSAPP_NUMBER = "27671732265";
const EMAIL_ADDRESS = "Tech2buddy.online@gmail.com";

export const Footer = ({ onNavigate, onSetCategory }) => {
  return (
    <footer className="relative z-10 bg-black/60 backdrop-blur-3xl border-t border-white/5 pt-20 pb-24 md:pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_URL} 
                alt="Tech2Buddy Logo" 
                className="w-12 h-12 rounded-xl object-cover shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-xl font-black tracking-tighter uppercase">Tech2Buddy</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-medium">
              Style Meets Tech At Every Step. Your premium campus tech plug for high-quality gear and essential style.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Facebook size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Navigation</h4>
            <ul className="space-y-4">
              <li><button onClick={() => { onNavigate('landing'); onSetCategory(null); }} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold">Home</button></li>
              <li><button onClick={() => { onNavigate('shop'); onSetCategory(null); }} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold">The Vault</button></li>
              <li><button onClick={() => { onNavigate('about'); onSetCategory(null); }} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold">About Us</button></li>
              <li><button onClick={() => { onNavigate('shop'); onSetCategory('Style'); }} className="text-zinc-400 hover:text-white transition-colors text-sm font-bold">Style Collection</button></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6 md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Contact Us</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex items-center gap-4 group">
                  <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase">WhatsApp</p>
                    <p className="text-sm font-bold">067 173 2265</p>
                  </div>
                </a>
                <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center gap-4 group">
                  <div className="p-3 bg-purple-600/10 rounded-2xl text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase">Email Address</p>
                    <p className="text-sm font-bold truncate max-w-[180px]">{EMAIL_ADDRESS}</p>
                  </div>
                </a>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 bg-rose-600/10 rounded-2xl text-rose-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase">Location</p>
                    <p className="text-sm font-bold">South Africa, Online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            © 2024 Tech2Buddy. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Privacy</button>
            <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Terms</button>
            <button className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Refunds</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
