import React from 'react';

export const Badge = ({ children, className = "" }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white ${className}`}>
    {children}
  </span>
);
