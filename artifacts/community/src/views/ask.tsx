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
import { X, HelpCircle, LayoutGrid, Plus } from "lucide-react";

const MAX_TAGS = 5;

const formSchema = z
  .object({
    title: z.string().min(10, "Title must be at least 10 characters.").max(200, "Title too long."),
    body: z.string().min(20, "Body must be at least 20 characters.").max(30000, "Body too long."),
    tags: z.array(z.string()).max(MAX_TAGS, `You can add at most ${MAX_TAGS} tags.`),
    categorySlug: z.string().min(1, "Please select a category."),
    website: z.string().max(0, "Honeypot must be empty").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.categorySlug === "other" && data.tags.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one tag is required for the Other category.",
        path: ["tags"],
      });
    }
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

  const categorySlug = form.watch("categorySlug");
  const isOtherCategory = categorySlug === "other";
  const showTags = Boolean(categorySlug);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.website) return;

    createQuestion.mutate(
      {
        data: {
          title: values.title,
          body: values.body,
          tags: values.tags.slice(0, MAX_TAGS),
          categorySlug: values.categorySlug,
          website: values.website,
          language: window.document.documentElement.lang || "en",
        },
      },
      {
        onSuccess: (question) => {
          const pending = question.status === "pending_review";
          toast({
            title: pending ? "Submitted for review" : "Question posted!",
            description: pending
              ? "Your question will appear publicly once it is approved."
              : "Your question has been published.",
          });
          setLocation(`/questions/${question.slug}`);
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message || "Failed to post question. Please try again.",
          });
        },
      },
    );
  };

  const addTagsFromInput = () => {
    const parts = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (parts.length === 0) return;

    const currentTags = form.getValues("tags");
    const next = [...currentTags];
    let skipped = 0;

    for (const part of parts) {
      if (next.length >= MAX_TAGS) {
        skipped += 1;
        continue;
      }
      if (!next.includes(part)) {
        next.push(part);
      }
    }

    form.setValue("tags", next, { shouldValidate: true });
    setTagInput("");

    if (skipped > 0 || (currentTags.length >= MAX_TAGS && parts.length > 0)) {
      toast({
        variant: "destructive",
        title: "Limit reached",
        description: `You can add at most ${MAX_TAGS} tags.`,
      });
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTagsFromInput();
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter((t) => t !== tagToRemove),
      { shouldValidate: true },
    );
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary shrink-0 shadow-sm">
            <HelpCircle className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              {t("question.ask_title")}
            </h1>
            <p className="text-muted-foreground text-base">
              Be specific, provide context, and keep it clear so others can help you effectively.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 border bg-card rounded-3xl shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="hidden" aria-hidden="true">
                <input type="text" {...form.register("website")} tabIndex={-1} autoComplete="off" />
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("question.title_label")}
                    </FormLabel>
                    <FormDescription>
                      Summarize your problem in a one-sentence question.
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="e.g. How do I renew my residency permit after the recent policy update?"
                        className="text-base h-12 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categorySlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-primary" /> Category
                    </FormLabel>
                    <FormDescription>Select the best matching category.</FormDescription>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.trigger("tags");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl text-base">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {categories?.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.slug}
                            className="rounded-md cursor-pointer"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showTags ? (
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        {t("question.tags_label")}{" "}
                        {isOtherCategory ? (
                          <span className="text-destructive font-normal">(required)</span>
                        ) : (
                          <span className="text-muted-foreground font-normal">(optional)</span>
                        )}
                      </FormLabel>
                      <FormDescription>
                        {isOtherCategory
                          ? `Add at least one tag for this Other topic (up to ${MAX_TAGS}). Separate multiple tags with commas, then press Enter or Add.`
                          : `Optionally add up to ${MAX_TAGS} tags. Separate them with commas, then press Enter or Add.`}
                      </FormDescription>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="e.g. housing, visa, renew..."
                            className="h-12 rounded-xl"
                            disabled={form.watch("tags").length >= MAX_TAGS}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-12 shrink-0 rounded-xl px-4"
                          onClick={addTagsFromInput}
                          disabled={
                            !tagInput.trim() || form.watch("tags").length >= MAX_TAGS
                          }
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.watch("tags").map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-destructive transition-colors focus:outline-none rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}

              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      {t("question.body_label")}
                    </FormLabel>
                    <FormDescription>
                      Include all the information someone would need to answer your question.
                    </FormDescription>
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
                <Button
                  type="submit"
                  size="lg"
                  disabled={createQuestion.isPending}
                  className="rounded-full px-10 h-12 shadow-md hover:shadow-lg transition-all text-base font-bold"
                >
                  {createQuestion.isPending ? t("common.loading") : t("question.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
