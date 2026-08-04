import type { ReactNode } from "react";
import { Gabarito, Instrument_Sans, Space_Mono } from "next/font/google";
import "@/styles/who-we-are.css";

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

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export default function WhoWeAreLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`wwa-page ${gabarito.variable} ${instrument.variable} ${spaceMono.variable}`}
    >
      {children}
    </div>
  );
}
