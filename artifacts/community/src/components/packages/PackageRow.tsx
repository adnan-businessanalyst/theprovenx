import { packagesContent } from "@/content/packages";

type PackageOffer = (typeof packagesContent.packages)[number];

export function PackageRow({ pkg }: { pkg: PackageOffer }) {
  const headers = packagesContent.tableHeaders;

  return (
    <article
      id={pkg.id}
      className="scroll-mt-28 rounded-3xl border bg-card p-6 md:p-8 shadow-sm"
    >
      <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-3">
        {pkg.name}
      </h3>
      <p className="text-muted-foreground text-base md:text-lg max-w-3xl mb-6">
        {pkg.description}
      </p>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[42rem] text-left border-collapse">
          <caption className="sr-only">
            {pkg.name} tiers — database size, monthly sessions, peak concurrent
            users, development price, and monthly fees
          </caption>
          <thead>
            <tr className="border-b bg-muted/40">
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {headers.tier}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {headers.databaseSize}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {headers.monthlySessions}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {headers.peakConcurrentUsers}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {headers.developmentPrice}
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {headers.monthlyFees}
              </th>
            </tr>
          </thead>
          <tbody>
            {pkg.tiers.map((tier) => (
              <tr
                key={tier.id}
                className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
              >
                <th
                  scope="row"
                  className="px-4 py-3.5 text-sm font-bold uppercase tracking-widest text-primary whitespace-nowrap"
                >
                  {tier.name}
                </th>
                <td className="px-4 py-3.5 text-base font-serif font-bold">
                  {tier.limits.databaseSize}
                </td>
                <td className="px-4 py-3.5 text-base font-serif font-bold">
                  {tier.limits.monthlySessions}
                </td>
                <td className="px-4 py-3.5 text-base font-serif font-bold">
                  {tier.limits.peakConcurrentUsers}
                </td>
                <td className="px-4 py-3.5 text-base font-serif font-bold">
                  {tier.developmentPrice}
                </td>
                <td className="px-4 py-3.5 text-base font-serif font-bold">
                  {tier.monthlyFees}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
