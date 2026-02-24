import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: 'default' | 'income' | 'expense' | 'balance';
  subtitle?: string;
}

const variantClasses = {
  default: 'bg-card border border-border',
  income: 'bg-card border border-income/20',
  expense: 'bg-card border border-expense/20',
  balance: 'bg-gradient-primary text-primary-foreground',
};

const iconClasses = {
  default: 'bg-secondary text-secondary-foreground',
  income: 'bg-income/10 text-income',
  expense: 'bg-expense/10 text-expense',
  balance: 'bg-primary-foreground/20 text-primary-foreground',
};

const StatCard = ({ title, value, icon: Icon, variant = 'default', subtitle }: StatCardProps) => {
  return (
    <div className={`rounded-lg p-5 shadow-card transition-all duration-200 hover:shadow-card-hover animate-fade-in ${variantClasses[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${variant === 'balance' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
            {title}
          </p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${variant === 'balance' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconClasses[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
