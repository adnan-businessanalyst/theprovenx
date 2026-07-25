"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsUp, Eye, CheckCircle2, Pin } from "lucide-react";
import { Question } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function QuestionCard({ question }: { question: Question }) {
  const { t, i18n } = useTranslation();

  return (
    <div className={`p-5 rounded-xl border bg-card text-card-foreground shadow-sm hover-elevate transition-all ${question.isFeatured ? 'border-secondary/50 bg-secondary/5' : ''}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Stats Sidebar */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:w-24 shrink-0 text-sm">
          <div className="flex items-center gap-1 font-medium">
            <span>{question.score}</span>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className={`flex items-center gap-1 font-medium ${question.hasAcceptedAnswer ? 'text-primary' : question.answerCount > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            <span>{question.answerCount}</span>
            {question.hasAcceptedAnswer ? <CheckCircle2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground hidden sm:flex">
            <span>{question.viewCount}</span>
            <Eye className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start gap-2 mb-2">
            {question.isFeatured && (
              <Badge variant="secondary" className="px-1.5 py-0 h-5 shrink-0 flex items-center gap-1 bg-secondary/20 text-secondary-foreground border-secondary/30">
                <Pin className="h-3 w-3" />
                <span className="text-[10px] uppercase font-bold">{t("home.pinned")}</span>
              </Badge>
            )}
            <Link href={`/questions/${question.slug}`}>
              <h3 className="text-lg font-serif font-semibold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
                {question.title}
              </h3>
            </Link>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-2 mb-3 max-w-3xl">
            {question.body.replace(/[#*_\[\]]/g, '') /* very basic markdown strip */}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 items-center">
              {question.category && (
                <Link href={`/?category=${encodeURIComponent(question.category.slug)}`}>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent cursor-pointer transition-colors text-xs font-semibold rounded-full">
                    {question.category.name}
                  </Badge>
                </Link>
              )}
              {question.tags.map(tag => (
                <Link key={tag} href={`/tags?q=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors text-xs font-medium rounded-full">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
              <Link href={`/users/${question.author.username}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={question.author.avatarUrl || undefined} />
                  <AvatarFallback className="text-[8px]">{question.author.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{question.author.displayName}</span>
              </Link>
              <span className="opacity-50">•</span>
              <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
