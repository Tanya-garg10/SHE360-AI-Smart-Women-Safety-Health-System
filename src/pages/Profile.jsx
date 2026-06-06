import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, MapPin, Activity, Edit3, Eye, Globe, Lock, Type, Contrast, Volume2, Layout } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { LANGUAGES, encryptVaultData, decryptVaultData } from '../utils/features';

const Profile = () => {
  const {
    userName, setUserName, contacts, healthReports,
    accessibility, setAccessibility, language, setLanguage,
    vaultData, setVaultData, unlockAchievement, safetyProfile, setSafetyProfile,
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [vaultPassphrase, setVaultPassphrase] = useState('');
  const [vaultContent, setVaultContent] = useState({ healthRecords: '', emergencyNotes: '', personalNotes: '' });
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultError, setVaultError] = useState('');

  const handleSave = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  const toggleAccessibility = (key) => {
    setAccessibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleVaultSave = async () => {
    if (!vaultPassphrase) { setVaultError('Enter a passphrase'); return; }
    try {
      const encrypted = await encryptVaultData(vaultContent, vaultPassphrase);
      setVaultData(encrypted);
      unlockAchievement('vault-secured');
      setVaultError('');
      setVaultUnlocked(false);
      setVaultPassphrase('');
    } catch { setVaultError('Encryption failed'); }
  };

  const handleVaultUnlock = async () => {
    if (!vaultPassphrase || !vaultData) { setVaultError('Enter passphrase to unlock'); return; }
    try {
      const decrypted = await decryptVaultData(vaultData, vaultPassphrase);
      setVaultContent(decrypted);
      setVaultUnlocked(true);
      setVaultError('');
    } catch { setVaultError('Wrong passphrase or corrupted data'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="grid-2col">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              aria-label="Edit profile name"
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-main)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <Edit3 size={16} />
            </button>

            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'white', border: '4px solid var(--bg-deep)' }}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
                <input value={tempName} onChange={(e) => setTempName(e.target.value)} aria-label="Your name" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', outline: 'none' }} autoFocus />
                <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 16px' }}>Save</button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{userName}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>SHE360 Premium Member</p>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Mail size={16} color="var(--primary)" /> <span>user@example.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Phone size={16} color="var(--primary)" /> <span>+91 98765 43210</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Calendar size={16} color="var(--primary)" /> <span>Joined Feb 2026</span>
              </div>
            </div>
          </div>

          {/* Accessibility Mode */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} color="var(--accent)" /> Accessibility Mode
            </h3>
            {[
              { key: 'largeText', label: 'Larger Text', icon: Type, desc: 'Increase font size across the app' },
              { key: 'highContrast', label: 'High Contrast', icon: Contrast, desc: 'Enhanced color contrast for visibility' },
              { key: 'screenReader', label: 'Screen Reader', icon: Volume2, desc: 'Optimize for screen reader navigation' },
              { key: 'simplifiedNav', label: 'Simplified Navigation', icon: Layout, desc: 'Cleaner, larger navigation buttons' },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <item.icon size={16} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAccessibility(item.key)}
                  role="switch"
                  aria-checked={accessibility[item.key]}
                  aria-label={`Toggle ${item.label}`}
                  style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: accessibility[item.key] ? 'var(--accent)' : 'var(--glass-border)', position: 'relative', transition: 'var(--transition)' }}
                >
                  <span style={{ position: 'absolute', top: '3px', left: accessibility[item.key] ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', transition: 'var(--transition)' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Multilingual Voice Support */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="var(--primary)" /> Multilingual Voice Support
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Voice commands and chatbot support in Indian languages
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  aria-label={`Select ${lang.label}`}
                  style={{
                    padding: '10px 12px', borderRadius: '10px', border: language === lang.code ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                    background: language === lang.code ? 'var(--primary-glow)' : 'rgba(255,255,255,0.03)',
                    color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: language === lang.code ? 700 : 400, textAlign: 'left',
                  }}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(157,141,241,0.1), rgba(79,209,197,0.05))' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Account Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                <Shield size={28} color="var(--accent)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{contacts.length}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Emergency Contacts</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                <Activity size={28} color="var(--primary)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{healthReports.length}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Health Reports</p>
              </div>
            </div>
          </div>

          {/* End-to-End Encrypted Data Vault */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--danger)" /> Encrypted Data Vault
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Secure health records, emergency contacts, and personal notes with AES-256 encryption
            </p>

            {vaultUnlocked ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <textarea placeholder="Health records..." value={vaultContent.healthRecords} onChange={e => setVaultContent({ ...vaultContent, healthRecords: e.target.value })} rows={2} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', resize: 'vertical' }} />
                <textarea placeholder="Emergency notes..." value={vaultContent.emergencyNotes} onChange={e => setVaultContent({ ...vaultContent, emergencyNotes: e.target.value })} rows={2} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', resize: 'vertical' }} />
                <textarea placeholder="Personal notes..." value={vaultContent.personalNotes} onChange={e => setVaultContent({ ...vaultContent, personalNotes: e.target.value })} rows={2} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', resize: 'vertical' }} />
                <input type="password" placeholder="Passphrase to encrypt" value={vaultPassphrase} onChange={e => setVaultPassphrase(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                <button onClick={handleVaultSave} className="btn-primary" style={{ padding: '10px 16px', alignSelf: 'flex-start' }}>🔐 Encrypt & Save</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input type="password" placeholder={vaultData ? 'Enter passphrase to unlock' : 'Create passphrase'} value={vaultPassphrase} onChange={e => setVaultPassphrase(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  {vaultData && <button onClick={handleVaultUnlock} className="btn-primary" style={{ padding: '8px 16px' }}>Unlock Vault</button>}
                  <button onClick={() => { setVaultUnlocked(true); setVaultContent({ healthRecords: '', emergencyNotes: '', personalNotes: '' }); }} style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>
                    {vaultData ? 'Create New' : 'Setup Vault'}
                  </button>
                </div>
              </div>
            )}
            {vaultError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '8px' }}>{vaultError}</p>}
            {vaultData && !vaultUnlocked && <p style={{ color: 'var(--accent)', fontSize: '0.75rem', marginTop: '8px' }}>🔒 Vault is encrypted and secured</p>}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--primary)" /> Security Settings
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Location Tracking</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700 }}>Enabled</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Voice AI Listener</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700 }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Offline Emergency Cache</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700 }}>Synced</span>
            </div>
            <div style={{ marginTop: '12px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Blood Group (for emergency)</label>
              <input value={safetyProfile.bloodGroup || ''} onChange={e => setSafetyProfile({ ...safetyProfile, bloodGroup: e.target.value })} placeholder="e.g. B+" style={{ width: '100%', marginTop: '4px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)' }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--danger)" /> Recent Saved Locations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Home', address: 'Sector 7, Dwarka', time: 'Active' },
                { name: 'Office', address: 'Cyber City, Gurugram', time: 'Last seen 5h ago' },
                { name: 'Gym', address: 'Fitness AI Club', time: 'Last seen 2d ago' },
              ].map((loc, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{loc.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{loc.address}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: loc.time === 'Active' ? 'var(--accent)' : 'var(--text-muted)' }}>{loc.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
