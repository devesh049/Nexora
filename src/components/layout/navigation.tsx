"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Search, User, Command } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandMenu } from "@/components/navigation/command-menu";
import { navigation } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();
  const authenticated = sessionStatus === "authenticated";
  const displayName = session?.user?.name || session?.user?.email || "Account";
  const initials = displayName.slice(0, 1).toUpperCase();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandMenuOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur-xl shadow-sm"
            : "border-b border-transparent bg-background/60 backdrop-blur-md"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:text-primary",
                    isActivePath(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground-secondary hover:bg-surface-hover"
                  )}
                  aria-current={isActivePath(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex md:items-center md:gap-2">
              {/* Search / Command Menu Trigger */}
              <button
                onClick={() => setCommandMenuOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-hover text-sm text-foreground-muted hover:border-border-hover hover:text-foreground transition-all"
                aria-label="Open command menu"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 text-xs text-foreground-muted">
                  <Command className="h-3 w-3" />
                  K
                </kbd>
              </button>
              <ThemeToggle />
              {authenticated ? <>
                <Link href="/dashboard" aria-label={`Dashboard for ${displayName}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">{initials}</Link>
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>Log Out</Button>
              </> : <>
                <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                <Link href="/signup"><Button variant="primary" size="sm">Sign Up</Button></Link>
              </>}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setCommandMenuOpen(true)}
                className="p-2 rounded-lg text-foreground-muted hover:bg-surface-hover"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
            <div className="space-y-1 px-4 py-4">
              {navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-base font-medium transition-all",
                    isActivePath(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
                  )}
                  aria-current={isActivePath(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-border mt-2">
                {authenticated ? <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}><Button variant="ghost" className="w-full justify-start gap-2"><User className="h-4 w-4" />{displayName}</Button></Link>
                  <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => signOut({ callbackUrl: "/" })}><User className="h-4 w-4" />Log Out</Button>
                </> : <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Sign Up Free
                  </Button>
                </Link>
                </>}
              </div>
            </div>
          </div>
        )}
      </nav>

      <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
    </>
  );
}
