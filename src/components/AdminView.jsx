import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unlock, X, Plus, Edit, Trash2, Upload, Loader2, FolderPlus, Package, Image as ImageIcon } from 'lucide-react';
import { addDoc, updateDoc, deleteDoc, doc, serverTimestamp, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const AdminView = ({ products, setView, db, appId, notify }) => {
  const [activeTab, setActiveTab] = useState('products'); 
  const [isUploading, setIsUploading] = useState(false);
  
  // Category State
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', image: '' });

  // Product State
  const [isEditing, setIsEditing] = useState(null);
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', description: '', images: [] 
  });

  const storage = getStorage();

  // --- Real-time Categories Sync ---
  useEffect(() => {
    if (!db) return;
    const catRef = collection(db, 'artifacts', appId, 'public', 'data', 'categories');
    const q = query(catRef, orderBy('name', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [db, appId]);

  // --- Multi-Purpose File Upload (iPhone Optimized) ---
  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setIsUploading(true);
    
    try {
      for (const file of files) {
        const sRef = ref(storage, `${type}/${appId}/${Date.now()}-${file.name}`);
        const snap = await uploadBytes(sRef, file);
        const url = await getDownloadURL(snap.ref);
        
        if (type === 'categories') {
          // Set single image for category cover
          setNewCat(prev => ({ ...prev, image: url }));
        } else {
          // Append to product image array
          setNewProduct(prev => ({ ...prev, images: [...prev.images, url] }));
        }
      }
      notify("Upload Complete! 📸");
    } catch (err) { 
      console.error(err);
      notify("Upload Failed"); 
    } finally { 
      setIsUploading(false); 
    }
  };

  // --- Save Category Logic ---
  const saveCategory = async () => {
    if (!newCat.name.trim() || !newCat.image) {
      return notify("Name and Image are required!");
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'categories'), {
        name: newCat.name,
        image: newCat.image,
        timestamp: serverTimestamp()
      });
      setNewCat({ name: '', image: '' });
      notify("Category Created! 📂");
    } catch (e) {
      notify("Error saving category.");
    }
  };

  // --- Save Product Logic ---
  const saveProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      return notify("Fill Name, Price and Category!");
    }
    try {
      const productData = { 
        ...newProduct, 
        timestamp: serverTimestamp(),
        updatedAt: Date.now() 
      };

      if (isEditing) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', isEditing.id), productData);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), productData);
      }
      
      setIsEditing(null);
      setNewProduct({ name: '', price: '', category: '', description: '', images: [] });
      notify("Product Synced! ✅");
    } catch (e) { 
      notify("Sync Failed."); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto px-4 md:px-6 mb-32 space-y-8 safe-p-top"
    >
      {/* Admin Header & iPhone-style Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Unlock size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Inventory Lab</h2>
          </div>
          <button onClick={() => setView('landing')} className="p-2.5 bg-zinc-900 rounded-full border border-white/5 active:scale-90">
            <X size={20} />
          </button>
        </div>

        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`flex-1 py-3 rounded-xl font-black text-xs tracking-widest transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            PRODUCTS
          </button>
          <button 
            onClick={() => setActiveTab('categories')} 
            className={`flex-1 py-3 rounded-xl font-black text-xs tracking-widest transition-all ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500'}`}
          >
            COLLECTIONS
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'categories' ? (
          <motion.div 
            key="cat-tab" 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Create Category Form */}
            <div className="space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                <FolderPlus size={18} className="text-blue-500"/> New Collection
              </h3>
              <div className="space-y-4 bg-zinc-900/30 p-5 rounded-[2rem] border border-white/5">
                 <label className="block cursor-pointer">
                    <div className="w-full h-48 rounded-[1.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden relative hover:border-blue-500/50 transition-colors bg-zinc-800/20">
                      {isUploading ? <Loader2 className="animate-spin text-blue-500" /> : 
                       newCat.image ? <img src={newCat.image} className="w-full h-full object-cover animate-in fade-in zoom-in-95" alt="Preview" /> : 
                       <div className="text-center p-4">
                         <Upload className="mx-auto mb-2 text-zinc-600" size={24}/>
                         <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Upload Cover Photo</p>
                       </div>}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'categories')} />
                    </div>
                 </label>
                 <input 
                   className="w-full bg-zinc-800/50 p-4 rounded-xl border border-white/5 outline-none font-bold text-white placeholder:text-zinc-600 focus:border-blue-500/50 transition-all" 
                   placeholder="Collection Title (e.g. Summer Drop)" 
                   value={newCat.name} 
                   onChange={e => setNewCat({...newCat, name: e.target.value})} 
                 />
                 <button 
                   onClick={saveCategory} 
                   disabled={isUploading} 
                   className="w-full py-4 bg-blue-600 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform disabled:opacity-50"
                 >
                   {isUploading ? 'Uploading...' : 'Create Collection'}
                 </button>
              </div>
            </div>

            {/* Category List (Bento Preview) */}
            <div className="grid grid-cols-2 gap-3 h-fit">
              {categories.map(cat => (
                <div key={cat.id} className="relative aspect-square rounded-[1.8rem] overflow-hidden group border border-white/5 shadow-xl">
                  <img src={cat.image} className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black via-transparent to-transparent">
                     <p className="font-black italic text-sm uppercase tracking-tighter leading-tight">{cat.name}</p>
                     <button 
                       onClick={() => confirm("Delete this collection?") && deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'categories', cat.id))} 
                       className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                     >
                       <Trash2 size={12} className="text-white"/>
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* --- Product Tab --- */
          <motion.div 
            key="prod-tab" 
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
              <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                {isEditing ? <Edit size={18} className="text-blue-500"/> : <Package size={18} className="text-blue-500"/>}
                {isEditing ? 'Modify Listing' : 'New Drop Entry'}
              </h3>
              <div className="space-y-4 bg-zinc-900/30 p-5 rounded-[2.5rem] border border-white/5">
                 {/* Multi-image Preview Grid */}
                 <div className="grid grid-cols-4 gap-2 mb-2">
                    <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-colors bg-zinc-800/20">
                      <Plus size={18} className="text-zinc-600"/>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'products')} />
                    </label>
                    {newProduct.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group shadow-md">
                        <img src={img} className="w-full h-full object-cover" alt="Product" />
                        <button 
                          onClick={() => setNewProduct({...newProduct, images: newProduct.images.filter((_, idx) => idx !== i)})} 
                          className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          <Trash2 size={14} className="text-white"/>
                        </button>
                      </div>
                    ))}
                 </div>

                 <input 
                   className="w-full bg-zinc-800/50 p-4 rounded-xl border border-white/5 outline-none font-bold text-white focus:border-blue-500/50 transition-all" 
                   placeholder="Item Name" 
                   value={newProduct.name} 
                   onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                 />
                 
                 <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" 
                      className="w-full bg-zinc-800/50 p-4 rounded-xl border border-white/5 outline-none font-bold text-white focus:border-blue-500/50" 
                      placeholder="Price (R)" 
                      value={newProduct.price} 
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                    />
                    <div className="relative">
                      <select 
                        className="w-full bg-zinc-800/50 p-4 rounded-xl border border-white/5 outline-none font-black text-[10px] uppercase tracking-widest text-white appearance-none h-full" 
                        value={newProduct.category} 
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option value="">Collection</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                 </div>

                 <textarea 
                   className="w-full bg-zinc-800/50 p-4 rounded-xl border border-white/5 outline-none font-bold text-white text-sm focus:border-blue-500/50" 
                   rows="4" 
                   placeholder="Product Specs & Description..." 
                   value={newProduct.description} 
                   onChange={e => setNewProduct({...newProduct, description: e.target.value})} 
                 />
                 
                 <button 
                   onClick={saveProduct} 
                   disabled={isUploading} 
                   className="w-full py-4 bg-blue-600 rounded-xl font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                   {isEditing ? 'Sync Changes' : 'Confirm Drop'}
                 </button>
                 
                 {isEditing && (
                   <button 
                     onClick={() => {
                        setIsEditing(null);
                        setNewProduct({ name: '', price: '', category: '', description: '', images: [] });
                     }} 
                     className="w-full text-[10px] font-black text-zinc-500 uppercase tracking-widest pt-2"
                   >
                     Discard Edits
                   </button>
                 )}
              </div>
            </div>

            {/* Live Inventory List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Live Inventory ({products.length})</h3>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-1 pb-20">
                 {products.map(p => (
                   <div key={p.id} className="bg-zinc-900/50 p-3 rounded-[1.5rem] flex items-center justify-between border border-white/5 group hover:border-blue-500/30 transition-colors">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden relative">
                         <img src={p.images?.[0] || p.image} className="w-full h-full object-cover" alt="Thumb" />
                         {p.images?.length > 1 && (
                            <div className="absolute bottom-0 right-0 bg-blue-600 px-1 rounded-tl-md text-[8px] font-black">+{p.images.length - 1}</div>
                         )}
                       </div>
                       <div>
                         <h4 className="font-black text-xs uppercase tracking-tighter line-clamp-1">{p.name}</h4>
                         <p className="text-[9px] text-blue-400 font-bold uppercase">R{p.price} • {p.category}</p>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => { 
                            setIsEditing(p); 
                            setNewProduct({...p, images: p.images || [p.image]}); 
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                         }} 
                         className="p-2.5 bg-zinc-800 rounded-full active:scale-90"
                       >
                         <Edit size={14} className="text-zinc-400"/>
                       </button>
                       <button 
                         onClick={() => confirm("Remove permanently?") && deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', p.id))} 
                         className="p-2.5 bg-red-500/10 rounded-full active:scale-90"
                       >
                         <Trash2 size={14} className="text-red-500"/>
                       </button>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};