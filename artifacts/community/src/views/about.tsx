"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Target, TrendingUp, Mail, Users, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useGetCommunityStats, getGetCommunityStatsQueryKey, useCreateSponsorInquiry } from "@workspace/api-client-react";
import type { SponsorInquiryInputBudgetRange } from "@workspace/api-client-react";

const BUDGET_OPTIONS: SponsorInquiryInputBudgetRange[] = ["under_1k", "1k_5k", "5k_20k", "over_20k", "undecided"];

function SponsorInquiryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ company: "", contactName: "", email: "", budgetRange: "" as string, message: "", website: "" });
  const createInquiry = useCreateSponsorInquiry();

  const isValid =
    form.company.trim().length > 0 &&
    form.contactName.trim().length > 0 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()) &&
    BUDGET_OPTIONS.includes(form.budgetRange as SponsorInquiryInputBudgetRange) &&
    form.message.trim().length >= 10;

  const handleSubmit = () => {
    if (!isValid) return;
    createInquiry.mutate(
      {
        data: {
          company: form.company.trim(),
          contactName: form.contactName.trim(),
          email: form.email.trim(),
          budgetRange: form.budgetRange as SponsorInquiryInputBudgetRange,
          message: form.message.trim(),
          website: form.website,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("about.sponsor_form.success"));
          setForm({ company: "", contactName: "", email: "", budgetRange: "", message: "", website: "" });
          onOpenChange(false);
        },
        onError: () => {
          toast.error(t("about.sponsor_form.error"));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{t("about.sponsor_form.title")}</DialogTitle>
          <DialogDescription>{t("about.sponsor_form.subtitle")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="sponsor-company">{t("about.sponsor_form.company")}</Label>
            <Input id="sponsor-company" value={form.company} maxLength={200} onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sponsor-name">{t("about.sponsor_form.contact_name")}</Label>
              <Input id="sponsor-name" value={form.contactName} maxLength={120} onChange={e => setForm(prev => ({ ...prev, contactName: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sponsor-email">{t("about.sponsor_form.email")}</Label>
              <Input id="sponsor-email" type="email" dir="ltr" value={form.email} maxLength={254} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("about.sponsor_form.budget")}</Label>
            <Select value={form.budgetRange} onValueChange={v => setForm(prev => ({ ...prev, budgetRange: v }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("about.sponsor_form.budget_placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{t(`about.sponsor_form.budget_${opt}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sponsor-message">{t("about.sponsor_form.message")}</Label>
            <Textarea id="sponsor-message" value={form.message} maxLength={2000} rows={4} placeholder={t("about.sponsor_form.message_placeholder")} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} className="rounded-xl resize-none" />
          </div>
          {/* Honeypot field — hidden from humans, bots fill it in */}
          <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="sponsor-website">Website</label>
            <input id="sponsor-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm(prev => ({ ...prev, website: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button className="rounded-full" onClick={handleSubmit} disabled={!isValid || createInquiry.isPending}>
            {createInquiry.isPending ? t("common.loading") : t("about.sponsor_form.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [sponsorFormOpen, setSponsorFormOpen] = useState(false);

  const { data: stats } = useGetCommunityStats({
    query: { queryKey: getGetCommunityStatsQueryKey() }
  });

  return (
    <div className="space-y-16 pb-16">
{/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-12 space-y-6">
        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 text-primary bg-primary/5 uppercase tracking-widest text-xs font-bold">
          {t("about.title")}
        </Badge>
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-foreground">
          {t("about.story_title")}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
          {t("about.story_body")}
        </p>
      </section>

      {/* The Promise Section */}
      <section className="relative w-[100vw] left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-secondary text-secondary-foreground py-20 px-6 my-20 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-3xl mb-4 backdrop-blur-sm">
            <ShieldCheck className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-extrabold text-white">
            {t("about.promise_title")}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
            {t("about.promise_body")}
          </p>
        </div>
      </section>

      {/* Ads Section */}
      <section className="max-w-5xl mx-auto border-2 border-accent/20 bg-accent/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
          <Target className="w-96 h-96 text-accent" />
        </div>
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-accent">
              {t("about.sponsorship")}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {t("about.ads_title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.ads_body")}
            </p>
            <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-foreground text-background hover:bg-foreground/90 transition-all font-bold group" onClick={() => setSponsorFormOpen(true)}>
              <Mail className="mr-2 rtl:mr-0 rtl:ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t("about.ads_cta")}
            </Button>
            <SponsorInquiryDialog open={sponsorFormOpen} onOpenChange={setSponsorFormOpen} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 sm:pb-0">
            <div className="bg-background rounded-3xl p-6 border shadow-sm hover-elevate transition-all">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-3xl font-black text-foreground mb-1">
                {stats ? (stats.userCount > 1000 ? `${(stats.userCount/1000).toFixed(1)}k+` : stats.userCount) : "..."}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("about.active_members")}</p>
            </div>
            <div className="bg-background rounded-3xl p-6 border shadow-sm hover-elevate transition-all sm:translate-y-6">
              <CheckCircle2 className="h-8 w-8 text-secondary mb-4" />
              <h3 className="text-3xl font-black text-foreground mb-1">
                {stats ? (stats.answerCount > 1000 ? `${(stats.answerCount/1000).toFixed(1)}k+` : stats.answerCount) : "..."}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("about.verified_answers")}</p>
            </div>
            <div className="bg-background rounded-3xl p-6 border shadow-sm hover-elevate transition-all">
              <MessageCircle className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-3xl font-black text-foreground mb-1">
                {stats ? (stats.questionCount > 1000 ? `${(stats.questionCount/1000).toFixed(1)}k+` : stats.questionCount) : "..."}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("about.questions_asked")}</p>
            </div>
            <div className="bg-background rounded-3xl p-6 border shadow-sm hover-elevate transition-all sm:translate-y-6">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-3xl font-black text-foreground mb-1">98%</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t("about.trust_rate")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
