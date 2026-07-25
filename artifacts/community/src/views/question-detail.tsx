"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useGetQuestion,
  getGetQuestionQueryKey,
  useCreateAnswer,
  useVoteQuestion,
  useVoteAnswer,
  useAcceptAnswer,
  useCreateComment,
  useTranslateContent,
  useCreateFlag,
  useGetMe,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { ChevronUp, ChevronDown, CheckCircle2, MessageSquare, Flag, Globe, MoreVertical } from "lucide-react";

// Schemas
const answerSchema = z.object({
  body: z.string().min(20, "Answer must be at least 20 characters.").max(30000, "Answer too long."),
  website: z.string().max(0, "Honeypot").optional(),
});

const commentSchema = z.object({
  body: z.string().min(5, "Comment must be at least 5 characters.").max(1000, "Comment too long."),
  website: z.string().max(0, "Honeypot").optional(),
});

export default function QuestionDetail({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reportDialog, setReportDialog] = useState<{ open: boolean, type: 'question'|'answer'|'comment', id: number }>({ open: false, type: 'question', id: 0 });
  const [reportReason, setReportReason] = useState("");

  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  
  const { data: qDetail, isLoading } = useGetQuestion(slug, {
    query: { queryKey: getGetQuestionQueryKey(slug) }
  });

  const voteQuestion = useVoteQuestion();
  const voteAnswer = useVoteAnswer();
  const acceptAnswer = useAcceptAnswer();
  const createAnswer = useCreateAnswer();
  const createComment = useCreateComment();
  const translateContent = useTranslateContent();
  const createFlag = useCreateFlag();

  // Translation state cache: { 'question_id': { target: { title, body } } }
  const [translations, setTranslations] = useState<Record<string, any>>({});
  // Current active translation state per item: 'original' | 'en' | 'ar'
  const [activeTranslation, setActiveTranslation] = useState<Record<string, 'original'|'en'|'ar'>>({});

  const handleTranslate = async (type: 'question'|'answer', id: number, target: 'original'|'en'|'ar', originalTitle?: string, originalBody?: string) => {
    const itemKey = `${type}_${id}`;
    setActiveTranslation(prev => ({ ...prev, [itemKey]: target }));

    if (target === 'original') return;

    if (!translations[itemKey]?.[target]) {
      // Fetch it
      try {
        const res = await translateContent.mutateAsync({
          data: { contentType: type, contentId: id, target }
        });
        setTranslations(prev => ({
          ...prev,
          [itemKey]: {
            ...(prev[itemKey] || {}),
            [target]: res
          }
        }));
      } catch (err) {
        toast({ variant: "destructive", title: "Translation failed", description: "Could not translate content." });
        setActiveTranslation(prev => ({ ...prev, [itemKey]: 'original' }));
      }
    }
  };

  const getDisplayContent = (type: 'question'|'answer', id: number, originalTitle: string | undefined, originalBody: string) => {
    const itemKey = `${type}_${id}`;
    const target = activeTranslation[itemKey] || 'original';
    
    if (target === 'original') {
      return { title: originalTitle, body: originalBody, isTranslating: false };
    }

    const cached = translations[itemKey]?.[target];
    if (cached) {
      return { title: cached.title || originalTitle, body: cached.body, isTranslating: false };
    }

    return { title: originalTitle, body: originalBody, isTranslating: true };
  };

  const handleVote = (type: 'question'|'answer', id: number, value: 1 | -1 | 0) => {
    if (!me) return setLocation('/sign-in');

    if (type === 'question') {
      voteQuestion.mutate({ id, data: { value } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(slug) })
      });
    } else {
      voteAnswer.mutate({ id, data: { value } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(slug) })
      });
    }
  };

  const handleAccept = (answerId: number) => {
    if (!me || me.id !== qDetail?.question.author.id) return;
    acceptAnswer.mutate({ id: answerId }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(slug) })
    });
  };

  const submitReport = () => {
    if (!reportReason.trim() || reportReason.length < 5) {
      toast({ variant: "destructive", title: "Invalid Reason", description: "Please provide a valid reason (min 5 characters)." });
      return;
    }
    createFlag.mutate({
      data: {
        contentType: reportDialog.type,
        contentId: reportDialog.id,
        reason: reportReason,
      }
    }, {
      onSuccess: () => {
        toast({ title: "Reported", description: "Content has been reported for moderation." });
        setReportDialog({ open: false, type: 'question', id: 0 });
        setReportReason("");
      }
    });
  };

  if (isLoading) return <QuestionSkeleton />;
  if (!qDetail) return <div className="text-center py-20 text-muted-foreground">Question not found.</div>;

  const { question, answers, comments } = qDetail;
  const acceptedAnswer = answers.find(a => a.isAccepted);
  const isAuthor = me?.id === question.author.id;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question.title,
      "text": question.body,
      "answerCount": answers.length,
      "upvoteCount": question.score,
      "dateCreated": question.createdAt,
      "author": {
        "@type": "Person",
        "name": question.author.displayName
      },
      "acceptedAnswer": acceptedAnswer ? {
        "@type": "Answer",
        "text": acceptedAnswer.body,
        "dateCreated": acceptedAnswer.createdAt,
        "upvoteCount": acceptedAnswer.score,
        "author": {
          "@type": "Person",
          "name": acceptedAnswer.author.displayName
        }
      } : undefined,
      "suggestedAnswer": answers.filter(a => !a.isAccepted).map(a => ({
        "@type": "Answer",
        "text": a.body,
        "dateCreated": a.createdAt,
        "upvoteCount": a.score,
        "author": {
          "@type": "Person",
          "name": a.author.displayName
        }
      }))
    }
  };

  return (
    <>
<div className="max-w-4xl mx-auto space-y-8">
        
        {/* QUESTION HEADER */}
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight">
            {getDisplayContent('question', question.id, question.title, question.body).title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-6">
            {question.category && (
              <Link href={`/?category=${encodeURIComponent(question.category.slug)}`}>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent cursor-pointer transition-colors text-xs font-semibold rounded-full px-3 py-1">
                  {question.category.name}
                </Badge>
              </Link>
            )}
            <span className="flex items-center gap-1.5"><span className="opacity-70">Asked</span> <span className="font-medium text-foreground">{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span></span>
            <span className="flex items-center gap-1.5"><span className="opacity-70">Viewed</span> <span className="font-medium text-foreground">{question.viewCount} times</span></span>
            <TranslationToggle 
              active={activeTranslation[`question_${question.id}`] || 'original'} 
              onChange={(target) => handleTranslate('question', question.id, target, question.title, question.body)}
              isTranslating={getDisplayContent('question', question.id, question.title, question.body).isTranslating}
            />
          </div>
        </div>

        {/* QUESTION BODY & VOTING */}
        <div className="flex gap-4 md:gap-6">
          <div className="flex flex-col items-center gap-2 shrink-0 w-12">
            <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${question.myVote === 1 ? 'text-primary bg-primary/10' : ''}`} onClick={() => handleVote('question', question.id, question.myVote === 1 ? 0 : 1)}>
              <ChevronUp className="h-8 w-8" />
            </Button>
            <span className="text-xl font-medium font-serif">{question.score}</span>
            <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${question.myVote === -1 ? 'text-destructive bg-destructive/10' : ''}`} onClick={() => handleVote('question', question.id, question.myVote === -1 ? 0 : -1)}>
              <ChevronDown className="h-8 w-8" />
            </Button>
          </div>

          <div className="flex-1 min-w-0 space-y-6">
            <div className={`prose dark:prose-invert max-w-none break-words ${getDisplayContent('question', question.id, question.title, question.body).isTranslating ? 'opacity-50 animate-pulse' : 'transition-opacity duration-300'}`}>
              {getDisplayContent('question', question.id, question.title, question.body).body}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {question.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-muted hover:bg-muted/80">{tag}</Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setReportDialog({ open: true, type: 'question', id: question.id })}>
                  <Flag className="h-4 w-4 mr-2" /> {t('question.report')}
                </Button>
              </div>

              <div className="p-3 bg-card border rounded-lg flex items-center gap-3 w-full sm:w-auto">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={question.author.avatarUrl || undefined} />
                  <AvatarFallback>{question.author.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-muted-foreground">Asked by</div>
                  <div className="text-sm font-medium">{question.author.displayName}</div>
                </div>
              </div>
            </div>

            {/* Question Comments */}
            <CommentList 
              parentType="question" 
              parentId={question.id} 
              comments={comments} 
              onReport={(id) => setReportDialog({ open: true, type: 'comment', id })} 
            />
          </div>
        </div>

        {/* ANSWERS */}
        <div className="pt-8">
          <h2 className="text-xl font-serif font-bold mb-6 border-b pb-4">
            {answers.length} {t('question.answers')}
          </h2>

          <div className="space-y-10">
            {answers.map(answer => (
              <div key={answer.id} className="flex gap-4 md:gap-6 pb-10 border-b last:border-0 last:pb-0">
                <div className="flex flex-col items-center gap-2 shrink-0 w-12">
                  <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${answer.myVote === 1 ? 'text-primary bg-primary/10' : ''}`} onClick={() => handleVote('answer', answer.id, answer.myVote === 1 ? 0 : 1)}>
                    <ChevronUp className="h-8 w-8" />
                  </Button>
                  <span className="text-xl font-medium font-serif">{answer.score}</span>
                  <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${answer.myVote === -1 ? 'text-destructive bg-destructive/10' : ''}`} onClick={() => handleVote('answer', answer.id, answer.myVote === -1 ? 0 : -1)}>
                    <ChevronDown className="h-8 w-8" />
                  </Button>
                  
                  {answer.isAccepted && (
                    <CheckCircle2 className="h-8 w-8 text-green-500 mt-2" />
                  )}
                  {!answer.isAccepted && isAuthor && (
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full mt-2 hover:text-green-500 hover:bg-green-50" onClick={() => handleAccept(answer.id)}>
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground opacity-30" />
                    </Button>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-6">
                  <div className="flex justify-end mb-[-1rem] relative z-10">
                    <TranslationToggle 
                      active={activeTranslation[`answer_${answer.id}`] || 'original'} 
                      onChange={(target) => handleTranslate('answer', answer.id, target, undefined, answer.body)}
                      isTranslating={getDisplayContent('answer', answer.id, undefined, answer.body).isTranslating}
                    />
                  </div>
                  <div className={`prose dark:prose-invert max-w-none break-words p-4 rounded-xl ${answer.isAccepted ? 'bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900' : ''} ${getDisplayContent('answer', answer.id, undefined, answer.body).isTranslating ? 'opacity-50 animate-pulse' : 'transition-opacity duration-300'}`}>
                    {getDisplayContent('answer', answer.id, undefined, answer.body).body}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setReportDialog({ open: true, type: 'answer', id: answer.id })}>
                        <Flag className="h-4 w-4 mr-2" /> {t('question.report')}
                      </Button>
                    </div>

                    <div className="p-3 bg-muted/30 border rounded-lg flex items-center gap-3 w-full sm:w-auto">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={answer.author.avatarUrl || undefined} />
                        <AvatarFallback>{answer.author.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs text-muted-foreground">Answered {formatDistanceToNow(new Date(answer.createdAt))}</div>
                        <div className="text-sm font-medium">{answer.author.displayName}</div>
                      </div>
                    </div>
                  </div>

                  {/* Answer Comments */}
                  <CommentList 
                    parentType="answer" 
                    parentId={answer.id} 
                    comments={answer.comments || []} 
                    onReport={(id) => setReportDialog({ open: true, type: 'comment', id })} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YOUR ANSWER */}
        {me ? (
          <div className="pt-8 border-t">
            <h2 className="text-xl font-serif font-bold mb-4">{t('question.answer_this')}</h2>
            <AnswerForm questionId={question.id} slug={slug} />
          </div>
        ) : (
          <div className="p-6 bg-muted/50 rounded-xl text-center border border-dashed mt-8">
            <h3 className="font-medium mb-2">Want to answer this question?</h3>
            <Button asChild><Link href="/sign-in">{t('nav.sign_in')}</Link></Button>
          </div>
        )}
      </div>

      <Dialog open={reportDialog.open} onOpenChange={(open) => setReportDialog(prev => ({...prev, open}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('flag.title')}</DialogTitle>
            <DialogDescription>Please describe why this content should be removed or reviewed.</DialogDescription>
          </DialogHeader>
          <Textarea 
            value={reportReason} 
            onChange={e => setReportReason(e.target.value)} 
            placeholder="Reason for reporting..." 
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setReportDialog(prev => ({...prev, open: false}))}>{t('common.cancel')}</Button>
            <Button variant="destructive" onClick={submitReport}>{t('flag.submit')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AnswerForm({ questionId, slug }: { questionId: number, slug: string }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createAnswer = useCreateAnswer();

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: { body: "", website: "" },
  });

  const onSubmit = (values: z.infer<typeof answerSchema>) => {
    if (values.website) return;
    createAnswer.mutate({ id: questionId, data: { body: values.body, language: 'en' } }, {
      onSuccess: () => {
        form.reset();
        toast({ title: "Answer posted!" });
        queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(slug) });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="hidden"><input type="text" {...form.register("website")} tabIndex={-1} /></div>
        <FormField control={form.control} name="body" render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea placeholder="Write your answer here..." className="min-h-[150px] resize-y" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={createAnswer.isPending} className="px-8 rounded-full">{createAnswer.isPending ? t('common.loading') : t('question.post_answer')}</Button>
      </form>
    </Form>
  );
}

function CommentList({ parentType, parentId, comments, onReport }: { parentType: 'question'|'answer', parentId: number, comments: any[], onReport: (id: number) => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createComment = useCreateComment();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: "", website: "" },
  });

  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    if (values.website) return;
    createComment.mutate({ data: { parentType, parentId, body: values.body } }, {
      onSuccess: () => {
        form.reset();
        setShowForm(false);
        queryClient.invalidateQueries(); // invalidate all to catch question details
      }
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-muted">
      {comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {comments.map(c => (
            <div key={c.id} className="text-sm border-b border-muted pb-3 last:border-0 group">
              <span className="text-foreground">{c.body}</span>
              <span className="text-muted-foreground mx-2">—</span>
              <span className="text-primary font-medium">{c.author.displayName}</span>
              <span className="text-muted-foreground ml-2 text-xs">{formatDistanceToNow(new Date(c.createdAt))}</span>
              <button className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" onClick={() => onReport(c.id)}>Flag</button>
            </div>
          ))}
        </div>
      )}
      
      {me ? (
        showForm ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 mt-2">
              <div className="hidden"><input type="text" {...form.register("website")} tabIndex={-1} /></div>
              <FormField control={form.control} name="body" render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea placeholder="Type your comment..." className="min-h-[60px] resize-y text-sm" {...field} />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex flex-col gap-2 shrink-0">
                <Button type="submit" size="sm" disabled={createComment.isPending}>{t('common.save')}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
              </div>
            </form>
          </Form>
        ) : (
          <button onClick={() => setShowForm(true)} className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            {t('question.add_comment')}
          </button>
        )
      ) : null}
    </div>
  );
}

function TranslationToggle({ active, onChange, isTranslating }: { active: 'original'|'en'|'ar', onChange: (t: 'original'|'en'|'ar') => void, isTranslating?: boolean }) {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1 ml-auto border shadow-sm">
      <Globe className={`h-3 w-3 ml-2 text-muted-foreground ${isTranslating ? 'animate-spin' : ''}`} />
      <button 
        onClick={() => onChange('original')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${active === 'original' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        {t('question.translation_original')}
      </button>
      <button 
        onClick={() => onChange('en')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${active === 'en' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        {t('question.translation_en')}
      </button>
      <button 
        onClick={() => onChange('ar')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${active === 'ar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        {t('question.translation_ar')}
      </button>
    </div>
  );
}

function QuestionSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/3"></div>
      </div>
      <div className="flex gap-6">
        <div className="w-12 shrink-0 space-y-2 flex flex-col items-center">
          <div className="h-10 w-10 bg-muted rounded-full"></div>
          <div className="h-6 w-6 bg-muted rounded"></div>
          <div className="h-10 w-10 bg-muted rounded-full"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}
