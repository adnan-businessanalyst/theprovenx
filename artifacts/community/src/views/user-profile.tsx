"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useGetUserProfile, getGetUserProfileQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingUp, MessageSquare, HelpCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import QuestionCard from "@/components/question-card";

export default function UserProfile({ username }: { username: string }) {
  const { t } = useTranslation();

  const { data: profile, isLoading } = useGetUserProfile(username, {
    query: { queryKey: getGetUserProfileQueryKey(username) }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-6 p-8 border rounded-3xl bg-card">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-4 pt-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        User not found.
      </div>
    );
  }

  const { user, topTags, recentQuestions, recentAnswers } = profile;

  return (
    <>
<div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Profile Card */}
        <div className="flex flex-col sm:flex-row gap-8 p-8 border rounded-3xl bg-card shadow-sm relative overflow-hidden">
          {(user.role === 'admin' || user.role === 'platform_owner') && (
            <div className="absolute top-0 right-0 p-4">
              <Badge variant="default" className="bg-primary/20 text-primary border-transparent gap-1">
                <ShieldAlert className="h-3 w-3" /> Admin
              </Badge>
            </div>
          )}
          
          <div className="shrink-0 flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-background shadow-md">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-4xl bg-primary/5 text-primary font-serif">
                {user.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center">
              <div className="text-3xl font-bold font-serif text-primary tracking-tight">{user.reputation}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t('profile.reputation')}</div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            
            {user.bio && (
              <p className="mt-4 text-foreground/90 max-w-2xl leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>{user.questionCount} {t('profile.questions')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>{user.answerCount} {t('profile.answers')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{user.acceptedAnswerCount} Accepted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="answers">
          <TabsList className="bg-muted/50 p-1 mb-6 flex-wrap h-auto justify-start">
            <TabsTrigger value="answers" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Top Answers</TabsTrigger>
            <TabsTrigger value="questions" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Top Questions</TabsTrigger>
            <TabsTrigger value="tags" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Top Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="answers" className="space-y-4">
            {recentAnswers.length > 0 ? (
              recentAnswers.map(ans => (
                <div key={`${ans.type}-${ans.questionId}`} className="p-4 rounded-xl border bg-card hover-elevate transition-all flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/50 rounded-lg min-w-[3rem]">
                    <span className="font-semibold text-foreground">{ans.score}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      {ans.type === 'accepted' && <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-1.5 py-0">Accepted</Badge>}
                      <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(ans.createdAt), { addSuffix: true })}</span>
                    </div>
                    <Link href={`/questions/${ans.questionSlug}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2">
                        {ans.questionTitle}
                      </h3>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-muted/20 border border-dashed rounded-xl text-muted-foreground">
                No answers yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            {recentQuestions.length > 0 ? (
              recentQuestions.map(q => (
                <QuestionCard key={q.id} question={q} />
              ))
            ) : (
              <div className="text-center py-10 bg-muted/20 border border-dashed rounded-xl text-muted-foreground">
                No questions asked yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="tags">
            {topTags.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topTags.map(tag => (
                  <Link key={tag.id} href={`/?tag=${encodeURIComponent(tag.slug)}`}>
                    <div className="p-4 rounded-xl border bg-card flex flex-col items-center justify-center gap-2 hover-elevate cursor-pointer">
                      <Badge variant="secondary">{tag.name}</Badge>
                      <span className="text-2xl font-semibold">{tag.questionCount}</span>
                      <span className="text-xs text-muted-foreground uppercase">Questions</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/20 border border-dashed rounded-xl text-muted-foreground">
                No tag activity yet.
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </>
  );
}
