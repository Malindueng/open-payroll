import { ReactNode } from "react";

type Variant = "primary" | "danger" | "ghost" | "success" | "outline";

const cls: Record<Variant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  danger: "btn-danger",
  ghost: "btn-ghost",
  success: "btn-success",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${cls[variant]} ${className}`}
    >
      {children}
    </button>
  );
}