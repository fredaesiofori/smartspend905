import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Heart, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

const FinancialHealthScore = () => {
  const { transactions, totalIncome, totalExpenses, monthlyExpenses, settings, budgetProgress } = useApp();

  const { score, label, color, breakdown, tip } = useMemo(() => {
    // 1. Savings rate (40 pts)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const savingsPts = Math.max(0, Math.min(40, (savingsRate / 30) * 40));

    // 2. Budget adherence (30 pts)
    const budgetPts = budgetProgress <= 100 ? 30 : Math.max(0, 30 - (budgetProgress - 100) * 0.5);

    // 3. Tracking consistency (20 pts) — count of txns in last 30 days
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = transactions.filter(t => new Date(t.date).getTime() >= cutoff).length;
    const consistencyPts = Math.min(20, (recent / 15) * 20);

    // 4. Diversification (10 pts) — number of expense categories used
    const cats = new Set(transactions.filter(t => t.type === 'expense').map(t => t.category));
    const diversityPts = Math.min(10, (cats.size / 5) * 10);

    const total = Math.round(savingsPts + budgetPts + consistencyPts + diversityPts);

    let label = 'Building', color = 'text-warning', tip = 'Log a few transactions to get started.';
    if (total >= 80) { label = 'Excellent'; color = 'text-income'; tip = 'Great habits! Keep saving consistently.'; }
    else if (total >= 60) { label = 'Healthy'; color = 'text-income'; tip = 'Solid foundation. Try increasing savings by 5%.'; }
    else if (total >= 40) { label = 'Fair'; color = 'text-warning'; tip = 'Reduce non-essential spending this month.'; }
    else if (total > 0) { label = 'Needs Attention'; color = 'text-expense'; tip = 'Track every expense and set a tighter budget.'; }

    return {
      score: total,
      label,
      color,
      tip,
      breakdown: [
        { name: 'Savings rate', value: Math.round(savingsPts), max: 40 },
        { name: 'Budget adherence', value: Math.round(budgetPts), max: 30 },
        { name: 'Tracking consistency', value: Math.round(consistencyPts), max: 20 },
        { name: 'Category diversity', value: Math.round(diversityPts), max: 10 },
      ],
    };
  }, [transactions, totalIncome, totalExpenses, monthlyExpenses, settings.monthlyBudget, budgetProgress]);

  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-card-foreground">Financial Health Score</h3>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="130" height="130" className="-rotate-90">
            <circle cx="65" cy="65" r={radius} stroke="hsl(var(--muted))" strokeWidth="10" fill="none" />
            <circle
              cx="65" cy="65" r={radius} strokeWidth="10" fill="none"
              stroke="url(#hsGrad)" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
              className="transition-all duration-700"
            />
            <defs>
              <linearGradient id="hsGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(265 60% 55%)" />
                <stop offset="100%" stopColor="hsl(43 96% 56%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{score}</span>
            <span className={`text-xs font-semibold ${color}`}>{label}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {breakdown.map(b => (
            <div key={b.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground truncate">{b.name}</span>
                <span className="font-medium text-foreground shrink-0">{b.value}/{b.max}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${(b.value / b.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-accent/40 text-xs text-accent-foreground">
        <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>{tip}</span>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
