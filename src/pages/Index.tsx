import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, Shield, Smartphone, TrendingUp, CheckCircle,
  Star, Wallet, PiggyBank, Tag, CalendarDays, Bell, Target, FileText,
  BookOpen, Lightbulb, DollarSign, Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroMockup from '@/assets/hero-mockup.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } }),
};

const features = [
  { icon: BarChart3, title: 'Track Daily Expenses', desc: 'Log every cedi you spend in seconds. Know exactly where your money goes each day.' },
  { icon: Tag, title: 'Categorize Spending', desc: 'Organize expenses into Food, Transport, Data, School, and Misc for crystal-clear insights.' },
  { icon: CalendarDays, title: 'Weekly & Monthly Totals', desc: 'See your spending patterns over time with automatic weekly and monthly summaries.' },
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Premium charts and breakdowns that reveal your true spending habits.' },
  { icon: Bell, title: 'Budget Alerts', desc: 'Get notified before you overspend. Set limits per category and stay on track.' },
  { icon: Target, title: 'Savings Goals', desc: 'Set goals, track progress, and watch your savings grow week by week.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your financial data is encrypted and stays private. Only you can see it.' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Designed for your phone first. Track spending anywhere, anytime — even on the go.' },
];

const steps = [
  { num: '1', title: 'Create Your Free Account', desc: 'Sign up with your email in under 30 seconds. No credit card needed.' },
  { num: '2', title: 'Log Your Transactions', desc: 'Add income and expenses as they happen. Categorize each one for better tracking.' },
  { num: '3', title: 'See Where Your Money Goes', desc: 'Get charts, reports, and AI-powered tips that help you save more every month.' },
];

const testimonials = [
  { name: 'Ama K.', role: 'Entrepreneur, Accra', text: 'SmartSpend helped me save GH₵2,000 in just 3 months! I finally have clarity over my finances.', rating: 5 },
  { name: 'Kwame M.', role: 'Student, Kumasi', text: 'As a student, every cedi matters. SmartSpend shows me exactly where my allowance goes.', rating: 5 },
  { name: 'Efua D.', role: 'Teacher, Takoradi', text: 'The budget alerts are a game changer for my family finances. No more surprise overspending.', rating: 5 },
];

const freePlan = ['Basic expense tracking', 'Up to 50 transactions/month', 'Monthly reports', 'Ads supported'];
const premiumPlan = ['Unlimited transactions', 'Advanced analytics', 'No ads', 'Custom categories', 'Export to CSV/PDF', 'Priority support', 'Premium themes'];

const blogPosts = [
  {
    icon: BookOpen,
    title: '5 Budgeting Tips Every Student Should Know',
    excerpt: 'University life is expensive. Learn how to stretch your allowance further with these five simple budgeting strategies that actually work for students in Ghana.',
    slug: '#',
  },
  {
    icon: PiggyBank,
    title: 'How to Save GH₵500 in 3 Months on a Small Income',
    excerpt: 'Think saving is only for the rich? Think again. This step-by-step guide shows how young earners can save consistently — even with a tight budget.',
    slug: '#',
  },
  {
    icon: Lightbulb,
    title: 'The 50/30/20 Rule: A Simple Guide for Beginners',
    excerpt: 'One of the most popular budgeting frameworks explained in plain language. Learn how to allocate your income for needs, wants, and savings.',
    slug: '#',
  },
  {
    icon: DollarSign,
    title: 'Why Tracking Expenses Changes Everything',
    excerpt: 'Most people have no idea where their money goes. Discover why the simple act of tracking can transform your relationship with money.',
    slug: '#',
  },
];

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
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#blog" className="hover:text-foreground transition-colors">Blog</a>
          </nav>
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
                Where Did My Money Go?{' '}
                <span className="text-gradient">SmartSpend Knows.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="text-xl font-semibold text-foreground/80">
                Track it. Control it. Grow it.
              </motion.p>
              <motion.p variants={fadeUp} custom={2} className="text-base text-muted-foreground max-w-lg leading-relaxed">
                SmartSpend is a simple, login-based budget-tracking web app built for students and young earners in Ghana. Whether you're managing your monthly allowance, your first salary, or your small business income — SmartSpend helps you see exactly where every cedi goes.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
                <Link to="/auth">
                  <Button size="lg" className="gap-2 text-base px-6">
                    Sign Up Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/upgrade">
                  <Button variant="outline" size="lg" className="text-base px-6">
                    Upgrade to Premium
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> Free forever</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> Ghana optimized</span>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <img src={heroMockup} alt="SmartSpend dashboard preview showing budget charts and transaction tracking for students in Ghana" className="rounded-xl shadow-elevated w-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem & Founder Story */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">The Problem We All Face</h2>
            <p className="text-muted-foreground leading-relaxed">
              Have you ever checked your mobile money balance and wondered, <em>"Where did all my money go?"</em> You're not alone. Millions of young Ghanaians spend money daily on food, transport, data bundles, and school supplies — but have no idea how much they're spending or where it all goes. Without a clear picture of your finances, it's almost impossible to save, plan, or build a better future.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              That's the exact problem SmartSpend was built to solve. We believe that financial awareness is the first step to financial freedom. When you can see your spending habits clearly, you can make smarter choices — and that's where real change begins.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="mt-10 bg-card rounded-xl p-6 border border-border shadow-card">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Quote className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-card-foreground italic leading-relaxed">
                  "I used to spend money and forget where it went. At the end of every month, I'd wonder why I had nothing saved. So I built SmartSpend — first for myself, then for every student and young earner who deserves to know where their money goes. This app is my way of helping Ghanaians take control of their finances, one cedi at a time."
                </p>
                <p className="mt-3 text-sm font-semibold text-primary">— The SmartSpend Founder</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What SmartSpend Offers */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground text-center">What SmartSpend Offers</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              SmartSpend isn't just another finance app. It's purpose-built for the Ghanaian lifestyle.
            </p>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                With SmartSpend, you can log every transaction — whether it's buying waakye for breakfast, topping up your data, or paying your hostel fees. Each expense is categorized automatically into <strong className="text-foreground">Food, Transport, Data, School,</strong> or <strong className="text-foreground">Miscellaneous</strong>, so you always have a clear breakdown of your spending.
              </p>
              <p>
                The app generates <strong className="text-foreground">weekly and monthly summaries</strong> that show you exactly how much you've spent and earned. Want to know if you spent more on food this week compared to last week? SmartSpend has the answer. Want to see your biggest expense category this month? It's right there on your dashboard.
              </p>
              <p>
                For users who want even more control, our <strong className="text-foreground">Premium plan</strong> unlocks advanced analytics, custom budget alerts, savings goals, CSV/PDF exports, and an ad-free experience. Whether you're a student managing GH₵200 a month or a young professional earning your first salary, SmartSpend scales with you.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Features Built for You</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Simple, powerful tools designed for students and young earners in Ghana.</p>
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
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-3">Three simple steps to financial clarity.</p>
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

      {/* Dashboard Screenshot */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">See Your Finances at a Glance</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">The SmartSpend dashboard gives you a complete overview of your income, expenses, and spending categories — all in one clean view.</p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <img src={heroMockup} alt="SmartSpend app dashboard showing expense categories, budget charts, and transaction history" className="rounded-xl shadow-elevated w-full border border-border" />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
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
      <section id="pricing" className="py-20 bg-secondary/30">
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
                <Button variant="outline" className="w-full mt-6">Get Started Free</Button>
              </Link>
            </div>
            <div className="bg-card rounded-xl p-6 border-2 border-primary shadow-elevated relative">
              <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Popular</span>
              <h3 className="font-bold text-lg text-card-foreground">Premium</h3>
              <p className="text-2xl font-bold text-foreground mt-2">GH₵15<span className="text-sm font-normal text-muted-foreground">/month</span></p>
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

      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Smart Money Tips</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Practical financial advice for students and young earners in Ghana.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border flex flex-col"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <post.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground text-sm leading-snug">{post.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
                <span className="mt-3 text-xs font-semibold text-primary inline-flex items-center gap-1">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Take Control of Your Money?</h2>
          <p className="text-primary-foreground/80 mt-4 text-lg">Join thousands of Ghanaians building better financial habits with SmartSpend. It's free, it's simple, and it works.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="mt-8 text-base px-8 gap-2">
              Sign Up Now — It's Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-primary">
                <Wallet className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">SmartSpend</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
            <p className="text-xs text-muted-foreground">© 2026 SmartSpend. Made with ❤️ in Ghana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
