import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Shield, MapPin, Activity, Edit3 } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { userName, setUserName, contacts, healthReports } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    setUserName(tempName);
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="grid-2col">
        {/* Left Column: Profile Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-main)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
            >
              <Edit3 size={16} />
            </button>

            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'white', border: '4px solid var(--bg-deep)' }}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
                <input 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', outline: 'none' }} 
                  autoFocus
                />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pin Lock</span>
              <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', cursor: 'pointer' }}>Setup</button>
            </div>
          </div>
        </div>

        {/* Right Column: Account Stats */}
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
