import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Smile, Meh, Frown, Sparkles, Brain, BarChart3, Trash2, Bot, Wind, Play, Square, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getSentiment, getGroqChatResponse } from '../services/api';
import { generateWeeklyWellnessPlan, detectMessageLanguage, CHAT_GREETINGS, CHAT_FALLBACK, CHAT_PLACEHOLDERS } from '../utils/features';

const MOODS = [
  { label: 'Cloudy', icon: Frown, color: '#FF4B91', value: 1, emoji: '😔', tip: 'It\'s okay to feel this way. Let\'s talk about it.' },
  { label: 'Neutral', icon: Meh,   color: '#A0AEC0', value: 2, emoji: '😐', tip: 'A calm day. Small wins still count!' },
  { label: 'Sunny',  icon: Smile,  color: '#4FD1C5', value: 3, emoji: '😊', tip: 'You\'re doing great! Keep spreading that energy.' },
];

const getInitialMessages = (lang) => [
  { id: 1, text: CHAT_GREETINGS[lang] || CHAT_GREETINGS['en-IN'], sender: 'ai' },
];

const MentalHealth = () => {
  const { moodHistory, addMood, healthReports, wellnessPlan, setWellnessPlan, toggleWellnessTask, sleepHours, setSleepHours, activityLevel, setActivityLevel, language } = useUser();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('she360-chat');
      return saved ? JSON.parse(saved) : getInitialMessages(language);
    } catch { return getInitialMessages(language); }
  });
  const [lastReplyLang, setLastReplyLang] = useState(language);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [breathTimer, setBreathTimer] = useState(4);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Breathing Exercise Logic
  useEffect(() => {
    let interval;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathTimer(prev => {
          if (prev > 1) return prev - 1;
          
          // Switch phase
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathTimer(4);
    }
    return () => clearInterval(interval);
  }, [breathingActive, breathPhase]);

  useEffect(() => {
    localStorage.setItem('she360-chat', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Get sentiment (local fallback included in api.js)
    const sentimentResult = await getSentiment(text);
    const sentiment = sentimentResult?.sentiment || 'Neutral';

    // Auto-log mood
    if (sentiment === 'Positive') addMood('Sunny');
    else if (sentiment === 'Negative') addMood('Cloudy');

    const replyLang = detectMessageLanguage(text);
    setLastReplyLang(replyLang);

    const updatedHistory = [...messages, userMsg];
    const aiText = await getGroqChatResponse(updatedHistory, replyLang);

    if (aiText) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai', sentiment, lang: replyLang }]);
    } else {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: CHAT_FALLBACK[replyLang] || CHAT_FALLBACK['en-IN'], sender: 'ai', sentiment: 'Neutral', lang: replyLang }]);
    }
    setIsTyping(false);
  };

  const clearChat = () => {
    setMessages(getInitialMessages(language));
    localStorage.removeItem('she360-chat');
  };

  // Build chart data from last 7 mood entries
  const moodChartData = (() => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const recent = [...moodHistory].slice(-7);
    return days.map((d, i) => ({
      day: d,
      val: recent[i] ? (recent[i].label === 'Sunny' ? 3 : recent[i].label === 'Neutral' ? 2 : 1) : 0,
      label: recent[i]?.label ?? '—',
      color: recent[i]?.label === 'Sunny' ? '#4FD1C5' : recent[i]?.label === 'Neutral' ? '#9D8DF1' : recent[i]?.label === 'Cloudy' ? '#FF4B91' : 'rgba(255,255,255,0.08)',
    }));
  })();

  const lastMood = moodHistory[moodHistory.length - 1];
  const lastMoodDef = MOODS.find(m => m.label === lastMood?.label);

  const generatePlan = () => {
    const plan = generateWeeklyWellnessPlan(moodHistory, healthReports, sleepHours, activityLevel);
    setWellnessPlan(plan);
  };

  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">
      <div className="grid-mind">

        {/* ── Left: Breathing, Mood Tracker + Chart ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* 4-7-8 Breathing App */}
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(157,141,241,0.08), rgba(79,209,197,0.08))', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Wind size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem' }}>4-7-8 Breathing</h3>
            </div>
            
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Expanding Circle */}
              <motion.div
                animate={
                  !breathingActive ? { scale: 1, opacity: 0.1 } :
                  breathPhase === 'Inhale' ? { scale: 1.5, opacity: 0.3 } :
                  breathPhase === 'Hold' ? { scale: 1.5, opacity: 0.4 } :
                  { scale: 1, opacity: 0.1 }
                }
                transition={
                  breathPhase === 'Inhale' ? { duration: 4, ease: "linear" } :
                  breathPhase === 'Hold' ? { duration: 7, ease: "linear" } :
                  breathPhase === 'Exhale' ? { duration: 8, ease: "linear" } :
                  { duration: 0.5 }
                }
                style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)' }}
              />
              
              <div style={{ zIndex: 10, width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px solid var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(157,141,241,0.2)' }}>
                {breathingActive ? (
                  <>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{breathPhase}</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>{breathTimer}</span>
                  </>
                ) : (
                  <Wind size={32} color="var(--text-muted)" />
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setBreathingActive(!breathingActive)}
              className={breathingActive ? '' : 'btn-primary'}
              style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '12px', background: breathingActive ? 'rgba(255,255,255,0.05)' : '', border: breathingActive ? '1px solid var(--glass-border)' : 'none', color: 'white', cursor: 'pointer', fontWeight: 600, transition: 'var(--transition)' }}
            >
              {breathingActive ? <><Square size={16} /> Stop Exercise</> : <><Play size={16} /> Start Exercise</>}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5' }}>
              Inhale for 4s, hold for 7s, exhale for 8s. Clinically proven to reduce anxiety and promote sleep.
            </p>
          </div>

          {/* Mood Selector */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Brain size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem' }}>How are you feeling?</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {MOODS.map((m) => {
                const isActive = lastMood?.label === m.label;
                return (
                  <motion.button
                    key={m.label}
                    whileHover={{ y: -6, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { addMood(m.label); }}
                    style={{
                      flex: 1, background: isActive ? `${m.color}20` : 'rgba(255,255,255,0.03)',
                      border: `2px solid ${isActive ? m.color : 'transparent'}`,
                      borderRadius: '16px', cursor: 'pointer', padding: '14px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      transition: 'var(--transition)',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                    <m.icon size={18} color={isActive ? m.color : 'white'} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isActive ? m.color : 'var(--text-muted)' }}>
                      {m.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {lastMoodDef && (
              <motion.p
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}
              >
                {lastMoodDef.tip}
              </motion.p>
            )}
          </div>

          {/* 7-Day Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
              <BarChart3 size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '0.95rem' }}>7-Day Emotional Trend</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
              {moodChartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: d.val ? `${(d.val / 3) * 100}%` : '8px' }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    title={`${d.label}`}
                    style={{ width: '100%', background: d.color, borderRadius: '4px 4px 0 0', minHeight: '8px', cursor: 'help' }}
                  />
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', justifyContent: 'center' }}>
              {MOODS.map(m => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: m.color }} />
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Wellness Plans */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="var(--accent)" /> Adaptive Wellness Plan
              </h3>
              <button onClick={generatePlan} style={{ background: 'var(--primary-glow)', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={12} /> {wellnessPlan ? 'Refresh' : 'Generate'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sleep (hrs)</label>
                <input type="number" min="4" max="12" value={sleepHours} onChange={e => setSleepHours(Number(e.target.value))} style={{ width: '100%', marginTop: '2px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', fontSize: '0.85rem' }} />
              </div>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Activity</label>
                <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} style={{ width: '100%', marginTop: '2px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {wellnessPlan ? (
              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {wellnessPlan.map((day, di) => (
                  <div key={di} style={{ padding: '8px 0', borderBottom: di < 6 ? '1px solid var(--glass-border)' : 'none', opacity: di === todayIndex ? 1 : 0.7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: di === todayIndex ? 'var(--accent)' : 'var(--text-main)' }}>
                        {day.day} {di === todayIndex ? '(Today)' : ''}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{day.focus}</span>
                    </div>
                    {di === todayIndex && day.tasks.map((task, ti) => (
                      <button key={ti} onClick={() => toggleWellnessTask(di, ti)} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', textAlign: 'left', padding: '4px 0', background: 'none', border: 'none', color: task.done ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>
                        <CheckCircle2 size={12} color={task.done ? 'var(--accent)' : 'var(--glass-border)'} />
                        {task.task}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                Generate a personalized weekly plan based on your mood, health, sleep & activity
              </p>
            )}
          </div>

          {/* Mindful Reflection */}
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(157,141,241,0.07), rgba(79,209,197,0.05))', flex: 1 }}>
            <Sparkles size={22} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h3>Mindful Reflection</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.7', marginTop: '10px' }}>
              {moodHistory.length >= 3
                ? `You have logged your mood ${moodHistory.length} times. `
                : 'Start logging your mood daily to unlock insights. '}
              {lastMood
                ? `Your last mood was "${lastMood.label}". Regular check-ins help identify emotional triggers and patterns.`
                : 'Even a single daily check-in builds powerful emotional awareness over time.'
              }
            </p>
            {moodHistory.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['Sunny', 'Neutral', 'Cloudy']).map(mood => {
                  const count = moodHistory.filter(m => m.label === mood).length;
                  const def = MOODS.find(m => m.label === mood);
                  return count > 0 ? (
                    <div key={mood} style={{ padding: '4px 10px', background: `${def.color}20`, borderRadius: '20px', fontSize: '0.75rem', color: def.color, fontWeight: 700 }}>
                      {def.emoji} {mood}: {count}x
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Chat Interface ── */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, minHeight: '500px' }}>
          {/* Chat Header */}
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <Bot size={18} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem' }}>Mindful Assistant</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>● Online • Replies in your language ({lastReplyLang?.split('-')[0]?.toUpperCase() || 'EN'})</p>
            </div>
            <button
              onClick={clearChat}
              title="Clear conversation"
              style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{
                  maxWidth: '88%',
                  padding: '12px 16px',
                  borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user'
                    ? 'linear-gradient(135deg, var(--primary), #7E6EE0)'
                    : m.sentiment === 'Negative' ? 'rgba(255,75,145,0.08)'
                    : m.sentiment === 'Positive' ? 'rgba(79,209,197,0.08)'
                    : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.55',
                  boxShadow: m.sender === 'user' ? '0 4px 15px var(--primary-glow)' : 'none',
                  borderLeft: m.sender === 'ai' && m.sentiment ? `3px solid ${m.sentiment === 'Negative' ? 'var(--danger)' : m.sentiment === 'Positive' ? 'var(--accent)' : 'var(--primary)'}` : 'none',
                }}
              >
                {m.text}
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', borderRadius: '18px' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: '0.5rem 1.5rem 0', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {["I'm feeling anxious 😟", "मुझे बात करनी है 💬", "எனக்கு பேச வேண்டும் 💬", "আজ ভালো লাগছে 😊"].map(prompt => (
              <button
                key={prompt}
                onClick={() => { setInputValue(prompt); inputRef.current?.focus(); }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', transition: 'var(--transition)' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '1rem 1.5rem 1.5rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={CHAT_PLACEHOLDERS[lastReplyLang] || CHAT_PLACEHOLDERS[language] || CHAT_PLACEHOLDERS['en-IN']}
                rows={1}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                  borderRadius: '14px', padding: '12px 16px', color: 'white', outline: 'none',
                  fontFamily: 'inherit', fontSize: '0.9rem', resize: 'none', lineHeight: '1.4',
                  maxHeight: '100px', overflowY: 'auto',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="btn-primary"
                style={{ padding: '0', width: '46px', height: '46px', justifyContent: 'center', flexShrink: 0, opacity: inputValue.trim() ? 1 : 0.5 }}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MentalHealth;
