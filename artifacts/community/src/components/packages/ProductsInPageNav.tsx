"use client";

import Link from "next/link";
import { Gabarito, Instrument_Sans } from "next/font/google";
import { packagesContent } from "@/content/packages";
import { usePageScrollNav } from "@/lib/page-scroll-nav";
import "@/styles/who-we-are.css";
import "@/styles/page-inpage-nav.css";

const gabarito = Gabarito({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-gabarito",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

export function ProductsInPageNav() {
  const { scrolled } = usePageScrollNav();
  const { brand, nav } = packagesContent.header;

  return (
    <div
      className={`page-inpage-nav wwa-page ${gabarito.variable} ${instrument.variable} ${
        scrolled ? "is-visible" : ""
      }`}
      aria-hidden={!scrolled}
    >
      <header className="wwa-header">
        <div className="wwa-container wwa-header-inner">
          <Link
            href="/"
            className="wwa-brand"
            tabIndex={scrolled ? undefined : -1}
          >
            <span className="wwa-brand-mark" aria-hidden="true">
              X
            </span>
            {brand}
          </Link>
          <nav className="wwa-nav" aria-label="Page sections">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={scrolled ? undefined : -1}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
}
