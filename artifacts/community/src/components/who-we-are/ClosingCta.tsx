"use client";

import Link from "next/link";
import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

export function ClosingCta() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.cta;

  return (
    <section ref={ref} className="wwa-section wwa-section--flush wwa-reveal" aria-labelledby="wwa-cta-title">
      <div className="wwa-container">
        <div className="wwa-cta">
          <h2 id="wwa-cta-title" className="wwa-h2">
            {c.title}
          </h2>
          <p>{c.body}</p>
          <div className="wwa-cta-actions">
            <Link href={c.ask.href} className="wwa-btn wwa-btn--solid">
              {c.ask.label}
            </Link>
            <Link href={c.project.href} className="wwa-btn wwa-btn--ghost">
              {c.project.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
