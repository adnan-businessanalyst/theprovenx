"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Zap, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Products() {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 pb-16">
{/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-12 space-y-6">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-foreground">
          {t("products.title")}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          {t("products.subtitle")}
        </p>
      </section>

      {/* Platforms */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Web Community */}
        <div className="group rounded-[2.5rem] border bg-card overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">
          <div className="p-8 md:p-10 flex-1 flex flex-col z-10 relative">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Monitor className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-3">{t("products.web")}</h2>
            <p className="text-muted-foreground text-lg mb-8 flex-1">
              {t("products.web_desc")}
            </p>
            <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-full w-fit group/btn hover:pr-5 transition-all">
              {t("products.open_app")} <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Link>
          </div>
          <div className="h-40 bg-muted/30 border-t mt-auto relative overflow-hidden flex items-end justify-center px-8">
            <div className="w-full max-w-sm h-32 bg-background border border-b-0 rounded-t-xl shadow-lg relative translate-y-4 group-hover:translate-y-2 transition-transform duration-500 flex flex-col">
              <div className="h-4 border-b bg-muted flex items-center px-2 gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="p-4 space-y-2 flex-1">
                <div className="h-2 w-1/3 bg-muted rounded-full"></div>
                <div className="h-2 w-full bg-muted/50 rounded-full"></div>
                <div className="h-2 w-2/3 bg-muted/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile App */}
        <div className="group rounded-[2.5rem] border border-secondary/20 bg-secondary/5 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col h-full">
          <div className="p-8 md:p-10 flex-1 flex flex-col z-10 relative">
            <div className="h-16 w-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
              <Smartphone className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-3">{t("products.mobile")}</h2>
            <p className="text-muted-foreground text-lg mb-8 flex-1">
              {t("products.mobile_desc")}
            </p>
            <a href="/mobile/" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-secondary bg-transparent hover:bg-secondary hover:text-white text-secondary h-10 px-4 py-2 rounded-full w-fit group/btn hover:pr-5 transition-all">
              {t("products.get_app")} <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </a>
          </div>
          <div className="h-40 bg-secondary/10 mt-auto relative overflow-hidden flex items-end justify-center">
            <div className="w-24 h-36 bg-background border border-b-0 rounded-t-3xl shadow-2xl relative translate-y-6 group-hover:translate-y-2 transition-transform duration-500 border-x-8 border-t-8 border-foreground">
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mt-1"></div>
              <div className="p-2 space-y-1 mt-2">
                <div className="h-1 w-full bg-muted/50 rounded-full"></div>
                <div className="h-1 w-2/3 bg-muted/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plans */}
      <section className="max-w-4xl mx-auto mt-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold">{t("products.plans")}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="rounded-3xl border bg-card p-8 shadow-sm">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{t("products.free")}</h3>
              <p className="text-muted-foreground">{t("products.free_desc")}</p>
            </div>
            <div className="text-4xl font-extrabold mb-8">{t("products.price_free").split('/')[0]}<span className="text-lg text-muted-foreground font-normal">/{t("products.price_free").split('/')[1]}</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> <span>{t("products.feature_ask")}</span></li>
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> <span>{t("products.feature_post")}</span></li>
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> <span>{t("products.feature_vote")}</span></li>
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-primary" /> <span>{t("products.feature_profile")}</span></li>
            </ul>
            <Link href="/sign-up" className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-full h-12 text-lg">
              {t("products.join_now")}
            </Link>
          </div>

          {/* Pro Plan (Coming Soon) */}
          <div className="rounded-3xl border-2 border-accent bg-background p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6">
              <Badge className="bg-accent text-accent-foreground font-bold px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                {t("products.coming_soon")}
              </Badge>
            </div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {t("products.paid")} <Zap className="h-5 w-5 text-accent fill-accent" />
              </h3>
              <p className="text-muted-foreground">{t("products.paid_desc")}</p>
            </div>
            <div className="text-4xl font-extrabold mb-8 opacity-50">{t("products.price_paid").split('/')[0]}<span className="text-lg text-muted-foreground font-normal">/{t("products.price_paid").split('/')[1]}</span></div>
            <ul className="space-y-3 mb-8 opacity-70">
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-accent" /> <span>{t("products.feature_everything")}</span></li>
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-accent" /> <span>{t("products.feature_support")}</span></li>
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-accent" /> <span>{t("products.feature_analytics")}</span></li>
              <li className="flex items-center gap-3"><Check className="h-5 w-5 text-accent" /> <span>{t("products.feature_badges")}</span></li>
            </ul>
            <Button disabled variant="outline" className="w-full rounded-full h-12 text-lg border-dashed">
              {t("products.coming_soon")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
