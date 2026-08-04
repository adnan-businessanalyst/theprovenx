"use client";

import { Info } from "lucide-react";
import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

export function ProofBoard() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.proof;

  return (
    <section ref={ref} id={c.id} className="wwa-section wwa-reveal" aria-labelledby="wwa-proof-title">
      <div className="wwa-container">
        <p className="wwa-eyebrow">{c.eyebrow}</p>
        <h2 id="wwa-proof-title" className="wwa-h2">
          {c.title}
        </h2>
        <p className="wwa-lead">{c.lead}</p>
        <div className="wwa-proof-grid">
          {c.stats.map((stat) => {
            const filled = stat.value != null;
            return (
              <div
                key={stat.label}
                className={`wwa-proof-slot ${filled ? "is-filled" : ""}`}
              >
                <div className="wwa-proof-value">{filled ? stat.value : "—"}</div>
                <div className="wwa-proof-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
        <div className="wwa-info" role="note">
          <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <p style={{ margin: 0 }}>{c.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
