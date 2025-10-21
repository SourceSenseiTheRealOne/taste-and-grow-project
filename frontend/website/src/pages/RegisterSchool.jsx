import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Sprout, Loader2, School, MapPin, User, Mail, Phone, Users, CheckCircle2 } from 'lucide-react';

export default function RegisterSchool() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    schoolName: '',
    cityRegion: '',
    contactName: user?.name || '',
    email: '',
    phone: '',
    studentCount: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && user.schoolId) {
      navigate('/dashboard');
      return;
    }

    // Update contact name if user data loads
    if (user && !formData.contactName) {
      setFormData(prev => ({ ...prev, contactName: user.name }));
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Prepare data - remove empty optional fields
      const submitData = {
        schoolName: formData.schoolName,
        cityRegion: formData.cityRegion,
        contactName: formData.contactName
      };

      if (formData.email) submitData.email = formData.email;
      if (formData.phone) submitData.phone = formData.phone;
      if (formData.studentCount) submitData.studentCount = parseInt(formData.studentCount);

      const response = await api.post('/schools/register', submitData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register school');
      }

      const data = await response.json();
      
      // Update the user in local storage with the new school data
      const updatedUser = {
        ...user,
        schoolId: data.school.id,
        schoolAccessCode: data.user.schoolAccessCode,
        parentsLink: data.user.parentsLink
      };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register school. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="w-16 h-16 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              School Registered Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Redirecting you to your dashboard...
            </p>
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Sprout className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-800">Taste & Grow</span>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <School className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Register Your School
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join Taste & Grow and start your school's journey with real food experiences
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">School Information</CardTitle>
            <CardDescription>
              Fill in the details about your school. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="schoolName" className="flex items-center gap-2">
                  <School className="w-4 h-4" />
                  School Name *
                </Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  placeholder="Central Elementary School"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* City/Region */}
              <div className="space-y-2">
                <Label htmlFor="cityRegion" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City/Region *
                </Label>
                <Input
                  id="cityRegion"
                  name="cityRegion"
                  type="text"
                  placeholder="New York, NY"
                  value={formData.cityRegion}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Contact Name */}
              <div className="space-y-2">
                <Label htmlFor="contactName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contact Name *
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  type="text"
                  placeholder="John Smith"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Primary contact person at the school
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Optional Information
                </h3>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      School Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contact@school.edu"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      School Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Student Count */}
                  <div className="space-y-2">
                    <Label htmlFor="studentCount" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Students
                    </Label>
                    <Input
                      id="studentCount"
                      name="studentCount"
                      type="number"
                      placeholder="500"
                      value={formData.studentCount}
                      onChange={handleChange}
                      disabled={isLoading}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Registering School...
                    </>
                  ) : (
                    <>
                      <School className="w-5 h-5 mr-2" />
                      Register School
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="border-2 border-green-200">
            <CardContent className="pt-6 text-center">
              <School className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Your School</h3>
              <p className="text-xs text-gray-600">
                Get a unique school code and dashboard
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Invite Teachers</h3>
              <p className="text-xs text-gray-600">
                Share access codes with your team
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 mb-1">Get Started</h3>
              <p className="text-xs text-gray-600">
                Begin creating food experiences
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

