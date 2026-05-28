/**
 * AppHeader — shared responsive header used by all inner app pages.
 *
 * Desktop (lg+): logo + inline nav links + right controls (ThemeToggle, profile, logout)
 * Mobile/tablet (<lg): logo + right controls + burger button → animated slide-down dropdown
 *
 * Usage:
 *   <AppHeader activePath="/simulations" />
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  Brain,
  LayoutDashboard,
  Layers,
  LogOut,
  Menu,
  Pencil,
  Shield,
  Target,
  User,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",    path: "/dashboard",    icon: LayoutDashboard, className: "text-cyan-400/90 hover:text-cyan-300" },
  { label: "Simulations",  path: "/simulations",  icon: Zap,             className: "text-amber-400/80 hover:text-amber-300" },
  { label: "Achievements", path: "/achievements", icon: Award,           className: "text-foreground/70 hover:text-white" },
  { label: "Mindset",      path: "/mindset",      icon: Brain,           className: "text-purple-400/80 hover:text-purple-300" },
  { label: "Glossary",     path: "/glossary",     icon: BookOpen,        className: "text-foreground/70 hover:text-white" },
  { label: "Frameworks",   path: "/frameworks",   icon: Layers,          className: "text-foreground/70 hover:text-white" },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Admin",     path: "/admin/cancellations", icon: Shield, className: "text-rose-400/80 hover:text-rose-300" },
  { label: "Questions", path: "/admin/questions",     icon: Pencil, className: "text-amber-400/80 hover:text-amber-300" },
];

interface AppHeaderProps {
  /** Current route path — used to highlight the active nav item */
  activePath?: string;
}

export function AppHeader({ activePath }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navTo = (path: string) => {
    setMenuOpen(false);
    setLocation(path);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#app-header")) setMenuOpen(false);
    };
    const handleScroll = () => setMenuOpen(false);
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuOpen]);

  const isAdmin = user?.role === "admin";
  const allItems = isAdmin ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <header
      id="app-header"
      className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50"
    >
      {/* ── Main row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        {/* Logo */}
        <button
          onClick={() => navTo("/dashboard")}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Target className="h-3.5 w-3.5 text-foreground" />
          </div>
          <span className="font-bold text-base">Spitfire PM</span>
        </button>

        {/* Desktop nav — hidden below lg */}
        <nav className="hidden lg:flex gap-1 flex-1 justify-center">
          {allItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => setLocation(item.path)}
                className={`${item.className} ${isActive ? "bg-white/8 font-semibold" : ""}`}
              >
                <item.icon className="h-4 w-4 mr-1.5" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ThemeToggle />
          {/* Name + email — desktop only */}
          <button
            onClick={() => setLocation("/profile")}
            className="text-sm text-right hidden lg:block hover:opacity-80 transition-opacity cursor-pointer"
          >
            <p className="font-medium text-foreground">{user?.displayName || user?.name}</p>
            <p className="text-foreground/40 text-xs">{user?.email}</p>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/profile")}
            className="text-foreground/40 hover:text-white"
            title="My Profile"
          >
            <User className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-foreground/40 hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          {/* Burger — visible below lg */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border text-foreground/60 hover:text-white hover:border-cyan-400/40 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile / tablet dropdown — animated slide-down ── */}
      <div
        className="lg:hidden overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out"
        style={{
          display: "grid",
          gridTemplateRows: menuOpen ? "1fr" : "0fr",
          opacity: menuOpen ? 1 : 0,
        }}
        aria-hidden={!menuOpen}
      >
        <div className="min-h-0">
          <div className="border-t border-border px-4 py-3 flex flex-col gap-1 bg-background/95">
            {allItems.map((item, i) => {
              const isActive = activePath === item.path;
              // Insert a divider before admin items
              const showDivider = isAdmin && i === NAV_ITEMS.length;
              return (
                <div key={item.path}>
                  {showDivider && <div className="border-t border-border/40 my-1" />}
                  <button
                    onClick={() => navTo(item.path)}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${item.className} hover:bg-white/5 ${isActive ? "bg-white/8 font-semibold" : ""}`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    )}
                  </button>
                </div>
              );
            })}
            <div className="border-t border-border/40 my-1" />
            <button
              onClick={() => navTo("/profile")}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-white hover:bg-white/5 transition-colors text-left"
            >
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">{user?.displayName || user?.name}</span>
              <span className="text-foreground/40 text-xs ml-auto truncate hidden sm:block">
                {user?.email}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
