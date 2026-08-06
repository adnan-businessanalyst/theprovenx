"use client";

import { useEffect, useRef, useState } from "react";

export function Manifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="manifesto-section w-[100vw] relative left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2 mb-10 overflow-hidden"
      aria-label="Every answer here is a first-hand account. Nothing is marked Proven until other people who did the same thing confirm it matches."
    >
      <div className="absolute inset-0 bg-white dark:bg-[#101F38] -z-10" />
      <div className={`manifesto-stack ${inView ? "is-in" : ""}`}>
        <span className="manifesto-line manifesto-line-sm">Every answer here</span>
        <span className="manifesto-line manifesto-line-lg">
          is a first-hand account
        </span>
        <span className="manifesto-line manifesto-line-lg">
          Nothing is marked Proven
        </span>
        <span className="manifesto-line manifesto-line-md">
          until others confirm it matches
        </span>
      </div>
    </section>
  );
}
