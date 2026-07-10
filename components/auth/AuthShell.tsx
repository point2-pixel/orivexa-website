import Link from "next/link";
import { Sparkles } from "lucide-react";
import { GridBackground } from "@/components/ui/GridBackground";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <GridBackground />
      <div className="absolute left-1/2 top-1/4 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow-sm">
            <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Orivexa AI</span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-2">{footer}</p>
      </div>
    </div>
  );
}
