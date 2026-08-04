import { packagesContent } from "@/content/packages";
import { PackageRow } from "./PackageRow";

export function OurPackages() {
  const { title, subtitle, packages } = packagesContent;

  return (
    <section id="our-packages" className="scroll-mt-28 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-serif font-bold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>
        ) : null}
      </div>

      <div className="space-y-6">
        {packages.map((pkg) => (
          <PackageRow key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
