import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone } from 'lucide-react';

const CAPITEC_DETAILS = {
  accountHolder: "Tech2Buddy",
  accountNumber: "1234567890",
  bankName: "Capitec Bank",
  branchCode: "470010",
  eftLink: "https://www.capitecbank.co.za/pay-me/tech2buddy"
};

const WHATSAPP_NUMBER = "27671732265";

export const CheckoutModal = ({ isOpen, onClose, cart, onComplete }) => {
  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  const completeOrder = () => {
    const message = encodeURIComponent(
      `🛒 *TECH2BUDDY ORDER*\n\n` +
      cart.map(i => `• ${i.name} x${i.quantity} (R${i.price})`).join('\n') +
      `\n\n*Total:* R${cartTotal.toFixed(2)}\n` +
      `*Status:* Payment Sent 🚀`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    onComplete();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="relative bg-zinc-900 w-full max-w-lg rounded-[4rem] p-12 shadow-2xl space-y-10 border border-white/10"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto text-blue-500">
                <CreditCard size={40} />
              </div>
              <h2 className="text-4xl font-black tracking-tighter italic">Checkout.</h2>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Instant Bank Transfer</p>
            </div>

            <div className="bg-black/50 rounded-[3rem] p-8 space-y-6 border border-white/5">
              <div className="grid grid-cols-2 gap-y-6">
                <div><p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Holder</p><p className="font-black text-lg">{CAPITEC_DETAILS.accountHolder}</p></div>
                <div><p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Number</p><p className="font-black text-lg underline decoration-blue-500">{CAPITEC_DETAILS.accountNumber}</p></div>
                <div><p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Total</p><p className="font-black text-2xl text-blue-400">R{cartTotal.toFixed(2)}</p></div>
              </div>
            </div>

            <div className="space-y-4">
              <button onClick={() => window.open(CAPITEC_DETAILS.eftLink, '_blank')} className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-3"><CreditCard size={20}/> Pay via Link</button>
              <button onClick={completeOrder} className="w-full py-6 bg-emerald-600 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 text-white"><Smartphone size={20}/> Proof on WhatsApp</button>
              <button onClick={onClose} className="w-full text-zinc-500 font-black uppercase text-[10px] tracking-widest transition-colors hover:text-white">Return to Bag</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
