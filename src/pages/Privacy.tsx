import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Privacy = () => (
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
      <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
      <div className="prose prose-sm text-muted-foreground space-y-4 leading-relaxed">
        <p>SmartSpend ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.</p>
        <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
        <p>We collect information you provide when creating an account (email address, name) and financial data you voluntarily enter (transactions, budgets, categories). We do not access your bank accounts or mobile money wallets.</p>
        <h2 className="text-lg font-semibold text-foreground">How We Use Your Information</h2>
        <p>Your data is used solely to provide the SmartSpend service — tracking expenses, generating reports, and delivering insights. We never sell your personal data to third parties.</p>
        <h2 className="text-lg font-semibold text-foreground">Data Security</h2>
        <p>All data is encrypted in transit and at rest. We use industry-standard security measures to protect your information from unauthorized access.</p>
        <h2 className="text-lg font-semibold text-foreground">Cookies & Analytics</h2>
        <p>We may use cookies and analytics tools to improve our service. These do not contain personally identifiable financial information.</p>
        <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
      </div>
    </main>
  </div>
);

export default Privacy;
