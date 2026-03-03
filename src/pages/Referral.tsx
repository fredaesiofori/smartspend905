import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, Gift, Users, CheckCircle } from 'lucide-react';

const ReferralPage = () => {
  const { user, isGuest } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [rewardedCount, setRewardedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || isGuest) { setLoading(false); return; }
    loadReferralData();
  }, [user, isGuest]);

  const loadReferralData = async () => {
    if (!user) return;
    try {
      // Get or create referral code
      let { data: codeData } = await supabase
        .from('referral_codes' as any)
        .select('code')
        .eq('user_id', user.id)
        .single();

      if (!codeData) {
        const code = `SS-${user.id.slice(0, 6).toUpperCase()}`;
        const { data: newCode } = await supabase
          .from('referral_codes' as any)
          .insert({ user_id: user.id, code } as any)
          .select('code')
          .single();
        codeData = newCode;
      }

      setReferralCode((codeData as any)?.code || '');

      // Get referral stats
      const { data: refs } = await supabase
        .from('referrals' as any)
        .select('status')
        .eq('referrer_id', user.id);

      setReferralCount((refs as any[])?.length || 0);
      setRewardedCount((refs as any[])?.filter((r: any) => r.status === 'rewarded').length || 0);
    } catch (err) {
      console.error('Error loading referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Copied!', description: 'Referral link copied to clipboard.' });
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=Join SmartSpend and track your finances! Use my referral code: ${referralCode} ${referralLink}`, '_blank');
  };

  const shareSMS = () => {
    window.open(`sms:?body=Join SmartSpend and track your finances! Use my referral code: ${referralCode} ${referralLink}`, '_blank');
  };

  if (isGuest) {
    return (
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Refer & Earn</h1>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Sign up to get your unique referral code and earn rewards!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Refer & Earn</h1>
        <p className="text-sm text-muted-foreground">Share SmartSpend and earn premium rewards!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center shadow-card">
          <Users className="h-5 w-5 mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{referralCount}</p>
          <p className="text-xs text-muted-foreground">Referrals</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center shadow-card">
          <CheckCircle className="h-5 w-5 mx-auto text-income mb-2" />
          <p className="text-2xl font-bold text-foreground">{rewardedCount}</p>
          <p className="text-xs text-muted-foreground">Rewards Earned</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4 text-center shadow-card">
          <Gift className="h-5 w-5 mx-auto text-warning mb-2" />
          <p className="text-2xl font-bold text-foreground">{referralCount > 0 ? referralCount : 0}</p>
          <p className="text-xs text-muted-foreground">Months Free</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Your Referral Code</h3>
        <div className="flex gap-2">
          <Input value={referralCode} readOnly className="font-mono text-lg font-bold tracking-wider" />
          <Button onClick={copyLink} variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Input value={referralLink} readOnly className="text-xs text-muted-foreground" />
          <Button onClick={copyLink} variant="outline" size="sm">
            Copy Link
          </Button>
        </div>
      </div>

      {/* Share */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Share with Friends</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={shareWhatsApp} className="gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)]">
            <Share2 className="h-4 w-4" /> WhatsApp
          </Button>
          <Button onClick={shareSMS} variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" /> SMS
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">How It Works</h3>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Share your unique referral link with friends' },
            { step: '2', text: 'They sign up using your link or code' },
            { step: '3', text: 'You get 1 month of Premium free per referral!' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
