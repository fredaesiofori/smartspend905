import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  'hsl(265, 60%, 55%)',
  'hsl(43, 96%, 56%)',
  'hsl(290, 55%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(152, 56%, 39%)',
  'hsl(200, 60%, 50%)',
  'hsl(30, 80%, 50%)',
  'hsl(340, 60%, 50%)',
  'hsl(120, 40%, 45%)',
  'hsl(220, 60%, 55%)',
];

const CategoryBreakdown = () => {
  const { transactions, currencySymbol } = useApp();

  const data = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    return {
      total,
      items: Object.entries(map)
        .map(([name, value]) => ({ name, value, pct: total > 0 ? (value / total) * 100 : 0 }))
        .sort((a, b) => b.value - a.value),
    };
  }, [transactions]);

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-card-foreground">Spending by Category</h3>
      </div>
      {data.items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No expenses yet.</p>
      ) : (
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={item.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-card-foreground font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs">{item.pct.toFixed(1)}%</span>
                  <span className="text-card-foreground font-semibold">
                    {currencySymbol}{item.value.toLocaleString('en', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.pct}%`, background: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;
