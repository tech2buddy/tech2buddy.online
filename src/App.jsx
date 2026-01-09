import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

// Component Imports
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { ShopView } from './components/ShopView';
import { AboutView } from './components/AboutView';
import { AdminView } from './components/AdminView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UnlockModal } from './components/UnlockModal';
import { Notification } from './components/Notification';
import { MobileNav } from './components/MobileNav';

// --- Firebase Configuration (Campus Buddy) ---
const firebaseConfig = {
  apiKey: "AIzaSyADVoTqpt1w9CY5aDjdP-MxtS89AQCF5C4",
  authDomain: "campus-buddy-7a449.firebaseapp.com",
  databaseURL: "https://campus-buddy-7a449-default-rtdb.firebaseio.com",
  projectId: "campus-buddy-7a449",
  storageBucket: "campus-buddy-7a449.firebasestorage.app",
  messagingSenderId: "379137706668",
  appId: "1:379137706668:web:7c82d0a7fbc7805e1b6d09",
  measurementId: "G-2S8JCFS6HW"
};

// Initialize Firebase services
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const appId = 'tech2buddy-catalog-v2'; 
export const ADMIN_PASSCODE = "2024";

const App = () => {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- iPhone Dynamic Height Fix ---
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Auth Effect ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Auth Error:", e);
        notify("Connection Issue. Check Firebase Settings.");
      }
    };
    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  // --- Real-time Products Sync ---
  useEffect(() => {
    if (!user || !db) return;
    const productsRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    const unsubProducts = onSnapshot(productsRef, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Error:", error);
    });
    return () => unsubProducts();
  }, [user]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    notify(`${product.name} bagged! 🛍️`);
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  }, [products]);

  const renderView = () => {
    switch (view) {
      case 'shop':
        return (
          <ShopView 
            products={sortedProducts} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            addToCart={addToCart} 
            setView={setView} 
            db={db}
            appId={appId}
          />
        );
      case 'about':
        return <AboutView setView={setView} />;
      case 'admin':
        return <AdminView products={sortedProducts} setView={setView} db={db} appId={appId} notify={notify} />;
      default:
        return <LandingView setView={setView} setSelectedCategory={setSelectedCategory} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/5 blur-[120px] rounded-full" />
      </div>

      <Header 
        view={view} 
        setView={setView} 
        setSelectedCategory={setSelectedCategory} 
        isAdminUnlocked={isAdminUnlocked} 
        setIsCartOpen={setIsCartOpen} 
        cart={cart} 
        setShowUnlockModal={setShowUnlockModal}
        scaleX={scaleX}
      />

      <main className="relative z-10 pt-24 flex-1">
        <AnimatePresence mode="wait">
          <motion.div 
            key={view} 
            className="w-full h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Conditional Footer: Hidden in Shop and Admin for better mobile flow */}
      {view !== 'admin' && view !== 'shop' && (
        <Footer onNavigate={setView} onSetCategory={setSelectedCategory} />
      )}

      <UnlockModal 
        isOpen={showUnlockModal} 
        onClose={() => setShowUnlockModal(false)} 
        onUnlock={() => {
          setIsAdminUnlocked(true);
          setShowUnlockModal(false);
          setView('admin');
          notify("Vault Access Granted! 🔓");
        }}
        notify={notify}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        setCart={setCart} 
        onCheckout={() => {
          setIsCheckingOut(true);
          setIsCartOpen(false);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckingOut} 
        onClose={() => setIsCheckingOut(false)} 
        cart={cart} 
        onComplete={() => {
          setCart([]);
          setIsCheckingOut(false);
          setView('landing');
        }}
      />

      <Notification message={notification} />
      
      <MobileNav 
        view={view} 
        setView={setView} 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
        setIsCartOpen={setIsCartOpen} 
        cart={cart} 
      />
    </div>
  );
};

export default App;