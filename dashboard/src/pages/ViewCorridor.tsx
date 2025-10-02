import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit2, 
  Loader2,
  Image as ImageIcon,
  Calendar,
  Hash,
  FileText,
  Wand2,
  Eye
} from 'lucide-react';

interface FunFact {
  id: string;
  text: string;
}

interface CorridorData {
  id: string;
  name: string;
  scientificName: string;
  sceneCount: number;
  funFacts: FunFact[];
  fruitImage?: string;
  status: 'Draft' | 'Published' | 'Review';
  lastModified: string;
  createdAt: string;
  rewardCard: string;
  completionRate: number;
  totalViews: number;
}

const ViewCorridor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data - in real app, this would come from API
  const mockCorridorData: CorridorData = {
    id: id || '1',
    name: 'Strawberry Fields',
    scientificName: 'Fragaria × ananassa',
    sceneCount: 6,
    funFacts: [
      { id: '1', text: 'Strawberries are the only fruit with seeds on the outside!' },
      { id: '2', text: 'One strawberry plant can produce up to 200 berries in a season.' },
      { id: '3', text: 'Strawberries are packed with vitamin C - more than oranges!' },
      { id: '4', text: 'The ancient Romans used strawberries for medicinal purposes.' },
      { id: '5', text: 'Strawberries belong to the rose family of plants.' },
      { id: '6', text: 'A single strawberry contains about 200 seeds on its surface.' }
    ],
    fruitImage: '/api/placeholder/300/300',
    status: 'Published',
    lastModified: '2 days ago',
    createdAt: '2 weeks ago',
    rewardCard: 'Strawberry Champion',
    completionRate: 87,
    totalViews: 1247
  };

  // Load corridor data
  useEffect(() => {
    const loadCorridorData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, fetch from API using the id
        // const data = await fetchCorridorById(id);
        // setCorridorData(data);
      } catch (err) {
        setError('Failed to load corridor data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCorridorData();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading corridor details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/corridors')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Corridors
          </Button>
        </div>
      </div>
    );
  }

  const data = mockCorridorData;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{data.name}</h1>
            <p className="text-muted-foreground italic">{data.scientificName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(data.status)}>
            {data.status}
          </Badge>
          <Button
            onClick={() => navigate(`/corridors/${data.id}/edit`)}
            className="bg-gradient-primary text-primary-foreground hover:bg-primary-light"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Corridor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Fruit/Vegetable Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                {data.fruitImage ? (
                  <img
                    src={data.fruitImage}
                    alt={data.name}
                    className="w-64 h-64 object-cover rounded-lg border shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fun Facts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Fun Facts ({data.funFacts.length})
              </CardTitle>
              <CardDescription>
                Educational facts about {data.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.funFacts.map((fact, index) => (
                  <div
                    key={fact.id}
                    className="p-4 bg-card-secondary rounded-lg border-l-4 border-primary"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{fact.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Scenes</span>
                <span className="font-semibold">{data.sceneCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fun Facts</span>
                <span className="font-semibold">{data.funFacts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-semibold text-success">{data.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Views</span>
                <span className="font-semibold">{data.totalViews.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reward Card Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Reward Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">🏆</div>
                <h3 className="font-semibold text-foreground">{data.rewardCard}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Unlocked after completing all scenes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{data.createdAt}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Modified</span>
                <span>{data.lastModified}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(data.status)} variant="outline">
                  {data.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/corridors/${data.id}/edit`)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Corridor
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/corridors')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewCorridor;
