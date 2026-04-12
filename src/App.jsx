import React, { useState, useEffect, useRef } from 'react';
import { Shield, Activity, MessageSquare, LayoutDashboard, Menu, X, Bell, Moon, Sun, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import Safety from './pages/Safety';
import Health from './pages/Health';
import MentalHealth from './pages/MentalHealth';
import Profile from './pages/Profile';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile',   label: 'My Profile',  icon: User },
  { id: 'safety',    label: 'Safety Hub',  icon: Shield },
  { id: 'health',    label: 'Health Suite', icon: Activity },
  { id: 'mental',    label: 'MindSpace',    icon: MessageSquare },
];

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const App = () => {
  const { userName } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState(localStorage.getItem('she360-theme') || 'dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('she360-theme', theme);
  }, [theme]);

  // Track window width
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // auto-close overlay on resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close overlay when navigating on mobile
  const handleNav = (id) => {
    setActiveTab(id);
    if (isMobile) setMobileOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerLabel = navItems.find(n => n.id === activeTab)?.label ?? 'Dashboard';

  return (
    <div className="app-shell">

      {/* ── Mobile Click-Away Overlay ── */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`sidebar${sidebarCollapsed && !isMobile ? ' collapsed' : ''}${isMobile && mobileOpen ? ' mobile-open' : ''}`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Shield size={22} color="white" />
          </div>
          <span className="sidebar-logo-text title-glow">SHE360 AI</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-btn${activeTab === item.id ? ' active' : ''}`}
              onClick={() => handleNav(item.id)}
              title={item.label}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              <span className="nav-btn-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <div className="sidebar-toggle">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
            </button>
          </div>
        )}
      </aside>

      {/* ── Main Content ── */}
      <div className={`main-content${sidebarCollapsed && !isMobile ? ' sidebar-collapsed' : ''}`}>

        {/* Header */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburger (mobile) */}
            {isMobile && (
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
                <Menu size={22} />
              </button>
            )}
            <div className="header-left">
              <h2>Welcome back, {userName || 'User'} 👋</h2>
              <p>{headerLabel} • Stay safe, stay healthy</p>
            </div>
          </div>

          <div className="header-right">
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button className="header-icon-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={18} />
                <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }} />
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '300px', background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '16px', zIndex: 1000, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Notifications</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '0.85rem', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>💜 MindSpace is here for you today!</div>
                      <div style={{ fontSize: '0.85rem', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>✅ Security tip: Keep SOS shortcut on home screen.</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button className="header-icon-btn" title="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            {/* Profile Avatar */}
            <div className="avatar" title="My Profile" onClick={() => handleNav('profile')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white' }}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" {...pageVariants}>
              <Dashboard />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" {...pageVariants}>
              <Profile />
            </motion.div>
          )}
          {activeTab === 'safety' && (
            <motion.div key="safety" {...pageVariants}>
              <Safety />
            </motion.div>
          )}
          {activeTab === 'health' && (
            <motion.div key="health" {...pageVariants}>
              <Health />
            </motion.div>
          )}
          {activeTab === 'mental' && (
            <motion.div key="mental" {...pageVariants}>
              <MentalHealth />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
