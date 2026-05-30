import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Target, Trash2, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  icon: string;
}

const ICONS = ['🎯', '🏠', '🚗', '✈️', '🎓', '💍', '💼', '📱', '💻', '🎁'];

const SavingsGoals = () => {
  const { user, isGuest } = useAuth();
  const { currencySymbol } = useApp();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [contribOpen, setContribOpen] = useState<Goal | null>(null);
  const [form, setForm] = useState({ name: '', target: '', deadline: '', icon: '🎯' });
  const [contribAmt, setContribAmt] = useState('');

  const load = async () => {
    if (!user || isGuest) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('savings_goals' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else setGoals((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const createGoal = async () => {
    if (!user || !form.name || !form.target) return;
    const { error } = await supabase.from('savings_goals' as any).insert({
      user_id: user.id,
      name: form.name,
      target_amount: parseFloat(form.target),
      deadline: form.deadline || null,
      icon: form.icon,
    });
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Goal created! 🎯' });
    setForm({ name: '', target: '', deadline: '', icon: '🎯' });
    setOpen(false);
    load();
  };

  const addContribution = async () => {
    if (!contribOpen || !contribAmt) return;
    const newAmt = Number(contribOpen.current_amount) + parseFloat(contribAmt);
    const { error } = await supabase.from('savings_goals' as any)
      .update({ current_amount: newAmt })
      .eq('id', contribOpen.id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Contribution added! 💰' });
    setContribAmt('');
    setContribOpen(null);
    load();
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('savings_goals' as any).delete().eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    load();
  };

  if (isGuest) {
    return <div className="text-center py-12 text-muted-foreground">Sign in to create savings goals.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Set targets and track your progress.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Savings Goal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ICONS.map(i => (
                    <button key={i} type="button" onClick={() => setForm({ ...form, icon: i })}
                      className={`text-2xl p-2 rounded-lg border ${form.icon === i ? 'border-primary bg-primary/10' : 'border-border'}`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Goal Name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., New Laptop" />
              </div>
              <div>
                <Label>Target Amount ({currencySymbol})</Label>
                <Input type="number" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} placeholder="5000" />
              </div>
              <div>
                <Label>Deadline (optional)</Label>
                <Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createGoal} className="bg-gradient-primary">Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : goals.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-10 text-center shadow-card">
          <Target className="h-12 w-12 mx-auto text-primary mb-3" />
          <p className="font-semibold text-foreground">No goals yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first savings goal to start tracking progress.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map(g => {
            const pct = Math.min(100, (Number(g.current_amount) / Number(g.target_amount)) * 100);
            const done = pct >= 100;
            return (
              <div key={g.id} className="bg-card border border-border rounded-lg p-5 shadow-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{g.icon}</span>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{g.name}</h3>
                      {g.deadline && <p className="text-xs text-muted-foreground">by {new Date(g.deadline).toLocaleDateString()}</p>}
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(g.id)} className="text-muted-foreground hover:text-expense">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-foreground">{currencySymbol}{Number(g.current_amount).toLocaleString()}</span>
                    <span className="text-muted-foreground">/ {currencySymbol}{Number(g.target_amount).toLocaleString()}</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold ${done ? 'text-income' : 'text-primary'}`}>
                      {done ? '🎉 Achieved!' : `${pct.toFixed(0)}% complete`}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => setContribOpen(g)}>
                      <TrendingUp className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!contribOpen} onOpenChange={(o) => !o && setContribOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add to {contribOpen?.name}</DialogTitle></DialogHeader>
          <div>
            <Label>Amount ({currencySymbol})</Label>
            <Input type="number" value={contribAmt} onChange={e => setContribAmt(e.target.value)} placeholder="100" />
          </div>
          <DialogFooter>
            <Button onClick={addContribution} className="bg-gradient-primary">Add Contribution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavingsGoals;
