interface SeoTextProps {
  paragraphs: string[];
}

export const SeoText = ({ paragraphs }: SeoTextProps) => {
  if (paragraphs.length === 0) return null;

  return (
    <section className="border-t border-border bg-secondary/10 py-8">
      <div className="container max-w-3xl">
        {paragraphs.map((text, i) => (
          <p key={i} className="mb-4 text-sm leading-relaxed text-muted-foreground last:mb-0">
            {text}
          </p>
        ))}
      </div>
    </section>
  );
};
