import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatGptService from '@/services/chatgpt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Upload, 
  Wand2, 
  Loader2,
  Image as ImageIcon,
  Trash2,
  Save
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
}

const EditCorridor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [corridorName, setCorridorName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [sceneCount, setSceneCount] = useState('5');
  const [fruitImage, setFruitImage] = useState<File | null>(null);
  const [fruitImagePreview, setFruitImagePreview] = useState<string | null>(null);
  const [funFacts, setFunFacts] = useState<FunFact[]>([]);
  const [newFunFact, setNewFunFact] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published' | 'Review'>('Draft');

  // ChatGPT integration state
  const [chatGptPrompt, setChatGptPrompt] = useState('');
  const [isGeneratingFacts, setIsGeneratingFacts] = useState(false);

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
      { id: '4', text: 'The ancient Romans used strawberries for medicinal purposes.' }
    ],
    fruitImage: '/api/placeholder/150/150',
    status: 'Published',
    lastModified: '2 days ago'
  };

  // Load corridor data
  useEffect(() => {
    const loadCorridorData = async () => {
      setLoadingData(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app, fetch from API using the id
        const data = mockCorridorData;
        
        setCorridorName(data.name);
        setScientificName(data.scientificName);
        setSceneCount(data.sceneCount.toString());
        setFunFacts(data.funFacts);
        setStatus(data.status);
        setFruitImagePreview(data.fruitImage || null);
      } catch (err) {
        setError('Failed to load corridor data');
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      loadCorridorData();
    }
  }, [id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFruitImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFruitImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFruitImage(null);
    setFruitImagePreview(null);
  };

  const addFunFact = () => {
    if (newFunFact.trim()) {
      const fact: FunFact = {
        id: Date.now().toString(),
        text: newFunFact.trim()
      };
      setFunFacts([...funFacts, fact]);
      setNewFunFact('');
    }
  };

  const removeFunFact = (id: string) => {
    setFunFacts(funFacts.filter(fact => fact.id !== id));
  };

  const generateFunFactsWithChatGPT = async () => {
    if (!chatGptPrompt.trim()) {
      setError('Please enter a prompt for ChatGPT');
      return;
    }

    setIsGeneratingFacts(true);
    setError('');

    try {
      const response = await ChatGptService.generateFunFacts({
        prompt: chatGptPrompt,
        fruitName: corridorName,
        scientificName: scientificName,
        sceneCount: parseInt(sceneCount)
      });

      if (response.success) {
        const generatedFacts: FunFact[] = response.facts.map((text, index) => ({
          id: `generated-${Date.now()}-${index}`,
          text
        }));

        setFunFacts([...funFacts, ...generatedFacts]);
        setChatGptPrompt('');
        setSuccess('Fun facts generated successfully!');
      } else {
        throw new Error(response.error || 'Failed to generate facts');
      }
    } catch (err) {
      setError('Failed to generate fun facts. Please try again.');
    } finally {
      setIsGeneratingFacts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!corridorName.trim() || !scientificName.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess('Corridor updated successfully!');
      setTimeout(() => {
        navigate('/corridors');
      }, 1500);
    } catch (err) {
      setError('Failed to update corridor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading corridor data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Edit Corridor</h1>
          <p className="text-muted-foreground">
            Modify the educational content for this fruit or vegetable
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          ID: {id}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the essential details for your corridor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corridorName">Corridor Name *</Label>
                <Input
                  id="corridorName"
                  placeholder="e.g., Strawberry Fields"
                  value={corridorName}
                  onChange={(e) => setCorridorName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scientificName">Scientific Name *</Label>
                <Input
                  id="scientificName"
                  placeholder="e.g., Fragaria × ananassa"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sceneCount">Number of Scenes</Label>
                <Select value={sceneCount} onValueChange={setSceneCount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of scenes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} scenes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: 'Draft' | 'Published' | 'Review') => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fruit Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Fruit/Vegetable Image</CardTitle>
            <CardDescription>
              Update the image representing this fruit or vegetable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fruitImagePreview ? (
                <div className="relative">
                  <img
                    src={fruitImagePreview}
                    alt="Fruit preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Upload an image of the fruit/vegetable</p>
                  <input
                    type="file"
                    id="fruitImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('fruitImage')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fun Facts Generation with ChatGPT */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Additional Fun Facts with AI</CardTitle>
            <CardDescription>
              Use ChatGPT to automatically generate more educational fun facts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatGptPrompt">Prompt for ChatGPT</Label>
              <Textarea
                id="chatGptPrompt"
                placeholder="e.g., Generate 3 more fun facts about strawberries for kids aged 5-8, focusing on nutrition and growth..."
                value={chatGptPrompt}
                onChange={(e) => setChatGptPrompt(e.target.value)}
                rows={3}
              />
            </div>
            <Button
              type="button"
              onClick={generateFunFactsWithChatGPT}
              disabled={isGeneratingFacts || !chatGptPrompt.trim()}
              className="w-full"
            >
              {isGeneratingFacts ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Fun Facts...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate with ChatGPT
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Fun Facts Management */}
        <Card>
          <CardHeader>
            <CardTitle>Fun Facts ({funFacts.length})</CardTitle>
            <CardDescription>
              Manage educational fun facts about this fruit or vegetable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a new fun fact..."
                value={newFunFact}
                onChange={(e) => setNewFunFact(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFunFact())}
              />
              <Button
                type="button"
                onClick={addFunFact}
                disabled={!newFunFact.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {funFacts.length > 0 && (
              <div className="space-y-2">
                <Label>Current Fun Facts</Label>
                {funFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="flex items-center gap-2 p-3 bg-card-secondary rounded-lg"
                  >
                    <span className="flex-1 text-sm">{fact.text}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFunFact(fact.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-success bg-success/10 text-success">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-primary text-primary-foreground hover:bg-primary-light"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Corridor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Corridor
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCorridor;
