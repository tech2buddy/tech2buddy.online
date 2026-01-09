import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, cart, setCart, onCheckout }) => {
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed top-4 right-4 bottom-4 w-full max-w-sm bg-zinc-900 z-[101] shadow-2xl rounded-[3rem] overflow-hidden flex flex-col border border-white/10"
          >
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter">Your Bag.</h2>
              <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:rotate-90 transition-transform"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-zinc-500 font-black italic text-2xl">Bag is Empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div layout key={item.id} className="flex gap-6">
                    <div className="w-24 h-28 bg-zinc-800 rounded-3xl overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-black text-lg tracking-tight leading-tight">{item.name}</h3>
                        <p className="text-blue-400 font-bold mt-1">R {item.price}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-white/5 rounded-full px-4 py-2 gap-5 border border-white/10">
                          <button onClick={() => updateQty(item.id, -1)} className="font-black">-</button>
                          <span className="text-sm font-black">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="font-black">+</button>
                        </div>
                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-red-500 text-[10px] font-black uppercase tracking-widest">Remove</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 bg-black/40 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Total Selection</span>
                  <p className="text-4xl font-black">R {cartTotal.toFixed(2)}</p>
                </div>
                <button onClick={onCheckout} className="w-full py-6 bg-blue-600 rounded-[2rem] font-black text-xl hover:scale-[1.02] transition-all text-white">Proceed</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
