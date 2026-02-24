export type TransactionType = 'income' | 'expense';

export type Currency = 'GHS' | 'USD' | 'EUR' | 'GBP';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GHS: 'GH₵',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
  expense: [
    'Food & Drinks',
    'Transport',
    'Airtime',
    'Data',
    'Tithe',
    'Utilities',
    'Rent',
    'Shopping',
    'Entertainment',
    'Health',
    'Education',
    'Savings',
    'Other',
  ],
};

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes: string;
  createdAt: string;
}

export interface UserSettings {
  currency: Currency;
  monthlyBudget: number;
  darkMode: boolean;
  name: string;
}

export interface AppState {
  transactions: Transaction[];
  settings: UserSettings;
}
