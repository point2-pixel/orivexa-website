import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonVariantStyles, buttonSizeStyles } from "./Button";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonVariantStyles;
  size?: keyof typeof buttonSizeStyles;
  className?: string;
  onClick?: () => void;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out",
        buttonVariantStyles[variant],
        buttonSizeStyles[size],
        className
      )}
    >
      {children}
    </Link>
  );
}
