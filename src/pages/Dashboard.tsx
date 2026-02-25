import { TrendingUp, TrendingDown, Wallet, Target, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import StatCard from '@/components/StatCard';
import TransactionForm from '@/components/TransactionForm';
import FinancialTips from '@/components/FinancialTips';
import SponsoredCard from '@/components/SponsoredCard';
import AdPlaceholder from '@/components/AdPlaceholder';
import AIInsights from '@/components/AIInsights';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { transactions, currencySymbol, totalIncome, totalExpenses, balance, monthlyExpenses, budgetProgress, settings } = useApp();

  const recent = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's your financial overview.</p>
        </div>
        <TransactionForm />
      </div>

      {/* Budget Alert at 80% */}
      {budgetProgress >= 80 && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${budgetProgress > 100 ? 'bg-expense/10 border-expense/20' : 'bg-warning/10 border-warning/20'}`}>
          <AlertTriangle className={`h-5 w-5 ${budgetProgress > 100 ? 'text-expense' : 'text-warning'}`} />
          <div>
            <p className={`text-sm font-semibold ${budgetProgress > 100 ? 'text-expense' : 'text-warning'}`}>
              {budgetProgress > 100 ? '🚨 Budget Exceeded!' : '⚠️ Budget Warning'}
            </p>
            <p className="text-xs text-muted-foreground">
              You've used {budgetProgress.toFixed(0)}% of your {currencySymbol}{settings.monthlyBudget.toLocaleString()} monthly budget.
            </p>
          </div>
        </div>
      )}

      <AdPlaceholder variant="banner" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" value={`${currencySymbol}${totalIncome.toLocaleString('en', { minimumFractionDigits: 2 })}`} icon={TrendingUp} variant="income" />
        <StatCard title="Total Expenses" value={`${currencySymbol}${totalExpenses.toLocaleString('en', { minimumFractionDigits: 2 })}`} icon={TrendingDown} variant="expense" />
        <StatCard title="Balance" value={`${currencySymbol}${balance.toLocaleString('en', { minimumFractionDigits: 2 })}`} icon={Wallet} variant="balance" />
        <StatCard title="Monthly Budget" value={`${Math.min(budgetProgress, 100).toFixed(0)}% used`} icon={Target} subtitle={`${currencySymbol}${monthlyExpenses.toLocaleString('en', { minimumFractionDigits: 2 })} / ${currencySymbol}${settings.monthlyBudget.toLocaleString()}`} />
      </div>

      {/* Budget Progress */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-card-foreground">Monthly Budget Progress</h3>
          <span className={`text-sm font-semibold ${budgetProgress > 90 ? 'text-expense' : budgetProgress > 70 ? 'text-warning' : 'text-income'}`}>
            {budgetProgress.toFixed(0)}%
          </span>
        </div>
        <Progress value={Math.min(budgetProgress, 100)} className="h-3" />
        {budgetProgress > 90 && (
          <p className="text-xs text-expense mt-2 font-medium">⚠️ You're close to exceeding your monthly budget!</p>
        )}
      </div>

      {/* AI Insights */}
      <AIInsights />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">Recent Transactions</h3>
            <Link to="/transactions" className="text-sm text-primary hover:underline font-medium">View All</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No transactions yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{t.category}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <FinancialTips />
          <SponsoredCard
            title="MTN MoMo Savings"
            description="Start saving directly from your mobile money. Earn up to 10% interest."
            ctaText="Learn More"
          />
          <AdPlaceholder variant="sidebar" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
