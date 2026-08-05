"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  useListMyQuestions,
  getListMyQuestionsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import QuestionCard from "@/components/question-card";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MessageCircle,
} from "lucide-react";

const PAGE_SIZE = 20;

function statusLabel(status: string): { label: string; className: string } {
  switch (status) {
    case "pending_review":
      return {
        label: "Pending review",
        className: "bg-amber-500/15 text-amber-700 border-amber-500/25",
      };
    case "suspended":
      return {
        label: "Suspended",
        className: "bg-destructive/15 text-destructive border-destructive/25",
      };
    default:
      return {
        label: "Published",
        className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
      };
  }
}

export default function Board() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListMyQuestions(
    { page, pageSize: PAGE_SIZE },
    {
      query: {
        queryKey: getListMyQuestionsQueryKey({ page, pageSize: PAGE_SIZE }),
      },
    },
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Your board
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            My questions
          </h1>
          <p className="text-muted-foreground mt-1">
            All questions you have asked — published, pending, or suspended.
          </p>
        </div>
        <Button asChild className="rounded-full shrink-0">
          <Link href="/ask">{t("nav.ask")}</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <Spinner size={96} />
        </div>
      ) : data?.items.length ? (
        <div className="space-y-4">
          {data.items.map((q) => {
            const status = statusLabel(q.status);
            return (
              <div key={q.id} className="relative">
                <div className="absolute top-3 right-3 z-10 rtl:right-auto rtl:left-3">
                  <Badge
                    variant="outline"
                    className={`rounded-full text-xs ${status.className}`}
                  >
                    {status.label}
                  </Badge>
                </div>
                <QuestionCard question={q} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-muted/30 rounded-3xl border border-dashed">
          <MessageCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
            No questions yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Your board will show every question you post. Ask the community
            something you have lived through.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/ask">{t("nav.ask")}</Link>
          </Button>
        </div>
      )}

      {data && data.total > PAGE_SIZE ? (
        <div className="flex items-center justify-between bg-card border rounded-full px-6 py-3 shadow-sm">
          <p className="text-sm text-muted-foreground font-medium">
            {t("common.showing", {
              start: (page - 1) * PAGE_SIZE + 1,
              end: Math.min(page * PAGE_SIZE, data.total),
              total: data.total,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
              {t("common.prev")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              disabled={page * PAGE_SIZE >= data.total}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("common.next")}
              <ChevronRight className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
