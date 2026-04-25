import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MapPin, Mic, MicOff, Phone, Share2, AlertTriangle, Plus, Trash2, Navigation, CheckCircle2, X, PhoneCall, Check, Route, Volume2, VolumeX, Camera, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUnsafeZones } from '../services/api';

const Safety = () => {
  const { contacts, setContacts } = useUser();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [voiceDetection, setVoiceDetection] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Click to get location');
  const [unsafeZones, setUnsafeZones] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showContactForm, setShowContactForm] = useState(false);
  const [sosStatus, setSosStatus] = useState('idle'); // idle | counting | sent
  const [shareStatus, setShareStatus] = useState('');
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(false);
  const [isScanningRoute, setIsScanningRoute] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [geoFenceAlert, setGeoFenceAlert] = useState(false);
  const [guardianModeActive, setGuardianModeActive] = useState(false);
  const [dangerPrediction, setDangerPrediction] = useState(null); // null | 'scanning' | 'alert'
  const [evidenceCapture, setEvidenceCapture] = useState(false);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    getUnsafeZones().then(setUnsafeZones);
  }, []);

  // SOS Countdown
  useEffect(() => {
    let timer;
    if (isSOSActive && countdown > 0) {
      setSosStatus('counting');
      timer = setInterval(() => setCountdown(p => p - 1), 1000);
    } else if (isSOSActive && countdown === 0) {
      setSosStatus('sent');
      setIsSOSActive(false);
      setEvidenceCapture(true); // Auto Evidence Capture
    }
    return () => clearInterval(timer);
  }, [isSOSActive, countdown]);

  const activateSOS = () => {
    if (sosStatus === 'sent') {
      // Reset
      setSosStatus('idle');
      setCountdown(5);
      setEvidenceCapture(false);
      return;
    }
    if (isSOSActive) {
      // Cancel
      setIsSOSActive(false);
      setSosStatus('idle');
      setCountdown(5);
      setEvidenceCapture(false);
      return;
    }
    setIsSOSActive(true);
    setCountdown(5);
  };

  // Share Location
  const shareLocation = () => {
    if (!navigator.geolocation) {
      setShareStatus('Geolocation not supported');
      return;
    }
    setShareStatus('Getting location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude.toFixed(5), lng: longitude.toFixed(5) });
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setLocationStatus(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setShareStatus('Location ready! ✓');
        const textToShare = `🆘 SHE360 SOS - My Location: ${mapsLink}`;

        if (navigator.share) {
          navigator.share({
            title: 'SHE360 Emergency SOS',
            text: textToShare,
          }).then(() => {
            setShareStatus('Shared! ✓');
            setTimeout(() => setShareStatus(''), 3000);
          }).catch((err) => {
            console.error('Share failed', err);
            setShareStatus('Share cancelled');
            setTimeout(() => setShareStatus(''), 3000);
          });
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(textToShare).then(() => {
            setShareStatus('Copied to clipboard! ✓');
            setTimeout(() => setShareStatus(''), 3000);
          });
        } else {
          setTimeout(() => setShareStatus(''), 3000);
        }
      },
      () => {
        setLocationStatus('Location access denied');
        setShareStatus('Permission denied');
        setTimeout(() => setShareStatus(''), 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Geo-Fencing Demo
  const triggerGeoFenceDemo = () => {
    if (unsafeZones.length > 0) {
      setLocation({ lat: unsafeZones[0].lat, lng: unsafeZones[0].lng });
      setLocationStatus(`📍 ${unsafeZones[0].lat}, ${unsafeZones[0].lng}`);
      setGeoFenceAlert(true);
      setGuardianModeActive(true);
      setTimeout(() => setGeoFenceAlert(false), 8000); // Hide banner after 8s
    }
  };

  // AI Danger Prediction Demo
  const triggerDangerPrediction = () => {
    setDangerPrediction('scanning');
    setTimeout(() => {
      setDangerPrediction('alert');
      setTimeout(() => setDangerPrediction(null), 8000);
    }, 2000);
  };

  // Voice Detection
  const toggleVoiceDetection = () => {
    if (voiceDetection) {
      recognitionRef.current?.stop();
      setVoiceDetection(false);
      return;
    }
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Try Chrome!');
      return;
    }
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.onstart = () => setVoiceDetection(true);
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join(' ')
        .toLowerCase();
      if (transcript.includes('help') || transcript.includes('danger') || transcript.includes('bachao')) {
        recognition.stop();
        setVoiceDetection(false);
        setIsSOSActive(true);
        setCountdown(5);
      }
    };
    recognition.onerror = () => setVoiceDetection(false);
    recognition.onend = () => setVoiceDetection(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setContacts([...contacts, { ...newContact }]);
      setNewContact({ name: '', phone: '' });
      setShowContactForm(false);
    }
  };

  const removeContact = (i) => setContacts(contacts.filter((_, idx) => idx !== i));

  const callContact = (phone) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  const handleCheckIn = (method = 'whatsapp') => {
    setCheckInStatus(true);
    
    if (contacts.length > 0) {
      // Append location if available
      const locText = location ? `\nMy location: https://maps.google.com/?q=${location.lat},${location.lng}` : '';
      const message = encodeURIComponent(`I reached safely! This is an automated message from SHE360 AI.${locText}`);
      
      if (method === 'whatsapp') {
        // Use the first contact's phone number for WhatsApp direct message
        const phone = contacts[0].phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      } else if (method === 'sms') {
        // Join all phone numbers for SMS
        const phoneNumbers = contacts.map(c => c.phone.replace(/\s/g, '')).join(',');
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const separator = isIOS ? '&' : '?';
        window.open(`sms:${phoneNumbers}${separator}body=${message}`, '_blank');
      }
    }

    setTimeout(() => setCheckInStatus(false), 3000);
  };

  const handleScanRoute = () => {
    setIsScanningRoute(true);
    setTimeout(() => {
      setIsScanningRoute(false);
      setRouteFound(true);
    }, 2500);
  };

  const toggleSiren = () => {
    if (sirenActive) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setSirenActive(false);
    } else {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return alert('Audio not supported in this browser');
      
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(400, ctx.currentTime); // starting frequency
      
      // Create a siren effect by modulating frequency
      setInterval(() => {
        if(ctx.state === 'running') {
          oscillator.frequency.setValueAtTime(400, ctx.currentTime);
          oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
        }
      }, 600);

      gainNode.gain.value = 1; // max volume
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      setSirenActive(true);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try { oscillatorRef.current.stop(); } catch (e) {}
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">

      {/* Geo-Fencing Banner */}
      <AnimatePresence>
        {geoFenceAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ 
              background: 'rgba(255,75,145,0.95)', backdropFilter: 'blur(10px)', color: 'white', 
              padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', 
              display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid var(--danger)',
              boxShadow: '0 10px 30px rgba(255,75,145,0.3)'
            }}
          >
            <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>Geo-Fence Alert: Unsafe Zone Entered</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                You are entering a known high-risk/low-light zone ({unsafeZones[0]?.reason || 'High density'}). 
                <strong> Live Guardian Mode has been auto-activated</strong> and your location is being shared with trusted contacts.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danger Prediction Banner */}
      <AnimatePresence>
        {dangerPrediction === 'alert' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ 
              background: 'rgba(246,173,85,0.95)', backdropFilter: 'blur(10px)', color: '#1a202c', 
              padding: '1.2rem', borderRadius: '12px', marginBottom: '1.5rem', 
              display: 'flex', alignItems: 'flex-start', gap: '12px', border: '1px solid #DD6B20',
              boxShadow: '0 10px 30px rgba(246,173,85,0.3)'
            }}
          >
            <Activity size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>AI Danger Prediction: High Risk Situation Detected</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.4', fontWeight: 600 }}>
                Stay Alert. Contextual analysis (Late Night + Low Light + Unusual Route) indicates potential danger. Proceed with caution.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid-safety">

        {/* ── Left: SOS + Contacts ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* SOS Button */}
          <div className="glass-card" style={{
            padding: '2rem', textAlign: 'center',
            background: isSOSActive ? 'rgba(255,75,145,0.07)' : sosStatus === 'sent' ? 'rgba(79,209,197,0.07)' : 'var(--bg-card)',
          }}>
            <h2 style={{ marginBottom: '0.5rem' }}>
              {sosStatus === 'sent' ? '✅ Alerts Sent!' : isSOSActive ? '⚠️ SOS Activating...' : 'Emergency SOS'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {isSOSActive ? `Sending in ${countdown}s — tap to cancel` : sosStatus === 'sent' ? `Alerted ${contacts.length} contacts` : 'Hold button to send SOS to your contacts'}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              onClick={activateSOS}
              style={{
                width: '160px', height: '160px', borderRadius: '50%',
                background: isSOSActive ? 'var(--danger)' : sosStatus === 'sent' ? '#4FD1C5' : 'rgba(255,75,145,0.1)',
                border: `6px solid ${isSOSActive ? 'rgba(255,255,255,0.3)' : sosStatus === 'sent' ? 'var(--accent)' : 'var(--danger)'}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: isSOSActive ? 'white' : sosStatus === 'sent' ? 'white' : 'var(--danger)',
                animation: isSOSActive ? 'sos-pulse 1s ease-in-out infinite' : 'none',
                margin: '0 auto',
              }}
            >
              {sosStatus === 'sent'
                ? <><CheckCircle2 size={50} /><span style={{ fontWeight: 700, marginTop: '6px', fontSize: '0.85rem' }}>SENT</span></>
                : isSOSActive
                ? <><ShieldAlert size={44} /><span style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1 }}>{countdown}</span></>
                : <><ShieldAlert size={50} /><span style={{ fontWeight: 700, marginTop: '8px' }}>SOS</span></>
              }
            </motion.button>

            {/* Action Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={toggleVoiceDetection}
                style={{
                  padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: voiceDetection ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                  color: 'white', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600,
                  animation: voiceDetection ? 'pulse-ring 1.5s infinite' : 'none',
                }}
              >
                {voiceDetection ? <><Mic size={16} /> Listening...</> : <><MicOff size={16} /> Voice Guard</>}
              </button>

              <button
                onClick={shareLocation}
                style={{
                  padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: 'rgba(79,209,197,0.12)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                <Share2 size={16} /> {shareStatus || 'Share Location'}
              </button>

              <button
                onClick={toggleSiren}
                style={{
                  padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: sirenActive ? 'rgba(255,75,145,0.2)' : 'rgba(255,255,255,0.06)', 
                  color: sirenActive ? 'var(--danger)' : 'white',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600,
                  animation: sirenActive ? 'pulse-ring 0.5s infinite' : 'none'
                }}
              >
                {sirenActive ? <VolumeX size={16} /> : <Volume2 size={16} />} 
                {sirenActive ? 'Stop Siren' : 'Loud Siren'}
              </button>

              {/* Fake Call Action Button */}
              <button
                onClick={() => setFakeCallActive(true)}
                style={{
                  padding: '10px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #A0AEC0, #718096)', color: 'white',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                <PhoneCall size={16} /> Fake Escape Call
              </button>
            </div>

            {location && (
              <p style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--accent)' }}>
                <MapPin size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                {locationStatus}
              </p>
            )}

            {voiceDetection && (
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '10px', animation: 'pulse-ring 2s infinite' }}>
                🎙️ Listening... say "Help", "Danger" or "Bachao"
              </p>
            )}

            {/* Auto Evidence Capture */}
            <AnimatePresence>
              {evidenceCapture && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginTop: '1.5rem' }}
                >
                  <div style={{ background: 'rgba(255,75,145,0.15)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--danger)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Camera size={16} /> Auto Evidence Capture Active
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li style={{ color: 'white' }}>Recording surrounding audio... <span style={{ color: 'var(--danger)', display: 'inline-block', animation: 'pulse-ring 1s infinite' }}>●</span></li>
                      <li style={{ color: 'white' }}>Capturing background camera shots...</li>
                      <li style={{ color: 'white' }}>Live location permanently logged.</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Emergency Contacts */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--primary)" /> Emergency Contacts
              </h3>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                style={{ background: 'var(--primary-glow)', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}
              >
                {showContactForm ? 'Cancel' : '+ Add'}
              </button>
            </div>

            <AnimatePresence>
              {showContactForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginBottom: '1rem', overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <input
                      placeholder="Name" value={newContact.name}
                      onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddContact()}
                      style={{ flex: '1 1 120px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <input
                      placeholder="Phone / Number" value={newContact.phone}
                      onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleAddContact()}
                      style={{ flex: '1 1 120px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button onClick={handleAddContact} className="btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }}>
                      Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>
                    {c.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.phone}</p>
                  </div>
                  <button onClick={() => callContact(c.phone)} title="Call" style={{ background: 'rgba(79,209,197,0.12)', border: 'none', color: 'var(--accent)', padding: '7px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Phone size={14} />
                  </button>
                  <button onClick={() => removeContact(i)} title="Remove" style={{ background: 'rgba(255,75,145,0.1)', border: 'none', color: 'var(--danger)', padding: '7px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {contacts.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem' }}>
                  No contacts yet. Add your first emergency contact!
                </p>
              )}
            </div>

            {/* Trusted Circle Integration: Safe Check-in */}
            {contacts.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>Send "I reached safe" via:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleCheckIn('whatsapp')}
                    className={checkInStatus ? "" : "btn-primary"}
                    style={{
                      flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                      background: checkInStatus ? 'rgba(79,209,197,0.1)' : '#25D366',
                      color: checkInStatus ? 'var(--accent)' : 'white', fontWeight: 700, transition: 'var(--transition)'
                    }}
                  >
                    {checkInStatus ? <><CheckCircle2 size={18} /> Sent!</> : <><Share2 size={18} /> WhatsApp</>}
                  </button>
                  <button
                    onClick={() => handleCheckIn('sms')}
                    className={checkInStatus ? "" : "btn-primary"}
                    style={{
                      flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                      background: checkInStatus ? 'rgba(79,209,197,0.1)' : 'var(--primary)',
                      color: checkInStatus ? 'var(--accent)' : 'white', fontWeight: 700, transition: 'var(--transition)'
                    }}
                  >
                    {checkInStatus ? <><CheckCircle2 size={18} /> Sent!</> : <><Check size={18} /> SMS (All)</>}
                  </button>
                </div>
                {checkInStatus && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>Opening messaging app to notify Trusted Circle</p>}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Map + Quick Help ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Guardian Map */}
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', minHeight: '360px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Navigation size={18} color="var(--accent)" /> Live Guardian Tracking
              </h3>
              
              {guardianModeActive ? (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,75,145,0.1)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--danger)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', animation: 'pulse-ring 1s infinite', display: 'inline-block' }} />
                  BROADCASTING LIVE
                </span>
              ) : (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />
                  STANDBY
                </span>
              )}
            </div>

            <div style={{ flex: 1, background: 'linear-gradient(160deg, #0d1120, #121624)', borderRadius: '18px', position: 'relative', overflow: 'hidden', minHeight: '240px' }}>
              {/* Grid pattern */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(157,141,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(157,141,241,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

              {/* Unsafe Zone Alerts */}
              <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {unsafeZones.slice(0, 2).map((z, i) => (
                  <div key={i} style={{ padding: '6px 12px', background: 'rgba(255,75,145,0.2)', border: '1px solid var(--danger)', borderRadius: '10px', backdropFilter: 'blur(10px)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={12} color="var(--danger)" />
                    <span>Zone {i + 1}: {z.reason}</span>
                  </div>
                ))}
              </div>

              {/* Center pulsing location */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  style={{ position: 'absolute', width: '140px', height: '140px', borderRadius: '50%', border: '2px dashed var(--primary)', pointerEvents: 'none' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px dashed var(--accent)', pointerEvents: 'none' }}
                />
                <div style={{ zIndex: 5, textAlign: 'center', color: 'var(--primary)' }}>
                  <MapPin size={36} fill="rgba(157,141,241,0.2)" />
                  <p style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {location ? `${location.lat}, ${location.lng}` : 'Home Sector 7'}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AI-Safe Zone</p>
                </div>
              </div>

              {/* AI Route Scanner Overlay */}
              <AnimatePresence>
                {(isScanningRoute || routeFound) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(5, 8, 16, 0.95)', backdropFilter: 'blur(4px)', zIndex: 20, display: 'flex', flexDirection: 'column', padding: '20px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'auto' }}>
                       <h4 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Route size={18} color="var(--primary)" /> AI Safe Navigation</h4>
                       <button onClick={() => setRouteFound(false)} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                     </div>
                     
                     {isScanningRoute ? (
                       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                         <div style={{ width: '40px', height: '40px', border: '3px solid rgba(157,141,241,0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                         <p style={{ color: 'var(--primary)', marginTop: '14px', fontWeight: 600, fontSize: '0.9rem' }}>Analyzing path safety metrics...</p>
                         <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>Checking crowd density & lighting</p>
                       </div>
                     ) : (
                       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                         <div style={{ background: 'rgba(255,75,145,0.1)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '12px' }}>
                           <h5 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px' }}><X size={14} /> Route A (Shortest: 12 mins)</h5>
                           <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px' }}>Avoid: Low lighting & isolated street reported.</p>
                         </div>
                         <div style={{ background: 'rgba(79,209,197,0.15)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '12px' }}>
                           <h5 style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} /> Route B (Safest: 15 mins)</h5>
                           <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px' }}>Recommended: Has active CCTV & high foot traffic. Rerouting map...</p>
                         </div>
                       </div>
                     )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom bar */}
              <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', padding: '10px 14px', background: 'rgba(0,0,0,0.5)', borderRadius: '12px', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', zIndex: 15 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Navigation size={16} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700 }}>Safe Path Active</p>
                    <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Well-lit route identified by AI</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setGuardianModeActive(!guardianModeActive)} style={{ padding: '7px 12px', border: '1px solid var(--accent)', borderRadius: '8px', background: guardianModeActive ? 'var(--accent)' : 'transparent', color: guardianModeActive ? 'var(--bg-card)' : 'var(--accent)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, transition: 'var(--transition)' }}>
                    {guardianModeActive ? 'STOP LIVE' : 'GO LIVE'}
                  </button>
                  <button onClick={triggerDangerPrediction} style={{ padding: '7px 12px', border: '1px solid #DD6B20', borderRadius: '8px', background: dangerPrediction === 'scanning' ? 'rgba(246,173,85,0.2)' : 'transparent', color: '#F6AD55', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, animation: dangerPrediction === 'scanning' ? 'pulse-ring 1s infinite' : 'none' }}>
                    {dangerPrediction === 'scanning' ? 'ANALYZING...' : 'PREDICT RISK'}
                  </button>
                  <button onClick={handleScanRoute} style={{ padding: '7px 12px', border: '1px solid var(--primary)', borderRadius: '8px', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>
                    SCAN ROUTE
                  </button>
                  <button onClick={triggerGeoFenceDemo} style={{ padding: '7px 12px', border: '1px solid var(--danger)', borderRadius: '8px', background: 'rgba(255,75,145,0.1)', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }} title="Demo Unsafe Zone Alert">
                    SIMULATE ZONE
                  </button>
                  <button
                    onClick={toggleVoiceDetection}
                    style={{ padding: '7px', border: 'none', borderRadius: '8px', background: voiceDetection ? 'var(--primary)' : 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', display: 'flex' }}
                  >
                    {voiceDetection ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help Numbers */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="var(--danger)" /> Quick Helplines
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Police', num: '100', color: '#4FD1C5' },
                { label: 'Women Helpline', num: '1091', color: '#FF4B91' },
                { label: 'Ambulance', num: '108', color: '#F6AD55' },
                { label: 'Cyber Crime', num: '1930', color: '#9D8DF1' },
              ].map((h, i) => (
                <a key={i} href={`tel:${h.num}`} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '10px 12px', background: `${h.color}10`, border: `1px solid ${h.color}30`, borderRadius: '12px', cursor: 'pointer', transition: 'var(--transition)' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = h.color}
                    onMouseOut={e => e.currentTarget.style.borderColor = `${h.color}30`}
                  >
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.label}</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: h.color }}>{h.num}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fake Call Overlay */}
      <AnimatePresence>
        {fakeCallActive && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#1c1c1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginTop: '-10vh' }}>
              <h2 style={{ fontSize: '2.5rem', color: 'white', fontWeight: 400, letterSpacing: '2px' }}>Mom Calling...</h2>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>Mobile</p>
            </div>
            
            <div style={{ display: 'flex', gap: '60px', marginTop: '40vh' }}>
              <button 
                onClick={() => setFakeCallActive(false)} 
                style={{ width: '75px', height: '75px', borderRadius: '50%', background: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)' }}
              >
                <Phone size={32} color="white" style={{ transform: 'rotate(135deg)' }} />
              </button>
              
              <button 
                onClick={() => setFakeCallActive(false)} 
                style={{ width: '75px', height: '75px', borderRadius: '50%', background: '#22C55E', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)', animation: 'pulse-ring 2s infinite' }}
              >
                <Phone size={32} color="white" />
              </button>
            </div>
            <p style={{ position: 'absolute', bottom: '30px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Tap either button to discreetly exit screen</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Safety;
