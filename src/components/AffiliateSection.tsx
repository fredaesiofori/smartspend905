import { ExternalLink } from 'lucide-react';

const affiliates = [
  { name: 'InvestNow Africa', desc: 'Start investing with as little as GH₵50', tag: 'Investment' },
  { name: 'SaveWise App', desc: 'Automated savings for your goals', tag: 'Savings' },
  { name: 'MoneyMaster Course', desc: 'Learn personal finance in 30 days', tag: 'Education' },
  { name: 'BudgetPro Book', desc: 'The #1 budgeting guide for beginners', tag: 'Book' },
];

const AffiliateSection = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">Recommended Financial Tools</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">
          Affiliate
        </span>
      </div>
      <div className="space-y-3">
        {affiliates.map((a) => (
          <a
            key={a.name}
            href="#"
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                {a.name}
              </p>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{a.tag}</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AffiliateSection;
