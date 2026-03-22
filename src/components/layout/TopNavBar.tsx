import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CreditCard,
  Users,
  Calendar,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage, useTranslations } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const regulatoryLinks = [
  { id: "sfda", name: "هيئة الغذاء والدواء", nameEn: "SFDA", url: "https://www.sfda.gov.sa/", icon: "🏛️" },
  { id: "saso", name: "هيئة المواصفات والمقاييس", nameEn: "SASO", url: "https://www.saso.gov.sa/", icon: "📋" },
  { id: "iso", name: "منظمة ISO", nameEn: "ISO", url: "https://www.iso.org/", icon: "🌐" },
];

export function TopNavBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { lang, setLang, isRtl } = useLanguage();
  const t = useTranslations();
  const { currentUser, notifications, users, switchUser, markNotificationRead } = useAppContext();

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const displayName = lang === "ar" ? currentUser.name : currentUser.nameEn;
  const displayRole = lang === "ar" ? currentUser.role : currentUser.roleEn;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 bg-card border-b border-border/60 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">{isRtl ? "ج" : "F"}</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-foreground leading-tight">
                {t.systemName}
              </h1>
              <p className="text-xs text-muted-foreground">{t.fsms}</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-8 bg-border/60" />

          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <span className="text-secondary-foreground font-medium text-sm">{isRtl ? "غ" : "S"}</span>
            </div>
            <span className="text-sm text-muted-foreground">{isRtl ? "شركة الغذاء السعودية" : "Saudi Food Company"}</span>
          </div>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Regulatory Links */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-muted-foreground ml-1">{t.relatedLinks}</span>
            <div className="flex items-center gap-1">
              {regulatoryLinks.map((link) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{isRtl ? link.name : link.nameEn}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="hidden lg:block w-px h-6 bg-border/60" />

          {/* Search */}
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <Input
                  type="search"
                  placeholder={t.searchPlaceholder}
                  className={`h-9 text-sm ${isRtl ? "pr-9" : "pl-9"}`}
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRtl ? "right-3" : "left-3"}`} />
              </motion.div>
            ) : (
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-4 h-4" />
              </Button>
            )}
          </AnimatePresence>

          {/* Language Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              >
                <Globe className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{lang === "ar" ? "English" : "العربية"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className={`absolute top-1.5 w-2 h-2 bg-destructive rounded-full ${isRtl ? "left-1.5" : "right-1.5"}`} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0" sideOffset={8}>
              <div className="p-4 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{isRtl ? "التنبيهات" : "Notifications"}</h3>
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount}</Badge>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                {userNotifications.length > 0 ? (
                  <div className="flex flex-col">
                    {userNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-4 border-b border-border/40 hover:bg-secondary/20 transition-colors cursor-pointer",
                          !n.read && "bg-primary/5"
                        )}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <p className="text-sm font-medium">{isRtl ? n.title : n.titleEn}</p>
                        <p className="text-xs text-muted-foreground mt-1">{isRtl ? n.message : n.messageEn}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {new Date(n.createdAt).toLocaleTimeString(isRtl ? "ar-SA" : "en-US")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    {isRtl ? "لا توجد تنبيهات حالياً" : "No notifications yet"}
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border/60" />

          {/* User Profile & Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-2 px-2 hover:bg-secondary">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className={`hidden md:block ${isRtl ? "text-right" : "text-left"}`}>
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{displayRole}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 p-0" sideOffset={8}>
              <div className="p-4 bg-secondary/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{displayName}</p>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isRtl ? "تبديل الحساب" : "Switch Account"}
                </DropdownMenuLabel>
                {users.map((user) => (
                  <DropdownMenuItem 
                    key={user.id} 
                    className="gap-2 cursor-pointer flex items-center justify-between"
                    onClick={() => switchUser(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-secondary">
                          {(isRtl ? user.name : user.nameEn).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className={cn(currentUser.id === user.id && "font-bold")}>
                        {isRtl ? user.name : user.nameEn}
                      </span>
                    </div>
                    {currentUser.id === user.id && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator />

              <div className="p-2">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  <span>{t.manageAccount}</span>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="p-2">
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
