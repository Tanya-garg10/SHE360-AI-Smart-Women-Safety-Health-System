import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CHALLENGES, DEFAULT_SAFE_SPACES, cacheEmergencyData } from '../utils/features';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const getSaved = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [contacts, setContacts] = useState(() => getSaved('emergency-contacts', [
    { name: 'Home', phone: '+91 99999 00001', role: 'family' },
    { name: 'Police Helpline', phone: '112', role: 'guardian' },
  ]));

  const [moodHistory, setMoodHistory] = useState(() => getSaved('mood-history', []));
  const [healthReports, setHealthReports] = useState(() => getSaved('health-reports', []));
  const [userName, setUserName] = useState(() => getSaved('user-name', 'User'));

  const [safetyProfile, setSafetyProfile] = useState(() => getSaved('safety-profile', {
    routine: 'office',
    travelAlone: true,
    lateNightCommute: false,
    publicTransport: true,
    bloodGroup: '',
    medicalNotes: '',
  }));

  const [accessibility, setAccessibility] = useState(() => getSaved('accessibility', {
    largeText: false,
    highContrast: false,
    screenReader: false,
    simplifiedNav: false,
  }));

  const [language, setLanguage] = useState(() => getSaved('language', 'en-IN'));
  const [safeSpaces] = useState(DEFAULT_SAFE_SPACES);
  const [checkIns, setCheckIns] = useState(() => getSaved('check-ins', []));
  const [commuteEvents, setCommuteEvents] = useState(() => getSaved('commute-events', []));
  const [wellnessPlan, setWellnessPlan] = useState(() => getSaved('wellness-plan', null));
  const [challenges, setChallenges] = useState(() => getSaved('challenges', DEFAULT_CHALLENGES.map(c => ({ ...c, progress: 0, active: false }))));
  const [achievements, setAchievements] = useState(() => getSaved('achievements', []));
  const [vaultData, setVaultData] = useState(() => getSaved('vault-data', null));
  const [sleepHours, setSleepHours] = useState(() => getSaved('sleep-hours', 7));
  const [activityLevel, setActivityLevel] = useState(() => getSaved('activity-level', 'moderate'));

  useEffect(() => localStorage.setItem('emergency-contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('mood-history', JSON.stringify(moodHistory)), [moodHistory]);
  useEffect(() => localStorage.setItem('health-reports', JSON.stringify(healthReports)), [healthReports]);
  useEffect(() => localStorage.setItem('user-name', JSON.stringify(userName)), [userName]);
  useEffect(() => localStorage.setItem('safety-profile', JSON.stringify(safetyProfile)), [safetyProfile]);
  useEffect(() => localStorage.setItem('accessibility', JSON.stringify(accessibility)), [accessibility]);
  useEffect(() => localStorage.setItem('language', JSON.stringify(language)), [language]);
  useEffect(() => localStorage.setItem('check-ins', JSON.stringify(checkIns)), [checkIns]);
  useEffect(() => localStorage.setItem('commute-events', JSON.stringify(commuteEvents)), [commuteEvents]);
  useEffect(() => localStorage.setItem('wellness-plan', JSON.stringify(wellnessPlan)), [wellnessPlan]);
  useEffect(() => localStorage.setItem('challenges', JSON.stringify(challenges)), [challenges]);
  useEffect(() => localStorage.setItem('achievements', JSON.stringify(achievements)), [achievements]);
  useEffect(() => { if (vaultData) localStorage.setItem('vault-data', JSON.stringify(vaultData)); }, [vaultData]);
  useEffect(() => localStorage.setItem('sleep-hours', JSON.stringify(sleepHours)), [sleepHours]);
  useEffect(() => localStorage.setItem('activity-level', JSON.stringify(activityLevel)), [activityLevel]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-large-text', accessibility.largeText ? 'true' : 'false');
    root.setAttribute('data-high-contrast', accessibility.highContrast ? 'true' : 'false');
    root.setAttribute('data-simplified-nav', accessibility.simplifiedNav ? 'true' : 'false');
    root.setAttribute('data-screen-reader', accessibility.screenReader ? 'true' : 'false');
    root.setAttribute('lang', language);
  }, [accessibility, language]);

  // Cache emergency data for offline mode
  useEffect(() => {
    cacheEmergencyData(contacts, { ...safetyProfile, userName });
  }, [contacts, safetyProfile, userName]);

  const addMood = (label) => {
    const newEntry = { date: new Date().toISOString(), label };
    setMoodHistory(prev => [...prev.slice(-6), newEntry]);
    updateChallengeProgress('mood');
  };

  const addHealthReport = (type, result) => {
    const newReport = { id: Date.now(), type, result, date: new Date().toLocaleDateString() };
    setHealthReports(prev => [newReport, ...prev]);
  };

  const addCheckIn = () => {
    const entry = { date: new Date().toISOString(), type: 'safe' };
    setCheckIns(prev => [entry, ...prev.slice(0, 29)]);
    updateChallengeProgress('safety');
    if (checkIns.length === 0) unlockAchievement('first-checkin');
  };

  const updateChallengeProgress = (type) => {
    setChallenges(prev => prev.map(c => {
      if (c.active && c.type === type && c.progress < c.target) {
        const newProgress = c.progress + 1;
        if (newProgress >= c.target) unlockAchievement('wellness-complete');
        return { ...c, progress: newProgress };
      }
      return c;
    }));
  };

  const toggleChallenge = (id) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, active: !c.active, progress: c.active ? 0 : c.progress } : c));
  };

  const unlockAchievement = (id) => {
    setAchievements(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const updateContactRole = (index, role) => {
    setContacts(prev => prev.map((c, i) => i === index ? { ...c, role } : c));
    if (role === 'guardian') unlockAchievement('guardian-setup');
  };

  const toggleWellnessTask = (dayIndex, taskIndex) => {
    if (!wellnessPlan) return;
    setWellnessPlan(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        tasks: updated[dayIndex].tasks.map((t, i) => i === taskIndex ? { ...t, done: !t.done } : t),
      };
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{
      contacts, setContacts, updateContactRole,
      moodHistory, addMood,
      healthReports, addHealthReport,
      userName, setUserName,
      safetyProfile, setSafetyProfile,
      accessibility, setAccessibility,
      language, setLanguage,
      safeSpaces,
      checkIns, addCheckIn,
      commuteEvents, setCommuteEvents,
      wellnessPlan, setWellnessPlan, toggleWellnessTask,
      challenges, toggleChallenge, updateChallengeProgress,
      achievements, unlockAchievement,
      vaultData, setVaultData,
      sleepHours, setSleepHours,
      activityLevel, setActivityLevel,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
