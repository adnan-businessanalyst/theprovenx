"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, ShoppingBag } from "lucide-react";
import { OurPackages } from "@/components/packages/OurPackages";
import { UsagePolicy } from "@/components/packages/UsagePolicy";
import { ProductsInPageNav } from "@/components/packages/ProductsInPageNav";

export default function Products() {
  const { t } = useTranslation();

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="space-y-16 pb-16">
      <ProductsInPageNav />

      <section className="text-center max-w-3xl mx-auto pt-12 space-y-6">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-foreground">
          {t("products.title")}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          {t("products.subtitle")}
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <a
          href="#informative-website"
          className="group rounded-[2.5rem] border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="p-8 md:p-10 flex-1 flex flex-col z-10 relative">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Monitor className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-3">{t("products.web")}</h2>
            <p className="text-muted-foreground text-lg flex-1">
              {t("products.web_desc")}
            </p>
            <span className="mt-6 text-sm font-medium text-primary">
              {t("products.view_package")} →
            </span>
          </div>
          <div className="h-40 bg-muted/30 border-t mt-auto relative overflow-hidden flex items-end justify-center px-8 pointer-events-none">
            <div className="w-full max-w-sm h-32 bg-background border border-b-0 rounded-t-xl shadow-lg relative translate-y-4 group-hover:translate-y-2 transition-transform duration-500 flex flex-col">
              <div className="h-4 border-b bg-muted flex items-center px-2 gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <div className="p-4 space-y-2 flex-1">
                <div className="h-2 w-1/3 bg-muted rounded-full" />
                <div className="h-2 w-full bg-muted/50 rounded-full" />
                <div className="h-2 w-2/3 bg-muted/50 rounded-full" />
              </div>
            </div>
          </div>
        </a>

        <a
          href="#e-store"
          className="group rounded-[2.5rem] border border-secondary/20 bg-secondary/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="p-8 md:p-10 flex-1 flex flex-col z-10 relative">
            <div className="h-16 w-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-3">{t("products.mobile")}</h2>
            <p className="text-muted-foreground text-lg flex-1">
              {t("products.mobile_desc")}
            </p>
            <span className="mt-6 text-sm font-medium text-secondary">
              {t("products.view_package")} →
            </span>
          </div>
          <div className="h-40 bg-secondary/10 mt-auto relative overflow-hidden flex items-end justify-center pointer-events-none">
            <div className="w-full max-w-[11rem] h-28 bg-background border rounded-2xl shadow-lg relative translate-y-3 group-hover:translate-y-1 transition-transform duration-500 p-3 space-y-2">
              <div className="h-16 rounded-xl bg-secondary/15" />
              <div className="h-2 w-2/3 bg-muted rounded-full" />
              <div className="h-2 w-1/2 bg-muted/60 rounded-full" />
            </div>
          </div>
        </a>
      </section>

      <OurPackages />
      <UsagePolicy />
    </div>
  );
}
