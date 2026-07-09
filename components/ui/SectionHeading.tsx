import { cn } from "@/lib/utils";
import { ScrollReveal } from "./ScrollReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </span>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.1}>
        <h2 className="mt-5 text-display-md font-semibold tracking-tight text-white">
          {title}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={0.18}>
          <p className={cn("mt-5 text-lg text-muted leading-relaxed", align === "center" && "mx-auto")}>
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
