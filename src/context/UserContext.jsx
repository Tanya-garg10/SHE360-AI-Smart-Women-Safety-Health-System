import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Persistence Utilities
  const getSaved = (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const [contacts, setContacts] = useState(() => getSaved('emergency-contacts', [
    { name: 'Home', phone: '+91 99999 00001' },
    { name: 'Police Helpline', phone: '112' }
  ]));

  const [moodHistory, setMoodHistory] = useState(() => getSaved('mood-history', []));
  const [healthReports, setHealthReports] = useState(() => getSaved('health-reports', []));
  const [userName, setUserName] = useState(() => getSaved('user-name', 'User'));

  // Save to LocalStorage on change
  useEffect(() => localStorage.setItem('emergency-contacts', JSON.stringify(contacts)), [contacts]);
  useEffect(() => localStorage.setItem('mood-history', JSON.stringify(moodHistory)), [moodHistory]);
  useEffect(() => localStorage.setItem('health-reports', JSON.stringify(healthReports)), [healthReports]);
  useEffect(() => localStorage.setItem('user-name', JSON.stringify(userName)), [userName]);

  const addMood = (label) => {
    const newEntry = { date: new Date().toISOString(), label };
    setMoodHistory(prev => [...prev.slice(-6), newEntry]); // Keep last 7 days
  };

  const addHealthReport = (type, result) => {
    const newReport = { id: Date.now(), type, result, date: new Date().toLocaleDateString() };
    setHealthReports(prev => [newReport, ...prev]);
  };

  return (
    <UserContext.Provider value={{
      contacts, setContacts,
      moodHistory, addMood,
      healthReports, addHealthReport,
      userName, setUserName
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
