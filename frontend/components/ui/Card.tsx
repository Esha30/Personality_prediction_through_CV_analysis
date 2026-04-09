import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function Card({ children, className = "", title, subtitle, icon, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`card p-6 relative overflow-hidden group hover:border-violet-500/25 transition-all duration-500 ${className}`}
    >
      {/* Ambient glow on hover */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {title && (
        <div className="mb-5 relative z-10">
          <div className="flex items-center gap-2.5 mb-1">
            {icon && <div className="text-violet-400">{icon}</div>}
            <h3 className="text-base font-semibold text-white/90 font-display">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-white/35 font-medium">{subtitle}</p>}
        </div>
      )}
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
