import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

const COLORS = ['hsl(265, 60%, 55%)', 'hsl(43, 96%, 56%)', 'hsl(290, 55%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(152, 56%, 39%)', 'hsl(200, 60%, 50%)', 'hsl(30, 80%, 50%)', 'hsl(340, 60%, 50%)'];

const SpendingTrendChart = () => {
  const { transactions, currencySymbol } = useApp();

  const trendData = useMemo(() => {
    const days: Record<string, number> = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = 0;
    }
    transactions.filter(t => t.type === 'expense').forEach(t => {
      if (t.date in days) days[t.date] += t.amount;
    });
    return Object.entries(days).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
      amount,
    }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [transactions]);

  const hasData = transactions.filter(t => t.type === 'expense').length > 0;

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3 bg-card rounded-lg border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-card-foreground">30-Day Spending Trend</h3>
        </div>
        {!hasData ? (
          <p className="text-sm text-muted-foreground text-center py-10">No expenses yet to chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="spendArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(265 60% 55%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(265 60% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={4} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                formatter={(v: number) => `${currencySymbol}${v.toLocaleString('en', { minimumFractionDigits: 2 })}`}
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="amount" stroke="hsl(265 60% 55%)" strokeWidth={2} fill="url(#spendArea)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5 shadow-card">
        <h3 className="font-semibold text-card-foreground mb-4">Top Categories</h3>
        {categoryData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip
                formatter={(v: number) => `${currencySymbol}${v.toLocaleString('en', { minimumFractionDigits: 2 })}`}
                contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SpendingTrendChart;
