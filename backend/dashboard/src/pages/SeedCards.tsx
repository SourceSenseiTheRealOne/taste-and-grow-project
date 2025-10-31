import { useState, useEffect } from "react";
import { Plus, Save, Edit2, Trash2, Loader2, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface SeedCard {
  id: string;
  seedId: string;
  commonName: string;
  scientific: string;
  type: string;
  region: string;
  status: "Heritage" | "At Risk" | "Endangered" | "Lost";
  era: "Heritage" | "Ancestral" | "Millennial";
  rarity: "Common" | "Rare" | "Legendary";
  ageYears: number;
  story: string;
  tasteProfile: {
    sweetness: number;
    acidity: number;
    complexity: number;
  };
  images: string[];
  sources: string[];
  featured: boolean;
  locked: boolean;
  order: number;
  active: boolean;
}

export default function SeedCards() {
  const [seedCards, setSeedCards] = useState<SeedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<SeedCard | null>(null);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSource, setNewSource] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    seedId: "",
    commonName: "",
    scientific: "",
    type: "",
    region: "",
    status: "Heritage" as SeedCard["status"],
    era: "Heritage" as SeedCard["era"],
    rarity: "Common" as SeedCard["rarity"],
    ageYears: 0,
    story: "",
    tasteProfile: {
      sweetness: 0,
      acidity: 0,
      complexity: 0,
    },
    images: [] as string[],
    sources: [] as string[],
    featured: false,
    locked: false,
    order: 0,
    active: true,
  });

  useEffect(() => {
    fetchSeedCards();
  }, []);

  const fetchSeedCards = async () => {
    try {
      setLoading(true);
      const response = await api.get("/seed-cards");
      if (response.ok) {
        const data = await response.json();
        setSeedCards(data);
      } else {
        throw new Error("Failed to fetch seed cards");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch seed cards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingCard(null);
    setFormData({
      seedId: "",
      commonName: "",
      scientific: "",
      type: "",
      region: "",
      status: "Heritage",
      era: "Heritage",
      rarity: "Common",
      ageYears: 0,
      story: "",
      tasteProfile: {
        sweetness: 0,
        acidity: 0,
        complexity: 0,
      },
      images: [],
      sources: [],
      featured: false,
      locked: false,
      order: 0,
      active: true,
    });
    setNewImageUrl("");
    setNewSource("");
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (card: SeedCard) => {
    setEditingCard(card);
    setFormData({
      seedId: card.seedId,
      commonName: card.commonName,
      scientific: card.scientific,
      type: card.type,
      region: card.region,
      status: card.status,
      era: card.era,
      rarity: card.rarity,
      ageYears: card.ageYears,
      story: card.story,
      tasteProfile: { ...card.tasteProfile },
      images: [...card.images],
      sources: [...card.sources],
      featured: card.featured,
      locked: card.locked,
      order: card.order,
      active: card.active,
    });
    setNewImageUrl("");
    setNewSource("");
    setOpenDialog(true);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddSource = () => {
    if (newSource.trim()) {
      setFormData({
        ...formData,
        sources: [...formData.sources, newSource.trim()],
      });
      setNewSource("");
    }
  };

  const handleRemoveSource = (index: number) => {
    setFormData({
      ...formData,
      sources: formData.sources.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingCard) {
        // Update existing card
        const response = await api.patch(
          `/seed-cards/${editingCard.id}`,
          formData
        );
        if (response.ok) {
          toast({
            title: "Success",
            description: "Seed card updated successfully",
          });
          setOpenDialog(false);
          fetchSeedCards();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update seed card");
        }
      } else {
        // Create new card
        const response = await api.post("/seed-cards", formData);
        if (response.ok) {
          toast({
            title: "Success",
            description: "Seed card created successfully",
          });
          setOpenDialog(false);
          fetchSeedCards();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create seed card");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save seed card",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCardId) return;

    try {
      setSaving(true);
      const response = await api.delete(`/seed-cards/${deletingCardId}`);
      if (response.ok) {
        toast({
          title: "Success",
          description: "Seed card deleted successfully",
        });
        setOpenDeleteDialog(false);
        setDeletingCardId(null);
        fetchSeedCards();
      } else {
        throw new Error("Failed to delete seed card");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete seed card",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (cardId: string) => {
    setDeletingCardId(cardId);
    setOpenDeleteDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Heritage":
        return "bg-green-500";
      case "At Risk":
        return "bg-orange-500";
      case "Endangered":
        return "bg-red-500";
      case "Lost":
        return "bg-gray-800";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seed Cards</h1>
          <p className="text-muted-foreground mt-1">
            Manage seed cards and their information for the website
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Seed Card
        </Button>
      </div>

      {seedCards.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No seed cards found.</p>
            <Button onClick={handleOpenCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Seed Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {seedCards.map((card) => (
            <Card key={card.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{card.commonName}</CardTitle>
                    <CardDescription className="mt-1 italic">
                      {card.scientific}
                    </CardDescription>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <Badge className={getStatusColor(card.status)}>
                        {card.status}
                      </Badge>
                      <Badge variant="outline">{card.rarity}</Badge>
                      {card.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(card)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(card.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Type:</span> {card.type}
                  </p>
                  <p>
                    <span className="font-semibold">Region:</span> {card.region}
                  </p>
                  <p>
                    <span className="font-semibold">Age:</span> {card.ageYears} years
                  </p>
                  {card.images.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold">Images:</span> {card.images.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? "Edit Seed Card" : "Create Seed Card"}
            </DialogTitle>
            <DialogDescription>
              {editingCard
                ? "Update the seed card details below."
                : "Fill in the details to create a new seed card."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seedId">Seed ID *</Label>
                <Input
                  id="seedId"
                  value={formData.seedId}
                  onChange={(e) =>
                    setFormData({ ...formData, seedId: e.target.value })
                  }
                  placeholder="e.g., PT-APP-0001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commonName">Common Name *</Label>
                <Input
                  id="commonName"
                  value={formData.commonName}
                  onChange={(e) =>
                    setFormData({ ...formData, commonName: e.target.value })
                  }
                  placeholder="e.g., Maçã Bravo de Esmolfe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scientific">Scientific Name *</Label>
              <Input
                id="scientific"
                value={formData.scientific}
                onChange={(e) =>
                  setFormData({ ...formData, scientific: e.target.value })
                }
                placeholder="e.g., Malus domestica 'Bravo de Esmolfe'"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder="e.g., Fruit, Grain, Nut"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  placeholder="e.g., Beira Alta (Mainland PT)"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as SeedCard["status"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heritage">Heritage</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                    <SelectItem value="Endangered">Endangered</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="era">Era *</Label>
                <Select
                  value={formData.era}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      era: value as SeedCard["era"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heritage">Heritage</SelectItem>
                    <SelectItem value="Ancestral">Ancestral</SelectItem>
                    <SelectItem value="Millennial">Millennial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rarity">Rarity *</Label>
                <Select
                  value={formData.rarity}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      rarity: value as SeedCard["rarity"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageYears">Age (years) *</Label>
                <Input
                  id="ageYears"
                  type="number"
                  value={formData.ageYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageYears: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="story">Story *</Label>
              <Textarea
                id="story"
                value={formData.story}
                onChange={(e) =>
                  setFormData({ ...formData, story: e.target.value })
                }
                placeholder="e.g., Fragrant PDO apple from high, cool valleys."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Taste Profile *</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sweetness">Sweetness (%)</Label>
                  <Input
                    id="sweetness"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tasteProfile.sweetness}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tasteProfile: {
                          ...formData.tasteProfile,
                          sweetness: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="acidity">Acidity (%)</Label>
                  <Input
                    id="acidity"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tasteProfile.acidity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tasteProfile: {
                          ...formData.tasteProfile,
                          acidity: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="complexity">Complexity (%)</Label>
                  <Input
                    id="complexity"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tasteProfile.complexity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tasteProfile: {
                          ...formData.tasteProfile,
                          complexity: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Image URL"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddImage}>
                  <Image className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm truncate flex-1">{image}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                        className="h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sources</Label>
              <div className="flex gap-2">
                <Input
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  placeholder="Source name"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSource();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSource}>
                  Add
                </Button>
              </div>
              {formData.sources.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.sources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{source}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSource(index)}
                        className="h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="locked"
                    checked={formData.locked}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, locked: checked })
                    }
                  />
                  <Label htmlFor="locked">Locked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, active: checked })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingCard ? "Update" : "Create"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              seed card and all its information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

