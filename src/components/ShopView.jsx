import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';

export const ShopView = ({ products, selectedCategory, setSelectedCategory, addToCart, setView, db, appId }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  // Scroll function for "Jump to Next"
  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth * 0.8;
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!db) return;
    const catRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    const unsub = onSnapshot(catRef, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db, appId]);

  const currentSelection = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory, products]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 max-w-7xl mx-auto mb-32 space-y-6 relative z-10">
      {/* Header */}
      <header className="flex flex-row items-center justify-between pt-4">
        <div className="flex flex-row items-center gap-4">
          <button onClick={() => selectedCategory ? setSelectedCategory(null) : setView('landing')} className="p-3 bg-zinc-900 rounded-full border border-white/5">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-black tracking-tighter italic uppercase">{selectedCategory || "Collections"}</h1>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          /* --- BENTO GRID (Initial View) --- */
          <motion.div key="bento" className="grid grid-cols-3 gap-3 auto-rows-[120px]">
            {categories.map((cat, i) => (
              <div key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`relative overflow-hidden rounded-[1.5rem] cursor-pointer border border-white/5 ${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}`}>
                <img src={cat.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <h2 className="absolute bottom-3 left-3 text-[10px] font-black uppercase italic">{cat.name}</h2>
              </div>
            ))}
          </motion.div>
        ) : (
          /* --- CAROUSEL VIEW (The "Jump to Next" Style) --- */
          <motion.div key="carousel" className="relative group">
            {/* Desktop Navigation Arrows */}
            <button onClick={() => scroll('left')} className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 p-3 bg-white text-black rounded-full hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowLeft size={20}/>
            </button>
            <button onClick={() => scroll('right')} className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 p-3 bg-white text-black rounded-full hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={20}/>
            </button>

            {/* Horizontal Product Container */}
            <div 
              ref={scrollRef}
              className="flex flex-row gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 py-4"
            >
              {currentSelection.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => { setSelectedProduct(p); setActiveImgIndex(0); }}
                  className="min-w-[280px] w-[80vw] md:min-w-[320px] md:w-[25vw] snap-center cursor-pointer space-y-4"
                >
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl relative">
                    <img src={p.images?.[0] || p.image} className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/10">
                       <ArrowRight size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="px-2">
                    <h3 className="font-black text-sm uppercase tracking-tight">{p.name}</h3>
                    <p className="text-blue-500 font-bold italic text-sm">R {p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SIDE-BY-SIDE MODAL --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-row h-[55vh] md:h-[65vh]">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-[110] p-2 bg-white text-black rounded-full"><X size={16} /></button>
              
              <div className="w-1/2 bg-zinc-800/30 flex items-center justify-center p-4 border-r border-white/5">
                 <img src={selectedProduct.images?.[activeImgIndex] || selectedProduct.image} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
              </div>

              <div className="w-1/2 p-6 flex flex-col justify-between h-full bg-zinc-900">
                <div className="space-y-4">
                  <h2 className="text-2xl font-black italic uppercase leading-tight">{selectedProduct.name}</h2>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{selectedProduct.category}</p>
                  <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-4">{selectedProduct.description}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex flex-row items-center justify-between">
                  <p className="text-2xl font-black italic">R {selectedProduct.price}</p>
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="bg-blue-600 px-6 py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-600/20 active:scale-95 transition-all">ADD</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};