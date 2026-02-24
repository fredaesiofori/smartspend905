import { Lightbulb } from 'lucide-react';

const tips = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Track every expense — small amounts add up over time.",
  "Set up an emergency fund covering 3-6 months of expenses.",
  "Review your subscriptions monthly and cancel unused ones.",
  "Automate your savings to build wealth effortlessly.",
];

const FinancialTips = () => {
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Financial Tip</p>
          <p className="text-sm text-muted-foreground mt-1">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialTips;
