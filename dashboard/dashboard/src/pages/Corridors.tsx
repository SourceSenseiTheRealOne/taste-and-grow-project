import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Eye, 
  Copy,
  MoreVertical,
  Apple
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const corridors = [
  {
    id: 1,
    name: "Strawberry Fields",
    scientificName: "Fragaria × ananassa",
    status: "Published",
    scenes: 6,
    funFacts: 4,
    rewardCard: "Strawberry Champion",
    lastModified: "2 days ago",
    color: "bg-red-500"
  },
  {
    id: 2,
    name: "Golden Carrots",
    scientificName: "Daucus carota",
    status: "Draft",
    scenes: 4,
    funFacts: 3,
    rewardCard: "Carrot Master",
    lastModified: "1 hour ago",
    color: "bg-orange-500"
  },
  {
    id: 3,
    name: "Broccoli Forest",
    scientificName: "Brassica oleracea",
    status: "Review",
    scenes: 5,
    funFacts: 5,
    rewardCard: "Broccoli Guardian",
    lastModified: "3 days ago",
    color: "bg-green-500"
  },
  {
    id: 4,
    name: "Blueberry Hills",
    scientificName: "Vaccinium corymbosum",
    status: "Published",
    scenes: 6,
    funFacts: 6,
    rewardCard: "Berry Collector",
    lastModified: "1 week ago",
    color: "bg-blue-500"
  },
  {
    id: 5,
    name: "Corn Fields",
    scientificName: "Zea mays",
    status: "Draft",
    scenes: 3,
    funFacts: 2,
    rewardCard: "Corn Explorer",
    lastModified: "5 days ago",
    color: "bg-yellow-500"
  },
  {
    id: 6,
    name: "Tomato Garden",
    scientificName: "Solanum lycopersicum",
    status: "Published",
    scenes: 5,
    funFacts: 4,
    rewardCard: "Tomato Expert",
    lastModified: "1 week ago",
    color: "bg-red-600"
  },
];

export default function Corridors() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-success/10 text-success border-success/20';
      case 'Draft':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Review':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredCorridors = corridors.filter(corridor =>
    corridor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    corridor.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fruit & Vegetable Corridors</h1>
          <p className="text-muted-foreground mt-1">
            Manage educational content for each fruit and vegetable learning experience
          </p>
        </div>
        <Button 
          className="bg-gradient-primary text-primary-foreground hover:bg-primary-light shadow-button"
          asChild
        >
          <Link to="/corridors/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Corridor
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 bg-card shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search corridors by name or scientific name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
          <Button variant="outline" className="whitespace-nowrap">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Corridors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCorridors.map((corridor) => (
          <Card key={corridor.id} className="p-6 bg-card hover:shadow-card-hover transition-smooth group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${corridor.color} rounded-lg flex items-center justify-center text-white`}>
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {corridor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    {corridor.scientificName}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/corridors/${corridor.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/corridors/${corridor.id}/edit`}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(corridor.status)}>
                  {corridor.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {corridor.lastModified}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-card-secondary rounded-lg p-3">
                  <div className="font-medium text-foreground">{corridor.scenes}</div>
                  <div className="text-muted-foreground">Scenes</div>
                </div>
                <div className="bg-card-secondary rounded-lg p-3">
                  <div className="font-medium text-foreground">{corridor.funFacts}</div>
                  <div className="text-muted-foreground">Fun Facts</div>
                </div>
              </div>

              <div className="pt-2 border-t border-border-light">
                <div className="text-sm">
                  <span className="text-muted-foreground">Reward: </span>
                  <span className="font-medium text-secondary">{corridor.rewardCard}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/corridors/${corridor.id}/edit`}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/corridors/${corridor.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCorridors.length === 0 && (
        <Card className="p-12 text-center bg-card shadow-card">
          <Apple className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No corridors found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? `No corridors match your search for "${searchTerm}"`
              : "Get started by creating your first educational corridor"
            }
          </p>
          <Button 
            className="bg-gradient-primary text-primary-foreground hover:bg-primary-light"
            asChild
          >
            <Link to="/corridors/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Corridor
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}