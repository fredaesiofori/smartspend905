import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Transaction, UserSettings, Currency, CURRENCY_SYMBOLS } from '@/types';

interface AppContextType {
  transactions: Transaction[];
  settings: UserSettings;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateSettings: (s: Partial<UserSettings>) => void;
  currencySymbol: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyExpenses: number;
  budgetProgress: number;
}

const defaultSettings: UserSettings = {
  currency: 'GHS',
  monthlyBudget: 5000,
  darkMode: false,
  name: 'User',
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage('smartspend_transactions', [])
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage('smartspend_settings', defaultSettings)
  );

  useEffect(() => {
    localStorage.setItem('smartspend_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('smartspend_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newT: Transaction = {
      ...t,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newT, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateSettings = useCallback((s: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...s }));
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((s, t) => s + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const budgetProgress = settings.monthlyBudget > 0 ? (monthlyExpenses / settings.monthlyBudget) * 100 : 0;
  const currencySymbol = CURRENCY_SYMBOLS[settings.currency];

  return (
    <AppContext.Provider
      value={{
        transactions,
        settings,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateSettings,
        currencySymbol,
        totalIncome,
        totalExpenses,
        balance,
        monthlyExpenses,
        budgetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
