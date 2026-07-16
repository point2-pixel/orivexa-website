"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useScrollLock(mobileOpen);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="mx-auto max-w-7xl container-px">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl transition-all duration-500",
            scrolled
              ? "glass-strong px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-transparent px-5 py-3"
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label={`${SITE_CONFIG.name} home`}>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow-sm">
              <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-lg px-4 py-2 text-sm text-muted transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <ButtonLink href="/signup" size="sm" className="group">
              Get started
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </ButtonLink>
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mx-auto mt-3 max-w-7xl container-px">
              <div className="glass-strong flex flex-col gap-1 rounded-2xl p-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm text-muted hover:bg-white/5 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-2.5 text-center text-sm text-muted hover:text-white"
                  >
                    Sign in
                  </Link>
                  <ButtonLink href="/signup" size="md" className="w-full" onClick={() => setMobileOpen(false)}>
                    Get started
                  </ButtonLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
