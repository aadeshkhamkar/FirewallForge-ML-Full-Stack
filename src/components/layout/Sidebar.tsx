import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  User,
  BarChart3,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Brain,
  Trophy,
  Bot,
  Code,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/projects', icon: Code, label: 'Real-Time Projects' },
    { path: '/assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === 'instructor' || user?.role === 'admin') {
    navItems.push({
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
    });
  }

  /* ===================================================== */
  /* MOBILE SIDEBAR (IMAGE-STYLE) */
  /* ===================================================== */
  const MobileSidebar = () => (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-card border-r border-border z-50 flex flex-col items-center md:hidden">
      {/* LOGO */}
      <div className="h-20 flex items-center justify-center">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>

      {/* ICON NAV */}
      <nav className="flex-1 flex flex-col items-center gap-4 mt-6">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path} className="relative">
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-0 rounded-xl bg-primary/15"
                />
              )}

              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center relative z-10 transition',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <Button
        variant="ghost"
        size="icon"
        onClick={logout}
        className="mb-6 text-muted-foreground hover:text-destructive"
      >
        <LogOut className="w-5 h-5" />
      </Button>
    </aside>
  );

  /* ===================================================== */
  /* DESKTOP SIDEBAR (YOUR ORIGINAL CODE – UNCHANGED) */
  /* ===================================================== */
  const DesktopSidebar = () => (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-card border-r border-border z-40 flex-col transition-all duration-300 hidden md:flex',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-xl font-bold text-foreground">
              LearnHub
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn('nav-link', isActive && 'active')}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {isActive && (
                <motion.div
                  layoutId="desktop-active"
                  className="absolute left-0 w-1 h-8 rounded-r-full gradient-primary"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border">
        {!collapsed && user && (
          <div className="mb-4 p-3 rounded-lg bg-secondary">
            <p className="font-medium text-sm text-foreground truncate">
              {user.full_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'w-full justify-start text-muted-foreground hover:text-destructive',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar;
