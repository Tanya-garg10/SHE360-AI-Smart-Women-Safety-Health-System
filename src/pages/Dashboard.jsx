import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Heart, Zap, MapPin, TrendingUp, Bell, BarChart3, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] } }),
};

const Dashboard = () => {
  const { moodHistory, healthReports, contacts, userName } = useUser();
  const lastMood = moodHistory[moodHistory.length - 1];
  const lastReport = healthReports[0];

  const stats = [
    {
      label: 'Safety Status',
      value: contacts.length > 0 ? 'Secure ✓' : 'Setup Needed',
      icon: Shield,
      color: '#4FD1C5',
      bg: 'rgba(79,209,197,0.08)',
      sub: `${contacts.length} contacts saved`,
    },
    {
      label: 'Health Reports',
      value: healthReports.length,
      icon: Activity,
      color: '#9D8DF1',
      bg: 'rgba(157,141,241,0.08)',
      sub: lastReport ? `Last: ${lastReport.result?.risk_level} risk` : 'No assessments yet',
    },
    {
      label: 'Mood Today',
      value: lastMood?.label ?? 'Not Logged',
      icon: Heart,
      color: '#FF4B91',
      bg: 'rgba(255,75,145,0.08)',
      sub: lastMood ? new Date(lastMood.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Log your mood →',
    },
    {
      label: 'AI Insights',
      value: 'Active',
      icon: Zap,
      color: '#F6AD55',
      bg: 'rgba(246,173,85,0.08)',
      sub: 'Personalized wellness tips',
    },
  ];

  // Build chart data from moodHistory (last 7)
  const chartData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const recent = [...moodHistory].slice(-7);
    return days.map((d, i) => ({
      day: d,
      val: recent[i] ? (recent[i].label === 'Sunny' ? 3 : recent[i].label === 'Neutral' ? 2 : 1) : Math.floor(Math.random() * 3) + 1,
      mood: recent[i]?.label ?? '—',
    }));
  })();

  const aiInsight = lastMood?.label === 'Cloudy'
    ? '💜 You logged feeling cloudy. Try a 5-min breathing exercise — it really helps!'
    : lastMood?.label === 'Sunny'
    ? '🌟 You\'re feeling great today! This is a perfect time to tackle an important task.'
    : healthReports.length > 0
    ? `📋 Your last PCOS assessment showed ${lastReport?.result?.risk_level} risk. ${lastReport?.result?.recommendation}`
    : '👋 Welcome to SHE360 AI! Start by adding emergency contacts in the Safety Hub, then complete your first health assessment.';

  return (
    <motion.div
      initial="hidden" animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="page-container"
    >
      {/* USP Banner */}
      <motion.div variants={cardVariant} custom={0} className="glass-card" style={{
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(100deg, rgba(157,141,241,0.12), rgba(79,209,197,0.06))',
        borderLeft: '4px solid var(--primary)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <Zap size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px' }}>SHE360 AI PLATFORM</p>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '2px' }}>
            AI-powered unified system — Safety · Health · Mental Wellness
          </h3>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid-layout" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <motion.div key={i} variants={cardVariant} custom={i + 1} className="glass-card" style={{ padding: '1.5rem', background: stat.bg, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{stat.label}</span>
              <div style={{ background: `${stat.color}22`, padding: '8px', borderRadius: '10px' }}>
                <stat.icon size={18} color={stat.color} />
              </div>
            </div>
            <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: stat.color }}>{stat.value}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{stat.sub}</p>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '3px', width: '50%', background: stat.color, borderRadius: '0 4px 4px 0', opacity: 0.6 }} />
          </motion.div>
        ))}
      </div>

      {/* Activity + AI Insight */}
      <div className="grid-activity">
        {/* Activity Feed */}
        <motion.div variants={cardVariant} custom={5} className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary)" /> Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {healthReports.slice(0, 4).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `3px solid ${r.result?.risk_level === 'High' ? 'var(--danger)' : r.result?.risk_level === 'Moderate' ? '#F6AD55' : 'var(--accent)'}` }}>
                <Activity size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.type}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.result?.risk_level} Risk • {r.date}</p>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: r.result?.risk_level === 'High' ? 'rgba(255,75,145,0.15)' : 'rgba(79,209,197,0.15)', color: r.result?.risk_level === 'High' ? 'var(--danger)' : 'var(--accent)', fontWeight: 700 }}>
                  {r.result?.risk_level}
                </span>
              </div>
            ))}
            {healthReports.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <Activity size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ fontSize: '0.9rem' }}>No activity yet. Complete a health assessment!</p>
              </div>
            )}
          </div>

          {/* Mini Mood Chart */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart3 size={14} color="var(--primary)" /> 7-Day Mood Trend
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px' }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${d.val * 28}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    title={`${d.day}: ${d.mood}`}
                    style={{
                      width: '100%',
                      background: d.val === 3 ? 'var(--accent)' : d.val === 2 ? 'var(--primary)' : 'var(--danger)',
                      borderRadius: '4px 4px 0 0', opacity: 0.7, cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Insight */}
        <motion.div variants={cardVariant} custom={6} className="glass-card" style={{
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(157,141,241,0.1), rgba(79,209,197,0.07))',
          display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-glow)', padding: '10px', borderRadius: '12px' }}>
              <Zap size={20} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem' }}>AI Wellness Insight</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personalized for you</p>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
            {aiInsight}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Wellness Score</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                {Math.min(100, contacts.length * 15 + healthReports.length * 20 + moodHistory.length * 5)}%
              </span>
            </div>
            <div style={{ height: '6px', background: 'var(--glass-border)', borderRadius: '10px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, contacts.length * 15 + healthReports.length * 20 + moodHistory.length * 5)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Contacts', val: contacts.length, icon: Users, color: 'var(--accent)' },
              { label: 'Reports', val: healthReports.length, icon: Activity, color: 'var(--primary)' },
              { label: 'Mood Logs', val: moodHistory.length, icon: Heart, color: 'var(--danger)' },
              { label: 'Days Active', val: Math.max(1, new Set(moodHistory.map(m => m.date?.split('T')[0])).size), icon: MapPin, color: '#F6AD55' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <item.icon size={14} color={item.color} />
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.label}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700 }}>{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
