"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, User, ArrowRight, X } from "lucide-react";

export default function Blog() {
  const { t } = useTranslation();
  const [activePost, setActivePost] = useState<number | null>(null);

  const POSTS = [
    {
      id: 1,
      title: t("blog.p1_title"),
      date: "2023-10-15",
      author: "The Proven X Team",
      excerpt: t("blog.p1_excerpt"),
      content: "When you ask a question online, you usually get one of two things: a generic SEO-optimized article, or a highly upvoted comment from someone who sounds confident but has no actual experience. \n\nWe wanted to change that. The Proven X requires answers to be verified by other users who have walked the same path. It's not about who sounds the smartest—it's about what actually worked in the real world.\n\nBy focusing on first-hand accounts, we cut through the noise. Every 'Proven' answer on this platform represents a real solution that has been validated by peers. Welcome to the future of Q&A."
    },
    {
      id: 2,
      title: t("blog.p2_title"),
      date: "2023-11-02",
      author: "Product Team",
      excerpt: t("blog.p2_excerpt"),
      content: "Upvotes measure popularity, not accuracy. A funny or well-written answer can easily outrank a technically correct one. That's why we built the Proven verification system.\n\nWhen a user posts an answer, it starts as 'Unverified'. Other members of the community who have verified experience in that specific topic can review the answer. If they confirm that it matches their own first-hand experience, they can mark it as 'Verified'.\n\nOnce an answer receives enough verifications from trusted peers, it earns the 'Proven' badge. This ensures that the top answer isn't just the most popular—it's the most reliable."
    },
    {
      id: 3,
      title: t("blog.p3_title"),
      date: "2023-12-10",
      author: "Community Team",
      excerpt: t("blog.p3_excerpt"),
      content: "One of the most magical things about The Proven X is seeing the community band together to solve problems that officially 'don't exist'. \n\nLast month, a user asked about a very specific, undocumented error in a legacy system. Within 24 hours, three different veterans of that system had not only identified the root cause but had collaboratively verified the only known workaround. \n\nThis is why we built The Proven X. The collective experience of our community is vastly deeper than any official manual. When you need answers that aren't in the book, you need people who have lived through it."
    }
  ];

  const handlePostClick = (id: number) => {
    setActivePost(activePost === id ? null : id);
  };

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
{/* Header */}
      <section className="text-center pt-12 space-y-6">
        <h1 className="text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-foreground">
          {t("blog.title")}
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          {t("blog.subtitle")}
        </p>
      </section>

      {/* Blog List */}
      <div className="space-y-8">
        {POSTS.map((post) => {
          const isActive = activePost === post.id;
          
          return (
            <article 
              key={post.id} 
              className={`rounded-[2rem] border bg-card overflow-hidden transition-all duration-500 shadow-sm ${isActive ? 'ring-2 ring-primary border-transparent shadow-md' : 'hover:border-primary/30 hover:shadow-md'}`}
            >
              <div 
                className="p-8 md:p-10 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {post.author}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {!isActive && (
                    <p className="text-muted-foreground text-lg leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex items-center justify-center">
                  <Button 
                    variant={isActive ? "secondary" : "ghost"} 
                    size="icon" 
                    className="rounded-full h-12 w-12 transition-transform duration-500"
                  >
                    {isActive ? <X className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              <div 
                className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="p-8 md:p-10 pt-0 border-t bg-muted/10 prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-xl font-medium text-foreground mb-8 leading-relaxed">
                      {post.excerpt}
                    </p>
                    {post.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
