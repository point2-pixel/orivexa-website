import Link from "next/link";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] pt-20">
      <Container>
        <div className="grid grid-cols-2 gap-10 pb-16 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="#" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-semibold text-white">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {SITE_CONFIG.tagline}. The AI workspace that connects every
              meeting, document, and decision your company makes.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Twitter, href: SITE_CONFIG.links.twitter, label: "Twitter" },
                { icon: Github, href: SITE_CONFIG.links.github, label: "GitHub" },
                { icon: Linkedin, href: SITE_CONFIG.links.linkedin, label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] py-8 sm:flex-row">
          <p className="text-xs text-muted-2">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-2">
            Built for teams who never want to lose an idea again.
          </p>
        </div>
      </Container>
    </footer>
  );
}
