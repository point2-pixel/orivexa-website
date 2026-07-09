import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GridBackground } from "@/components/ui/GridBackground";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <GridBackground />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />

      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow-sm">
        <Sparkles className="h-6 w-6 text-white" strokeWidth={2.5} />
      </span>

      <h1 className="mt-8 text-display-md font-semibold tracking-tight text-white">
        This node isn&apos;t in the graph
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
        Let&apos;s get you back to something connected.
      </p>
      <Link href="/">
        <Button size="lg" className="mt-8">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
