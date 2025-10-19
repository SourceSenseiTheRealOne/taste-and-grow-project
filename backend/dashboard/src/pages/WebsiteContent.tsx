import { Card } from "@/components/ui/card";
import { FileText, Image, Video, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const contentTypes = [
  {
    title: "Hero Section",
    description: "Manage homepage hero content and images",
    icon: Image,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "About Content",
    description: "Edit about page text and media",
    icon: FileText,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Media Library",
    description: "Manage images and videos",
    icon: Video,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "SEO Settings",
    description: "Configure meta tags and descriptions",
    icon: Settings,
    color: "text-success",
    bg: "bg-success/10",
  },
];

export default function WebsiteContent() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Website Content</h1>
        <p className="text-muted-foreground mt-1">
          Manage your website content and media
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card key={type.title} className="p-6 bg-card hover:shadow-card-hover transition-smooth">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${type.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${type.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-card shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">
          Website content management features are currently under development. 
          This section will allow you to manage all website content, including:
        </p>
        <ul className="mt-4 space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Homepage sections and banners
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            About and informational pages
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Blog posts and news updates
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Media library and assets
          </li>
        </ul>
      </Card>
    </div>
  );
}

