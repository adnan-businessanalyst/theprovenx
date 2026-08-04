"use client";

import { whoWeAre } from "@/content/whoWeAre";

export function ProvenStamp() {
  const text = whoWeAre.hero.stampText.repeat(2);
  const pathId = "wwa-stamp-circle";

  return (
    <svg
      className="wwa-stamp"
      viewBox="0 0 200 200"
      width="100%"
      style={{ width: "clamp(140px, 17vw, 196px)", height: "auto" }}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <path
          id={pathId}
          d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          fill="none"
        />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="#FF6A13" strokeWidth="6" />
      <circle cx="100" cy="100" r="78" fill="#FFE8D6" />
      <g transform="translate(100 100)">
        <path
          d="M-18 2 L-6 14 L20 -14"
          fill="none"
          stroke="#FF6A13"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="wwa-stamp-spin" style={{ transformOrigin: "100px 100px", animation: "wwa-spin 46s linear infinite" }}>
        <text fill="#C74400" fontSize="11" fontFamily="var(--font-mono), monospace" letterSpacing="2.2">
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
      </g>
      <style>{`@keyframes wwa-spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
