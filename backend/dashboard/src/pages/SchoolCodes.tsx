import { useState, useEffect } from "react";
import { Key, Copy, Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/config/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolAccessCode?: string;
  parentsLink?: string;
  school?: {
    id: string;
    schoolName: string;
    schoolCode: string;
  };
}

interface School {
  id: string;
  schoolName: string;
  schoolCode: string;
  cityRegion: string;
  contactName: string;
  studentCount?: number;
}

export default function SchoolCodes() {
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users with school access codes
      const usersResponse = await fetch(`${API_URL}/auth/users`);
      const schoolsResponse = await fetch(`${API_URL}/schools`);

      if (usersResponse.ok && schoolsResponse.ok) {
        const usersData = await usersResponse.json();
        const schoolsData = await schoolsResponse.json();
        
        // Filter users who have school access codes
        const usersWithCodes = usersData.filter((user: User) => user.schoolAccessCode);
        
        setUsers(usersWithCodes);
        setSchools(schoolsData);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label + text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "PRINCIPAL":
        return "default";
      case "COORDINATOR":
        return "secondary";
      case "TEACHER":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading school codes...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">School Codes</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all school codes and access links
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {/* School Codes Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">School Codes</h2>
            <Badge variant="secondary">{schools.length}</Badge>
          </div>
          <div className="bg-card rounded-lg border border-border-light shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>School Code</TableHead>
                  <TableHead>City/Region</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No schools found.
                    </TableCell>
                  </TableRow>
                ) : (
                  schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">
                        {school.schoolName}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded font-mono font-semibold">
                          {school.schoolCode}
                        </code>
                      </TableCell>
                      <TableCell>{school.cityRegion}</TableCell>
                      <TableCell>{school.contactName}</TableCell>
                      <TableCell>{school.studentCount || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(school.schoolCode, "School Code: ")}
                        >
                          {copiedCode === "School Code: " + school.schoolCode ? (
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Access Codes Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-semibold">User Access Codes & Parent Links</h2>
            <Badge variant="secondary">{users.length}</Badge>
          </div>
          <div className="bg-card rounded-lg border border-border-light shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Access Code</TableHead>
                  <TableHead>Parent Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No users with access codes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>
                          {user.name}
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.school?.schoolName || "-"}
                        {user.school?.schoolCode && (
                          <p className="text-xs text-muted-foreground">
                            {user.school.schoolCode}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.schoolAccessCode && (
                          <code className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded font-mono">
                            {user.schoolAccessCode}
                          </code>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.parentsLink && (
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono max-w-[200px] truncate block">
                            {user.parentsLink}
                          </code>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {user.schoolAccessCode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  user.schoolAccessCode!,
                                  "Access Code: "
                                )
                              }
                            >
                              {copiedCode === "Access Code: " + user.schoolAccessCode ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                          {user.parentsLink && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(user.parentsLink!, "Parent Link: ")
                              }
                            >
                              {copiedCode === "Parent Link: " + user.parentsLink ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

