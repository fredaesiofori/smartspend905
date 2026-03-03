import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface ImpulseAlertProps {
  open: boolean;
  amount: number;
  category: string;
  averageSpend: number;
  currencySymbol: string;
  onProceed: () => void;
  onCancel: () => void;
  onMarkNecessary: () => void;
}

const ImpulseAlert = ({
  open,
  amount,
  category,
  averageSpend,
  currencySymbol,
  onProceed,
  onCancel,
  onMarkNecessary,
}: ImpulseAlertProps) => {
  const ratio = averageSpend > 0 ? (amount / averageSpend).toFixed(1) : '∞';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-warning/20">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <DialogTitle className="text-lg">⚠️ Impulse Alert</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            This <strong>{category}</strong> purchase of{' '}
            <strong>
              {currencySymbol}{amount.toLocaleString('en', { minimumFractionDigits: 2 })}
            </strong>{' '}
            is <strong>{ratio}x</strong> your average spending of{' '}
            <strong>
              {currencySymbol}{averageSpend.toLocaleString('en', { minimumFractionDigits: 2 })}
            </strong>{' '}
            in this category.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-sm text-muted-foreground">
          💡 Take a moment to consider if this purchase is truly necessary. Impulsive spending is the #1 budget killer.
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={onProceed} variant="destructive" className="w-full">
            Proceed Anyway
          </Button>
          <Button onClick={onMarkNecessary} variant="outline" className="w-full">
            Mark as Necessary
          </Button>
          <Button onClick={onCancel} variant="ghost" className="w-full">
            Cancel Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImpulseAlert;
