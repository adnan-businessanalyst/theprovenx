"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  useSearchQuestions, 
  getSearchQuestionsQueryKey 
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import QuestionCard from "@/components/question-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export default function Search() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQuery = searchParams.get("q") || "";
  const initialUnanswered = searchParams.get("unanswered") === "true";
  
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [q, setQ] = useState(initialQuery);
  const [unanswered, setUnanswered] = useState(initialUnanswered);
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 20;

  const { data: results, isLoading } = useSearchQuestions(
    { q, unanswered, page: currentPage, pageSize },
    { 
      query: { 
        enabled: q.length > 0,
        queryKey: getSearchQuestionsQueryKey({ q, unanswered, page: currentPage, pageSize }) 
      } 
    }
  );

  const performSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;
    
    setQ(queryInput);
    const params = new URLSearchParams();
    params.set("q", queryInput);
    if (unanswered) params.set("unanswered", "true");
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  const toggleUnanswered = (checked: boolean) => {
    setUnanswered(checked);
    if (q) {
      const params = new URLSearchParams(searchParams.toString());
      if (checked) params.set("unanswered", "true");
      else params.delete("unanswered");
      params.set("page", "1");
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <>
<div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-3xl border border-primary/10">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-6">Search Knowledge Base</h1>
          <form onSubmit={performSearch} className="w-full max-w-2xl relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                placeholder="What do you need help with?" 
                className="w-full pl-11 h-14 text-lg rounded-full border-primary/20 shadow-sm focus-visible:ring-primary"
              />
              {queryInput && (
                <button type="button" onClick={() => setQueryInput("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="h-14 rounded-full px-8 shrink-0">Search</Button>
          </form>

          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="unanswered" 
                checked={unanswered} 
                onCheckedChange={(c) => toggleUnanswered(c as boolean)} 
              />
              <label htmlFor="unanswered" className="font-medium text-foreground cursor-pointer">
                {t('search.filter_unanswered')}
              </label>
            </div>
          </div>
        </div>

        <div>
          {isLoading && q ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 mb-6" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-5 rounded-xl border bg-card flex gap-4 animate-pulse">
                  <div className="w-24 shrink-0 space-y-2"><Skeleton className="h-4 w-12 ml-auto" /><Skeleton className="h-4 w-12 ml-auto" /></div>
                  <div className="flex-1 space-y-3"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></div>
                </div>
              ))}
            </div>
          ) : results && results.items.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold mb-4">{results.total} results for "{q}"</h2>
              {results.items.map(question => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          ) : q ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <SearchIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('search.no_results')}</h3>
              <p className="text-muted-foreground">Try using different keywords or removing filters.</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
