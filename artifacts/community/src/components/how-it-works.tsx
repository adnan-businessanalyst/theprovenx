import { useTranslation } from "react-i18next";

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#FAF8F4] dark:bg-muted/30 py-12 mb-10">
      <div className="max-w-[1180px] mx-auto px-[28px]">
        {/* Inner Card */}
        <div className="bg-[#FFFFFF] dark:bg-card border border-[#E4E1DA] dark:border-border rounded-[18px] p-[32px] shadow-sm">
          {/* Header */}
          <div className="text-center mb-10 flex flex-col items-center">
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

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {/* Step 1 */}
            <div className="bg-[#FAF8F4] dark:bg-muted/40 border border-[#E9E5DC] dark:border-border/50 rounded-[14px] p-[20px] flex flex-col items-center text-center h-full">
              <div aria-hidden="true" className="h-[72px] flex items-center justify-center mb-4">
                <div className="flex items-end">
                  <div className="flex flex-col items-center mr-2 rtl:mr-0 rtl:ml-2">
                    <div className="w-5 h-5 rounded-full bg-[#1B4F8A] dark:bg-secondary"></div>
                    <div className="w-8 h-6 rounded-t-md bg-[#1B4F8A] dark:bg-secondary mt-1"></div>
                  </div>
                  <div className="relative bg-white dark:bg-card border border-[#E4E1DA] dark:border-border rounded-lg p-1.5 px-2.5 mb-2 shadow-sm">
                    <span className="text-[#E4640D] dark:text-primary font-bold text-lg leading-none block">?</span>
                    <div className="absolute top-1/2 -left-1.5 rtl:-left-auto rtl:-right-1.5 w-3 h-3 bg-white dark:bg-card border-l border-b border-[#E4E1DA] dark:border-border rotate-45 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="w-[30px] h-[30px] rounded-full bg-[#1B4F8A]/10 dark:bg-secondary/20 text-[#1B4F8A] dark:text-secondary font-bold flex items-center justify-center mb-4 text-sm shrink-0">1</div>
              <h3 className="text-[15px] font-semibold text-[#101F38] dark:text-foreground mb-2">{t("how_it_works.step1.title")}</h3>
              <p className="text-[13.5px] text-[#5A6B85] dark:text-muted-foreground leading-relaxed">{t("how_it_works.step1.copy")}</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF8F4] dark:bg-muted/40 border border-[#E9E5DC] dark:border-border/50 rounded-[14px] p-[20px] flex flex-col items-center text-center h-full">
              <div aria-hidden="true" className="h-[72px] flex items-center justify-center mb-4">
                <div className="flex flex-col gap-1.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-end gap-2">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1B4F8A] dark:bg-secondary"></div>
                        <div className="w-4 h-3 rounded-t-sm bg-[#1B4F8A] dark:bg-secondary mt-0.5"></div>
                      </div>
                      <div className="w-10 h-2 bg-[#E4E1DA] dark:bg-muted rounded-full mb-0.5"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[30px] h-[30px] rounded-full bg-[#1B4F8A]/10 dark:bg-secondary/20 text-[#1B4F8A] dark:text-secondary font-bold flex items-center justify-center mb-4 text-sm shrink-0">2</div>
              <h3 className="text-[15px] font-semibold text-[#101F38] dark:text-foreground mb-2">{t("how_it_works.step2.title")}</h3>
              <p className="text-[13.5px] text-[#5A6B85] dark:text-muted-foreground leading-relaxed">{t("how_it_works.step2.copy")}</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF8F4] dark:bg-muted/40 border border-[#E9E5DC] dark:border-border/50 rounded-[14px] p-[20px] flex flex-col items-center text-center h-full">
              <div aria-hidden="true" className="h-[72px] flex items-center justify-center mb-4">
                <div className="flex items-end">
                  <div className="flex flex-col items-center mr-2 rtl:mr-0 rtl:ml-2">
                    <div className="w-5 h-5 rounded-full bg-[#E4640D] dark:bg-primary"></div>
                    <div className="w-8 h-6 rounded-t-md bg-[#E4640D] dark:bg-primary mt-1"></div>
                  </div>
                  <div className="relative border-[1.5px] border-[#E4640D] dark:border-primary bg-white dark:bg-card rounded-lg w-10 h-8 mb-2">
                    <div className="absolute top-1.5 left-1.5 right-1.5 h-1 bg-[#E4640D]/30 dark:bg-primary/30 rounded-full"></div>
                    <div className="absolute top-3.5 left-1.5 right-3 h-1 bg-[#E4640D]/30 dark:bg-primary/30 rounded-full"></div>
                    
                    <div className="absolute -bottom-1.5 -right-1.5 rtl:right-auto rtl:-left-1.5 w-[14px] h-[14px] bg-[#E4640D] dark:bg-primary rounded-full flex items-center justify-center text-white border-2 border-white dark:border-card">
                      <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[30px] h-[30px] rounded-full bg-[#E4640D]/10 dark:bg-primary/20 text-[#E4640D] dark:text-primary font-bold flex items-center justify-center mb-4 text-sm shrink-0">3</div>
              <h3 className="text-[15px] font-semibold text-[#101F38] dark:text-foreground mb-2">{t("how_it_works.step3.title")}</h3>
              <p className="text-[13.5px] text-[#5A6B85] dark:text-muted-foreground leading-relaxed">{t("how_it_works.step3.copy")}</p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#FFFBEE] dark:bg-accent/10 border-[1.5px] border-[#F0C64B] dark:border-accent/40 rounded-[14px] p-[20px] flex flex-col items-center text-center h-full shadow-[0_0_15px_rgba(245,197,24,0.15)] dark:shadow-[0_0_15px_rgba(245,197,24,0.05)] relative overflow-hidden">
              <div aria-hidden="true" className="h-[72px] flex items-center justify-center mb-4 relative z-10">
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#1B4F8A] dark:bg-secondary"></div>
                      <div className="w-5 h-4 rounded-t-sm bg-[#1B4F8A] dark:bg-secondary mt-0.5"></div>
                      <div className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto w-2.5 h-2.5 bg-[#F5C518] rounded-full border-[1.5px] border-[#FFFBEE] dark:border-[#1E2330]"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[30px] h-[30px] rounded-full bg-[#F5C518]/30 dark:bg-accent/20 text-[#C19200] dark:text-accent font-bold flex items-center justify-center mb-4 text-sm shrink-0 relative z-10">4</div>
              <h3 className="text-[15px] font-semibold text-[#101F38] dark:text-foreground mb-2 relative z-10">{t("how_it_works.step4.title")}</h3>
              <p className="text-[13.5px] text-[#5A6B85] dark:text-muted-foreground leading-relaxed relative z-10">{t("how_it_works.step4.copy")}</p>

              {/* Payoff Badge */}
              <div className="mt-5 flex flex-col items-center relative z-10">
                <div aria-hidden="true" className="flex flex-col items-center mb-2">
                  <div className="w-[2px] h-3 bg-[#E0B53A] dark:bg-accent/80"></div>
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#E0B53A] dark:border-t-accent/80"></div>
                </div>
                <div className="relative flex items-center bg-[#F5C518] dark:bg-accent rounded-full h-[46px] pr-5 pl-1.5 shadow-sm">
                  <div className="w-[32px] h-[32px] rounded-full bg-[#101F38] flex items-center justify-center relative shrink-0">
                    <span className="font-serif text-[#F5C518] dark:text-accent font-bold text-lg leading-none mt-0.5">X</span>
                    <div className="absolute -bottom-1 -right-1 rtl:-left-1 rtl:right-auto w-[15px] h-[15px] bg-[#E4640D] dark:bg-primary rounded-full border-2 border-[#F5C518] dark:border-accent flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="ml-3 rtl:ml-0 rtl:mr-3 font-bold text-[#101F38] tracking-[0.1em] text-[15px] uppercase mt-0.5">PROVEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}