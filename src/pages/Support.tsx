import { Heart, Phone, Copy, CheckCircle, ExternalLink, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const momoAccounts = [
  {
    provider: 'MTN MoMo',
    number: '059 1616 8684',
    name: 'Smart Cedi Spend',
    color: 'bg-[hsl(48,96%,53%)]',
    textColor: 'text-foreground',
  },
  {
    provider: 'Telecel Cash',
    number: '020 886 2957',
    name: 'Smart Cedi Spend',
    color: 'bg-[hsl(0,72%,51%)]',
    textColor: 'text-white',
  },
];

const Support = () => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyNumber = (number: string, index: number) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ''));
    setCopiedIndex(index);
    toast({ title: 'Copied!', description: `${number} copied to clipboard.` });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-semibold mb-4">
          <Heart className="h-4 w-4" /> Support This App
        </div>
        <h1 className="text-3xl font-bold text-foreground">Help Us Keep SmartSpend Free</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Your support helps us maintain and improve SmartSpend for everyone. Every cedi counts! ❤️
        </p>
      </div>

      {/* MoMo Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Send via Mobile Money
        </h2>
        {momoAccounts.map((account, index) => (
          <div
            key={account.provider}
            className="bg-card rounded-xl border border-border shadow-card p-5 flex items-center gap-4"
          >
            <div className={`${account.color} ${account.textColor} rounded-lg p-3 font-bold text-sm text-center min-w-[80px]`}>
              {account.provider.split(' ')[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold text-card-foreground">{account.provider}</p>
              <p className="text-lg font-mono text-foreground">{account.number}</p>
              <p className="text-xs text-muted-foreground">Name: {account.name}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => copyNumber(account.number, index)}
            >
              {copiedIndex === index ? (
                <><CheckCircle className="h-3.5 w-3.5 text-income" /> Copied</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copy</>
              )}
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground text-center">
          After sending, take a screenshot as proof of payment. Thank you! 🙏
        </p>
      </div>

      {/* Suggested amounts */}
      <div className="bg-card rounded-xl border border-border shadow-card p-6 text-center space-y-4">
        <h3 className="font-bold text-card-foreground">Suggested Amounts</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {['GH₵5', 'GH₵10', 'GH₵20', 'GH₵50'].map((amount) => (
            <span
              key={amount}
              className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full text-sm"
            >
              {amount}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Any amount is appreciated!</p>
      </div>

      {/* Thank you */}
      <div className="bg-gradient-hero rounded-xl p-6 text-center text-primary-foreground">
        <Heart className="h-8 w-8 mx-auto mb-3 animate-pulse" />
        <h3 className="font-bold text-lg">Thank You for Your Support!</h3>
        <p className="text-primary-foreground/80 text-sm mt-1">
          You're helping us build better financial tools for Ghana 🇬🇭
        </p>
      </div>
    </div>
  );
};

export default Support;
