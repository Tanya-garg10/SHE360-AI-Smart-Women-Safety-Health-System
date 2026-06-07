import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Shield, Heart, Activity, Trophy, Flame, Target, Star, CheckCircle2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ACHIEVEMENTS } from '../utils/features';

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const Insights = () => {
  const { moodHistory, healthReports, checkIns, challenges, toggleChallenge, achievements } = useUser();

  const analytics = useMemo(() => {
    const moodCounts = { Sunny: 0, Neutral: 0, Cloudy: 0 };
    moodHistory.forEach(m => { if (moodCounts[m.label] !== undefined) moodCounts[m.label]++; });
    const totalMoods = moodHistory.length || 1;
    const riskCounts = { High: 0, Moderate: 0, Low: 0 };
    healthReports.forEach(r => { if (riskCounts[r.result?.risk_level] !== undefined) riskCounts[r.result.risk_level]++; });
    const weekCheckIns = checkIns.filter(c => {
      const d = new Date(c.date);
      return (Date.now() - d) < 7 * 86400000;
    }).length;
    const wellnessScore = Math.min(100, checkIns.length * 5 + moodHistory.length * 8 + healthReports.length * 10);
    return { moodCounts, totalMoods, riskCounts, weekCheckIns, wellnessScore };
  }, [moodHistory, healthReports, checkIns]);

  const moodChart = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const recent = moodHistory.slice(-7);
    return days.map((d, i) => ({
      day: d,
      val: recent[i] ? (recent[i].label === 'Sunny' ? 3 : recent[i].label === 'Neutral' ? 2 : 1) : 0,
      mood: recent[i]?.label ?? '—',
    }));
  }, [moodHistory]);

  const unlockedAchievements = ACHIEVEMENTS.filter(a => achievements.includes(a.id));

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="page-container">
      {/* Header */}
      <motion.div variants={cardVariant} custom={0} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(100deg, rgba(157,141,241,0.12), rgba(79,209,197,0.06))', borderLeft: '4px solid var(--primary)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChart3 size={22} color="var(--primary)" /> Personal Analytics Dashboard
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
          Visual insights into your safety check-ins, mood patterns, health trends, and wellness progress
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid-layout" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Wellness Score', value: `${analytics.wellnessScore}%`, icon: TrendingUp, color: 'var(--primary)' },
          { label: 'Safety Check-ins (7d)', value: analytics.weekCheckIns, icon: Shield, color: 'var(--accent)' },
          { label: 'Mood Logs', value: moodHistory.length, icon: Heart, color: 'var(--danger)' },
          { label: 'Health Reports', value: healthReports.length, icon: Activity, color: '#F6AD55' },
        ].map((s, i) => (
          <motion.div key={i} variants={cardVariant} custom={i + 1} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <s.icon size={18} color={s.color} />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid-2col">
        {/* Mood & Health Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div variants={cardVariant} custom={5} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Heart size={16} color="var(--danger)" /> Mood Pattern Analysis
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', marginBottom: '1rem' }}>
              {moodChart.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: d.val ? `${d.val * 30}%` : '4px' }}
                    style={{ width: '100%', background: d.val === 3 ? 'var(--accent)' : d.val === 2 ? 'var(--primary)' : d.val === 1 ? 'var(--danger)' : 'var(--glass-border)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}
                  />
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{d.day}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(analytics.moodCounts).map(([mood, count]) => (
                <div key={mood} style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700 }}>{mood}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>{Math.round((count / analytics.totalMoods) * 100)}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardVariant} custom={6} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Activity size={16} color="var(--primary)" /> Health Risk Trends
            </h3>
            {healthReports.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {healthReports.slice(0, 5).map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', borderLeft: `3px solid ${r.result?.risk_level === 'High' ? 'var(--danger)' : r.result?.risk_level === 'Moderate' ? '#F6AD55' : 'var(--accent)'}` }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.type}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.date}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: r.result?.risk_level === 'High' ? 'var(--danger)' : r.result?.risk_level === 'Moderate' ? '#F6AD55' : 'var(--accent)' }}>
                      {r.result?.risk_level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem' }}>Complete a health assessment to see trends</p>
            )}
          </motion.div>

          {/* Safety Check-in Timeline */}
          <motion.div variants={cardVariant} custom={7} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Shield size={16} color="var(--accent)" /> Safety Check-in History
            </h3>
            {checkIns.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {checkIns.slice(0, 8).map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'rgba(79,209,197,0.06)', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={14} color="var(--accent)" />
                    <span>Safe check-in</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {new Date(c.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No check-ins yet — use Safety Hub to check in</p>
            )}
          </motion.div>
        </div>

        {/* Wellness Challenges & Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div variants={cardVariant} custom={8} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Target size={16} color="var(--primary)" /> Wellness Challenges
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Optional challenges to build healthy habits — mindfulness, exercise, hydration, and safety
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {challenges.map((c) => (
                <div key={c.id} style={{ padding: '12px', background: c.active ? 'rgba(157,141,241,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: c.active ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.3rem' }}>{c.icon}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleChallenge(c.id)}
                      style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, background: c.active ? 'var(--primary)' : 'rgba(255,255,255,0.08)', color: c.active ? 'white' : 'var(--text-muted)' }}
                    >
                      {c.active ? 'Active' : 'Join'}
                    </button>
                  </div>
                  {c.active && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{c.progress}/{c.target}</span>
                      </div>
                      <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(c.progress / c.target) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '4px', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardVariant} custom={9} className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Trophy size={16} color="#F6AD55" /> Achievements
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {ACHIEVEMENTS.map((a) => {
                const unlocked = achievements.includes(a.id);
                return (
                  <div key={a.id} style={{ padding: '12px', background: unlocked ? 'rgba(246,173,85,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', textAlign: 'center', opacity: unlocked ? 1 : 0.5, border: unlocked ? '1px solid #F6AD55' : '1px solid var(--glass-border)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{unlocked ? a.icon : '🔒'}</span>
                    <p style={{ fontWeight: 700, fontSize: '0.8rem', marginTop: '6px' }}>{a.title}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{a.desc}</p>
                  </div>
                );
              })}
            </div>
            {unlockedAchievements.length > 0 && (
              <div style={{ marginTop: '1rem', padding: '10px', background: 'rgba(246,173,85,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                <Flame size={16} color="#F6AD55" />
                <span>{unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements unlocked!</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Insights;
