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
      className="manifesto-section w-full mb-8 sm:mb-10 overflow-x-clip"
      aria-label="Every answer here is a first-hand eXperience. Nothing is marked Proven until other people who did the same thing confirm it matches."
    >
      <div className="absolute inset-0 bg-white dark:bg-[#101F38] -z-10" />
      <div className={`manifesto-stack ${inView ? "is-in" : ""}`}>
        <span className="manifesto-line manifesto-line-sm">Every answer here</span>
        <span className="manifesto-line manifesto-line-lg">
          is a first-hand{" "}
          <span className="manifesto-experience">
            e<span className="manifesto-experience-x">X</span>perience
          </span>
        </span>
        <span className="manifesto-line manifesto-line-lg">
          Nothing is marked{" "}
          <span className="manifesto-proven">Proven</span>
        </span>
        <span className="manifesto-line manifesto-line-md">
          until others confirm it matches
        </span>
      </div>
    </section>
  );
}
