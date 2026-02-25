
-- Fix 1: Add missing INSERT policy on profiles table
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Fix 2 & 3: Fix handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, monthly_budget, currency, dark_mode)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'User'), 5000, 'GHS', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
