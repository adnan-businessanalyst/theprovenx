import { packagesContent } from "@/content/packages";

export function UsagePolicy() {
  const { usagePolicy } = packagesContent;

  return (
    <section
      id={usagePolicy.id}
      className="scroll-mt-28 max-w-5xl mx-auto rounded-3xl border bg-card p-6 md:p-8 shadow-sm space-y-4"
    >
      <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
        {usagePolicy.title}
      </h2>
      <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
        {usagePolicy.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
