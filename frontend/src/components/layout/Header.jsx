import { Bell, Search, UserCircle2, Globe, Check, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { batches, varieties, tests, currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('seedlab_notifications');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: "Batch CRIM-250110-089 low on stock", read: false, time: "2 hours ago" },
      { id: 2, text: "Test TEST-2508-01 successfully completed", read: false, time: "5 hours ago" },
      { id: 3, text: "New user registered: Alex Rivera", read: true, time: "1 day ago" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('seedlab_notifications', JSON.stringify(notifications));
  }, [notifications]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const lowerQuery = searchQuery.toLowerCase();
    const results = [];
    
    batches.forEach(b => {
      if (b.id.toLowerCase().includes(lowerQuery) || b.variety.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'Batch', id: b.id, name: b.variety, path: '/inventory' });
      }
    });

    varieties.forEach(v => {
      if (v.name.toLowerCase().includes(lowerQuery) || v.code.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'Variety', id: v.code, name: v.name, path: '/catalog' });
      }
    });

    tests.forEach(t => {
      if (t.id.toLowerCase().includes(lowerQuery) || t.batch.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'Test', id: t.id, name: `Batch: ${t.batch}`, path: '/lab' });
      }
    });

    return results.slice(0, 5);
  };

  const searchResults = getSearchResults();

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-24 border-b border-border bg-card/30 backdrop-blur-lg flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center w-96 relative" ref={searchRef}>
        <Search className="w-4 h-4 absolute left-3 text-text-muted" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
          placeholder="Search..." 
          className="w-full bg-background border border-border rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan/50 transition-all text-text-main placeholder:text-text-muted/50"
        />
        <AnimatePresence>
          {showSearchResults && searchQuery.trim() && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-full bg-[#0a192f] border border-border rounded-lg shadow-xl overflow-hidden z-50"
            >
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-text-muted text-sm">No results found</div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((res, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchQuery("");
                        navigate(res.path);
                      }}
                      className="p-3 border-b border-border/50 hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">{res.id}</p>
                        <p className="text-xs text-text-muted">{res.name}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-card border border-border text-primary-cyan">
                        {res.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative" ref={dropdownRef}>
          <button 
            className="relative text-text-muted hover:text-white transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-4 w-80 bg-[#0a192f] border border-border rounded-lg shadow-xl overflow-hidden z-50"
              >
                <div className="flex justify-between items-center p-3 border-b border-border bg-[#06111f]">
                  <h4 className="text-white text-sm font-semibold">Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-primary-cyan hover:text-white transition-colors">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {unreadCount === 0 ? (
                    <div className="p-4 text-center text-text-muted text-sm">No new notifications</div>
                  ) : (
                    unreadNotifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif.id)}
                        className="p-3 border-b border-border/50 hover:bg-white/5 transition-colors flex justify-between gap-2 cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-white">{notif.text}</p>
                          <p className="text-xs text-text-muted mt-1">{notif.time}</p>
                        </div>
                        <div className="text-primary-cyan p-1 self-start">
                          <span className="w-2 h-2 bg-primary-cyan rounded-full inline-block"></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center pl-6 border-l border-border cursor-pointer group relative">
          <div className="text-right mr-3 hidden md:block">
            <p className="text-sm font-semibold text-white">{currentUser?.name || 'User'}</p>
            <p className="text-xs text-primary-cyan">{currentUser?.role || 'Guest'}</p>
          </div>
          <UserCircle2 className="w-8 h-8 text-text-muted group-hover:text-white transition-colors" />
          
          <div className="absolute top-full right-0 mt-2 w-32 bg-[#0a192f] border border-border rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button 
              onClick={() => { logout(); navigate('/login'); }} 
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
