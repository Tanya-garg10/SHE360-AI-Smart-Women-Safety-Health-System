import re

with open('/workspace/src/pages/Health.jsx', 'r') as f:
    content = f.read()

# Add getAnemiaPrediction import
content = content.replace("import { getPCOSPrediction } from '../services/api';", "import { getPCOSPrediction, getAnemiaPrediction } from '../services/api';")

# Rename QUESTIONS to PCOS_QUESTIONS and add ANEMIA_QUESTIONS
questions_def = """const PCOS_QUESTIONS = [
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
    desc: 'Do you have stubborn, cystic acne that doesn\'t improve with regular skincare treatment?',
    icon: Droplets,
    color: 'var(--accent)',
  },
];

const ANEMIA_QUESTIONS = [
  { key: 'fatigue', label: 'Chronic Fatigue', desc: 'Do you feel unusually tired or exhausted most of the time?', icon: Zap, color: '#F6AD55' },
  { key: 'paleSkin', label: 'Pale Skin', desc: 'Have you or others noticed your skin, gums, or nails looking paler than usual?', icon: Activity, color: '#FF4B91' },
  { key: 'dizziness', label: 'Dizziness', desc: 'Do you frequently experience lightheadedness, especially when standing up quickly?', icon: AlertCircle, color: '#9D8DF1' },
];
"""

content = re.sub(r'const QUESTIONS = \[.*?\];', questions_def, content, flags=re.DOTALL)

# Add assessmentType state
content = content.replace("const [step, setStep] = useState(0);", "const [step, setStep] = useState(0);\n  const [assessmentType, setAssessmentType] = useState('PCOS');")

# Modify answers initial state
content = content.replace("const [answers, setAnswers] = useState({\n    irregularPeriods: null,\n    weightGain: null,\n    hairGrowth: null,\n    acne: null,\n    cycleLength: 28,\n  });", "const [answers, setAnswers] = useState({\n    irregularPeriods: null,\n    weightGain: null,\n    hairGrowth: null,\n    acne: null,\n    cycleLength: 28,\n    fatigue: null,\n    paleSkin: null,\n    dizziness: null,\n  });")

# Use current_questions
content = content.replace("const Health = () => {", "const Health = () => {")
content = content.replace("const handleAnalyze = async () => {", """const currentQuestions = assessmentType === 'PCOS' ? PCOS_QUESTIONS : ANEMIA_QUESTIONS;
  
  const handleAnalyze = async () => {""")

content = content.replace("""  const handleAnalyze = async () => {
    setLoading(true);
    const res = await getPCOSPrediction(answers);
    setResult(res);
    addHealthReport('PCOS Assessment', res);
    setLoading(false);
    setStep(QUESTIONS.length + 1); // results view
  };""", """  const handleAnalyze = async () => {
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
  };""")

content = content.replace("QUESTIONS", "currentQuestions")

# Add assessment type selector
tab_switcher = """{/* Tab Switcher */}
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
      </div>"""

assessment_selector = tab_switcher + """
      {activeView === 'wizard' && !result && step === 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
          <button onClick={() => {setAssessmentType('PCOS'); resetWizard();}} className={assessmentType === 'PCOS' ? 'btn-primary' : ''} style={{ padding: '8px 16px', borderRadius: '8px', background: assessmentType === 'PCOS' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}>PCOS Assessment</button>
          <button onClick={() => {setAssessmentType('Anemia'); resetWizard();}} className={assessmentType === 'Anemia' ? 'btn-primary' : ''} style={{ padding: '8px 16px', borderRadius: '8px', background: assessmentType === 'Anemia' ? '' : 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}>Anemia Assessment</button>
        </div>
      )}
"""
content = content.replace(tab_switcher, assessment_selector)

# Fix cycle length logic to only show for PCOS
content = content.replace("""{/* Cycle Length (last question) */}
              {step === currentQuestions.length && !loading && !result && (""", """{/* Cycle Length (last question) */}
              {step === currentQuestions.length && assessmentType === 'PCOS' && !loading && !result && (""")

# Results title
content = content.replace("PCOS Risk Prediction", "{assessmentType} Risk Prediction")

# Fix progress pct
content = content.replace("const progressPct = Math.round((step / (currentQuestions.length + 1)) * 100);", "const progressPct = Math.round((step / (currentQuestions.length + (assessmentType === 'PCOS' ? 1 : 0))) * 100);")

# Fix reset wizard
content = content.replace("""setAnswers({ irregularPeriods: null, weightGain: null, hairGrowth: null, acne: null, cycleLength: 28 });""", """setAnswers({ irregularPeriods: null, weightGain: null, hairGrowth: null, acne: null, cycleLength: 28, fatigue: null, paleSkin: null, dizziness: null });""")

# Fix result step logic
content = content.replace("step === currentQuestions.length + 1", "step === currentQuestions.length + (assessmentType === 'PCOS' ? 1 : 0)")

with open('/workspace/src/pages/Health.jsx', 'w') as f:
    f.write(content)
