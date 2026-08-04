"use client";

import { MessageCircle, Globe2, Boxes } from "lucide-react";
import { whoWeAre } from "@/content/whoWeAre";
import { useReveal } from "@/hooks/useReveal";

export function WhatWeDo() {
  const ref = useReveal<HTMLElement>();
  const c = whoWeAre.whatWeDo;

  return (
    <section ref={ref} id={c.id} className="wwa-section wwa-reveal" aria-labelledby="wwa-do-title">
      <div className="wwa-container">
        <p className="wwa-eyebrow">{c.eyebrow}</p>
        <h2 id="wwa-do-title" className="wwa-h2">
          {c.title}
        </h2>
        <div className="wwa-cards-3">
          {c.cards.map((card) => {
            if (card.kind === "saas") {
              return (
                <article key={card.tag} className="wwa-card wwa-service-card">
                  <div className="wwa-icon-tile wwa-icon-tile--yellow" aria-hidden="true">
                    <Boxes size={22} />
                  </div>
                  <span className="wwa-mono wwa-tag">{card.tag}</span>
                  <h3 className="wwa-h3">{card.title}</h3>
                  <p style={{ color: "var(--ink-soft)", margin: 0 }}>{card.body}</p>
                  <div className="wwa-product-grid">
                    {card.products.map((p) => (
                      <div key={p.name} className="wwa-product-tile">
                        <strong>{p.name}</strong>
                        <span>{p.blurb}</span>
                      </div>
                    ))}
                  </div>
                </article>
              );
            }

            const isAnswers = card.kind === "answers";
            return (
              <article key={card.tag} className="wwa-card wwa-service-card">
                <div
                  className={`wwa-icon-tile ${isAnswers ? "wwa-icon-tile--peach" : "wwa-icon-tile--blue"}`}
                  aria-hidden="true"
                >
                  {isAnswers ? <MessageCircle size={22} /> : <Globe2 size={22} />}
                </div>
                <span className="wwa-mono wwa-tag">{card.tag}</span>
                <h3 className="wwa-h3">{card.title}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{card.body}</p>
                <ul className={`wwa-list ${isAnswers ? "wwa-list--orange" : "wwa-list--blue"}`}>
                  {card.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
