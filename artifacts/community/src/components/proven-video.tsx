"use client";

import { useTranslation } from "react-i18next";

export function ProvenVideo() {
  const { t } = useTranslation();

  return (
    <section className="w-[100vw] relative left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-[#FAF8F4] dark:bg-muted/30 py-12 mb-10">
      <div className="max-w-[1180px] mx-auto px-[28px]">
        <div className="bg-[#FFFFFF] dark:bg-card border border-[#E4E1DA] dark:border-border rounded-[18px] p-[32px] shadow-sm">
          <div className="text-center mb-8 flex flex-col items-center">
            <p className="uppercase text-[11.5px] font-semibold tracking-[0.12em] text-[#E4640D] dark:text-primary mb-3">
              {t("how_it_works.eyebrow")}
            </p>
            <h2 className="font-serif text-[27px] font-semibold tracking-[-0.02em] text-[#101F38] dark:text-foreground mb-3 leading-tight">
              {t("how_it_works.headline")}
            </h2>
            <p className="text-[13.5px] text-[#5A6B85] dark:text-muted-foreground">
              {t("how_it_works.muted")}
            </p>
          </div>

          <div className="relative w-full overflow-hidden rounded-[14px] border border-[#E4E1DA] dark:border-border bg-[#101F38]/5 dark:bg-muted/40">
            <video
              className="w-full h-auto max-h-[min(70vh,720px)] object-contain bg-black"
              controls
              playsInline
              preload="metadata"
              aria-label={t("how_it_works.headline")}
            >
              <source src="/videos/how-proven-works.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
