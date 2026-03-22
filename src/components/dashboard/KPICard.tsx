import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label: string;
  };
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "accent";
  delay?: number;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  icon,
  variant = "default",
  delay = 0,
}: KPICardProps) {
  const variantStyles = {
    default: "border-border/50",
    success: "border-success/30 bg-success-light/20",
    warning: "border-warning/30 bg-warning-light/20",
    destructive: "border-destructive/30 bg-destructive-light/20",
    accent: "border-accent/30 bg-accent-light/10",
  };

  const iconBgStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
    accent: "bg-accent/15 text-accent",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = trend?.direction === "up" ? ArrowUp : trend?.direction === "down" ? ArrowDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "kpi-card group hover:shadow-hover transition-all duration-300",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <TrendIcon
                className={cn("w-4 h-4", trendColors[trend.direction])}
              />
              <span className={cn("text-sm font-medium", trendColors[trend.direction])}>
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            iconBgStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
