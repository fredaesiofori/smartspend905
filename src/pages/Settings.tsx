import { useApp } from '@/contexts/AppContext';
import { Currency } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Smartphone, ShieldAlert } from 'lucide-react';
import CategoryManager from '@/components/CategoryManager';

const currencies: { value: Currency; label: string }[] = [
  { value: 'GHS', label: '🇬🇭 GHS — Ghana Cedi' },
  { value: 'USD', label: '🇺🇸 USD — US Dollar' },
  { value: 'EUR', label: '🇪🇺 EUR — Euro' },
  { value: 'GBP', label: '🇬🇧 GBP — British Pound' },
  { value: 'NGN', label: '🇳🇬 NGN — Nigerian Naira' },
  { value: 'ZAR', label: '🇿🇦 ZAR — South African Rand' },
  { value: 'KES', label: '🇰🇪 KES — Kenyan Shilling' },
];

const SettingsPage = () => {
  const { settings, updateSettings } = useApp();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your SmartSpend experience.</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Profile</h3>
        <div>
          <Label>Display Name</Label>
          <Input value={settings.name} onChange={e => updateSettings({ name: e.target.value })} />
        </div>
      </div>

      {/* Currency */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Currency</h3>
        <Select value={settings.currency} onValueChange={v => updateSettings({ currency: v as Currency })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {currencies.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Budget */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Monthly Budget</h3>
        <div>
          <Label>Budget Amount</Label>
          <Input
            type="number"
            value={settings.monthlyBudget}
            onChange={e => updateSettings({ monthlyBudget: parseFloat(e.target.value) || 0 })}
            min="0"
          />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-card-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
          </div>
          <Switch checked={settings.darkMode} onCheckedChange={v => updateSettings({ darkMode: v })} />
        </div>
      </div>

      {/* Impulse Alert Mode */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-warning" /> Impulse Alert Mode
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-card-foreground">Enable Spending Guards</p>
            <p className="text-xs text-muted-foreground">Get warned when a purchase exceeds 2x your category average</p>
          </div>
          <Switch checked={settings.impulseMode} onCheckedChange={v => updateSettings({ impulseMode: v })} />
        </div>
      </div>

      {/* Future Integrations */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-card space-y-4">
        <h3 className="font-semibold text-card-foreground">Integrations</h3>
        <p className="text-sm text-muted-foreground">Coming soon — connect your mobile money and bank accounts.</p>
        <div className="space-y-3">
          {['MTN MoMo', 'Telecel Cash', 'Bank Sync API'].map(name => (
            <div key={name} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{name}</span>
              </div>
              <Button variant="outline" size="sm" disabled>Coming Soon</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
