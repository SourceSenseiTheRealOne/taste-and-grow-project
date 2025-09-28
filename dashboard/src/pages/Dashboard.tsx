import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Apple, Trophy, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardHero from "@/assets/dashboard-hero.jpg";

const stats = [
  {
    title: "Total Corridors",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: Apple,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    title: "Reward Cards",
    value: "48",
    change: "+6 new cards",
    trend: "up", 
    icon: Trophy,
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    title: "Completion Rate",
    value: "87%",
    change: "+5% improvement",
    trend: "up",
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    title: "Active Learners",
    value: "1,234",
    change: "+89 this month",
    trend: "up",
    icon: Users,
    color: "text-success",
    bg: "bg-success/10"
  },
];

const recentCorridors = [
  { name: "Strawberry Fields", scientific: "Fragaria × ananassa", status: "Published", scenes: 6 },
  { name: "Golden Carrots", scientific: "Daucus carota", status: "Draft", scenes: 4 },
  { name: "Broccoli Forest", scientific: "Brassica oleracea", status: "Review", scenes: 5 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground shadow-card">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={dashboardHero}
            alt="Educational fruits and vegetables"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Welcome to FruitLearn Manager</h1>
          <p className="text-primary-foreground/90 mb-6">
            Create engaging educational experiences with fruits and vegetables. 
            Manage corridors, design reward cards, and inspire young learners.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 shadow-button"
            asChild
          >
            <Link to="/corridors/new">
              <Plus className="w-5 h-5 mr-2" />
              Create New Corridor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 bg-card hover:shadow-card-hover transition-smooth">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm text-success font-medium">{stat.change}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                <p className="text-muted-foreground text-sm">{stat.title}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Corridors */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-card shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Recent Corridors</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/corridors">View All</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentCorridors.map((corridor) => (
                <div key={corridor.name} className="flex items-center justify-between p-4 rounded-lg bg-card-secondary hover:bg-muted transition-smooth">
                  <div>
                    <h3 className="font-medium text-foreground">{corridor.name}</h3>
                    <p className="text-sm text-muted-foreground">{corridor.scientific}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{corridor.scenes} scenes</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      corridor.status === 'Published' 
                        ? 'bg-success/10 text-success'
                        : corridor.status === 'Draft'
                        ? 'bg-warning/10 text-warning' 
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {corridor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6 bg-card shadow-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                asChild
              >
                <Link to="/corridors/new">
                  <Apple className="w-4 h-4 mr-3" />
                  Create Corridor
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-secondary/5 border-secondary/20 text-secondary hover:bg-secondary/10"
                asChild
              >
                <Link to="/cards/new">
                  <Trophy className="w-4 h-4 mr-3" />
                  Design Reward Card
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-accent/5 border-accent/20 text-accent hover:bg-accent/10"
                asChild
              >
                <Link to="/settings">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}