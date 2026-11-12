import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "success" | "quiet" | "danger" | "theme";
export type ButtonSize = "md" | "lg" | "xl";

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-semibold leading-none " +
  "transition-[transform,box-shadow,background-color] duration-150 active:translate-y-[3px] " +
  "disabled:cursor-not-allowed aria-disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-sun text-ink border-[3px] border-ink shadow-[0_4px_0_0_var(--color-ink)] hover:bg-[#ffd466] active:shadow-[0_1px_0_0_var(--color-ink)]",
  secondary:
    "bg-paper text-ink border-[3px] border-ink shadow-[0_4px_0_0_var(--color-ink)] hover:bg-cream active:shadow-[0_1px_0_0_var(--color-ink)]",
  success:
    "bg-mint-deep text-white border-[3px] border-ink shadow-[0_4px_0_0_var(--color-ink)] hover:brightness-110 active:shadow-[0_1px_0_0_var(--color-ink)]",
  theme:
    "bg-theme-deep text-white border-[3px] border-ink shadow-[0_4px_0_0_var(--color-ink)] hover:brightness-110 active:shadow-[0_1px_0_0_var(--color-ink)]",
  danger:
    "bg-coral-deep text-white border-[3px] border-ink shadow-[0_4px_0_0_var(--color-ink)] hover:brightness-110 active:shadow-[0_1px_0_0_var(--color-ink)]",
  quiet: "bg-transparent text-ink hover:bg-ink/5 active:translate-y-0",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-lg",
  xl: "min-h-16 px-9 text-xl",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconAfter?: IconName;
  children: ReactNode;
}

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "children">;

export function Button({ variant, size, icon, iconAfter, className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {icon && <Icon name={icon} className="h-[1.3em] w-[1.3em] shrink-0" />}
      {children}
      {iconAfter && <Icon name={iconAfter} className="h-[1.3em] w-[1.3em] shrink-0" />}
    </button>
  );
}

type ButtonLinkProps = CommonProps & Omit<ComponentProps<typeof Link>, "children">;

export function ButtonLink({ variant, size, icon, iconAfter, className = "", children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {icon && <Icon name={icon} className="h-[1.3em] w-[1.3em] shrink-0" />}
      {children}
      {iconAfter && <Icon name={iconAfter} className="h-[1.3em] w-[1.3em] shrink-0" />}
    </Link>
  );
}
