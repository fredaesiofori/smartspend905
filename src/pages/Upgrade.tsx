import { CheckCircle, X, Crown, Zap, Shield, Palette, Download, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AffiliateSection from '@/components/AffiliateSection';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const features = [
  { icon: X, name: 'Remove All Ads', free: false, premium: true },
  { icon: Zap, name: 'AI Smart Insights', free: false, premium: true },
  { icon: Zap, name: 'Advanced Analytics', free: false, premium: true },
  { icon: Download, name: 'Unlimited Exports', free: false, premium: true },
  { icon: Palette, name: 'Custom Categories', free: false, premium: true },
  { icon: Headphones, name: 'Priority Support', free: false, premium: true },
  { icon: Palette, name: 'Extra Themes', free: false, premium: true },
  { icon: Shield, name: 'Basic Tracking', free: true, premium: true },
  { icon: Shield, name: 'Monthly Reports', free: true, premium: true },
];

const plans = [
  { name: 'Monthly', price: 29, label: '/month', note: 'Cancel anytime', plan_id: 'monthly', highlight: false },
  { name: 'Yearly', price: 19, label: '/month', note: 'Billed GH₵228/year', plan_id: 'yearly', highlight: true, save: 'Save 33%' },
];

const Upgrade = () => {
  const { user, isGuest } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: typeof plans[0]) => {
    if (isGuest || !user) {
      toast({ title: 'Sign in required', description: 'Please create an account to upgrade.', variant: 'destructive' });
      return;
    }

    setLoading(plan.plan_id);
    try {
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: user.email,
          plan: `premium_${plan.plan_id}`,
          callback_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      const paymentUrl = data?.data?.authorization_url;
      if (typeof paymentUrl === 'string' && paymentUrl.startsWith('https://checkout.paystack.com/')) {
        window.location.href = paymentUrl;
      } else {
        throw new Error('Invalid payment URL received');
      }
    } catch (err: any) {
      toast({ title: 'Payment error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-semibold mb-4">
          <Crown className="h-4 w-4" /> SmartSpend Premium
        </div>
        <h1 className="text-3xl font-bold text-foreground">Unlock Your Full Financial Potential</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Get advanced analytics, remove ads, and access premium features to supercharge your money management.
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.plan_id}
            className={`bg-card rounded-xl p-6 shadow-card relative ${
              plan.highlight ? 'border-2 border-primary shadow-elevated' : 'border border-border'
            }`}
          >
            {plan.save && (
              <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                {plan.save}
              </span>
            )}
            <h3 className="font-bold text-lg text-card-foreground">{plan.name}</h3>
            <p className="text-3xl font-bold text-foreground mt-3">
              GH₵{plan.price}<span className="text-sm font-normal text-muted-foreground">{plan.label}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{plan.note}</p>
            <Button
              variant={plan.highlight ? 'default' : 'outline'}
              className="w-full mt-6"
              onClick={() => handleCheckout(plan)}
              disabled={loading === plan.plan_id}
            >
              {loading === plan.plan_id ? 'Redirecting...' : `Choose ${plan.name}`}
            </Button>
          </div>
        ))}
      </div>

      {/* Accepted payment methods */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Pay securely with Card, Google Pay, MTN MoMo, or Telecel Cash via Paystack 🔒
        </p>
      </div>

      {/* Feature Comparison */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-3 p-4 border-b border-border bg-muted/30">
          <span className="text-sm font-semibold text-card-foreground">Feature</span>
          <span className="text-sm font-semibold text-card-foreground text-center">Free</span>
          <span className="text-sm font-semibold text-primary text-center">Premium</span>
        </div>
        {features.map(f => (
          <div key={f.name} className="grid grid-cols-3 p-4 border-b border-border last:border-0 items-center">
            <span className="text-sm text-card-foreground">{f.name}</span>
            <div className="text-center">
              {f.free ? <CheckCircle className="h-4 w-4 text-income mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />}
            </div>
            <div className="text-center">
              <CheckCircle className="h-4 w-4 text-primary mx-auto" />
            </div>
          </div>
        ))}
      </div>

      <AffiliateSection />
    </div>
  );
};

export default Upgrade;
