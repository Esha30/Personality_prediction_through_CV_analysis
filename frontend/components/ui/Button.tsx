import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  loading,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline:
      "inline-flex items-center justify-center gap-2 border border-violet-500/40 text-violet-300 font-semibold px-6 py-3 rounded-xl hover:bg-violet-500/10 hover:border-violet-400/60 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
    ghost:
      "inline-flex items-center justify-center gap-2 text-white/50 font-medium px-4 py-2 rounded-lg hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
  };

  return (
    <button
      className={`${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
