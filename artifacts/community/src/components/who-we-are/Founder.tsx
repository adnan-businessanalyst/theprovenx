"use client";

import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

export function Founder() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.founder;

  return (
    <section ref={ref} id={c.id} className="wwa-section wwa-reveal" aria-labelledby="wwa-founder-title">
      <div className="wwa-container wwa-two-col" style={{ alignItems: "center" }}>
        <div
          className="wwa-founder-tile"
          aria-hidden="true"
          // Ready for next/image swap later without layout shift
          style={{ position: "relative" }}
        >
          {c.monogram}
        </div>
        <div>
          <p className="wwa-eyebrow">{c.eyebrow}</p>
          <h2 id="wwa-founder-title" className="sr-only">
            Built around people
          </h2>
          <blockquote className="wwa-quote">{c.quote}</blockquote>
          <p className="wwa-attr">
            {c.name} <span>— {c.role}</span>
          </p>
          <p className="wwa-lead" style={{ marginBottom: 0 }}>
            {c.note}
          </p>
        </div>
      </div>
    </section>
  );
}
