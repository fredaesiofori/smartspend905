import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES, TransactionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ImpulseAlert from './ImpulseAlert';

const TransactionForm = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { addTransaction, transactions, settings, currencySymbol, categories } = useApp();
  const { user, isGuest } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [impulseOpen, setImpulseOpen] = useState(false);
  const [impulseData, setImpulseData] = useState({ avg: 0 });
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggestCategory = async () => {
    if (!notes.trim()) {
      toast({ title: 'Add a note first', description: 'Describe what this expense is for so AI can categorize it.' });
      return;
    }
    setSuggesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('categorize-expense', {
        body: { description: notes, categories: CATEGORIES[type] },
      });
      if (error) throw error;
      if (data?.category) {
        setCategory(data.category);
        toast({ title: '✨ Suggested', description: `Categorized as "${data.category}"` });
      }
    } catch (err: any) {
      toast({ title: 'Could not suggest', description: err?.message || 'Try again later.', variant: 'destructive' });
    } finally {
      setSuggesting(false);
    }
  };

  const getCategoryAverage = (cat: string) => {
    const catTxns = transactions.filter(t => t.category === cat && t.type === 'expense');
    if (catTxns.length === 0) return 0;
    return catTxns.reduce((s, t) => s + t.amount, 0) / catTxns.length;
  };

  const logImpulseAlert = async (action: string, avg: number) => {
    if (!user || isGuest) return;
    try {
      await supabase.from('impulse_alerts' as any).insert({
        user_id: user.id,
        transaction_amount: parseFloat(amount),
        category,
        category_avg: avg,
        action,
      } as any);
    } catch (e) {
      console.error('Failed to log impulse alert:', e);
    }
  };

  const submitTransaction = () => {
    addTransaction({ amount: parseFloat(amount), type, category, date, notes });
    setAmount('');
    setCategory('');
    setNotes('');
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    const numAmount = parseFloat(amount);

    // Check impulse mode for expenses
    if (settings.impulseMode && type === 'expense') {
      const avg = getCategoryAverage(category);
      if (avg > 0 && numAmount > avg * 2) {
        setImpulseData({ avg });
        setImpulseOpen(true);
        return;
      }
    }

    submitTransaction();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Transaction
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className={`flex-1 ${type === 'income' ? 'bg-income text-income-foreground hover:bg-income/90' : ''}`}
                onClick={() => { setType('income'); setCategory(''); }}
              >
                Income
              </Button>
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className={`flex-1 ${type === 'expense' ? 'bg-expense text-expense-foreground hover:bg-expense/90' : ''}`}
                onClick={() => { setType('expense'); setCategory(''); }}
              >
                Expense
              </Button>
            </div>

            <div>
              <Label>Amount</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01" step="0.01" required />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>Category</Label>
                <button
                  type="button"
                  onClick={handleSuggestCategory}
                  disabled={suggesting}
                  className="text-xs flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
                >
                  {suggesting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  AI suggest
                </button>
              </div>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES[type].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. lunch at KFC, uber to school..." />
            </div>

            <Button type="submit" className="w-full">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ImpulseAlert
        open={impulseOpen}
        amount={parseFloat(amount) || 0}
        category={category}
        averageSpend={impulseData.avg}
        currencySymbol={currencySymbol}
        onProceed={() => {
          logImpulseAlert('proceeded', impulseData.avg);
          setImpulseOpen(false);
          submitTransaction();
        }}
        onCancel={() => {
          logImpulseAlert('cancelled', impulseData.avg);
          setImpulseOpen(false);
        }}
        onMarkNecessary={() => {
          logImpulseAlert('marked_necessary', impulseData.avg);
          setImpulseOpen(false);
          submitTransaction();
        }}
      />
    </>
  );
};

export default TransactionForm;
