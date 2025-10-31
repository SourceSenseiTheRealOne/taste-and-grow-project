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
  const cinematicIntroContents = getContentBySection('CINEMATIC_INTRO');
  const missionRolesContents = getContentBySection('MISSION_ROLES');
  const missionCardsContents = getContentBySection('MISSION_CARDS');
  const seedCardsContents = getContentBySection('SEED_CARDS');
  const finalCTAContents = getContentBySection('FINAL_CTA');
  const footerContents = getContentBySection('FOOTER');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Website Content (New Website)</h1>
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="cinematic-intro">Cinematic Intro</TabsTrigger>
          <TabsTrigger value="mission-roles">Mission Roles</TabsTrigger>
          <TabsTrigger value="mission-cards">Mission Cards</TabsTrigger>
          <TabsTrigger value="seed-cards">Seed Cards</TabsTrigger>
          <TabsTrigger value="final-cta">Final CTA</TabsTrigger>
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

        {/* Cinematic Intro */}
        <TabsContent value="cinematic-intro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cinematic Intro Section</CardTitle>
              <CardDescription>
                "The World Is Losing Its Taste" section with statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cinematicIntroContents.length > 0 ? (
                <>
                  {cinematicIntroContents.map(content => renderContentEditor(content))}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => handleBulkSave(cinematicIntroContents)} 
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
                    No cinematic intro content found. Initialize default content to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Roles */}
        <TabsContent value="mission-roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission Roles Section</CardTitle>
              <CardDescription>
                "Select Your Role" section with character roles and missions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missionRolesContents.length > 0 ? (
                <>
                  {missionRolesContents.map(content => renderContentEditor(content))}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => handleBulkSave(missionRolesContents)} 
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
                    No mission roles content found. Initialize default content to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Cards */}
        <TabsContent value="mission-cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission Cards Section</CardTitle>
              <CardDescription>
                "Every Class Has a Mission" section with 4 missions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missionCardsContents.length > 0 ? (
                <>
                  {missionCardsContents.map(content => renderContentEditor(content))}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => handleBulkSave(missionCardsContents)} 
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
                    No mission cards content found. Initialize default content to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seed Cards */}
        <TabsContent value="seed-cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seed Cards Section</CardTitle>
              <CardDescription>
                "The Seed Vault" section with seed cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {seedCardsContents.length > 0 ? (
                <>
                  {seedCardsContents.map(content => renderContentEditor(content))}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => handleBulkSave(seedCardsContents)} 
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
                    No seed cards content found. Initialize default content to get started.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final CTA */}
        <TabsContent value="final-cta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Final CTA Section</CardTitle>
              <CardDescription>
                "Together, We Keep the Taste Alive" call-to-action section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {finalCTAContents.length > 0 ? (
                <>
                  {finalCTAContents.map(content => renderContentEditor(content))}
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => handleBulkSave(finalCTAContents)} 
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
                    No final CTA content found. Initialize default content to get started.
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
