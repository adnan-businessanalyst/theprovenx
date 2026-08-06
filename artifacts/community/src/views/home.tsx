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
import { HeroTitle } from "@/components/hero-title";
import { Manifesto } from "@/components/manifesto";
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

  const heroRef = useRef<HTMLElement | null>(null);
  const { heroVisible, setHeroVisible } = useHeroVisibility();

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
        className={`hero-section w-full -mt-16 mb-8 sm:mb-10 shadow-sm isolate flex items-center justify-center pt-20 sm:pt-16 px-3 sm:px-4 overflow-x-clip ${
          heroVisible !== false ? "is-in" : ""
        }`}
      >
        <div className="absolute inset-0 bg-[#101F38] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/35 via-[#101F38] to-secondary/40 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsla(45,95%,50%,0.18),_transparent_55%)] -z-10" />

        <div className="relative z-10 w-full max-w-7xl mx-auto text-center flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
          <div className="hero-actions flex flex-row items-center justify-center gap-2 sm:gap-3 w-full max-w-[18rem] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-1">
            <div className="hero-action-ask min-w-0 flex-[1_1_auto]">
              <Button
                asChild
                variant="outline"
                className="hero-action-ask-btn w-full rounded-full px-4 sm:px-6 h-12 sm:h-14 md:h-16 lg:h-20 bg-transparent hover:bg-primary/10 border-2 border-primary text-primary hover:text-primary font-bold text-sm sm:text-base md:text-lg shadow-none"
              >
                <Link href="/ask" className="whitespace-nowrap text-center">
                  {t("nav.ask")}
                </Link>
              </Button>
            </div>
            <div className="hero-action-search shrink-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setLocation("/search")}
                className="hero-action-search-input h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full p-0 bg-transparent hover:bg-secondary/10 border-2 border-secondary text-secondary hover:text-secondary shadow-none [&_svg]:!size-[1.35rem] sm:[&_svg]:!size-[1.65rem] md:[&_svg]:!size-8 lg:[&_svg]:!size-10"
                aria-label={t("nav.search")}
              >
                <Search strokeWidth={1.75} />
              </Button>
            </div>
          </div>
          <div className="hero-title-stage w-full max-w-full overflow-visible px-0.5 pt-1">
            <HeroTitle />
          </div>
        </div>
      </section>

      <Manifesto />

      <ProvenVideo />

      <div className="container mx-auto max-w-6xl px-3 sm:px-4 pb-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
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

        <div className="lg:w-80 shrink-0 space-y-5 sm:space-y-6">
          {topVerifiers && topVerifiers.length > 0 && (
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-lg sm:text-xl mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent shrink-0" /> {t("home.topVerifiers")}
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-lg sm:text-xl mb-4 flex items-center gap-2">
                <Grid2X2 className="h-5 w-5 text-primary shrink-0" /> {t("home.categories")}
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border bg-card shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <TrendingUp className="h-32 w-32" />
              </div>
              <h3 className="font-serif font-semibold text-lg sm:text-xl mb-5 sm:mb-6">
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-serif font-semibold text-lg sm:text-xl mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent shrink-0" /> {t("home.popular_tags")}
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
