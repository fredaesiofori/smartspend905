import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TransactionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Pencil, Check, Tag } from 'lucide-react';

const CategoryManager = () => {
  const { categories, addCategory, renameCategory, deleteCategory } = useApp();
  const [tab, setTab] = useState<TransactionType>('expense');
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCategory(tab, newName);
    setNewName('');
  };

  const startEdit = (name: string) => {
    setEditing(name);
    setEditValue(name);
  };

  const saveEdit = (oldName: string) => {
    renameCategory(tab, oldName, editValue);
    setEditing(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
      <h3 className="font-semibold text-card-foreground flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" /> Manage Categories
      </h3>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={tab === 'expense' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => setTab('expense')}
        >
          Expense ({categories.expense.length})
        </Button>
        <Button
          type="button"
          variant={tab === 'income' ? 'default' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => setTab('income')}
        >
          Income ({categories.income.length})
        </Button>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder={`New ${tab} category...`}
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {categories[tab].map(c => (
          <div key={c} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
            {editing === c ? (
              <>
                <Input value={editValue} onChange={e => setEditValue(e.target.value)} className="h-8" autoFocus />
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => saveEdit(c)}>
                  <Check className="h-4 w-4 text-income" />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-card-foreground">{c}</span>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(c)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteCategory(tab, c)}>
                  <X className="h-4 w-4 text-expense" />
                </Button>
              </>
            )}
          </div>
        ))}
        {categories[tab].length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No categories yet. Add one above.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
