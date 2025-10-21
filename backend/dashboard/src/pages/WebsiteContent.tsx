import { useState, useEffect } from "react";
import { Plus, Save, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface WebsiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  metadata?: any;
  order: number;
  active: boolean;
}

export default function WebsiteContent() {
  const [contents, setContents] = useState<WebsiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/website-content', { requiresAuth: false });
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      const response = await api.post('/website-content/initialize', {});
      if (response.ok) {
        toast({
          title: "Success",
          description: "Default content initialized successfully",
        });
        fetchContent();
      } else {
        throw new Error('Failed to initialize content');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize content",
        variant: "destructive",
      });
    } finally {
      setInitializing(false);
    }
  };

  const handleSave = async (content: WebsiteContent) => {
    setSaving(true);
    try {
      const response = await api.patch(`/website-content/${content.id}`, {
        value: content.value,
        metadata: content.metadata,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content updated successfully",
        });
        fetchContent();
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkSave = async (sectionContents: WebsiteContent[]) => {
    setSaving(true);
    try {
      const updates = sectionContents.map(content => ({
        id: content.id,
        value: content.value,
        metadata: content.metadata,
      }));

      const response = await api.post('/website-content/bulk-update', updates);

      if (response.ok) {
        toast({
          title: "Success",
          description: "All changes saved successfully",
        });
        fetchContent();
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateContentValue = (id: string, newValue: string) => {
    setContents(contents.map(content => 
      content.id === id ? { ...content, value: newValue } : content
    ));
  };

  const getContentBySection = (section: string) => {
    return contents.filter(c => c.section === section);
  };

  const renderContentEditor = (content: WebsiteContent) => {
    const isLongText = content.value.length > 100;

    return (
      <div key={content.id} className="space-y-2 p-4 bg-muted/50 rounded-lg">
        <Label htmlFor={content.id} className="text-sm font-semibold capitalize">
          {content.key.replace(/_/g, ' ')}
        </Label>
        {isLongText ? (
          <Textarea
            id={content.id}
            value={content.value}
            onChange={(e) => updateContentValue(content.id, e.target.value)}
            rows={4}
            className="w-full"
          />
        ) : (
          <Input
            id={content.id}
            value={content.value}
            onChange={(e) => updateContentValue(content.id, e.target.value)}
            className="w-full"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Website Content</h1>
          <p className="text-muted-foreground mt-1">
            Manage your website content from the dashboard
          </p>
        </div>

        <Alert>
          <AlertDescription>
            No website content found. Click the button below to initialize default content.
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <Button 
            onClick={handleInitialize} 
            disabled={initializing}
            className="gap-2"
          >
            {initializing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Initialize Default Content
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  const heroContents = getContentBySection('HERO');
  const howItWorksContents = getContentBySection('HOW_IT_WORKS');
  const foodKitContents = getContentBySection('FOOD_KIT');
  const footerContents = getContentBySection('FOOTER');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Website Content</h1>
          <p className="text-muted-foreground mt-1">
            Edit website content and see changes reflect on the live site
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContent} className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="food-kits">Food Kits</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main homepage hero content - the first thing visitors see
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroContents.map(content => renderContentEditor(content))}
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleBulkSave(heroContents)} 
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* How It Works */}
        <TabsContent value="how-it-works" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How It Works Section</CardTitle>
              <CardDescription>
                4-step process explaining how Taste & Grow works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {howItWorksContents.map(content => renderContentEditor(content))}
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleBulkSave(howItWorksContents)} 
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Food Kits */}
        <TabsContent value="food-kits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Food Kits Section</CardTitle>
              <CardDescription>
                Section titles and descriptions for the food kits showcase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {foodKitContents.length > 0 ? (
                <>
                  {foodKitContents.map(content => renderContentEditor(content))}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => handleBulkSave(foodKitContents)} 
                      disabled={saving}
                      className="gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <Alert>
                  <AlertDescription>
                    No food kit content found. Food kit details are currently hardcoded in the website.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Section</CardTitle>
              <CardDescription>
                Company information and footer content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {footerContents.map(content => renderContentEditor(content))}
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleBulkSave(footerContents)} 
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
