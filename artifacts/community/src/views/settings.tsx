"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMe, getGetMeQueryKey, useUpdateMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters.").max(80, "Name too long."),
  bio: z.string().max(1000, "Bio too long.").optional(),
});

export default function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);
  const queryClient = useQueryClient();

  const { data: me, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const updateMe = useUpdateMe();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (me) {
      form.reset({
        displayName: me.displayName || "",
        bio: me.bio || "",
      });
    }
  }, [me, form]);

  if (isLoading) {
    return <div className="p-8 max-w-2xl mx-auto"><Skeleton className="h-96 w-full rounded-2xl" /></div>;
  }

  if (!me) {
    setLocation("/sign-in");
    return null;
  }

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    updateMe.mutate({ data: values }, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update profile");
      }
    });
  };

  return (
    <>
<div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <SettingsIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">{t('profile.edit')}</h1>
            <p className="text-muted-foreground">Manage your public presence on The Proven X.</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 border bg-card rounded-3xl shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('profile.display_name')}</FormLabel>
                    <FormDescription>Your name as it appears across the site.</FormDescription>
                    <FormControl>
                      <Input className="text-base h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('profile.bio')}</FormLabel>
                    <FormDescription>Tell the community a bit about yourself and your expertise.</FormDescription>
                    <FormControl>
                      <Textarea className="min-h-[120px] resize-y text-base p-4" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" size="lg" disabled={updateMe.isPending} className="rounded-full px-8 shadow-sm">
                  {updateMe.isPending ? t('common.loading') : t('profile.save')}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
