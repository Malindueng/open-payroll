import { ReactNode } from "react";

type Variant = "primary" | "danger" | "ghost" | "success";

const styles: Record<Variant, string> = {
  primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
  danger: "bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30",
  ghost: "bg-gray-800 hover:bg-gray-700 text-gray-300",
  success: "bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/30",
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}