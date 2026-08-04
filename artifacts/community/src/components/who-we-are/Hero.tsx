"use client";

import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";
import { ProvenStamp } from "./ProvenStamp";

export function Hero() {
  const ref = useReveal<HTMLElement>();
  const { eyebrow, lines, lead, chips } = whoWeAre.hero;
  const colorClass = {
    ink: "wwa-line-ink",
    orange: "wwa-line-orange",
    blue: "wwa-line-blue",
  } as const;

  return (
    <section ref={ref} className="wwa-section wwa-section--flush wwa-reveal" aria-labelledby="wwa-hero-title">
      <div className="wwa-container wwa-hero-grid">
        <div>
          <p className="wwa-eyebrow">{eyebrow}</p>
          <h1 id="wwa-hero-title" className="wwa-h1">
            {lines.map((line) => (
              <span key={line.text} className={colorClass[line.color]} style={{ display: "block" }}>
                {line.text}
              </span>
            ))}
          </h1>
          <p className="wwa-lead">{lead}</p>
          <div className="wwa-chips">
            {chips.map((chip) => (
              <div key={chip.n} className="wwa-chip">
                <span>{chip.n}</span>
                <span>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="wwa-stamp-wrap">
          <ProvenStamp />
        </div>
      </div>
    </section>
  );
}
