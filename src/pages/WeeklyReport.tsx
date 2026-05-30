import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--gold))', 'hsl(152, 56%, 39%)', 'hsl(0, 72%, 51%)', 'hsl(200, 60%, 50%)', 'hsl(270, 50%, 55%)'];

const WeeklyReport = () => {
  const { transactions, currencySymbol } = useApp();

  const { weekStart, weekEnd, weekTx, lastWeekTx } = useMemo(() => {
    const now = new Date();
    const dow = now.getDay();
    const start = new Date(now); start.setDate(now.getDate() - dow); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
    const lastStart = new Date(start); lastStart.setDate(start.getDate() - 7);
    const lastEnd = new Date(start); lastEnd.setMilliseconds(-1);

    const inRange = (t: any, s: Date, e: Date) => {
      const d = new Date(t.date); return d >= s && d <= e;
    };
    return {
      weekStart: start, weekEnd: end,
      weekTx: transactions.filter(t => inRange(t, start, end)),
      lastWeekTx: transactions.filter(t => inRange(t, lastStart, lastEnd)),
    };
  }, [transactions]);

  const income = weekTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = weekTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastWeekTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;
  const change = lastExpenses > 0 ? ((expenses - lastExpenses) / lastExpenses) * 100 : 0;

  const dayData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map = days.map(d => ({ day: d, income: 0, expense: 0 }));
    weekTx.forEach(t => {
      const idx = new Date(t.date).getDay();
      map[idx][t.type] += t.amount;
    });
    return map;
  }, [weekTx]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    weekTx.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [weekTx]);

  const topCategory = categoryData[0];

  const insights: string[] = [];
  if (expenses === 0 && income === 0) insights.push('No activity this week. Add transactions to see insights.');
  if (lastExpenses > 0) {
    if (change > 20) insights.push(`⚠️ Your spending is up ${change.toFixed(0)}% vs last week.`);
    else if (change < -10) insights.push(`✅ Great job! Spending down ${Math.abs(change).toFixed(0)}% vs last week.`);
  }
  if (topCategory) insights.push(`🏷️ Top spending category: ${topCategory.name} (${currencySymbol}${topCategory.value.toLocaleString()}).`);
  if (savings > 0) insights.push(`💰 You saved ${currencySymbol}${savings.toLocaleString()} this week.`);
  else if (savings < 0) insights.push(`📉 You overspent by ${currencySymbol}${Math.abs(savings).toLocaleString()} this week.`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Weekly Report</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – {weekEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-income" />
            <p className="text-xs text-muted-foreground">Income</p>
          </div>
          <p className="text-xl font-bold text-income">{currencySymbol}{income.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-expense" />
            <p className="text-xs text-muted-foreground">Expenses</p>
          </div>
          <p className="text-xl font-bold text-expense">{currencySymbol}{expenses.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Net Savings</p>
          </div>
          <p className={`text-xl font-bold ${savings >= 0 ? 'text-income' : 'text-expense'}`}>
            {currencySymbol}{savings.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">vs Last Week</p>
          <p className={`text-xl font-bold ${change > 0 ? 'text-expense' : 'text-income'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-gold/10 border border-primary/20 rounded-lg p-5">
        <h3 className="font-semibold text-foreground mb-3">📊 Weekly Insights</h3>
        <ul className="space-y-2">
          {insights.map((i, idx) => (
            <li key={idx} className="text-sm text-foreground/90">{i}</li>
          ))}
        </ul>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-4">Daily Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => `${currencySymbol}${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="hsl(152, 56%, 39%)" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <h3 className="font-semibold text-card-foreground mb-4">Spending by Category</h3>
          {categoryData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No expenses yet this week.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${currencySymbol}${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
