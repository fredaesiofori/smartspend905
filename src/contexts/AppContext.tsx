import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Transaction, UserSettings, Currency, CURRENCY_SYMBOLS, CATEGORIES, TransactionType } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CategoryMap {
  income: string[];
  expense: string[];
}

interface AppContextType {
  transactions: Transaction[];
  settings: UserSettings;
  categories: CategoryMap;
  addCategory: (type: TransactionType, name: string) => void;
  renameCategory: (type: TransactionType, oldName: string, newName: string) => void;
  deleteCategory: (type: TransactionType, name: string) => void;
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
  loadingData: boolean;
}

const defaultSettings: UserSettings = {
  currency: 'GHS',
  monthlyBudget: 5000,
  darkMode: false,
  name: 'User',
  impulseMode: true,
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
  const { user, isGuest } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loadingData, setLoadingData] = useState(true);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (isGuest) {
      setTransactions(loadFromStorage('smartspend_transactions', []));
      setSettings(loadFromStorage('smartspend_settings', defaultSettings));
      setLoadingData(false);
      return;
    }
    if (!user) {
      setTransactions([]);
      setSettings(defaultSettings);
      setLoadingData(false);
      return;
    }

    const loadData = async () => {
      setLoadingData(true);
      try {
        // Load transactions
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (txError) throw txError;
        setTransactions(
          (txData || []).map(t => ({
            id: t.id,
            amount: Number(t.amount),
            type: t.type as 'income' | 'expense',
            category: t.category,
            date: t.date,
            notes: t.notes || '',
            createdAt: t.created_at,
          }))
        );

        // Load profile/settings
        const { data: profile, error: pError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (pError) throw pError;
        if (profile) {
          setSettings({
            currency: (profile.currency as Currency) || 'GHS',
            monthlyBudget: Number(profile.monthly_budget) || 5000,
            darkMode: profile.dark_mode || false,
            name: profile.name || 'User',
            impulseMode: (profile as any).impulse_mode !== false,
          });
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [user, isGuest]);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Save guest data to localStorage
  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('smartspend_transactions', JSON.stringify(transactions));
      localStorage.setItem('smartspend_settings', JSON.stringify(settings));
    }
  }, [transactions, settings, isGuest]);

  const addTransaction = useCallback(async (t: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (user && !isGuest) {
      const { data, error } = await supabase
        .from('transactions')
        .insert({ user_id: user.id, amount: t.amount, type: t.type, category: t.category, date: t.date, notes: t.notes || null })
        .select()
        .single();
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      if (data) {
        setTransactions(prev => [{
          id: data.id, amount: Number(data.amount), type: data.type as 'income' | 'expense',
          category: data.category, date: data.date, notes: data.notes || '', createdAt: data.created_at,
        }, ...prev]);
      }
    } else {
      const newT: Transaction = { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      setTransactions(prev => [newT, ...prev]);
    }
  }, [user, isGuest, toast]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    if (user && !isGuest) {
      const { error } = await supabase.from('transactions').update(updates).eq('id', id).eq('user_id', user.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  }, [user, isGuest, toast]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (user && !isGuest) {
      const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [user, isGuest, toast]);

  const updateSettings = useCallback(async (s: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...s };
    setSettings(newSettings);
    if (user && !isGuest) {
      const { error } = await supabase.from('profiles').update({
        currency: newSettings.currency,
        monthly_budget: newSettings.monthlyBudget,
        dark_mode: newSettings.darkMode,
        name: newSettings.name,
        impulse_mode: newSettings.impulseMode,
      } as any).eq('id', user.id);
      if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }, [user, isGuest, settings, toast]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => { const d = new Date(t.date); return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const budgetProgress = settings.monthlyBudget > 0 ? (monthlyExpenses / settings.monthlyBudget) * 100 : 0;
  const currencySymbol = CURRENCY_SYMBOLS[settings.currency];

  return (
    <AppContext.Provider value={{ transactions, settings, addTransaction, updateTransaction, deleteTransaction, updateSettings, currencySymbol, totalIncome, totalExpenses, balance, monthlyExpenses, budgetProgress, loadingData }}>
      {children}
    </AppContext.Provider>
  );
};
