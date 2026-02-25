import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Insight {
  icon: string;
  title: string;
  message: string;
}

const AIInsights = () => {
  const { transactions, settings } = useApp();
  const { isGuest } = useAuth();
  const { toast } = useToast();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInsights = async () => {
    if (isGuest) {
      toast({ title: 'Sign in required', description: 'AI insights are available for signed-in users.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: {
          transactions: transactions.slice(0, 50).map(t => ({
            type: t.type, category: t.category, amount: t.amount, date: t.date,
          })),
          settings: { currency: settings.currency, monthlyBudget: settings.monthlyBudget },
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsights(data.insights || []);
      setHasLoaded(true);
    } catch (err: any) {
      toast({ title: 'AI Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (isGuest) {
    return (
      <div className="bg-card rounded-lg border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">AI Smart Insights</h3>
          <Lock className="h-4 w-4 text-muted-foreground ml-auto" />
        </div>
        <p className="text-sm text-muted-foreground">Sign in to unlock AI-powered spending insights.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">AI Smart Insights</h3>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInsights} disabled={loading} className="gap-1.5">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {hasLoaded ? 'Refresh' : 'Get Insights'}
        </Button>
      </div>

      {!hasLoaded && !loading && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Click "Get Insights" to analyze your spending with AI 🤖
        </p>
      )}

      {loading && (
        <div className="space-y-3 py-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasLoaded && !loading && insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-muted/50 border border-border">
              <span className="text-xl">{insight.icon}</span>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
