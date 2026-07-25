"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetMe, getGetMeQueryKey, useListNotifications, getListNotificationsQueryKey, useMarkNotificationsRead } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Inbox, Check } from "lucide-react";

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });

  const { data: notifications, isLoading: notifLoading } = useListNotifications(
    { limit: 100 },
    { query: { enabled: !!me, queryKey: getListNotificationsQueryKey({ limit: 100 }) } }
  );

  const markRead = useMarkNotificationsRead();

  if (meLoading || notifLoading) {
    return <div className="p-8 max-w-3xl mx-auto"><Skeleton className="h-96 w-full rounded-2xl" /></div>;
  }

  if (!me) {
    setLocation("/sign-in");
    return null;
  }

  const handleMarkAllRead = () => {
    markRead.mutate({ data: {} }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey({ limit: 100 }) });
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey({ limit: 10 }) }); // update bell
      }
    });
  };

  return (
    <>
<div className="max-w-3xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <Bell className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">{t('notifications.title')}</h1>
              <p className="text-muted-foreground">Stay updated on answers, comments, and community activity.</p>
            </div>
          </div>
          {notifications?.unreadCount ? (
            <Button variant="outline" onClick={handleMarkAllRead} disabled={markRead.isPending}>
              <Check className="h-4 w-4 mr-2" /> {t('notifications.mark_all_read')}
            </Button>
          ) : null}
        </div>

        <div className="border bg-card rounded-3xl overflow-hidden shadow-sm">
          {!notifications?.items?.length ? (
             <div className="text-center py-20 bg-muted/20 border-dashed text-muted-foreground">
               <Inbox className="h-12 w-12 opacity-20 mx-auto mb-4" />
               <p>{t('notifications.empty')}</p>
             </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.items.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-colors ${!n.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-base ${!n.isRead ? 'font-semibold text-foreground' : 'text-foreground/90'}`}>
                      {n.message}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Button asChild variant={!n.isRead ? "default" : "outline"} size="sm" className="shrink-0 rounded-full px-6">
                    <Link href={n.link}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
