import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  ClipboardCheck,
  Shield,
  Target,
  Wrench,
  Truck,
  Package,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Calendar,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { id: "meetings", labelKey: "meetings", icon: Calendar },
  { id: "quality", labelKey: "quality", icon: Shield },
  { id: "ccp", labelKey: "ccp", icon: Target },
  { id: "nonconformance", labelKey: "nonconformance", icon: AlertCircle, badge: 3 },
  { id: "customers", labelKey: "customers", icon: UserCheck },
  { id: "suppliers", labelKey: "suppliers", icon: Truck },
  { id: "audits", labelKey: "audits", icon: ClipboardCheck },
  { id: "maintenance", labelKey: "maintenance", icon: Wrench },
  { id: "inventory", labelKey: "inventory", icon: Package },
  { id: "documents", labelKey: "documents", icon: FileText },
  { id: "library", labelKey: "library", icon: FolderOpen },
  { id: "complaints", labelKey: "complaints", icon: MessageSquare },
  { id: "users", labelKey: "usersNav", icon: Users },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isRtl } = useLanguage();
  const t = useTranslations();

  return (
    <aside
      className={cn(
        "fixed top-16 bottom-0 z-40 bg-sidebar border-sidebar-border transition-all duration-300 flex flex-col",
        isRtl ? "right-0 border-l" : "left-0 border-r",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-6 z-50 h-6 w-6 rounded-full bg-card border border-border shadow-sm hover:bg-secondary",
          isRtl ? "-left-3" : "-right-3"
        )}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          isRtl ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />
        ) : (
          isRtl ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            const label = t[item.labelKey as keyof typeof t] as string;

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <li>
                      <button
                        onClick={() => onItemClick(item.id)}
                        className={cn(
                          "w-full h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.badge && (
                          <span className="absolute top-0 left-0 -mt-1 -ml-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent side={isRtl ? "left" : "right"}>
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={cn(
                    "w-full h-10 rounded-lg flex items-center gap-3 px-3 transition-all duration-200 text-sm",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRtl ? 10 : -10 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  </AnimatePresence>
                  {item.badge && (
                    <span className={`${isRtl ? "mr-auto" : "ml-auto"} h-5 min-w-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/60 text-center">
            <p>{t.version}</p>
            <p className="mt-1">© 2024 FSMS</p>
          </div>
        )}
      </div>
    </aside>
  );
}
