"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useListTopUsers, getListTopUsersQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, TrendingUp } from "lucide-react";

export default function Contributors() {
  const { t } = useTranslation();

  const { data: users, isLoading } = useListTopUsers(
    { limit: 50 },
    { query: { queryKey: getListTopUsersQueryKey({ limit: 50 }) } }
  );

  return (
    <>
<div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border">
          <Trophy className="h-16 w-16 text-secondary mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Top Contributors</h1>
          <p className="text-muted-foreground text-center max-w-lg">
            Recognizing the experts and community members who share their knowledge and help others navigate complex questions.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-xl animate-pulse flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted w-2/3 rounded"></div>
                  <div className="h-3 bg-muted w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <Link key={user.id} href={`/users/${user.username}`}>
                <div className="p-5 rounded-2xl border bg-card hover-elevate transition-all flex items-center gap-4 group cursor-pointer relative overflow-hidden">
                  
                  {index < 3 && (
                    <div className="absolute top-0 right-0 p-2">
                      <Award className={`h-6 w-6 ${index === 0 ? 'text-accent' : index === 1 ? 'text-slate-400' : 'text-[#cd7f32]'}`} />
                    </div>
                  )}

                  <div className="relative shrink-0">
                    <Avatar className="h-14 w-14 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className="text-lg bg-primary/5 text-primary">
                        {user.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center bg-background rounded-full p-0.5">
                      <Badge variant="secondary" className="px-1 py-0 h-4 text-[10px] bg-secondary/20 text-secondary-foreground border border-secondary/30">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {user.displayName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 text-primary font-medium" title="Reputation">
                        <TrendingUp className="h-3 w-3" /> {user.reputation}
                      </div>
                      <div title="Accepted Answers">
                        <span className="font-medium text-foreground">{user.acceptedAnswerCount}</span> <span className="opacity-70">answers</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No contributors yet</h3>
            <p className="text-muted-foreground">Be the first to answer a question!</p>
          </div>
        )}
      </div>
    </>
  );
}
