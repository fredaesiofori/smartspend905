import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import TransactionForm from '@/components/TransactionForm';
import AdPlaceholder from '@/components/AdPlaceholder';
import { CATEGORIES, TransactionType } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Transactions = () => {
  const { transactions, deleteTransaction, updateTransaction, currencySymbol } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ amount: '', category: '', notes: '', date: '' });

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !search || t.category.toLowerCase().includes(search.toLowerCase()) || t.notes.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [transactions, search, filterType, filterCategory]);

  const allCategories = [...new Set(transactions.map(t => t.category))];

  const startEdit = (t: typeof transactions[0]) => {
    setEditId(t.id);
    setEditData({ amount: t.amount.toString(), category: t.category, notes: t.notes, date: t.date });
  };

  const saveEdit = () => {
    if (editId) {
      updateTransaction(editId, { amount: parseFloat(editData.amount), category: editData.category, notes: editData.notes, date: editData.date });
      setEditId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">{transactions.length} total transactions</p>
        </div>
        <TransactionForm />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Ad */}
      {filtered.length > 3 && <AdPlaceholder variant="inline" />}

      {/* List */}
      <div className="bg-card rounded-lg border border-border shadow-card divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No transactions found.</div>
        ) : (
          filtered.map((t, i) => (
            <div key={t.id}>
              <div className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-income' : 'bg-expense'}`} />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{t.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {t.notes && ` · ${t.notes}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}{currencySymbol}{t.amount.toLocaleString('en', { minimumFractionDigits: 2 })}
                  </span>
                  <button onClick={() => startEdit(t)} className="p-1.5 rounded hover:bg-accent transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => deleteTransaction(t.id)} className="p-1.5 rounded hover:bg-expense/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-expense" />
                  </button>
                </div>
              </div>
              {/* Inline ad every 5 items */}
              {i > 0 && (i + 1) % 5 === 0 && i < filtered.length - 1 && <AdPlaceholder variant="inline" />}
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Amount</Label><Input type="number" value={editData.amount} onChange={e => setEditData(p => ({ ...p, amount: e.target.value }))} /></div>
            <div><Label>Category</Label><Input value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))} /></div>
            <div><Label>Date</Label><Input type="date" value={editData.date} onChange={e => setEditData(p => ({ ...p, date: e.target.value }))} /></div>
            <div><Label>Notes</Label><Input value={editData.notes} onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))} /></div>
            <Button onClick={saveEdit} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
