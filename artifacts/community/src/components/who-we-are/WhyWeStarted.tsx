"use client";

import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

const rotations = [-4, 3, -2, 4, -3];
const positions = [
  { top: "8%", left: "4%" },
  { top: "12%", right: "6%" },
  { top: "48%", left: "0%" },
  { top: "52%", right: "2%" },
  { bottom: "8%", left: "28%" },
];

export function WhyWeStarted() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.why;

  return (
    <section ref={ref} id={c.id} className="wwa-section wwa-reveal" aria-labelledby="wwa-why-title">
      <div className="wwa-container wwa-two-col">
        <div>
          <p className="wwa-eyebrow">{c.eyebrow}</p>
          <h2 id="wwa-why-title" className="wwa-h2">
            {c.title}
          </h2>
          <p className="wwa-lead">{c.lead}</p>
          <ul className="wwa-bullets">
            {c.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="wwa-scatter" aria-hidden="true">
          {c.notes.map((note, i) => (
            <div
              key={note}
              className="wwa-note"
              style={{
                ...positions[i],
                transform: `rotate(${rotations[i]}deg)`,
              }}
            >
              {note}
            </div>
          ))}
          <div className="wwa-gather">{c.gatherPill}</div>
        </div>
      </div>
    </section>
  );
}
