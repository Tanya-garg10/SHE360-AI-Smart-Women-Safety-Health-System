import React, { useState, useEffect } from 'react';
import { Shield, Activity, MessageSquare, LayoutDashboard, Menu, X, Bell, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Safety from './pages/Safety';
import Health from './pages/Health';
import MentalHealth from './pages/MentalHealth';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
              <h2>Welcome back, User 👋</h2>
              <p>{headerLabel} • Stay safe, stay healthy</p>
            </div>
          </div>

          <div className="header-right">
            <button className="header-icon-btn" title="Notifications">
              <Bell size={18} />
            </button>
            <button className="header-icon-btn" title="Toggle theme">
              <Moon size={18} />
            </button>
            <div className="avatar" title="Profile" />
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" {...pageVariants}>
              <Dashboard />
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
