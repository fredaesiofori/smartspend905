import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, Check, X, Star, Download, Smartphone, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const apps = [
  {
    name: 'SmartSpend',
    type: 'Local / Free',
    cediSupport: true,
    momoIntegration: true,
    offline: true,
    aiInsights: true,
    savingsGoals: true,
    studentFocus: true,
    rating: 5,
    pros: ['Built for Ghana (GHS default)', 'MTN & Telecel MoMo support', 'AI spending insights', 'Goal-based savings', 'No subscription fee'],
    cons: ['Newer app, growing feature set'],
  },
  {
    name: 'MTN MoMo',
    type: 'Mobile Money Wallet',
    cediSupport: true,
    momoIntegration: true,
    offline: false,
    aiInsights: false,
    savingsGoals: false,
    studentFocus: false,
    rating: 4,
    pros: ['Widely used in Ghana', 'Instant transfers', 'Bill payments', 'Cash-in/cash-out agents everywhere'],
    cons: ['No budgeting categories', 'No spending reports', 'No savings goals', 'Transaction fees apply'],
  },
  {
    name: 'YNAB (You Need A Budget)',
    type: 'International / Paid',
    cediSupport: false,
    momoIntegration: false,
    offline: false,
    aiInsights: false,
    savingsGoals: true,
    studentFocus: false,
    rating: 4,
    pros: ['Proven zero-based budgeting method', 'Excellent educational resources', 'Strong community', 'Bank syncing (US/EU)'],
    cons: ['No GHS / MoMo support', '$14.99/month subscription', 'Steep learning curve', 'Requires US/UK bank for full features'],
  },
  {
    name: 'Goodbudget',
    type: 'International / Freemium',
    cediSupport: false,
    momoIntegration: false,
    offline: true,
    aiInsights: false,
    savingsGoals: true,
    studentFocus: false,
    rating: 3,
    pros: ['Envelope budgeting system', 'Works offline', 'Free version available', 'Simple interface'],
    cons: ['No cedi currency', 'No MoMo integration', 'Limited reports on free plan', 'Manual entry only'],
  },
  {
    name: 'Wallet by BudgetBakers',
    type: 'International / Freemium',
    cediSupport: true,
    momoIntegration: false,
    offline: true,
    aiInsights: false,
    savingsGoals: true,
    studentFocus: false,
    rating: 3,
    pros: ['Multi-currency (including GHS)', 'Bank sync in some regions', 'Shared wallets', 'Good charts'],
    cons: ['No MoMo integration', 'Limited Ghana bank connections', 'Premium required for full features', 'Not student-focused'],
  },
];

const faqs = [
  {
    q: 'What is the best free budgeting app for students in Ghana?',
    a: 'SmartSpend is the best free budgeting app built specifically for Ghanaian students. It supports GHS by default, includes Mobile Money tracking, and offers AI-powered spending insights — all at no cost.',
  },
  {
    q: 'Can I use YNAB or Goodbudget with Ghana cedis?',
    a: 'YNAB and Goodbudget do not natively support the Ghana cedi (GHS) or Mobile Money integrations. While you can manually convert amounts, they are not optimized for the Ghanaian financial ecosystem.',
  },
  {
    q: 'Is MTN MoMo enough for budgeting?',
    a: 'MTN MoMo is excellent for payments and transfers, but it lacks budgeting features like expense categorization, spending limits, savings goals, and financial reports. For real budgeting, you need a dedicated app like SmartSpend.',
  },
  {
    q: 'What features should a student budgeting app have?',
    a: 'A student budgeting app should support GHS, track Mobile Money transactions, categorize expenses (food, transport, data, etc.), set savings goals, work offline, and provide clear spending summaries.',
  },
];

const BlogBestApps = () => (
  <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-primary">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">SmartSpend</span>
        </Link>
        <Link to="/"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-3.5 w-3.5" /> Back</Button></Link>
      </div>
    </header>

    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* Hero */}
      <article className="space-y-4">
        <div className="text-xs font-semibold text-primary uppercase tracking-wider">2025 Guide</div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
          The Best Budgeting Apps for Students in Ghana (2025 Edition)
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Finding the right budgeting app as a student in Ghana means looking beyond international tools. You need cedi support, Mobile Money integration, and features that match how you actually spend. We compared the top options — including SmartSpend, MTN MoMo, YNAB, and Goodbudget — so you can pick the best one.
        </p>
      </article>

      {/* Quick comparison table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold text-foreground">App</th>
                <th className="text-center p-3 font-semibold text-foreground">GHS</th>
                <th className="text-center p-3 font-semibold text-foreground">MoMo</th>
                <th className="text-center p-3 font-semibold text-foreground">Offline</th>
                <th className="text-center p-3 font-semibold text-foreground">AI</th>
                <th className="text-center p-3 font-semibold text-foreground">Goals</th>
                <th className="text-center p-3 font-semibold text-foreground">Free</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apps.map((app) => (
                <tr key={app.name} className="hover:bg-muted/50">
                  <td className="p-3 font-medium text-foreground">{app.name}</td>
                  <td className="p-3 text-center">{app.cediSupport ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}</td>
                  <td className="p-3 text-center">{app.momoIntegration ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}</td>
                  <td className="p-3 text-center">{app.offline ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}</td>
                  <td className="p-3 text-center">{app.aiInsights ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}</td>
                  <td className="p-3 text-center">{app.savingsGoals ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}</td>
                  <td className="p-3 text-center">{app.name === 'SmartSpend' || app.name === 'MTN MoMo' ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed reviews */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Detailed Reviews</h2>
        {apps.map((app) => (
          <Card key={app.name} className="overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{app.name}</h3>
                  <p className="text-xs text-muted-foreground">{app.type}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < app.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} />
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Pros</p>
                  <ul className="space-y-1">
                    {app.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Cons</p>
                  <ul className="space-y-1">
                    {app.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Why SmartSpend wins for Ghana */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Why SmartSpend Wins for Ghanaian Students</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Built for Mobile Money</p>
                <p className="text-sm text-muted-foreground">Track MTN MoMo and Telecel Cash transactions alongside cash and bank spending.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Download className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Works Offline</p>
                <p className="text-sm text-muted-foreground">No internet? No problem. Record expenses and sync when you are back online.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">AI Spending Insights</p>
                <p className="text-sm text-muted-foreground">Get personalized tips on where to cut back and how to save more each month.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Privacy First</p>
                <p className="text-sm text-muted-foreground">Your financial data stays private. No ads targeting you based on spending habits.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">{faq.q}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 py-6">
        <h2 className="text-xl font-bold text-foreground">Ready to Start Budgeting Smarter?</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Join thousands of Ghanaian students already using SmartSpend to track every cedi and reach their savings goals.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground">Get Started Free</Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">Learn More</Button>
          </Link>
        </div>
      </section>
    </main>
  </div>
);

export default BlogBestApps;
