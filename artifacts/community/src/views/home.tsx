"use client";

import { useEffect, useRef } from "react";
import { useHeroVisibility } from "@/lib/hero-visibility";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  useListQuestions, 
  getListQuestionsQueryKey,
  useListFeaturedQuestions,
  getListFeaturedQuestionsQueryKey,
  useGetCommunityStats,
  getGetCommunityStatsQueryKey,
  useListTags,
  getListTagsQueryKey,
  useListCategories,
  useListTopVerifiers,
  ListQuestionsSort
} from "@workspace/api-client-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, TrendingUp, Users, CheckCircle2, MessageCircle, Search, Layers, Grid2X2, Award } from "lucide-react";
import QuestionCard from "@/components/question-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);
  const searchParams = useSearchParams();
  
  const currentSort = (searchParams.get("sort") as ListQuestionsSort) || "active";
  const currentTag = searchParams.get("tag") || undefined;
  const currentCategory = searchParams.get("category") || undefined;
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 20;

  const { data: featured } = useListFeaturedQuestions({
    query: { queryKey: getListFeaturedQuestionsQueryKey() }
  });

  const { data: questions, isLoading } = useListQuestions(
    { sort: currentSort, tag: currentTag, category: currentCategory, page: currentPage, pageSize },
    { query: { queryKey: getListQuestionsQueryKey({ sort: currentSort, tag: currentTag, category: currentCategory, page: currentPage, pageSize }) } }
  );

  const { data: stats } = useGetCommunityStats({
    query: { queryKey: getGetCommunityStatsQueryKey() }
  });

  const { data: popularTags } = useListTags(
    { query: { queryKey: getListTagsQueryKey() } }
  );

  const { data: categories } = useListCategories();

  const { data: topVerifiers } = useListTopVerifiers();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q") as string;
    if (q) {
      setLocation(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const navToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`/?${params.toString()}`);
  };

  const showFeatured = currentPage === 1 && !currentTag && !currentCategory && featured && featured.length > 0;

  const heroRef = useRef<HTMLElement | null>(null);
  const { setHeroVisible } = useHeroVisibility();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setHeroVisible(null);
    };
  }, [setHeroVisible]);

  return (
    <>
{/* Full-width Hero Section */}
      <section 
        ref={heroRef}
        className="w-[100vw] relative left-1/2 rtl:left-auto rtl:right-1/2 -translate-x-1/2 rtl:translate-x-1/2 mb-10 shadow-sm isolate flex items-center min-h-[280px] py-10 px-6"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary -z-10" />
        <div className="absolute inset-0 bg-background/10 backdrop-blur-[2px] -z-10" />
        
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-5">
          <div className="flex justify-center">
            <Button
              asChild
              className="rounded-full px-8 h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base border-2 border-white/40 hover:border-white/60 transition-all"
            >
              <Link href="/ask">{t("nav.ask")}</Link>
            </Button>
          </div>
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-widest font-bold text-xs shadow-sm">
            The Proven X
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight drop-shadow-sm leading-tight">
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-medium drop-shadow-sm">
            {t("home.subtitle")}
          </p>
          
          <div className="max-w-2xl mx-auto mt-6 relative">
            <form onSubmit={handleSearch} className="w-full group">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-5 rtl:left-auto rtl:right-5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input
                  name="q"
                  type="search"
                  placeholder={t("search.placeholder")}
                  className="w-full pl-12 pr-6 rtl:pl-6 rtl:pr-12 h-14 bg-background/95 backdrop-blur-md border-2 border-white/20 focus-visible:bg-white focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 transition-all rounded-full shadow-lg text-lg"
                />
              </div>
            </form>
          </div>
        </div>
      </section>

      <HowItWorks />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
              {currentCategory ? `${t("home.category_prefix")}${currentCategory}` : currentTag ? `${t("home.tag_prefix")}${currentTag}` : t("home.top_questions")}
            </h2>
            <Link href="/ask" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 font-medium text-primary-foreground shadow hover-elevate transition-colors sm:hidden">
              {t("nav.ask")}
            </Link>
          </div>

          <Tabs value={currentSort} onValueChange={(v) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("sort", v);
            params.set("page", "1");
            router.push(`/?${params.toString()}`);
          }} className="mb-6">
            <TabsList className="bg-muted/50 p-1 rounded-full flex-wrap h-auto justify-start">
              <TabsTrigger value="active" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">{t("home.active")}</TabsTrigger>
              <TabsTrigger value="newest" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">{t("home.newest")}</TabsTrigger>
              <TabsTrigger value="votes" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">{t("home.votes")}</TabsTrigger>
              <TabsTrigger value="unanswered" className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary">{t("home.unanswered")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {showFeatured && featured.map(q => (
              <QuestionCard key={`featured-${q.id}`} question={q} />
            ))}

            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl border bg-card flex gap-4 shadow-sm">
                  <div className="w-24 shrink-0 space-y-2"><Skeleton className="h-4 w-12 ml-auto" /><Skeleton className="h-4 w-12 ml-auto" /></div>
                  <div className="flex-1 space-y-3"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
                </div>
              ))
            ) : questions?.items.length ? (
              questions.items.map((q, i) => (
                <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${i * 50}ms` }}>
                  <QuestionCard question={q} />
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4 bg-muted/30 rounded-3xl border border-dashed">
                <MessageCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{t("home.empty_state.title")}</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">{t("home.empty_state.desc")}</p>
                {(currentTag || currentCategory) && (
                  <Button variant="outline" className="mt-6 rounded-full" onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("tag");
                    params.delete("category");
                    router.push(`/?${params.toString()}`);
                  }}>
                    {t("home.empty_state.clear")}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {questions && questions.total > pageSize && (
            <div className="flex items-center justify-between mt-8 bg-card border rounded-full px-6 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground font-medium">
                {t("common.showing", {
                  start: ((currentPage - 1) * pageSize) + 1,
                  end: Math.min(currentPage * pageSize, questions.total),
                  total: questions.total
                })}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  disabled={currentPage === 1}
                  onClick={() => navToPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" /> {t("common.prev")}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  disabled={currentPage * pageSize >= questions.total}
                  onClick={() => navToPage(currentPage + 1)}
                >
                  {t("common.next")} <ChevronRight className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 shrink-0 space-y-6">
          {/* Top Verifiers */}
          {topVerifiers && topVerifiers.length > 0 && (
            <div className="p-6 rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" /> {t("home.topVerifiers")}
              </h3>
              <div className="space-y-4">
                {topVerifiers.map((tv, idx) => (
                  <Link key={tv.user.id} href={`/users/${tv.user.username}`}>
                    <div className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all">
                          <AvatarImage src={tv.user.avatarUrl || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">{tv.user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 rtl:right-auto rtl:-left-1 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-card">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{tv.user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">@{tv.user.username}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full text-xs shrink-0">
                        {tv.verifiedCount}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categories && categories.length > 0 && (
            <div className="p-6 rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                <Grid2X2 className="h-5 w-5 text-primary" /> {t("home.categories")}
              </h3>
              <div className="space-y-2">
                {categories.map(cat => {
                  const isActive = currentCategory === cat.slug;
                  return (
                    <Link key={cat.id} href={`/?category=${encodeURIComponent(cat.slug)}`}>
                      <div className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'hover:bg-muted bg-background border border-transparent hover:border-border'
                      }`}>
                        <span className="font-medium text-sm">{cat.name}</span>
                        <Badge variant={isActive ? "secondary" : "outline"} className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-primary-foreground/20 text-primary-foreground border-transparent' : ''}`}>
                          {cat.questionCount}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {stats && (
            <div className="p-6 rounded-3xl border bg-card shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <TrendingUp className="h-32 w-32" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-6">{t("home.community_pulse")}</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl"><MessageCircle className="h-6 w-6" /></div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none">{stats.questionCount}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1.5">{t("home.stats.questions")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 text-accent-foreground rounded-2xl"><CheckCircle2 className="h-6 w-6" /></div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none">{stats.answerCount}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1.5">{t("home.stats.answers")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-2xl"><Users className="h-6 w-6" /></div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none">{stats.userCount}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1.5">{t("home.stats.members")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {popularTags && popularTags.length > 0 && (
            <div className="p-6 rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" /> {t("home.popular_tags")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <Link key={tag.id} href={`/?tag=${encodeURIComponent(tag.slug)}`}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer px-3 py-1.5 rounded-full text-xs">
                      {tag.name} <span className="opacity-60 mx-1.5 font-normal">{tag.questionCount}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
              <Button asChild variant="link" className="w-full mt-4 text-primary p-0 h-auto font-medium">
                <Link href="/tags" dangerouslySetInnerHTML={{ __html: t("home.view_all_tags") }} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
