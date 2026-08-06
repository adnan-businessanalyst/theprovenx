"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useHeroVisibility } from "@/lib/hero-visibility";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useGetCommunityStats,
  getGetCommunityStatsQueryKey,
  useListTags,
  getListTagsQueryKey,
  useListCategories,
  useListTopVerifiers,
} from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  MessageCircle,
  Search,
  Layers,
  Grid2X2,
  Award,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProvenVideo } from "@/components/proven-video";
import {
  TopQuestions,
  type TopQuestionsSort,
} from "@/components/top-questions";

function readInitialFeedState() {
  if (typeof window === "undefined") {
    return {
      sort: "active" as TopQuestionsSort,
      tag: undefined as string | undefined,
      category: undefined as string | undefined,
      page: 1,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const sortParam = params.get("sort");
  const sort: TopQuestionsSort =
    sortParam === "newest" ||
    sortParam === "votes" ||
    sortParam === "unanswered" ||
    sortParam === "active"
      ? sortParam
      : "active";
  const page = parseInt(params.get("page") || "1", 10);
  return {
    sort,
    tag: params.get("tag") || undefined,
    category: params.get("category") || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function syncFeedUrl(state: {
  sort: TopQuestionsSort;
  tag?: string;
  category?: string;
  page: number;
}) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (state.sort !== "active") params.set("sort", state.sort);
  if (state.category) params.set("category", state.category);
  if (state.tag) params.set("tag", state.tag);
  if (state.page > 1) params.set("page", String(state.page));
  const qs = params.toString();
  const next = qs ? `/?${qs}` : "/";
  window.history.replaceState(window.history.state, "", next);
}

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);

  const [feed, setFeed] = useState({
    sort: "active" as TopQuestionsSort,
    tag: undefined as string | undefined,
    category: undefined as string | undefined,
    page: 1,
  });
  const feedHydrated = useRef(false);

  useEffect(() => {
    if (feedHydrated.current) return;
    feedHydrated.current = true;
    setFeed(readInitialFeedState());
  }, []);

  const updateFeed = useCallback(
    (patch: {
      sort?: TopQuestionsSort;
      category?: string | null;
      tag?: string | null;
      page?: number;
    }) => {
      setFeed((prev) => {
        const next = {
          sort: patch.sort ?? prev.sort,
          category:
            patch.category === null
              ? undefined
              : patch.category !== undefined
                ? patch.category
                : prev.category,
          tag:
            patch.tag === null
              ? undefined
              : patch.tag !== undefined
                ? patch.tag
                : prev.tag,
          page: patch.page ?? prev.page,
        };
        syncFeedUrl(next);
        return next;
      });
    },
    [],
  );

  const handleSortChange = (nextSort: TopQuestionsSort) => {
    updateFeed({ sort: nextSort, page: 1 });
  };

  const handlePageChange = (nextPage: number) => {
    updateFeed({ page: nextPage });
  };

  const handleClearFilters = () => {
    updateFeed({ category: null, tag: null, page: 1 });
  };

  const handleCategorySelect = (slug: string | null) => {
    if (slug === null) {
      updateFeed({ category: null, tag: null, page: 1 });
      return;
    }
    if (feed.category === slug) {
      updateFeed({ category: null, tag: null, page: 1 });
      return;
    }
    updateFeed({ category: slug, tag: null, page: 1 });
  };

  const handleTagSelect = (slug: string) => {
    if (feed.tag === slug) {
      updateFeed({ tag: null, category: null, page: 1 });
      return;
    }
    updateFeed({ tag: slug, category: null, page: 1 });
  };

  const { data: stats } = useGetCommunityStats({
    query: { queryKey: getGetCommunityStatsQueryKey() },
  });

  const { data: popularTags } = useListTags({
    query: { queryKey: getListTagsQueryKey() },
  });

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

  const heroRef = useRef<HTMLElement | null>(null);
  const { setHeroVisible } = useHeroVisibility();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setHeroVisible(null);
    };
  }, [setHeroVisible]);

  const sortedCategories = categories
    ? [...categories].sort((a, b) => b.questionCount - a.questionCount)
    : [];
  const allCategoriesCount =
    stats?.questionCount ??
    sortedCategories.reduce((sum, c) => sum + c.questionCount, 0);

  return (
    <>
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

      <ProvenVideo />

      <div className="flex flex-col lg:flex-row gap-8">
        <TopQuestions
          category={feed.category}
          categoryLabel={
            categories?.find((c) => c.slug === feed.category)?.name
          }
          tag={feed.tag}
          tagLabel={popularTags?.find((tg) => tg.slug === feed.tag)?.name}
          sort={feed.sort}
          page={feed.page}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />

        <div className="lg:w-80 shrink-0 space-y-6">
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
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {tv.user.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 rtl:right-auto rtl:-left-1 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-card">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {tv.user.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{tv.user.username}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-full text-xs shrink-0"
                      >
                        {tv.verifiedCount}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {sortedCategories.length > 0 && (
            <div className="p-6 rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-xl mb-4 flex items-center gap-2">
                <Grid2X2 className="h-5 w-5 text-primary" /> {t("home.categories")}
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                    !feed.category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted bg-background border border-transparent hover:border-border"
                  }`}
                >
                  <span className="font-medium text-sm">
                    {t("home.all_categories")}
                  </span>
                  <Badge
                    variant={!feed.category ? "secondary" : "outline"}
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      !feed.category
                        ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                        : ""
                    }`}
                  >
                    {allCategoriesCount}
                  </Badge>
                </button>
                {sortedCategories.map((cat) => {
                  const isActive = feed.category === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer text-left ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted bg-background border border-transparent hover:border-border"
                      }`}
                    >
                      <span className="font-medium text-sm">{cat.name}</span>
                      <Badge
                        variant={isActive ? "secondary" : "outline"}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isActive
                            ? "bg-primary-foreground/20 text-primary-foreground border-transparent"
                            : ""
                        }`}
                      >
                        {cat.questionCount}
                      </Badge>
                    </button>
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
              <h3 className="font-serif font-semibold text-xl mb-6">
                {t("home.community_pulse")}
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none">
                      {stats.questionCount}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1.5">
                      {t("home.stats.questions")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 text-accent-foreground rounded-2xl">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none">
                      {stats.answerCount}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1.5">
                      {t("home.stats.answers")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold leading-none">
                      {stats.userCount}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1.5">
                      {t("home.stats.members")}
                    </p>
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
                {popularTags.map((popularTag) => {
                  const isActive = feed.tag === popularTag.slug;
                  return (
                    <button
                      key={popularTag.id}
                      type="button"
                      onClick={() => handleTagSelect(popularTag.slug)}
                    >
                      <Badge
                        variant="secondary"
                        className={`transition-colors cursor-pointer px-3 py-1.5 rounded-full text-xs ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary hover:text-primary-foreground"
                        }`}
                      >
                        {popularTag.name}{" "}
                        <span className="opacity-60 mx-1.5 font-normal">
                          {popularTag.questionCount}
                        </span>
                      </Badge>
                    </button>
                  );
                })}
              </div>
              <Button
                asChild
                variant="link"
                className="w-full mt-4 text-primary p-0 h-auto font-medium"
              >
                <Link
                  href="/tags"
                  dangerouslySetInnerHTML={{ __html: t("home.view_all_tags") }}
                />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
