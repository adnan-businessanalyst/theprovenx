"use client";

import Link from "next/link";
import { whoWeAre } from "@/content/whoWeAre";

export function WhoWeAreHeader() {
  const { brand, nav } = whoWeAre.header;
  return (
    <header className="wwa-header">
      <div className="wwa-container wwa-header-inner">
        <Link href="/" className="wwa-brand">
          <span className="wwa-brand-mark" aria-hidden="true">
            X
          </span>
          {brand}
        </Link>
        <nav className="wwa-nav" aria-label="Page sections">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
