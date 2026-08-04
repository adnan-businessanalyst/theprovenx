import type { Metadata } from "next";
import { buildMetadata, jsonLdScript } from "@/lib/seo";
import { whoWeAre } from "@/content/whoWeAre";
import { WhoWeAreHeader } from "@/components/who-we-are/WhoWeAreHeader";
import { Hero } from "@/components/who-we-are/Hero";
import { WhyWeStarted } from "@/components/who-we-are/WhyWeStarted";
import { WhatWeDo } from "@/components/who-we-are/WhatWeDo";
import { ProvenSection } from "@/components/who-we-are/ProvenSection";
import { Approach } from "@/components/who-we-are/Approach";
import { Founder } from "@/components/who-we-are/Founder";
import { ProofBoard } from "@/components/who-we-are/ProofBoard";
import { Direction } from "@/components/who-we-are/Direction";
import { ClosingCta } from "@/components/who-we-are/ClosingCta";
import { WhoWeAreFooter } from "@/components/who-we-are/WhoWeAreFooter";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Who We Are",
    description: whoWeAre.meta.description,
    path: "/who-we-are",
  }),
  title: whoWeAre.meta.title,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TheProvenX",
  description: whoWeAre.meta.description,
  founder: {
    "@type": "Person",
    name: "Adnan Akhonbay",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Riyadh",
    addressCountry: "SA",
  },
};

export default function WhoWeArePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(orgJsonLd)}
      />
      <WhoWeAreHeader />
      <main>
        <Hero />
        <WhyWeStarted />
        <WhatWeDo />
        <ProvenSection />
        <Approach />
        <Founder />
        <ProofBoard />
        <Direction />
        <ClosingCta />
      </main>
      <WhoWeAreFooter />
    </>
  );
}
