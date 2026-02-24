const AdPlaceholder = ({ variant = 'banner' }: { variant?: 'banner' | 'sidebar' | 'inline' }) => {
  const sizes = {
    banner: 'h-20 w-full',
    sidebar: 'h-64 w-full',
    inline: 'h-16 w-full',
  };

  return (
    <div className={`${sizes[variant]} rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center`}>
      <span className="text-xs text-muted-foreground/50">Ad Space</span>
    </div>
  );
};

export default AdPlaceholder;
