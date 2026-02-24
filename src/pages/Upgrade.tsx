import { CheckCircle, X, Crown, Zap, Shield, Palette, Download, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AffiliateSection from '@/components/AffiliateSection';
import { Link } from 'react-router-dom';

const features = [
  { icon: X, name: 'Remove All Ads', free: false, premium: true },
  { icon: Zap, name: 'Advanced Analytics', free: false, premium: true },
  { icon: Download, name: 'Unlimited Exports', free: false, premium: true },
  { icon: Palette, name: 'Custom Categories', free: false, premium: true },
  { icon: Headphones, name: 'Priority Support', free: false, premium: true },
  { icon: Palette, name: 'Extra Themes', free: false, premium: true },
  { icon: Shield, name: 'Basic Tracking', free: true, premium: true },
  { icon: Shield, name: 'Monthly Reports', free: true, premium: true },
];

const Upgrade = () => {
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
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="font-bold text-lg text-card-foreground">Monthly</h3>
          <p className="text-3xl font-bold text-foreground mt-3">GH₵29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          <p className="text-xs text-muted-foreground mt-1">Cancel anytime</p>
          <Button variant="outline" className="w-full mt-6">Choose Monthly</Button>
        </div>
        <div className="bg-card rounded-xl border-2 border-primary p-6 shadow-elevated relative">
          <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Save 33%</span>
          <h3 className="font-bold text-lg text-card-foreground">Yearly</h3>
          <p className="text-3xl font-bold text-foreground mt-3">GH₵19<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          <p className="text-xs text-muted-foreground mt-1">Billed GH₵228/year</p>
          <Button className="w-full mt-6">Choose Yearly</Button>
        </div>
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
