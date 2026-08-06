"use client";

import { ReactNode, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Search as SearchIcon, Menu, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HeroVisibilityContext } from "@/lib/hero-visibility";
import { PageScrollNavContext } from "@/lib/page-scroll-nav";
import { NavAuthGate } from "@/components/nav-auth";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "tl", label: "Tagalog" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ru", label: "Русский" },
  { code: "uk", label: "Українська" },
  { code: "fa", label: "فارسی" },
  { code: "ur", label: "اردو" },
  { code: "bn", label: "বাংলা" },
  { code: "tr", label: "Türkçe" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const setLocation = (to: string) => router.push(to);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    window.localStorage.setItem("i18nextLng", code);
  };

  // Nav Ask button: hidden while the home hero is visible; bounces in when it
  // appears, then re-bounces at a random interval every 3-30 seconds.
  const [heroVisible, setHeroVisible] = useState<boolean | null>(null);
  const heroCtx = useMemo(() => ({ heroVisible, setHeroVisible }), [heroVisible]);
  const isHome = pathname === "/";
  // On home, stay hidden until the hero has been measured and scrolled past.
  const askVisible = isHome ? heroVisible === false : true;
  const navOverHero = isHome && heroVisible !== false;
  const [bouncing, setBouncing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isProductsPage = pathname === "/products";
  const isWhoWeArePage = pathname === "/who-we-are";
  const usesScrollSwapNav = isProductsPage || isWhoWeArePage;
  const [pageScrolled, setPageScrolled] = useState(false);
  const pageScrollCtx = useMemo(
    () => ({ scrolled: usesScrollSwapNav && pageScrolled }),
    [usesScrollSwapNav, pageScrolled],
  );

  useEffect(() => {
    if (!usesScrollSwapNav) {
      setPageScrolled(false);
      return;
    }
    const onScroll = () => {
      setPageScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [usesScrollSwapNav]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string)?.trim();
    if (q) {
      setSearchOpen(false);
      setLocation(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  useEffect(() => {
    if (!askVisible) {
      setBouncing(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setBouncing(true);
    let tid: number;
    const schedule = () => {
      tid = window.setTimeout(() => {
        setBouncing(true);
        schedule();
      }, 3000 + Math.random() * 27000);
    };
    schedule();
    return () => window.clearTimeout(tid);
  }, [askVisible]);

  return (
    <HeroVisibilityContext.Provider value={heroCtx}>
    <PageScrollNavContext.Provider value={pageScrollCtx}>
    <div
      className={cn(
        "min-h-[100dvh] flex flex-col font-sans",
        isWhoWeArePage ? "bg-transparent" : "bg-muted/20",
      )}
    >
      <div
        className={cn(
          "sticky top-4 z-50 w-full px-4 transition-all duration-300",
          usesScrollSwapNav && pageScrolled &&
            "opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden !px-0 m-0",
        )}
        aria-hidden={usesScrollSwapNav && pageScrolled}
      >
        <header
          className={cn(
            "mx-auto max-w-6xl rounded-full border-0 transition-all duration-300",
            navOverHero
              ? "bg-transparent shadow-none backdrop-blur-0"
              : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md",
          )}
        >
          <div className="px-6 flex h-16 items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center mr-2 hover-elevate rounded-full px-1 py-0.5 transition-all shrink-0">
              <img
                src="/logo.png"
                alt="The Proven X"
                className="h-10 w-auto max-w-[min(220px,42vw)] object-contain"
              />
            </Link>

            {/* Navigation Links */}
            <nav
              className={cn(
                "hidden md:flex items-center gap-1 text-sm font-medium mr-auto",
                navOverHero ? "text-white/85" : "text-muted-foreground",
              )}
            >
              <Link href="/who-we-are" className={cn("px-4 py-2 rounded-full transition-colors", navOverHero ? "hover:text-white hover:bg-white/10" : "hover:text-foreground hover:bg-muted/80")}>{t("nav.who_we_are")}</Link>
              <Link href="/about" className={cn("px-4 py-2 rounded-full transition-colors", navOverHero ? "hover:text-white hover:bg-white/10" : "hover:text-foreground hover:bg-muted/80")}>{t("nav.about")}</Link>
              <Link href="/products" className={cn("px-4 py-2 rounded-full transition-colors", navOverHero ? "hover:text-white hover:bg-white/10" : "hover:text-foreground hover:bg-muted/80")}>{t("nav.products")}</Link>
              <Link href="/blog" className={cn("px-4 py-2 rounded-full transition-colors", navOverHero ? "hover:text-white hover:bg-white/10" : "hover:text-foreground hover:bg-muted/80")}>{t("nav.blog")}</Link>
              <Link href="/contributors" className={cn("px-4 py-2 rounded-full transition-colors", navOverHero ? "hover:text-white hover:bg-white/10" : "hover:text-foreground hover:bg-muted/80")}>{t("nav.contributors")}</Link>
            </nav>

            <div className="flex-1 md:hidden"></div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full hidden sm:flex",
                  navOverHero && "text-white hover:text-white hover:bg-white/10",
                )}
                onClick={() => setSearchOpen(true)}
                aria-label={t("nav.search")}
              >
                <SearchIcon className="h-4 w-4" />
              </Button>

              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="sm:max-w-lg top-[20%] translate-y-0 rounded-3xl p-6">
                  <DialogHeader>
                    <DialogTitle className="font-serif">{t("nav.search")}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <SearchIcon className="absolute left-4 rtl:left-auto rtl:right-4 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      name="q"
                      type="search"
                      autoFocus
                      placeholder={t("search.placeholder")}
                      className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 h-12 rounded-full"
                    />
                  </form>
                </DialogContent>
              </Dialog>

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      navOverHero && "text-white hover:text-white hover:bg-white/10",
                    )}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto rounded-xl">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={i18n.language === lang.code ? "bg-muted font-bold" : ""}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/ask"
                aria-hidden={!askVisible}
                tabIndex={askVisible ? undefined : -1}
                onAnimationEnd={() => setBouncing(false)}
                className={`inline-flex px-3 sm:px-5 py-2 bg-primary text-primary-foreground font-medium rounded-full shadow-sm hover:shadow-md hover:bg-primary/90 transition-all items-center gap-1.5 text-sm ${askVisible ? (bouncing ? "animate-ask-bounce" : "") : "invisible pointer-events-none"}`}
              >
                <span className="hidden sm:inline">{t("nav.ask")}</span>
                <span className="sm:hidden text-lg leading-none mb-[2px]">+</span>
              </Link>

              <NavAuthGate />
              
              {/* Mobile menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "rounded-full",
                      navOverHero && "text-white hover:text-white hover:bg-white/10",
                    )}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem onClick={() => setLocation('/who-we-are')} className="rounded-md">{t("nav.who_we_are")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/about')} className="rounded-md">{t("nav.about")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/products')} className="rounded-md">{t("nav.products")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/blog')} className="rounded-md">{t("nav.blog")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/contributors')} className="rounded-md">{t("nav.contributors")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchOpen(true)} className="rounded-md">{t("nav.search")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/ask')} className="font-bold text-primary rounded-md">{t("nav.ask")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/sign-in')} className="rounded-md">{t("nav.sign_in")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </header>
      </div>

      {isWhoWeArePage || isHome ? (
        <div className="flex-1">{children}</div>
      ) : (
        <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>
      )}

      {!isWhoWeArePage ? (
        <footer className="border-t bg-card mt-auto">
          <div className="container mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="The Proven X"
                className="h-8 w-auto max-w-[140px] object-contain opacity-70"
              />
              <span>&copy; {new Date().getFullYear()} {t("footer.copyright")}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/tags" className="hover:text-foreground transition-colors">{t("nav.tags")}</Link>
              <Link href="/contributors" className="hover:text-foreground transition-colors">{t("nav.contributors")}</Link>
              <Link href="/" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
              <Link href="/" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
              <Link href="/" className="hover:text-foreground transition-colors">{t("footer.help")}</Link>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
    </PageScrollNavContext.Provider>
    </HeroVisibilityContext.Provider>
  );
}
