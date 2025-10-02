import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Edit2, 
  Save, 
  Plus, 
  Trash2, 
  Eye,
  Settings,
  FileText,
  Image as ImageIcon,
  Users,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

interface WebsiteContent {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  status: 'Published' | 'Draft' | 'Review';
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

const Website: React.FC = () => {
  const [activeTab, setActiveTab] = useState('homepage');
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Dummy data for website content
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent[]>([
    {
      id: '1',
      title: 'Welcome to Taste & Grow',
      content: 'Discover the amazing world of fruits and vegetables through our interactive learning platform designed specifically for children aged 5-8. Our educational corridors make learning about healthy eating fun and engaging!',
      lastModified: '2 days ago',
      status: 'Published'
    },
    {
      id: '2',
      title: 'About Our Mission',
      content: 'We believe that early education about nutrition and healthy eating habits can shape a child\'s future. Our platform combines gamification with educational content to create an unforgettable learning experience.',
      lastModified: '1 week ago',
      status: 'Published'
    },
    {
      id: '3',
      title: 'How It Works',
      content: 'Children explore different fruit and vegetable corridors, each containing multiple scenes with fun facts, interactive activities, and rewards. As they complete each corridor, they earn achievement cards and learn valuable nutrition knowledge.',
      lastModified: '3 days ago',
      status: 'Draft'
    }
  ]);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@tasteandgrow.com',
    phone: '+1 (555) 123-4567',
    address: '123 Learning Street, Education City, EC 12345',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
  });

  const [newContent, setNewContent] = useState({
    title: '',
    content: ''
  });

  const handleEdit = (id: string) => {
    setEditing(id);
  };

  const handleSave = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebsiteContent(prev => prev.map(item => 
        item.id === id 
          ? { ...item, lastModified: 'Just now', status: 'Published' as const }
          : item
      ));
      
      setEditing(null);
      setSuccess('Content updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleAddContent = () => {
    if (newContent.title && newContent.content) {
      const content: WebsiteContent = {
        id: Date.now().toString(),
        title: newContent.title,
        content: newContent.content,
        lastModified: 'Just now',
        status: 'Draft'
      };
      
      setWebsiteContent(prev => [...prev, content]);
      setNewContent({ title: '', content: '' });
      setSuccess('New content added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDelete = (id: string) => {
    setWebsiteContent(prev => prev.filter(item => item.id !== id));
    setSuccess('Content deleted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Website Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your website content and settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
          <Button size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-success/10 text-success border border-success/20 rounded-lg p-4">
          {success}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Homepage Content */}
        <TabsContent value="homepage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Homepage Content
              </CardTitle>
              <CardDescription>
                Manage the main content displayed on your website's homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {websiteContent.map((content) => (
                <div key={content.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{content.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(content.status)}>
                        {content.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {content.lastModified}
                      </span>
                    </div>
                  </div>
                  
                  {editing === content.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`title-${content.id}`}>Title</Label>
                        <Input
                          id={`title-${content.id}`}
                          value={content.title}
                          onChange={(e) => setWebsiteContent(prev => 
                            prev.map(item => 
                              item.id === content.id 
                                ? { ...item, title: e.target.value }
                                : item
                            )
                          )}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`content-${content.id}`}>Content</Label>
                        <Textarea
                          id={`content-${content.id}`}
                          value={content.content}
                          onChange={(e) => setWebsiteContent(prev => 
                            prev.map(item => 
                              item.id === content.id 
                                ? { ...item, content: e.target.value }
                                : item
                            )
                          )}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(content.id)}
                          disabled={loading}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        {content.content}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(content.id)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(content.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Content */}
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Add New Content</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="new-title">Title</Label>
                    <Input
                      id="new-title"
                      placeholder="Enter content title..."
                      value={newContent.title}
                      onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-content">Content</Label>
                    <Textarea
                      id="new-content"
                      placeholder="Enter content..."
                      value={newContent.content}
                      onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddContent} disabled={!newContent.title || !newContent.content}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Content */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
              <CardDescription>
                Manage the content for your about page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">About Page Content</h3>
                <p className="text-muted-foreground mb-4">
                  This section will contain about page management features
                </p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add About Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Manage your contact details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="hours">Business Hours</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="hours"
                      value={contactInfo.hours}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, hours: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Contact Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>
                Configure your website settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Website Settings</h3>
                <p className="text-muted-foreground mb-4">
                  This section will contain website configuration options
                </p>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Website;
