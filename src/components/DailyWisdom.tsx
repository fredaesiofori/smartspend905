import { useState, useEffect } from 'react';
import { BookOpen, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const wisdomMessages = [
  { verse: "Proverbs 21:20", text: "The wise store up choice food and olive oil, but fools gulp theirs down." },
  { verse: "Proverbs 13:11", text: "Dishonest money dwindles away, but whoever gathers money little by little makes it grow." },
  { verse: "Luke 14:28", text: "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost?" },
  { verse: "Proverbs 22:7", text: "The borrower is slave to the lender." },
  { verse: "Proverbs 27:23", text: "Be sure you know the condition of your flocks, give careful attention to your herds." },
  { verse: "Ecclesiastes 5:10", text: "Whoever loves money never has enough; whoever loves wealth is never satisfied with their income." },
  { verse: "Proverbs 11:24", text: "One person gives freely, yet gains even more; another withholds unduly, but comes to poverty." },
  { verse: "Matthew 6:21", text: "For where your treasure is, there your heart will be also." },
  { verse: "Proverbs 16:16", text: "How much better to get wisdom than gold, to get insight rather than silver!" },
  { verse: "1 Timothy 6:10", text: "For the love of money is a root of all kinds of evil." },
  { verse: "Proverbs 3:9", text: "Honor the Lord with your wealth, with the firstfruits of all your crops." },
  { verse: "Malachi 3:10", text: "Bring the whole tithe into the storehouse, that there may be food in my house." },
  { verse: "Proverbs 6:6-8", text: "Go to the ant, you sluggard; consider its ways and be wise! It stores its provisions in summer." },
  { verse: "Philippians 4:19", text: "And my God will meet all your needs according to the riches of his glory in Christ Jesus." },
];

const motivationalTips = [
  "💡 Think carefully before you spend today.",
  "💡 Every cedi saved is a step toward your future.",
  "💡 Discipline today brings freedom tomorrow.",
  "💡 Ask yourself: Is this a need or a want?",
  "💡 Small consistent savings beat big one-time efforts.",
];

const DailyWisdom = () => {
  const { settings } = useApp();
  const [currentWisdom, setCurrentWisdom] = useState(wisdomMessages[0]);
  const [tip, setTip] = useState(motivationalTips[0]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDate() % wisdomMessages.length;
    const tipIndex = today.getDate() % motivationalTips.length;
    setCurrentWisdom(wisdomMessages[dayIndex]);
    setTip(motivationalTips[tipIndex]);
  }, []);

  const refresh = () => {
    const randomIndex = Math.floor(Math.random() * wisdomMessages.length);
    const randomTip = Math.floor(Math.random() * motivationalTips.length);
    setCurrentWisdom(wisdomMessages[randomIndex]);
    setTip(motivationalTips[randomTip]);
  };

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-gold/5 rounded-xl border border-primary/20 p-5 shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-8 translate-x-8" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-gold">
            <BookOpen className="h-4 w-4 text-gold-foreground" />
          </div>
          <h3 className="font-semibold text-card-foreground text-sm">Daily Wisdom</h3>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refresh}>
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDismissed(true)}>
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="mt-3 relative z-10">
        <p className="text-sm text-card-foreground italic leading-relaxed">"{currentWisdom.text}"</p>
        <p className="text-xs text-primary font-semibold mt-2">— {currentWisdom.verse}</p>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 relative z-10">
        <p className="text-xs text-muted-foreground">{tip}</p>
      </div>
    </div>
  );
};

export default DailyWisdom;
