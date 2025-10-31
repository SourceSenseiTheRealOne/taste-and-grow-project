import { useState, useEffect } from "react";
import { Plus, Save, Edit2, Trash2, Loader2, X } from "lucide-react";
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
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface MissionRole {
  id: string;
  name: string;
  title: string;
  mission: string;
  link?: string;
  bgColor?: string;
  contentIds?: {
    name?: string;
    title?: string;
    mission?: string;
    link?: string;
    bgColor?: string;
  };
}

export default function MissionRoles() {
  const [roles, setRoles] = useState<MissionRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<MissionRole | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    mission: "",
    link: "",
    bgColor: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/website-content/mission-roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        throw new Error("Failed to fetch mission roles");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch mission roles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      title: "",
      mission: "",
      link: "",
      bgColor: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (role: MissionRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name || "",
      title: role.title || "",
      mission: role.mission || "",
      link: role.link || "",
      bgColor: role.bgColor || "",
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingRole) {
        // Update existing role
        const response = await api.patch(
          `/website-content/mission-roles/${editingRole.id}`,
          formData
        );
        if (response.ok) {
          toast({
            title: "Success",
            description: "Mission role updated successfully",
          });
          setOpenDialog(false);
          fetchRoles();
        } else {
          throw new Error("Failed to update mission role");
        }
      } else {
        // Create new role
        const response = await api.post("/website-content/mission-roles", formData);
        if (response.ok) {
          toast({
            title: "Success",
            description: "Mission role created successfully",
          });
          setOpenDialog(false);
          fetchRoles();
        } else {
          throw new Error("Failed to create mission role");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save mission role",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoleId) return;

    try {
      setSaving(true);
      const response = await api.delete(
        `/website-content/mission-roles/${deletingRoleId}`
      );
      if (response.ok) {
        toast({
          title: "Success",
          description: "Mission role deleted successfully",
        });
        setOpenDeleteDialog(false);
        setDeletingRoleId(null);
        fetchRoles();
      } else {
        throw new Error("Failed to delete mission role");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete mission role",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (roleId: string) => {
    setDeletingRoleId(roleId);
    setOpenDeleteDialog(true);
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
          <h1 className="text-3xl font-bold text-foreground">Mission Roles</h1>
          <p className="text-muted-foreground mt-1">
            Manage character roles and missions for the website
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Mission Role
        </Button>
      </div>

      {roles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No mission roles found.</p>
            <Button onClick={handleOpenCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Mission Role
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                    <div className="mt-1">
                      <Badge variant="secondary">{role.title}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(role)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDeleteDialog(role.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{role.mission}</p>
                {role.bgColor && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Color:</span>
                    <div
                      className="h-6 w-6 rounded border border-border"
                      style={{ backgroundColor: role.bgColor }}
                    />
                  </div>
                )}
                {role.link && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">Link: </span>
                    <span className="text-xs text-primary">{role.link}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Mission Role" : "Create Mission Role"}
            </DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Update the mission role details below."
                : "Fill in the details to create a new mission role."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Seed Guardian"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Role Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Kids"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission">Mission Description *</Label>
              <Textarea
                id="mission"
                value={formData.mission}
                onChange={(e) =>
                  setFormData({ ...formData, mission: e.target.value })
                }
                placeholder="e.g., Collect, taste, and protect lost seeds."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link (Optional)</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="e.g., /for-schools"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bgColor">Background Color (Optional)</Label>
              <Input
                id="bgColor"
                value={formData.bgColor}
                onChange={(e) =>
                  setFormData({ ...formData, bgColor: e.target.value })
                }
                placeholder="e.g., #F5E6D3 or bg-[#F5E6D3]"
              />
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
                  {editingRole ? "Update" : "Create"}
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
              mission role and all its content.
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

