import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Calendar, CheckCircle2, ChevronRight, ChevronLeft,
  History, Pill, AlertCircle, RotateCcw, Thermometer, Droplets, Zap
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getPCOSPrediction, getAnemiaPrediction } from '../services/api';

const PCOS_QUESTIONS = [
  {
    key: 'irregularPeriods',
    label: 'Irregular Periods',
    desc: 'Is your menstrual cycle unpredictable, frequently late, or does it come less than 8 times a year?',
    icon: Calendar,
    color: 'var(--danger)',
  },
  {
    key: 'weightGain',
    label: 'Unexplained Weight Gain',
    desc: 'Have you experienced sudden weight gain, especially around your belly, without major diet changes?',
    icon: Activity,
    color: '#F6AD55',
  },
  {
    key: 'hairGrowth',
    label: 'Excess Hair Growth',
    desc: 'Do you notice unusual hair growth on your face, chest, or back (hirsutism)?',
    icon: Thermometer,
    color: 'var(--primary)',
  },
  {
    key: 'acne',
    label: 'Persistent Acne',
    desc: "Do you have stubborn, cystic acne that doesn't improve with regular skincare treatment?",
    icon: Droplets,
    color: 'var(--accent)',
  },
];

const ANEMIA_QUESTIONS = [
  { key: 'fatigue', label: 'Chronic Fatigue', desc: 'Do you feel unusually tired or exhausted most of the time?', icon: Zap, color: '#F6AD55' },
  { key: 'paleSkin', label: 'Pale Skin', desc: 'Have you or others noticed your skin, gums, or nails looking paler than usual?', icon: Activity, color: '#FF4B91' },
  { key: 'dizziness', label: 'Dizziness', desc: 'Do you frequently experience lightheadedness, especially when standing up quickly?', icon: AlertCircle, color: '#9D8DF1' },
];


