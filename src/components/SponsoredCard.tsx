const SponsoredCard = ({ title, description, ctaText, ctaUrl }: {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl?: string;
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">
        Sponsored
      </span>
      <h4 className="mt-2 font-semibold text-card-foreground">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <a
        href={ctaUrl || '#'}
        className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
      >
        {ctaText} →
      </a>
    </div>
  );
};

export default SponsoredCard;
