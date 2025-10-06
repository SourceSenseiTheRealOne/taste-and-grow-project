import { NavLink, useLocation } from "react-router-dom";
import { 
  Apple, 
  Trophy, 
  Settings, 
  Plus,
  BarChart3,
  Sparkles,
  LogOut,
  User,
  Globe,
  Brain
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Corridors",
    url: "/corridors",
    icon: Apple,
  },
  {
    title: "Website",
    url: "/website",
    icon: Globe,
  },
  {
    title: "Quiz Generator",
    url: "/quiz-generator",
    icon: Brain,
  },
  {
    title: "Reward Cards",
    url: "/cards",
    icon: Trophy,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const collapsed = state === "collapsed";
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return `w-full justify-start transition-smooth ${
      active 
        ? "bg-primary text-primary-foreground shadow-button" 
        : "hover:bg-card-secondary text-foreground hover:text-primary"
    }`;
  };

  return (
    <Sidebar className="border-r border-border-light">
      <SidebarHeader className="border-b border-border-light bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Taste & Grow
              </h2>
              <p className="text-sm text-muted-foreground">Content Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-medium mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="w-full bg-gradient-secondary border-0 text-secondary-foreground hover:bg-secondary-light shadow-card"
              asChild
            >
              <NavLink to="/corridors/new">
                <Plus className="w-4 h-4 mr-2" />
                New Corridor
              </NavLink>
            </Button>
          </div>
        )}

        {/* User Info and Logout */}
        <div className="mt-auto p-4 border-t border-border-light">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}