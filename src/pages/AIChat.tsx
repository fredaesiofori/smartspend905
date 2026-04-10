import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  "How can I save more money?",
  "Why did I overspend this month?",
  "Give me budgeting tips for students",
  "How do I create an emergency fund?",
];

const AIChat = () => {
  const { transactions, settings, currencySymbol, totalIncome, totalExpenses, balance, monthlyExpenses, budgetProgress } = useApp();
  const { isGuest } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getFinancialContext = () => {
    const recentTxns = transactions.slice(0, 20);
    const categoryBreakdown: Record<string, number> = {};
    recentTxns.filter(t => t.type === 'expense').forEach(t => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });

    return `User's financial summary:
- Currency: ${settings.currency} (${currencySymbol})
- Monthly Budget: ${currencySymbol}${settings.monthlyBudget}
- Total Income: ${currencySymbol}${totalIncome.toFixed(2)}
- Total Expenses: ${currencySymbol}${totalExpenses.toFixed(2)}
- Balance: ${currencySymbol}${balance.toFixed(2)}
- This Month's Expenses: ${currencySymbol}${monthlyExpenses.toFixed(2)}
- Budget Used: ${budgetProgress.toFixed(0)}%
- Top spending categories: ${Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k}: ${currencySymbol}${v.toFixed(2)}`).join(', ')}
- Recent transactions: ${recentTxns.slice(0, 10).map(t => `${t.type} ${currencySymbol}${t.amount} on ${t.category} (${t.date})`).join('; ')}`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          financialContext: getFinancialContext(),
        }),
      });

      if (resp.status === 429) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m getting too many requests right now. Please try again in a moment.' }]);
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        setMessages(prev => [...prev, { role: 'assistant', content: 'AI credits are low. Please try again later.' }]);
        setIsLoading(false);
        return;
      }

      if (!resp.ok || !resp.body) throw new Error('Failed to start stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantSoFar = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Financial Assistant</h1>
        <p className="text-sm text-muted-foreground">Ask me anything about your finances, budgeting, or saving tips.</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Hi! I'm your SmartSpend AI assistant</h3>
                <p className="text-sm text-muted-foreground mt-1">Ask me about your spending, savings, or budgeting tips.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs p-3 rounded-lg border border-border bg-muted/50 hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 h-fit">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-card-foreground border border-border'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 p-1.5 rounded-lg bg-gold/20 h-fit">
                  <User className="h-4 w-4 text-gold" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 p-1.5 rounded-lg bg-primary/10 h-fit">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted/50 border border-border rounded-xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          {isGuest && (
            <p className="text-xs text-muted-foreground text-center mb-2">Sign in for personalized financial insights.</p>
          )}
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your finances..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
