import { useMemo, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import SponsoredCard from '@/components/SponsoredCard';
import { AlertTriangle, Calendar, TrendingDown, TrendingUp, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['hsl(152, 56%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(200, 60%, 50%)', 'hsl(270, 50%, 55%)', 'hsl(30, 80%, 50%)', 'hsl(180, 50%, 40%)', 'hsl(340, 60%, 50%)'];

const Reports = () => {
  const { transactions, currencySymbol, budgetProgress, settings } = useApp();
  const currentYear = new Date().getFullYear();
  const availableYears = useMemo(() => {
    const years = new Set<number>(transactions.map(t => new Date(t.date).getFullYear()));
    years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions, currentYear]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const yearTxns = useMemo(
    () => transactions.filter(t => new Date(t.date).getFullYear() === selectedYear),
    [transactions, selectedYear]
  );

  const yearSummary = useMemo(() => {
    const income = yearTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = yearTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const monthsWithData = new Set(yearTxns.map(t => new Date(t.date).getMonth())).size || 1;
    return {
      income, expenses,
      savings: income - expenses,
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
      avgMonthlyExpense: expenses / monthsWithData,
    };
  }, [yearTxns]);

  const topCategories = useMemo(() => {
    const map: Record<string, number> = {};
    yearTxns.filter(t => t.type === 'expense').forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, pct: (value / total) * 100 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [yearTxns]);

  const insights = useMemo(() => {
    const out: string[] = [];
    if (yearSummary.savingsRate >= 20) out.push(`Excellent! You saved ${yearSummary.savingsRate.toFixed(0)}% of your income in ${selectedYear}.`);
    else if (yearSummary.savingsRate > 0) out.push(`You saved ${yearSummary.savingsRate.toFixed(0)}% this year — aim for 20% next.`);
    else if (yearSummary.income > 0) out.push(`You overspent your income by ${currencySymbol}${Math.abs(yearSummary.savings).toLocaleString()}. Tighten your top category.`);
    if (topCategories[0]) out.push(`Top category: ${topCategories[0].name} (${topCategories[0].pct.toFixed(0)}% of expenses).`);
    if (topCategories[0]?.pct > 40) out.push(`${topCategories[0].name} takes up over 40% of spending — consider trimming it.`);
    return out;
  }, [yearSummary, topCategories, selectedYear, currencySymbol]);



  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en', { month: 'short', year: '2-digit' }),
        ...data,
        savings: data.income - data.expense,
      }));
  }, [transactions]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground">Visual insights into your spending habits.</p>
      </div>

      {budgetProgress > 90 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-expense/10 border border-expense/20">
          <AlertTriangle className="h-5 w-5 text-expense" />
          <div>
            <p className="text-sm font-semibold text-expense">Budget Warning</p>
            <p className="text-xs text-muted-foreground">You've used {budgetProgress.toFixed(0)}% of your {currencySymbol}{settings.monthlyBudget.toLocaleString()} monthly budget.</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Total Income</p>
          <p className="text-xl font-bold text-income">{currencySymbol}{totalIncome.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-xl font-bold text-expense">{currencySymbol}{totalExpenses.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Net Savings</p>
          <p className={`text-xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-income' : 'text-expense'}`}>
            {currencySymbol}{(totalIncome - totalExpenses).toLocaleString('en', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 shadow-card">
          <p className="text-xs text-muted-foreground">Transactions</p>
          <p className="text-xl font-bold text-foreground">{transactions.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-4">Expense Breakdown</h3>
          {categoryData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${currencySymbol}${v.toLocaleString('en', { minimumFractionDigits: 2 })}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-4">Monthly Overview</h3>
          {monthlyData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => `${currencySymbol}${v.toLocaleString('en', { minimumFractionDigits: 2 })}`} />
                <Legend />
                <Bar dataKey="income" fill="hsl(152, 56%, 39%)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Savings Trend */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card">
        <h3 className="font-semibold text-card-foreground mb-4">Savings Trend</h3>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Add some transactions to see trends.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => `${currencySymbol}${v.toLocaleString('en', { minimumFractionDigits: 2 })}`} />
              <Line type="monotone" dataKey="savings" stroke="hsl(152, 56%, 39%)" strokeWidth={2} dot={{ fill: 'hsl(152, 56%, 39%)' }} name="Savings" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <SponsoredCard title="Investment Tracker Pro" description="Connect your investment portfolio and track returns alongside your spending." ctaText="Try Free" />
    </div>
  );
};

export default Reports;
