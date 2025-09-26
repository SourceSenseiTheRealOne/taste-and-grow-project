import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trophy, 
  Star, 
  Zap,
  Shield,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import rewardCardsImage from "@/assets/reward-cards.jpg";

const cards = [
  {
    id: 1,
    name: "Strawberry Champion",
    rarity: "Epic",
    stats: { power: 85, defense: 70, speed: 90 },
    unlockEffect: "Unlocks Berry Blast ability",
    corridor: "Strawberry Fields",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    name: "Carrot Master",
    rarity: "Rare",
    stats: { power: 75, defense: 85, speed: 60 },
    unlockEffect: "Improves vision abilities",
    corridor: "Golden Carrots",
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: 3,
    name: "Broccoli Guardian",
    rarity: "Legendary",
    stats: { power: 90, defense: 95, speed: 70 },
    unlockEffect: "Grants super strength",
    corridor: "Broccoli Forest",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: 4,
    name: "Berry Collector",
    rarity: "Common",
    stats: { power: 60, defense: 55, speed: 80 },
    unlockEffect: "Increases collection speed",
    corridor: "Blueberry Hills",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: 5,
    name: "Corn Explorer",
    rarity: "Rare",
    stats: { power: 70, defense: 60, speed: 85 },
    unlockEffect: "Reveals hidden paths",
    corridor: "Corn Fields",
    color: "from-yellow-400 to-amber-500"
  },
  {
    id: 6,
    name: "Tomato Expert",
    rarity: "Epic",
    stats: { power: 80, defense: 75, speed: 75 },
    unlockEffect: "Unlocks growth abilities",
    corridor: "Tomato Garden",
    color: "from-red-500 to-rose-500"
  },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common':
      return 'bg-muted text-muted-foreground border-muted';
    case 'Rare':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'Epic':
      return 'bg-secondary/10 text-secondary border-secondary/20';
    case 'Legendary':
      return 'bg-warning/10 text-warning border-warning/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getStatIcon = (stat: string) => {
  switch (stat) {
    case 'power':
      return <Zap className="w-3 h-3" />;
    case 'defense':
      return <Shield className="w-3 h-3" />;
    case 'speed':
      return <Star className="w-3 h-3" />;
    default:
      return <Heart className="w-3 h-3" />;
  }
};

export default function Cards() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reward Cards</h1>
          <p className="text-muted-foreground mt-1">
            Design and manage collectible reward cards for completing corridors
          </p>
        </div>
        <Button 
          className="bg-gradient-secondary text-secondary-foreground hover:bg-secondary-light shadow-button"
          asChild
        >
          <Link to="/cards/new">
            <Plus className="w-4 h-4 mr-2" />
            Design New Card
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="relative overflow-hidden bg-gradient-accent p-8 text-accent-foreground shadow-card">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={rewardCardsImage}
            alt="Reward cards collection"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-2">Collectible Learning Rewards</h2>
          <p className="text-accent-foreground/90 mb-4">
            Each corridor completion rewards learners with unique collectible cards. 
            Design cards with different rarities, stats, and special unlock effects.
          </p>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{cards.length}</div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">1</div>
              <div className="text-sm text-muted-foreground">Legendary</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">2</div>
              <div className="text-sm text-muted-foreground">Epic Cards</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">2</div>
              <div className="text-sm text-muted-foreground">Rare Cards</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className="overflow-hidden bg-card hover:shadow-card-hover transition-smooth group">
            {/* Card Header with Gradient */}
            <div className={`p-6 bg-gradient-to-br ${card.color} text-white relative`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{card.name}</h3>
                  <p className="text-white/80 text-sm">{card.corridor}</p>
                </div>
                <Badge className={`${getRarityColor(card.rarity)} bg-white/20 text-white border-white/30`}>
                  {card.rarity}
                </Badge>
              </div>
              
              {/* Card Icon */}
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {Object.entries(card.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center p-2 bg-card-secondary rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      {getStatIcon(stat)}
                    </div>
                    <div className="text-lg font-bold text-foreground">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">{stat}</div>
                  </div>
                ))}
              </div>

              {/* Unlock Effect */}
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="font-medium text-foreground text-sm">Special Effect</span>
                </div>
                <p className="text-sm text-muted-foreground">{card.unlockEffect}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/cards/${card.id}/edit`}>
                    Edit Card
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/cards/${card.id}`}>
                    Preview
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State for New Users */}
      <Card className="p-12 text-center bg-card shadow-card border-2 border-dashed border-border-light">
        <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Ready to Create More?</h3>
        <p className="text-muted-foreground mb-6">
          Design unique reward cards that motivate learners to complete their educational journey
        </p>
        <Button 
          className="bg-gradient-secondary text-secondary-foreground hover:bg-secondary-light"
          asChild
        >
          <Link to="/cards/new">
            <Plus className="w-4 h-4 mr-2" />
            Design Your Next Card
          </Link>
        </Button>
      </Card>
    </div>
  );
}