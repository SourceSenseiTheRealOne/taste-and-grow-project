import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  Apple, 
  Trophy, 
  Settings, 
  BarChart3,
  Sparkles,
  Users,
  School,
  Key,
  Globe,
  Gamepad2,
  ChevronDown,
  FileText,
  UserCircle
} from "lucide-react";

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavigationItem {
  title: string;
  url?: string;
  icon: any;
  items?: Array<{ title: string; url: string; icon: any }>;
}

const navigation: NavigationItem[] = [
  {
    title: "Analytics",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Website",
    icon: Globe,
    items: [
      {
        title: "Website Content",
        url: "/website-content",
        icon: FileText,
      },
      {
        title: "Mission Roles",
        url: "/mission-roles",
        icon: UserCircle,
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Schools",
        url: "/schools",
        icon: School,
      },
      {
        title: "School Codes",
        url: "/school-codes",
        icon: Key,
      },
    ],
  },
  {
    title: "Game",
    icon: Gamepad2,
    items: [
      {
        title: "Corridors",
        url: "/corridors",
        icon: Apple,
      },
      {
        title: "Reward Cards",
        url: "/cards",
        icon: Trophy,
      },
    ],
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
  const collapsed = state === "collapsed";
  const [openSections, setOpenSections] = useState<string[]>(["Website", "Game"]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const isSectionActive = (items?: Array<{ url: string }>) => {
    if (!items) return false;
    return items.some((item) => isActive(item.url));
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return `w-full justify-start transition-smooth ${
      active
        ? "bg-primary text-primary-foreground shadow-button"
        : "hover:bg-card-secondary text-foreground hover:text-primary"
    }`;
  };

  const getParentClass = (items?: Array<{ url: string }>) => {
    const active = isSectionActive(items);
    return `w-full justify-between transition-smooth ${
      active
        ? "text-primary font-semibold"
        : "text-foreground hover:text-primary hover:bg-card-secondary"
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
                Taste&Grow
              </h2>
              <p className="text-sm text-muted-foreground">Content Manager</p>
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
                  {item.items ? (
                    // Collapsible menu item
                    <Collapsible
                      open={openSections.includes(item.title)}
                      onOpenChange={() => toggleSection(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className={getParentClass(item.items)}>
                          <div className="flex items-center gap-2">
                            <item.icon className="w-5 h-5" />
                            {!collapsed && <span className="font-medium">{item.title}</span>}
                          </div>
                          {!collapsed && (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                openSections.includes(item.title) ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent className="pl-4 mt-1 space-y-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuButton key={subItem.url} asChild>
                              <NavLink to={subItem.url} className={getNavClass(subItem.url)}>
                                <subItem.icon className="w-4 h-4" />
                                <span className="text-sm">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    // Regular menu item
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url!} className={getNavClass(item.url!)}>
                        <item.icon className="w-5 h-5" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
