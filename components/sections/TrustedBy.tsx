import { TRUSTED_COMPANIES } from "@/lib/constants";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function TrustedBy() {
  const doubled = [...TRUSTED_COMPANIES, ...TRUSTED_COMPANIES];

  return (
    <section className="relative py-16">
      <ScrollReveal>
        <p className="text-center font-mono text-xs uppercase tracking-[0.25em] text-muted-2">
          Trusted by knowledge-driven teams
        </p>
      </ScrollReveal>

      <div className="relative mt-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee gap-16">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex shrink-0 items-center text-xl font-semibold tracking-tight text-white/25 transition-colors hover:text-white/50"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
