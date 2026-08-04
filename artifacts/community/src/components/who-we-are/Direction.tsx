"use client";

import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

export function Direction() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.direction;

  return (
    <section ref={ref} id={c.id} className="wwa-section wwa-reveal" aria-labelledby="wwa-direction-title">
      <div className="wwa-container">
        <p className="wwa-eyebrow">{c.eyebrow}</p>
        <h2 id="wwa-direction-title" className="wwa-h2">
          {c.title}
        </h2>
        <div className="wwa-direction-grid">
          {c.items.map((item) => (
            <article key={item} className="wwa-direction-card">
              {item}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
