import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Shield, Smartphone, TrendingUp, CheckCircle, Star, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroMockup from '@/assets/hero-mockup.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } }),
};

const features = [
  { icon: BarChart3, title: 'Track Expenses', desc: 'Monitor every cedi you spend with detailed categories.' },
  { icon: TrendingUp, title: 'Smart Budgets', desc: 'Set budgets and get alerts before you overspend.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your financial data stays safe and encrypted.' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Designed for your phone. Use it anywhere, anytime.' },
];

const steps = [
  { num: '1', title: 'Create Account', desc: 'Sign up in seconds — completely free.' },
  { num: '2', title: 'Add Transactions', desc: 'Log income and expenses as they happen.' },
  { num: '3', title: 'See Insights', desc: 'Get charts, reports, and tips to save more.' },
];

const testimonials = [
  { name: 'Ama K.', role: 'Entrepreneur, Accra', text: 'SmartSpend helped me save GH₵2,000 in just 3 months!', rating: 5 },
  { name: 'Kwame M.', role: 'Student, Kumasi', text: 'I finally understand where my money goes. Best app ever.', rating: 5 },
  { name: 'Efua D.', role: 'Teacher, Takoradi', text: 'The budget alerts are a game changer for my family finances.', rating: 5 },
];

const freePlan = ['Basic expense tracking', 'Up to 50 transactions/month', 'Monthly reports', 'Ads supported'];
const premiumPlan = ['Unlimited transactions', 'Advanced analytics', 'No ads', 'Custom categories', 'Export to CSV/PDF', 'Priority support', 'Premium themes'];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">SmartSpend</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gap-1.5">Get Started <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.03]" />
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" className="space-y-6">
              <motion.h1 variants={fadeUp} custom={0} className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                Take Control of Your Money.{' '}
                <span className="text-gradient">Track Every Cedi.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-lg">
                SmartSpend helps you manage income, track expenses, and build better financial habits — all in one simple app.
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="flex flex-wrap gap-3">
                <Link to="/auth">
                  <Button size="lg" className="gap-2 text-base px-6">
                    Start Tracking Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/upgrade">
                  <Button variant="outline" size="lg" className="text-base px-6">
                    Upgrade to Premium
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} custom={3} className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> Free forever</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> Ghana optimized</span>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <img src={heroMockup} alt="SmartSpend dashboard preview showing budget charts and transaction tracking" className="rounded-xl shadow-elevated w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need to Manage Money</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Simple tools designed for everyday Ghanaians who want to take control of their finances.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-3">Three simple steps to financial freedom.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-lg text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-card rounded-xl p-6 shadow-card border border-border">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-card-foreground italic">"{t.text}"</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Free vs Premium</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border shadow-card">
              <h3 className="font-bold text-lg text-card-foreground">Free Plan</h3>
              <p className="text-2xl font-bold text-foreground mt-2">GH₵0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="mt-6 space-y-3">
                {freePlan.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button variant="outline" className="w-full mt-6">Get Started</Button>
              </Link>
            </div>
            <div className="bg-card rounded-xl p-6 border-2 border-primary shadow-elevated relative">
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Popular</span>
              <h3 className="font-bold text-lg text-card-foreground">Premium</h3>
              <p className="text-2xl font-bold text-foreground mt-2">GH₵29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="mt-6 space-y-3">
                {premiumPlan.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/upgrade">
                <Button className="w-full mt-6">Upgrade Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Take Control?</h2>
          <p className="text-primary-foreground/80 mt-4 text-lg">Join thousands of Ghanaians building better financial habits with SmartSpend.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="mt-8 text-base px-8 gap-2">
              Start Tracking Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 SmartSpend. Made with ❤️ in Ghana.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
