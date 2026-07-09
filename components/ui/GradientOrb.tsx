import { cn } from "@/lib/utils";

interface GradientOrbProps {
  className?: string;
  color?: "primary" | "secondary" | "accent";
  size?: number;
}

const colorMap = {
  primary: "bg-primary/30",
  secondary: "bg-secondary/25",
  accent: "bg-accent/20",
};

export function GradientOrb({ className, color = "primary", size = 500 }: GradientOrbProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-[120px]",
        colorMap[color],
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
