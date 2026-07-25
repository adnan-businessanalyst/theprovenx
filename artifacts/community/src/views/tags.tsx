"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useListTags, getListTagsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Tags() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");

  const { data: tags, isLoading } = useListTags(
    { query: { queryKey: getListTagsQueryKey() } }
  );

  const filteredTags = tags?.filter(tag => 
    tag.name.toLowerCase().includes(filter.toLowerCase()) || 
    tag.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
<div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-4">{t('nav.tags')}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Filter by tag name..." 
            className="pl-10 h-12 text-base rounded-xl"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-xl animate-pulse space-y-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredTags && filteredTags.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTags.map(tag => (
              <Link key={tag.id} href={`/?tag=${encodeURIComponent(tag.slug)}`}>
                <div className="p-5 rounded-xl border bg-card hover-elevate transition-all h-full flex flex-col cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm px-3 py-1">
                      {tag.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {tag.description || "No description available for this tag."}
                  </p>
                  <div className="text-xs font-medium text-muted-foreground">
                    {tag.questionCount} {tag.questionCount === 1 ? 'question' : 'questions'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No tags found</h3>
            <p className="text-muted-foreground">No tags match your search filter.</p>
          </div>
        )}
      </div>
    </>
  );
}
