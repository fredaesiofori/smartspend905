import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => (
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
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
        <p className="text-muted-foreground mt-2">Have questions, feedback, or need support? We'd love to hear from you.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><Phone className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Phone / WhatsApp</p>
              <p className="text-sm text-muted-foreground">0596 168 684</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Email</p>
              <p className="text-sm text-muted-foreground">support@smartspend.app</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><MapPin className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Location</p>
              <p className="text-sm text-muted-foreground">Accra, Ghana 🇬🇭</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 border border-border shadow-card">
          <h2 className="font-semibold text-card-foreground mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link to="/auth" className="text-primary hover:underline">Sign Up for SmartSpend</Link></li>
            <li><Link to="/support" className="text-primary hover:underline">Support / Donate</Link></li>
            <li><Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
            <li><Link to="/about" className="text-primary hover:underline">About SmartSpend</Link></li>
          </ul>
        </div>
      </div>
    </main>
  </div>
);

export default Contact;
