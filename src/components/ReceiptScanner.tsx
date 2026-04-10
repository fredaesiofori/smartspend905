import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ExtractedData {
  amount: number | null;
  category: string | null;
  description: string | null;
}

const ReceiptScanner = () => {
  const { addTransaction, currencySymbol } = useApp();
  const { isGuest } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please use an image under 5MB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setImagePreview(base64);
      await extractReceipt(base64);
    };
    reader.readAsDataURL(file);
  };

  const extractReceipt = async (imageBase64: string) => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!resp.ok) throw new Error('Failed to scan receipt');
      const data = await resp.json();
      
      setExtracted(data);
      if (data.amount) setAmount(data.amount.toString());
      if (data.category) setCategory(data.category);
      if (data.description) setNotes(data.description);
    } catch (err) {
      console.error('Receipt scan error:', err);
      toast({ title: 'Scan failed', description: 'Could not extract data from receipt. Please enter manually.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!amount || !category) {
      toast({ title: 'Missing info', description: 'Please fill in amount and category', variant: 'destructive' });
      return;
    }

    addTransaction({
      amount: parseFloat(amount),
      type: 'expense',
      category,
      date: new Date().toISOString().split('T')[0],
      notes: notes || 'Scanned from receipt',
    });

    toast({ title: 'Transaction added', description: `${currencySymbol}${amount} expense added from receipt scan.` });
    resetAndClose();
  };

  const resetAndClose = () => {
    setImagePreview(null);
    setExtracted(null);
    setAmount('');
    setCategory('');
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Camera className="h-4 w-4" /> Scan Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Receipt</DialogTitle>
        </DialogHeader>

        {!imagePreview ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium text-card-foreground">Take a photo or upload receipt</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={imagePreview} alt="Receipt" className="w-full max-h-48 object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                    <p className="text-xs text-muted-foreground">Analyzing receipt with AI...</p>
                  </div>
                </div>
              )}
            </div>

            {!loading && (
              <>
                {extracted && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    <p className="text-xs text-success">AI extracted data from your receipt. Please verify below.</p>
                  </div>
                )}

                <div>
                  <Label>Amount ({currencySymbol})</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0.01" step="0.01" />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.expense.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Receipt details..." />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1 gap-2">
                    <Check className="h-4 w-4" /> Save Expense
                  </Button>
                  <Button variant="outline" onClick={resetAndClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptScanner;
