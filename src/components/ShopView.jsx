import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, Info, ShoppingBag, ArrowRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export const ShopView = ({ products, selectedCategory, setSelectedCategory, addToCart, setView, db, appId }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  // 1. Real-time Categories Sync
  useEffect(() => {
    if (!db) return;
    const catRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    const unsub = onSnapshot(catRef, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db, appId]);

  // 2. iPhone-Safe Scroll Locking
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      // Prevents the "rubber-band" effect on iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [selectedProduct]);

  const currentSelection = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="px-4 md:px-6 max-w-7xl mx-auto mb-32 space-y-8 md:space-y-12 relative z-10 safe-p-top"
    >
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => selectedCategory ? setSelectedCategory(null) : setView('landing')} 
            className="p-3 bg-zinc-900 rounded-full border border-white/5 active:scale-90 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase">
            {selectedCategory || "The Collections"}
          </h1>
        </div>
      </header>

      {/* --- BENTO CATEGORY GRID (Optimized for iPhone Aspect Ratios) --- */}
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div 
            key="bento"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[minmax(160px,_auto)] md:auto-rows-[240px]"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat.name)}
                className={`relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] cursor-pointer group border border-white/5 shadow-2xl ${
                  i === 0 ? 'min-h-[280px] md:col-span-2 md:row-span-2' : 'min-h-[180px]'
                }`}
              >
                <img 
                  src={cat.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                  <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">{cat.name}</h2>
                </div>
                <div className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-xl rounded-full md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <ArrowRight size={20} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* --- PRODUCT GRID (2 Columns on Mobile) --- */
          <motion.div 
            key="products"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6"
          >
            {currentSelection.map(p => (
              <motion.div 
                key={p.id} 
                variants={fadeUp} 
                initial="hidden" 
                animate="visible"
                onClick={() => { setSelectedProduct(p); setActiveImgIndex(0); }}
                className="group cursor-pointer space-y-3"
              >
                <div className="aspect-[4/5] rounded-[1.8rem] md:rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 relative">
                  <img src={p.images?.[0] || p.image} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full md:hidden">
                    <Info size={14} />
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-black text-sm md:text-lg leading-tight line-clamp-1 uppercase tracking-tight">{p.name}</h3>
                  <p className="text-blue-500 font-bold italic text-sm md:text-base">R {p.price}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PRODUCT LAB MODAL (iPhone 'dvh' Optimized) --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedProduct(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl" 
            />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl bg-zinc-900 border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row h-[92dvh] md:h-[80vh] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.5)]"
            >
              {/* iPhone Drag Indicator (Mobile Only) */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3 md:hidden shrink-0" />

              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-3 bg-white text-black rounded-full shadow-2xl active:scale-90"
              >
                <X size={20} />
              </button>

              {/* Media Section */}
              <div className="w-full md:w-1/2 bg-zinc-800/30 flex flex-col h-[40%] md:h-full border-b md:border-b-0 md:border-r border-white/5">
                <div className="flex-1 overflow-hidden flex items-center justify-center p-6 md:p-12">
                   <img src={selectedProduct.images?.[activeImgIndex] || selectedProduct.image} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                </div>
                {selectedProduct.images?.length > 1 && (
                  <div className="p-4 flex gap-2 justify-center overflow-x-auto no-scrollbar pb-6 md:pb-4">
                    {selectedProduct.images.map((img, i) => (
                      <button 
                        key={i} onClick={() => setActiveImgIndex(i)} 
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImgIndex === i ? 'border-blue-500 scale-105' : 'border-transparent opacity-40'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col h-[60%] md:h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 md:space-y-8">
                  <div>
                    <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1 block">Laboratory Entry</span>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tighter italic leading-none uppercase">{selectedProduct.name}</h2>
                    <div className="h-1 w-16 bg-blue-600 mt-4 md:mt-6 rounded-full" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-zinc-500 uppercase text-[10px] font-black tracking-[0.3em]">Description</p>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base font-medium pr-2">
                      {selectedProduct.description || "Premium technical artifact selected for the collection."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Authentic', 'Limited', 'Tech-Spec'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer of Modal - Sticky & Safe */}
                <div className="pt-4 md:pt-8 border-t border-white/5 flex items-center justify-between mt-auto bg-zinc-900 shrink-0 pb-safe">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[10px] font-black uppercase">Value</span>
                    <p className="text-2xl md:text-4xl font-black italic">R {selectedProduct.price}</p>
                  </div>
                  <button 
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} 
                    className="bg-blue-600 px-8 md:px-10 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black text-sm md:text-base hover:bg-blue-700 active:scale-95 shadow-xl shadow-blue-600/20 flex items-center gap-2"
                  >
                    <ShoppingBag size={18} /> BAG IT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};