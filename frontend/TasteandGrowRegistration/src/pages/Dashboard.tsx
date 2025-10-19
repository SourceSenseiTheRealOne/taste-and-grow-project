import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, Mail, MapPin, Users, ArrowRight, Info } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface School {
  id: string;
  school_code: string;
  school_name: string;
  city_region: string;
  contact_name: string;
  contact_email: string;
  student_count: number | null;
}

interface Experience {
  id: string;
  name: string;
  description: string;
  items_included: string[];
  base_price: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [school, setSchool] = useState<School | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [hasActiveExperience, setHasActiveExperience] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const schoolCode = searchParams.get('code') || sessionStorage.getItem('schoolCode');

    if (!schoolCode) {
      setError('No school code provided. Please register first.');
      setLoading(false);
      return;
    }

    sessionStorage.setItem('schoolCode', schoolCode);
    loadDashboardData(schoolCode);
  }, [searchParams]);

  const loadDashboardData = async (schoolCode: string) => {
    try {
      // Mock school data - replace with actual backend API call
      const mockSchool: School = {
        id: '1',
        school_code: schoolCode,
        school_name: 'Your School Name',
        city_region: 'Your City/Region',
        contact_name: 'Contact Person',
        contact_email: 'contact@school.com',
        student_count: null,
      };
      setSchool(mockSchool);

      // Mock experiences data - replace with actual backend API call
      const mockExperiences: Experience[] = [
        {
          id: '1',
          name: 'Experience 1',
          description: 'Description of experience 1',
          items_included: ['Item 1', 'Item 2', 'Item 3'],
          base_price: 25.00,
        },
        {
          id: '2',
          name: 'Experience 2',
          description: 'Description of experience 2',
          items_included: ['Item A', 'Item B'],
          base_price: 35.00,
        },
      ];
      setExperiences(mockExperiences);

      // Mock active experience check - replace with actual backend API call
      setHasActiveExperience(false);

    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateExperience = (experienceId: string) => {
    navigate(`/activate?experienceId=${experienceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{school.school_name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {school.city_region}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {school.contact_name} ({school.contact_email})
                </div>
                {school.student_count && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {school.student_count} students
                  </div>
                )}
              </div>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">School Code</p>
              <p className="text-lg font-mono font-bold text-green-700">{school.school_code}</p>
            </div>
          </div>
        </div>

        {hasActiveExperience && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  You have an active experience
                </p>
                <p className="text-sm text-blue-700">
                  You can only choose one experience at a time. Visit the Teacher Access page to view your active experience details.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Experiences</h2>
          <p className="text-gray-600">
            Choose one experience to activate. You can activate it multiple times for different events.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{experience.name}</h3>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(experience.base_price)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{experience.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">What's Included:</p>
                  <ul className="space-y-1">
                    {experience.items_included.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleActivateExperience(experience.id)}
                  disabled={hasActiveExperience}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  Activate Experience
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold mb-3">
                1
              </div>
              <p className="text-sm text-gray-600">
                Select an experience and set your event date
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold mb-3">
                2
              </div>
              <p className="text-sm text-gray-600">
                Add an optional fundraiser amount (€2-€10)
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold mb-3">
                3
              </div>
              <p className="text-sm text-gray-600">
                Share parent QR code and links with families
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold mb-3">
                4
              </div>
              <p className="text-sm text-gray-600">
                Receive products and fundraising support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
