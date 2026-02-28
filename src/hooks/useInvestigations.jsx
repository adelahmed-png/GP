import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'help-culprit-investigations';

const InvestigationsContext = createContext(null);

export function InvestigationsProvider({ children }) {
  const [investigations, setInvestigations] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investigations));
    } catch (e) {
      console.warn('Could not persist investigations', e);
    }
  }, [investigations]);

  const addInvestigation = useCallback((name, imageUrls = []) => {
    const id = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setInvestigations((prev) => [...prev, { id, name, imageUrls }]);
    return id;
  }, []);

  const getInvestigation = useCallback(
    (id) => investigations.find((inv) => inv.id === id) ?? null,
    [investigations]
  );

  const value = { investigations, addInvestigation, getInvestigation };
  return (
    <InvestigationsContext.Provider value={value}>
      {children}
    </InvestigationsContext.Provider>
  );
}

export function useInvestigations() {
  const ctx = useContext(InvestigationsContext);
  if (!ctx) throw new Error('useInvestigations must be used within InvestigationsProvider');
  return ctx;
}
