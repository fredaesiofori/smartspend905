import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => (
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
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">About SmartSpend</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4 leading-relaxed">
        <p>SmartSpend is a simple, login-based budget-tracking web app designed specifically for students and young earners in Ghana. Our mission is to help every Ghanaian understand where their money goes — and make smarter financial decisions as a result.</p>
        <p>The idea was born out of a personal struggle. Our founder used to spend money and forget where it went. At the end of every month, there was nothing saved and no clarity. SmartSpend was built to solve that problem — first for the founder, and then for everyone who faces the same challenge.</p>
        <p>We believe financial literacy starts with awareness. When you can see your spending habits clearly — broken down by category, week, and month — you naturally start making better choices. That's the power of SmartSpend.</p>
        <h2 className="text-lg font-semibold text-foreground">Our Values</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-foreground">Simplicity</strong> — Finance tracking should be easy, not complicated.</li>
          <li><strong className="text-foreground">Privacy</strong> — Your data belongs to you. We never sell it.</li>
          <li><strong className="text-foreground">Accessibility</strong> — Free to use, mobile-first, built for Ghana.</li>
          <li><strong className="text-foreground">Impact</strong> — Every cedi tracked is a step toward financial freedom.</li>
        </ul>
        <div className="flex items-center gap-2 pt-4 text-primary font-semibold">
          <Heart className="h-4 w-4" /> Made with love in Ghana 🇬🇭
        </div>
      </div>
    </main>
  </div>
);

export default About;
