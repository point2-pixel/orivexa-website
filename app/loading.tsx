export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-secondary [animation-delay:0.15s]" />
        <span className="h-2 w-2 animate-pulse-glow rounded-full bg-accent [animation-delay:0.3s]" />
      </div>
    </div>
  );
}
