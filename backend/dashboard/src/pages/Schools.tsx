import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, School as SchoolIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface School {
  id: string;
  schoolName: string;
  cityRegion: string;
  contactName: string;
  phone?: string;
  email?: string;
  studentCount?: number;
  schoolCode: string;
  users?: Array<{ id: string; name: string; email: string; role: string }>;
  teachers?: Array<{ id: string; name: string; email: string }>;
}

export default function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    schoolName: "",
    cityRegion: "",
    contactName: "",
    phone: "",
    email: "",
    studentCount: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await api.get('/schools', { requiresAuth: false });

      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch schools",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        schoolName: school.schoolName,
        cityRegion: school.cityRegion,
        contactName: school.contactName,
        phone: school.phone || "",
        email: school.email || "",
        studentCount: school.studentCount?.toString() || "",
      });
    } else {
      setEditingSchool(null);
      setFormData({
        schoolName: "",
        cityRegion: "",
        contactName: "",
        phone: "",
        email: "",
        studentCount: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchool(null);
    setFormData({
      schoolName: "",
      cityRegion: "",
      contactName: "",
      phone: "",
      email: "",
      studentCount: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert studentCount to number
      const dataToSend = {
        ...formData,
        studentCount: formData.studentCount ? parseInt(formData.studentCount) : null,
      };

      const response = editingSchool
        ? await api.patch(`/schools/${editingSchool.id}`, dataToSend)
        : await api.post('/schools', dataToSend);

      if (response.ok) {
        toast({
          title: "Success",
          description: `School ${editingSchool ? "updated" : "created"} successfully`,
        });
        fetchSchools();
        handleCloseDialog();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to save school",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save school",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!schoolToDelete) return;

    try {
      const response = await api.delete(`/schools/${schoolToDelete}`);

      if (response.ok) {
        toast({
          title: "Success",
          description: "School deleted successfully",
        });
        fetchSchools();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete school",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete school",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSchoolToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading schools...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schools</h1>
          <p className="text-muted-foreground mt-1">
            Manage schools and their information
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add School
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border-light shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School Name</TableHead>
              <TableHead>School Code</TableHead>
              <TableHead>City/Region</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No schools found. Create your first school!
                </TableCell>
              </TableRow>
            ) : (
              schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <SchoolIcon className="w-4 h-4 text-primary" />
                      {school.schoolName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {school.schoolCode}
                    </code>
                  </TableCell>
                  <TableCell>{school.cityRegion || "-"}</TableCell>
                  <TableCell>{school.contactName || "-"}</TableCell>
                  <TableCell>{school.email || "-"}</TableCell>
                  <TableCell>{school.phone || "-"}</TableCell>
                  <TableCell>{school.studentCount || "-"}</TableCell>
                  <TableCell>{(school.users?.length || 0) + (school.teachers?.length || 0)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(school)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSchoolToDelete(school.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSchool ? "Edit School" : "Add New School"}
            </DialogTitle>
            <DialogDescription>
              {editingSchool
                ? "Update the school information below."
                : "Enter the school information below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) =>
                    setFormData({ ...formData, schoolName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cityRegion">City/Region *</Label>
                  <Input
                    id="cityRegion"
                    value={formData.cityRegion}
                    onChange={(e) =>
                      setFormData({ ...formData, cityRegion: e.target.value })
                    }
                    placeholder="New York, NY"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="studentCount">Number of Students</Label>
                <Input
                  id="studentCount"
                  type="number"
                  value={formData.studentCount}
                  onChange={(e) =>
                    setFormData({ ...formData, studentCount: e.target.value })
                  }
                  placeholder="e.g., 450"
                  min="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSchool ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              school and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSchoolToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

