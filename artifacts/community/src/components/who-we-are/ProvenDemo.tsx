"use client";

import { useMemo, useState } from "react";
import { whoWeAre } from "@/content/whoWeAre";

const NEEDED = 5;

export function ProvenDemo() {
  const d = whoWeAre.proven.demo;
  const [count, setCount] = useState(0);
  const done = count >= NEEDED;

  const status = useMemo(() => {
    if (done) return d.statusProven;
    const left = NEEDED - count;
    return d.moreToGo(left);
  }, [count, done, d]);

  function confirm() {
    if (done) return;
    setCount((c) => Math.min(NEEDED, c + 1));
  }

  return (
    <div className="wwa-demo">
      <div className="wwa-demo-top">
        <span className="wwa-mono">{d.label}</span>
        <span className="wwa-mono" aria-live="polite">
          {status}
        </span>
      </div>
      <p className="wwa-demo-q">{d.question}</p>
      <div className="wwa-answer">
        <div className="wwa-answer-head">
          <div className="wwa-avatar" aria-hidden="true">
            N
          </div>
          <div className="wwa-byline">
            <strong>{d.answerer}</strong>
            <span>{d.answerMeta}</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--ink-soft)" }}>{d.answerBody}</p>
        <div className="wwa-helpful">✓ {d.helpful}</div>
      </div>
      <div className="wwa-confirm">
        <div className="wwa-pips" aria-hidden="true">
          {Array.from({ length: NEEDED }, (_, i) => (
            <div key={i} className={`wwa-pip ${i < count ? "is-on" : ""}`}>
              ✓
            </div>
          ))}
        </div>
        <button
          type="button"
          className="wwa-confirm-btn"
          onClick={confirm}
          disabled={done}
        >
          {done ? d.proven : d.confirm}
        </button>
        <span className="wwa-counter" aria-live="polite">
          {count} / {NEEDED}
        </span>
      </div>
      <svg
        className={`wwa-proven-stamp ${done ? "is-shown" : ""}`}
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="52" fill="none" stroke="#FF6A13" strokeWidth="4" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#FF6A13" strokeWidth="1.5" />
        <text
          x="60"
          y="58"
          textAnchor="middle"
          fill="#C74400"
          fontFamily="var(--font-display), sans-serif"
          fontWeight="800"
          fontSize="16"
          letterSpacing="1"
        >
          PROVEN
        </text>
        <text
          x="60"
          y="76"
          textAnchor="middle"
          fill="#54638A"
          fontFamily="var(--font-mono), monospace"
          fontSize="7"
          letterSpacing="1.5"
        >
          BY COMMUNITY
        </text>
      </svg>
    </div>
  );
}