const Health = () => {
  const { healthReports, addHealthReport } = useUser();
  const [activeView, setActiveView] = useState('wizard');
  const [step, setStep] = useState(0);
  const [assessmentType, setAssessmentType] = useState('PCOS');
  const [answers, setAnswers] = useState({
    irregularPeriods: null,
    weightGain: null,
    hairGrowth: null,
    acne: null,
    cycleLength: 28,
    fatigue: null,
    paleSkin: null,
    dizziness: null,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (key, val) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    setTimeout(() => setStep(s => s + 1), 300);
  };

  const currentQuestions = assessmentType === 'PCOS' ? PCOS_QUESTIONS : ANEMIA_QUESTIONS;
  
  const handleAnalyze = async () => {
    setLoading(true);
    let res;
    if (assessmentType === 'PCOS') {
      res = await getPCOSPrediction(answers);
      addHealthReport('PCOS Assessment', res);
    } else {
      res = await getAnemiaPrediction(answers);
      addHealthReport('Anemia Assessment', res);
    }
    setResult(res);
    setLoading(false);
    setStep(currentQuestions.length + (assessmentType === 'PCOS' ? 1 : 0)); // results view
  };

  const resetWizard = () => {
    setStep(0);
    setAnswers({ irregularPeriods: null, weightGain: null, hairGrowth: null, acne: null, cycleLength: 28, fatigue: null, paleSkin: null, dizziness: null });
    setResult(null);
  };

  const progressPct = Math.round((step / (currentQuestions.length + (assessmentType === 'PCOS' ? 1 : 0))) * 100);
  const riskColor = result?.risk_level === 'High' ? 'var(--danger)' : result?.risk_level === 'Moderate' ? '#F6AD55' : 'var(--accent)';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-container">

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
        {[{ id: 'wizard', label: '🩺 Assessment Wizard' }, { id: 'history', label: '📋 History' }].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            style={{
              padding: '10px 20px', border: 'none', borderRadius: '12px', cursor: 'pointer',
              background: activeView === tab.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.04)',
              color: activeView === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit',
              transition: 'var(--transition)', borderBottom: activeView === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeView === 'wizard' && !result && step === 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
          <button onClick={() => {setAssessmentType('PCOS'); resetWizard();}} className={assessmentType === 'PCOS' ? 'btn-primary' : ''} style={{ padding: '8px 16px', borderRadius: '8px', background: assessmentType === 'PCOS' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}>PCOS Assessment</button>
          <button onClick={() => {setAssessmentType('Anemia'); resetWizard();}} className={assessmentType === 'Anemia' ? 'btn-primary' : ''} style={{ padding: '8px 16px', borderRadius: '8px', background: assessmentType === 'Anemia' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}>Anemia Assessment</button>
        </div>
      )}


      <div className="grid-health">

        {/* Main Panel */}
        {activeView === 'wizard' ? (
          <div className="glass-card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', minHeight: '380px' }}>

            {/* Progress Bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'var(--glass-border)' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
              />
            </div>

            <AnimatePresence mode="wait">
              {/* Questions */}
              {step < currentQuestions.length && (
                <motion.div
                  key={`q-${step}`}
                  initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '2px' }}>
                    STEP {step + 1} OF {currentQuestions.length}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.2rem 0 0.5rem' }}>
                    <div style={{ background: `${currentQuestions[step].color}20`, padding: '12px', borderRadius: '14px' }}>
                      {React.createElement(currentQuestions[step].icon, { size: 28, color: currentQuestions[step].color })}
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentQuestions[step].label}</h2>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '480px' }}>
                    {currentQuestions[step].desc}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(currentQuestions[step].key, true)}
                      className="btn-primary"
                      style={{ padding: '14px 32px', fontSize: '1rem', flex: '1 1 140px' }}
                    >
                      <CheckCircle2 size={18} /> Yes, I have this
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleAnswer(currentQuestions[step].key, false)}
                      style={{
                        padding: '14px 32px', fontSize: '1rem', flex: '1 1 140px',
                        background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)',
                        borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                        transition: 'var(--transition)',
                      }}
                    >
                      No, I don't
                    </motion.button>
                  </div>

                  {step > 0 && (
                    <button
                      onClick={() => setStep(s => s - 1)}
                      style={{ marginTop: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                    >
                      <ChevronLeft size={16} /> Go back
                    </button>
                  )}
                </motion.div>
              )}

              {/* Analyze screen for Anemia */}
              {step === currentQuestions.length && assessmentType === 'Anemia' && !loading && !result && (
                <motion.div
                  key="anemia-analyze"
                  initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
                  style={{ textAlign: 'center' }}
                >
                  <Activity size={56} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.6rem' }}>Ready to Analyze?</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '2rem' }}>
                    Click below to generate your Anemia risk assessment.
                  </p>
                  
                  <button onClick={handleAnalyze} className="btn-primary" style={{ margin: '0 auto', padding: '14px 40px', fontSize: '1rem' }}>
                    <Zap size={18} /> Analyze with AI
                  </button>
                  <button onClick={() => setStep(s => s - 1)} style={{ marginTop: '1rem', display: 'block', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', margin: '1rem auto 0', fontSize: '0.85rem' }}>
                    ← Go back
                  </button>
                </motion.div>
              )}

              {/* Cycle Length (last question) */}
              {step === currentQuestions.length && assessmentType === 'PCOS' && !loading && !result && (
                <motion.div
                  key="cycle"
                  initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
                  style={{ textAlign: 'center' }}
                >
                  <Calendar size={56} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.6rem' }}>Average Cycle Length?</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '2rem' }}>
                    Normal range is 21–35 days. Enter your average.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '2rem' }}>
                    <button onClick={() => setAnswers(a => ({ ...a, cycleLength: Math.max(15, a.cycleLength - 1) }))}
                      style={{ background: 'var(--glass-border)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>−</button>
                    <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', minWidth: '80px', textAlign: 'center' }}>{answers.cycleLength}</span>
                    <button onClick={() => setAnswers(a => ({ ...a, cycleLength: Math.min(60, a.cycleLength + 1) }))}
                      style={{ background: 'var(--glass-border)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>days</p>

                  <button onClick={handleAnalyze} className="btn-primary" style={{ margin: '0 auto', padding: '14px 40px', fontSize: '1rem' }}>
                    <Zap size={18} /> Analyze with AI
                  </button>
                  <button onClick={() => setStep(s => s - 1)} style={{ marginTop: '1rem', display: 'block', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', margin: '1rem auto 0', fontSize: '0.85rem' }}>
                    ← Go back
                  </button>
                </motion.div>
              )}

              {/* Loading */}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '2rem' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }} style={{ display: 'inline-block' }}>
                    <Activity size={64} color="var(--primary)" />
                  </motion.div>
                  <h2 style={{ marginTop: '1.5rem' }}>AI Analyzing Symptoms...</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Running predictive model on your inputs</p>
                </motion.div>
              )}

              {/* Results */}
              {result && step === currentQuestions.length + (assessmentType === 'PCOS' ? 1 : 0) && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `${riskColor}20`, border: `4px solid ${riskColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    {result.risk_level === 'High'
                      ? <AlertCircle size={50} color={riskColor} />
                      : <CheckCircle2 size={50} color={riskColor} />
                    }
                  </div>

                  <h2 style={{ fontSize: '1.8rem' }}>Assessment Complete</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>{assessmentType} Risk Prediction</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '1.5rem 0' }}>
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Risk Level:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: riskColor }}>{result.risk_level}</span>
                    <span style={{ fontSize: '0.9rem', background: `${riskColor}20`, color: riskColor, padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
                      Score: {result.risk_score}/100
                    </span>
                  </div>

                  {/* Score Bar */}
                  <div style={{ margin: '0 auto 1.5rem', maxWidth: '320px' }}>
                    <div style={{ height: '10px', background: 'var(--glass-border)', borderRadius: '10px', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${result.risk_score}%` }} transition={{ duration: 1 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, var(--accent), ${riskColor})` }} />
                    </div>
                  </div>

                  <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{result.recommendation}</p>
                  </div>

                  <button onClick={resetWizard} className="btn-primary" style={{ margin: '0 auto', padding: '12px 32px' }}>
                    <RotateCcw size={16} /> Take Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* History View */
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={20} color="var(--primary)" /> Assessment History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
              {healthReports.length > 0
                ? healthReports.map((r) => {
                    const rc = r.result?.risk_level === 'High' ? 'var(--danger)' : r.result?.risk_level === 'Moderate' ? '#F6AD55' : 'var(--accent)';
                    return (
                      <div key={r.id} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', borderLeft: `4px solid ${rc}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700 }}>{r.type}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Risk:</span>
                          <span style={{ fontWeight: 800, color: rc }}>{r.result?.risk_level}</span>
                          {r.result?.risk_score && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Score: {r.result.risk_score}/100</span>}
                        </div>
                        {r.result?.recommendation && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
                            {r.result.recommendation}
                          </p>
                        )}
                      </div>
                    );
                  })
                : <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <History size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p>No reports yet. Complete your first assessment!</p>
                  </div>
              }
            </div>
          </div>
        )}

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(157,141,241,0.1), rgba(79,209,197,0.07))' }}>
            <Pill size={30} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3>Health Intelligence</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.65', marginTop: '10px' }}>
              Our AI runs a <b style={{ color: 'white' }}>Decision Tree model</b> based on clinically verified PCOS symptom data. Results are indicative — always consult a healthcare professional.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <Calendar size={22} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
            <h3>Assessment Schedule</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '1rem' }}>
              Recommended every 30 days for cycle monitoring
            </p>
            {healthReports.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Last Assessment</span>
                  <span style={{ color: 'var(--accent)' }}>{healthReports[0].date}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--glass-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: '30%', height: '100%', background: 'var(--primary)' }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>~21 days remaining</p>
              </>
            ) : (
              <button onClick={() => setActiveView('wizard')} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                Start Assessment →
              </button>
            )}
          </div>

          {/* Symptom Summary */}
          {step > 0 && activeView === 'wizard' && step < currentQuestions.length + 1 && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Your Answers So Far</h3>
              {currentQuestions.slice(0, step).map((q, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--glass-border)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{q.label}</span>
                  <span style={{ fontWeight: 700, color: answers[q.key] ? 'var(--danger)' : 'var(--accent)' }}>
                    {answers[q.key] ? 'Yes' : 'No'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Health;
