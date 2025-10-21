import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Sprout, 
  Users, 
  TrendingUp, 
  School, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  QrCode,
  Link as LinkIcon,
  BookOpen,
  DollarSign,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && !user.schoolId) {
      navigate('/register-school');
      return;
    }

    if (user && user.schoolId) {
      fetchSchoolData();
    }
  }, [user, authLoading, navigate]);

  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/schools/${user.schoolId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch school data');
      }

      const data = await response.json();
      setSchool(data);
    } catch (err) {
      console.error('Error fetching school:', err);
      setError('Failed to load school information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'TEACHER':
        return 'bg-blue-100 text-blue-700';
      case 'COORDINATOR':
        return 'bg-purple-100 text-purple-700';
      case 'PRINCIPAL':
        return 'bg-green-100 text-green-700';
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="w-16 h-16 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Sprout className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">Taste & Grow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('/')} className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Home
              </button>
              <button onClick={() => navigate('/dashboard')} className="text-green-600 font-semibold">
                Dashboard
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <button onClick={() => navigate('/')} className="text-gray-700 hover:text-green-600 transition-colors font-medium text-left">
                  Home
                </button>
                <button onClick={() => navigate('/dashboard')} className="text-green-600 font-semibold text-left">
                  Dashboard
                </button>
                <div className="pt-4 border-t border-gray-200">
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-lg text-gray-600">
                  Here's what's happening with your school
                </p>
              </div>
              <Badge className={`${getRoleBadgeColor(user.role)} text-sm px-4 py-2`}>
                {user.role}
              </Badge>
            </div>
          </div>

          {/* School Information Card */}
          {school && (
            <Card className="mb-8 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                      <School className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-1">{school.schoolName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {school.cityRegion}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Code: {school.schoolCode}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <strong>Contact Name:</strong> {school.contactName}
                      </p>
                      {school.email && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {school.email}
                        </p>
                      )}
                      {school.phone && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {school.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Student Count */}
                  {school.studentCount && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        School Stats
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <strong>Total Students:</strong> {school.studentCount}
                        </p>
                        <p className="text-gray-600">
                          <strong>Registered:</strong> {new Date(school.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Access Codes */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      Access & Sharing
                    </h3>
                    <div className="space-y-2">
                      {user.schoolAccessCode && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">School Access Code</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                            onClick={() => copyToClipboard(user.schoolAccessCode, 'Access code')}
                          >
                            <span className="font-mono text-xs">{user.schoolAccessCode}</span>
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {user.parentsLink && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Parent Link</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                            onClick={() => copyToClipboard(user.parentsLink, 'Parent link')}
                          >
                            <span className="text-xs truncate">Share with parents</span>
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Teachers */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Teachers
                </CardTitle>
                <Users className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  {school?.users?.length || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active in your school
                </p>
              </CardContent>
            </Card>

            {/* Active Experiences */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Experiences
                </CardTitle>
                <BookOpen className="w-5 h-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  0
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Coming soon
                </p>
              </CardContent>
            </Card>

            {/* Total Raised */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Funds Raised
                </CardTitle>
                <DollarSign className="w-5 h-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  $0
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Total fundraising
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Upcoming Events
                </CardTitle>
                <Calendar className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  0
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Scheduled activities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Teachers List */}
          {school?.users && school.users.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  School Team
                </CardTitle>
                <CardDescription>
                  Teachers and staff registered at your school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {school.users.map((teacher, index) => (
                    <div key={teacher.id}>
                      {index > 0 && <Separator />}
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getInitials(teacher.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{teacher.name}</p>
                            <p className="text-sm text-gray-500">{teacher.email}</p>
                          </div>
                        </div>
                        <Badge className={getRoleBadgeColor(teacher.role)}>
                          {teacher.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="mt-8 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your school and experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Experience
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                  <Users className="w-4 h-4 mr-2" />
                  Invite Teachers
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`mailto:?subject=Join our school on Taste & Grow&body=Use this link to join: ${user.parentsLink}`)}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Share Parent Link
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Some features are coming soon. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

