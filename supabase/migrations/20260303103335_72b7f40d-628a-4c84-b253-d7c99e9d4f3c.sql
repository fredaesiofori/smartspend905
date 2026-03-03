
-- Add impulse_mode to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS impulse_mode boolean DEFAULT true;

-- Impulse alerts tracking
CREATE TABLE public.impulse_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_amount numeric NOT NULL,
  category text NOT NULL,
  category_avg numeric NOT NULL,
  action text NOT NULL CHECK (action IN ('proceeded', 'cancelled', 'marked_necessary')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.impulse_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own impulse alerts" ON public.impulse_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own impulse alerts" ON public.impulse_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referral codes
CREATE TABLE public.referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral code" ON public.referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own referral code" ON public.referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Referrals tracking
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view referrals they made" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can view referrals they received" ON public.referrals FOR SELECT USING (auth.uid() = referred_id);
