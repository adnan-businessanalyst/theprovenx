"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  useGetMe,
  getGetMeQueryKey,
  useListNotifications,
  getListNotificationsQueryKey,
  useMarkNotificationsRead,
} from "@workspace/api-client-react";
import {
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  Inbox,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

export function NavAuth() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isLoaded, isSignedIn, user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const setLocation = (to: string) => router.push(to);

  const { data: meData } = useGetMe({
    query: {
      enabled: isLoaded && isSignedIn,
      queryKey: getGetMeQueryKey(),
      retry: false,
    },
  });

  const me = meData ?? (isSignedIn ? user : null) ?? null;

  const { data: notifications } = useListNotifications(
    { limit: 10 },
    {
      query: {
        enabled: !!me,
        queryKey: getListNotificationsQueryKey({ limit: 10 }),
      },
    },
  );

  const markRead = useMarkNotificationsRead();

  useEffect(() => {
    if (!me) return;
    const evtSource = new EventSource(`/api/notifications/stream`);
    evtSource.onmessage = () => {
      queryClient.invalidateQueries({
        queryKey: getListNotificationsQueryKey({ limit: 10 }),
      });
    };
    return () => evtSource.close();
  }, [me, queryClient]);

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="px-3 sm:px-5 py-2 bg-primary/10 text-primary hover:bg-primary/20 font-medium rounded-full transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        {t("nav.sign_in")}
      </Link>
    );
  }

  // Signed in — wait for profile payload (or auth user fallback) before icons.
  if (!isLoaded || !me) {
    return (
      <div className="h-9 w-20 animate-pulse rounded-full bg-muted/60" aria-hidden />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            {notifications?.unreadCount ? (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-destructive text-white border-2 border-background">
                {notifications.unreadCount > 99
                  ? "99+"
                  : notifications.unreadCount}
              </Badge>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 rounded-xl">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>{t("notifications.title")}</span>
            {notifications?.unreadCount ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto text-xs py-1 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  markRead.mutate(
                    { data: {} },
                    {
                      onSuccess: () =>
                        queryClient.invalidateQueries({
                          queryKey: getListNotificationsQueryKey({ limit: 10 }),
                        }),
                    },
                  );
                }}
              >
                {t("notifications.mark_all_read")}
              </Button>
            ) : null}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {!notifications?.items?.length ? (
              <div className="p-4 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Inbox className="h-8 w-8 opacity-20" />
                {t("notifications.empty")}
              </div>
            ) : (
              notifications.items.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className={`flex flex-col items-start p-3 gap-1 cursor-pointer rounded-lg ${!n.isRead ? "bg-muted/50" : ""}`}
                  onClick={() => setLocation(n.link)}
                >
                  <span className="text-sm font-medium">{n.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString(i18n.language)}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={me.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {me.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuLabel className="flex items-center gap-2 p-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={me.avatarUrl || undefined} />
              <AvatarFallback>
                {me.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{me.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                @{me.username}
              </p>
              <Badge
                variant="secondary"
                className="w-fit mt-1 text-[10px] py-0 rounded-full"
              >
                {me.reputation} rep
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setLocation("/board")}
            className="cursor-pointer rounded-md"
          >
            <ClipboardList className="mr-2 h-4 w-4" /> My board
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setLocation(`/users/${me.username}`)}
            className="cursor-pointer rounded-md"
          >
            <UserIcon className="mr-2 h-4 w-4" /> {t("profile.activity")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setLocation("/profile")}
            className="cursor-pointer rounded-md"
          >
            <Settings className="mr-2 h-4 w-4" /> {t("profile.edit")}
          </DropdownMenuItem>
          {(me.role === "admin" || me.role === "platform_owner") && (
            <DropdownMenuItem
              onClick={() => setLocation("/admin")}
              className="cursor-pointer text-primary rounded-md"
            >
              <ShieldAlert className="mr-2 h-4 w-4" /> {t("nav.admin")}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              router.push("/");
              router.refresh();
            }}
            className="cursor-pointer text-destructive focus:text-destructive rounded-md"
          >
            <LogOut className="mr-2 h-4 w-4" /> {t("nav.sign_out")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function NavAuthGate() {
  return <NavAuth />;
}
