"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  useListQuestions,
  getListQuestionsQueryKey,
  useListFeaturedQuestions,
  getListFeaturedQuestionsQueryKey,
} from "@workspace/api-client-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import QuestionCard from "@/components/question-card";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

export type TopQuestionsSort = "active" | "newest" | "votes" | "unanswered";

export type TopQuestionsProps = {
  category?: string;
  categoryLabel?: string;
  tag?: string;
  tagLabel?: string;
  sort?: TopQuestionsSort;
  page?: number;
  pageSize?: number;
  onSortChange: (sort: TopQuestionsSort) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
};

export function TopQuestions({
  category,
  categoryLabel,
  tag,
  tagLabel,
  sort = "active",
  page = 1,
  pageSize = 20,
  onSortChange,
  onPageChange,
  onClearFilters,
}: TopQuestionsProps) {
  const { t } = useTranslation();

  const { data: featured } = useListFeaturedQuestions({
    query: { queryKey: getListFeaturedQuestionsQueryKey() },
  });

  const { data: questions, isLoading } = useListQuestions(
    { sort, tag, category, page, pageSize },
    {
      query: {
        queryKey: getListQuestionsQueryKey({
          sort,
          tag,
          category,
          page,
          pageSize,
        }),
      },
    },
  );

  const showFeatured =
    page === 1 && !tag && !category && featured && featured.length > 0;

  const title = category
    ? `${t("home.category_prefix")}${categoryLabel ?? category}`
    : tag
      ? `${t("home.tag_prefix")}${tagLabel ?? tag}`
      : t("home.top_questions");

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-serif font-bold text-foreground flex items-center gap-2">
          {title}
        </h2>
        <Link
          href="/ask"
          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 font-medium text-primary-foreground shadow hover-elevate transition-colors sm:hidden"
        >
          {t("nav.ask")}
        </Link>
      </div>

      <Tabs
        value={sort}
        onValueChange={(v) => onSortChange(v as TopQuestionsSort)}
        className="mb-6"
      >
        <TabsList className="bg-muted/50 p-1 rounded-full flex-wrap h-auto justify-start">
          <TabsTrigger
            value="active"
            className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            {t("home.active")}
          </TabsTrigger>
          <TabsTrigger
            value="newest"
            className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            {t("home.newest")}
          </TabsTrigger>
          <TabsTrigger
            value="votes"
            className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            {t("home.votes")}
          </TabsTrigger>
          <TabsTrigger
            value="unanswered"
            className="rounded-full px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            {t("home.unanswered")}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {showFeatured &&
          featured.map((q) => (
            <QuestionCard key={`featured-${q.id}`} question={q} />
          ))}

        {isLoading ? (
          <div
            className="flex min-h-[280px] items-center justify-center py-16"
            role="status"
            aria-live="polite"
            aria-label="Loading"
          >
            <Spinner size={96} />
            <span className="sr-only">Loading…</span>
          </div>
        ) : questions?.items.length ? (
          questions.items.map((q, i) => (
            <div
              key={q.id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <QuestionCard question={q} />
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-4 bg-muted/30 rounded-3xl border border-dashed">
            <MessageCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
              {t("home.empty_state.title")}
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              {t("home.empty_state.desc")}
            </p>
            {(tag || category) && (
              <Button
                variant="outline"
                className="mt-6 rounded-full"
                onClick={onClearFilters}
              >
                {t("home.empty_state.clear")}
              </Button>
            )}
          </div>
        )}
      </div>

      {questions && questions.total > pageSize && (
        <div className="flex items-center justify-between mt-8 bg-card border rounded-full px-6 py-3 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium">
            {t("common.showing", {
              start: (page - 1) * pageSize + 1,
              end: Math.min(page * pageSize, questions.total),
              total: questions.total,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />{" "}
              {t("common.prev")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page * pageSize >= questions.total}
              onClick={() => onPageChange(page + 1)}
            >
              {t("common.next")}{" "}
              <ChevronRight className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
