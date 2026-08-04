"use client";

import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";
import { ProvenDemo } from "./ProvenDemo";

export function ProvenSection() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.proven;

  return (
    <section
      ref={ref}
      id={c.id}
      className="wwa-section wwa-reveal"
      aria-labelledby="wwa-proven-title"
      style={{ borderTop: "none", paddingTop: "clamp(24px, 4vw, 40px)" }}
    >
      <div className="wwa-container">
        <div className="wwa-proven-panel">
          <p className="wwa-eyebrow wwa-eyebrow--on-dark">{c.eyebrow}</p>
          <h2 id="wwa-proven-title" className="wwa-h2">
            {c.title}
          </h2>
          <p className="wwa-lead">{c.lead}</p>
          <div className="wwa-two-col" style={{ marginTop: "1.75rem" }}>
            <ol className="wwa-steps">
              {c.steps.map((step, i) => (
                <li key={step.title}>
                  <span className="wwa-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <p className="wwa-step-title">{step.title}</p>
                  <p className="wwa-step-body">{step.body}</p>
                </li>
              ))}
            </ol>
            <ProvenDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
