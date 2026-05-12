import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

interface ButtonLinkProps {
  variant?: Variant;
  size?: Size;
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-plasma text-midnight font-medium hover:bg-plasma/90 focus-visible:outline-2 focus-visible:outline-plasma",
  secondary:
    "bg-transparent border border-[rgba(139,146,165,0.4)] text-bone hover:border-ash focus-visible:outline-2 focus-visible:outline-plasma",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-[8px] transition-colors duration-150 focus-visible:outline-offset-2 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export function ButtonLink({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  target,
  rel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
