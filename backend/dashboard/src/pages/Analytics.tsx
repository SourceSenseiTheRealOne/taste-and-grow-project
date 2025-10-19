import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, School, Key, Link2, TrendingUp, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalUsers: number;
  totalSchools: number;
  generatedCodes: number;
  generatedLinks: number;
}

const statConfig = [
  {
    key: "totalUsers",
    title: "Total Users",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
    description: "Registered users in the system"
  },
  {
    key: "totalSchools",
    title: "Registered Schools",
    icon: School,
    color: "text-secondary",
    bg: "bg-secondary/10",
    description: "Schools using the platform"
  },
  {
    key: "generatedCodes",
    title: "Generated Codes",
    icon: Key,
    color: "text-accent",
    bg: "bg-accent/10",
    description: "School access codes created"
  },
  {
    key: "generatedLinks",
    title: "Generated Links",
    icon: Link2,
    color: "text-success",
    bg: "bg-success/10",
    description: "Parent links generated"
  },
];

export default function Analytics() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSchools: 0,
    generatedCodes: 0,
    generatedLinks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchStats = async (showRefreshMessage = false) => {
    try {
      if (showRefreshMessage) setRefreshing(true);
      
      // Fetch users and schools
      const [usersResponse, schoolsResponse] = await Promise.all([
        fetch(`${API_URL}/auth/users`),
        fetch(`${API_URL}/schools`),
      ]);

      if (usersResponse.ok && schoolsResponse.ok) {
        const users = await usersResponse.json();
        const schools = await schoolsResponse.json();

        // Count users with access codes and parent links
        const usersWithCodes = users.filter((user: any) => user.schoolAccessCode);
        const usersWithLinks = users.filter((user: any) => user.parentsLink);

        setStats({
          totalUsers: users.length,
          totalSchools: schools.length,
          generatedCodes: usersWithCodes.length,
          generatedLinks: usersWithLinks.length,
        });

        if (showRefreshMessage) {
          toast({
            title: "Stats Refreshed",
            description: "Dashboard data has been updated",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch statistics",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your platform statistics and metrics
          </p>
        </div>
        <Button 
          onClick={() => fetchStats(true)} 
          variant="outline" 
          className="gap-2"
          disabled={refreshing}
        >
          <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((config) => {
          const Icon = config.icon;
          const value = stats[config.key as keyof Stats];
          
          return (
            <Card 
              key={config.key} 
              className="p-6 bg-card hover:shadow-card-hover transition-smooth"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
                <p className="text-sm font-medium text-foreground mb-1">{config.title}</p>
                <p className="text-xs text-muted-foreground">{config.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Breakdown */}
        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">User Statistics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-card-secondary">
              <span className="text-sm text-muted-foreground">Total Registered Users</span>
              <span className="text-lg font-bold text-foreground">{stats.totalUsers}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-card-secondary">
              <span className="text-sm text-muted-foreground">Users with School Access</span>
              <span className="text-lg font-bold text-foreground">{stats.generatedCodes}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-card-secondary">
              <span className="text-sm text-muted-foreground">Users with Parent Links</span>
              <span className="text-lg font-bold text-foreground">{stats.generatedLinks}</span>
            </div>
          </div>
        </Card>

        {/* Schools Breakdown */}
        <Card className="p-6 bg-card shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <School className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">School Statistics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-card-secondary">
              <span className="text-sm text-muted-foreground">Total Schools</span>
              <span className="text-lg font-bold text-foreground">{stats.totalSchools}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-card-secondary">
              <span className="text-sm text-muted-foreground">Active School Codes</span>
              <span className="text-lg font-bold text-foreground">{stats.totalSchools}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-card-secondary">
              <span className="text-sm text-muted-foreground">Average Users per School</span>
              <span className="text-lg font-bold text-foreground">
                {stats.totalSchools > 0 
                  ? (stats.generatedCodes / stats.totalSchools).toFixed(1)
                  : "0"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="p-6 bg-gradient-secondary text-secondary-foreground shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-background/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Platform Growth</h3>
            <p className="text-sm opacity-90">
              Your platform is growing! {stats.totalUsers} users across {stats.totalSchools} schools 
              with {stats.generatedCodes} active access codes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

