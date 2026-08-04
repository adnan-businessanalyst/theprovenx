"use client";

import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

export function Approach() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.approach;

  return (
    <section ref={ref} id={c.id} className="wwa-section wwa-reveal" aria-labelledby="wwa-approach-title">
      <div className="wwa-container">
        <p className="wwa-eyebrow">{c.eyebrow}</p>
        <h2 id="wwa-approach-title" className="wwa-h2">
          {c.title}
        </h2>
        <p className="wwa-lead">{c.lead}</p>
        <div className="wwa-q-grid">
          {c.questions.map((q) => (
            <article key={q} className="wwa-card wwa-q-card">
              <div className="wwa-q-mark" aria-hidden="true">
                ?
              </div>
              {q}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
