"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateQuestion, useListCategories } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, HelpCircle, LayoutGrid } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters.").max(200, "Title too long."),
  body: z.string().min(20, "Body must be at least 20 characters.").max(30000, "Body too long."),
  tags: z.array(z.string()).min(1, "At least 1 tag is required.").max(5, "Maximum 5 tags allowed."),
  categorySlug: z.string().min(1, "Please select a category."),
  website: z.string().max(0, "Honeypot must be empty").optional(), // Honeypot
});

export default function AskQuestion() {
  const { t } = useTranslation();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState("");
  
  const createQuestion = useCreateQuestion();
  const { data: categories } = useListCategories();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      tags: [],
      categorySlug: "",
      website: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.website) return; // Honeypot caught someone

    createQuestion.mutate({
      data: {
        title: values.title,
        body: values.body,
        tags: values.tags,
        categorySlug: values.categorySlug,
        website: values.website,
        language: window.document.documentElement.lang || 'en'
      }
    }, {
      onSuccess: (question) => {
        toast({
          title: "Question posted!",
          description: "Your question has been published.",
        });
        setLocation(`/questions/${question.slug}`);
      },
      onError: (err: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to post question. Please try again.",
        });
      }
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !form.getValues('tags').includes(newTag)) {
        const currentTags = form.getValues('tags');
        if (currentTags.length < 5) {
          form.setValue('tags', [...currentTags, newTag], { shouldValidate: true });
          setTagInput("");
        } else {
          toast({ variant: "destructive", title: "Limit reached", description: "You can only add up to 5 tags." });
        }
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(t => t !== tagToRemove), { shouldValidate: true });
  };

  return (
    <>
<div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 shadow-sm">
            <HelpCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{t('question.ask_title')}</h1>
            <p className="text-muted-foreground text-base">Be specific, provide context, and keep it clear so others can help you effectively.</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 border bg-card rounded-3xl shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input type="text" {...form.register("website")} tabIndex={-1} autoComplete="off" />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('question.title_label')}</FormLabel>
                    <FormDescription>Summarize your problem in a one-sentence question.</FormDescription>
                    <FormControl>
                      <Input placeholder="e.g. How do I renew my residency permit after the recent policy update?" className="text-base h-12 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="categorySlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2"><LayoutGrid className="h-4 w-4 text-primary" /> Category</FormLabel>
                      <FormDescription>Select the best matching category.</FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl text-base">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl">
                          {categories?.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug} className="rounded-md cursor-pointer">{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">{t('question.tags_label')}</FormLabel>
                      <FormDescription>Add up to 5 tags (press Enter).</FormDescription>
                      <FormControl>
                        <Input 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="e.g. visa, policy-2024..." 
                          className="h-12 rounded-xl"
                          disabled={form.watch('tags').length >= 5}
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.watch('tags').map(tag => (
                          <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors focus:outline-none rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">{t('question.body_label')}</FormLabel>
                    <FormDescription>Include all the information someone would need to answer your question.</FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide details, context, what you have tried..." 
                        className="min-h-[250px] resize-y text-base p-5 rounded-2xl" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 border-t flex justify-end">
                <Button type="submit" size="lg" disabled={createQuestion.isPending} className="rounded-full px-10 h-12 shadow-md hover:shadow-lg transition-all text-base font-bold">
                  {createQuestion.isPending ? t('common.loading') : t('question.submit')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
