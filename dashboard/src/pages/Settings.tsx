import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon,
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Upload,
  HelpCircle
} from "lucide-react";

const settingsSections = [
  {
    title: "Profile Settings",
    description: "Manage your account information and preferences",
    icon: User,
    items: [
      { name: "Account Information", description: "Update your profile details" },
      { name: "Password & Security", description: "Change password and security settings" },
      { name: "Email Preferences", description: "Manage email notifications" },
    ]
  },
  {
    title: "Content Management", 
    description: "Configure how your educational content is managed",
    icon: Database,
    items: [
      { name: "Default Settings", description: "Set default values for new corridors" },
      { name: "Content Guidelines", description: "Configure content approval rules" },
      { name: "Auto-Save Options", description: "Manage automatic saving preferences" },
    ]
  },
  {
    title: "Notifications",
    description: "Control when and how you receive notifications",
    icon: Bell,
    items: [
      { name: "Push Notifications", description: "Enable desktop notifications" },
      { name: "Email Alerts", description: "Configure email notification settings" },
      { name: "Content Updates", description: "Get notified about content changes" },
    ]
  },
  {
    title: "Appearance",
    description: "Customize the dashboard appearance",
    icon: Palette,
    items: [
      { name: "Theme Preferences", description: "Choose your preferred color scheme" },
      { name: "Layout Options", description: "Customize dashboard layout" },
      { name: "Accessibility", description: "Configure accessibility features" },
    ]
  },
];

const dataManagement = [
  {
    title: "Export Data",
    description: "Download your corridors and cards data",
    icon: Download,
    action: "Export",
    variant: "outline" as const
  },
  {
    title: "Import Data", 
    description: "Import corridors from CSV or JSON files",
    icon: Upload,
    action: "Import",
    variant: "outline" as const
  },
  {
    title: "Backup Settings",
    description: "Configure automatic data backups",
    icon: Shield,
    action: "Configure",
    variant: "outline" as const
  },
];

export default function Settings() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and content settings
          </p>
        </div>
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          All changes saved
        </Badge>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-smooth">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-card-secondary hover:bg-muted/50 transition-colors">
                    <div>
                      <div className="font-medium text-foreground text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Data Management */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Data Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataManagement.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6 bg-card shadow-card hover:shadow-card-hover transition-smooth">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <Button variant={item.variant} className="w-full">
                    {item.action}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Help & Support */}
      <Card className="p-8 bg-gradient-accent text-accent-foreground shadow-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Need Help?</h3>
            <p className="text-white/80">Get support and learn how to make the most of FruitLearn Manager</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" className="bg-white text-accent hover:bg-white/90">
            View Documentation
          </Button>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Contact Support
          </Button>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Feature Requests
          </Button>
        </div>
      </Card>
    </div>
  );
}