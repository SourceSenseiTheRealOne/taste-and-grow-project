import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, AlertCircle, CheckCircle } from 'lucide-react';
import { registrationSchema, type RegistrationFormData } from '../lib/validation';
import { supabase } from '../lib/supabase';
import { generateSchoolCode } from '../lib/utils';

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationFormData>({
    schoolName: '',
    cityRegion: '',
    contactName: '',
    contactRole: 'teacher',
    contactEmail: '',
    studentCount: '',
    preferredLanguage: 'en',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [schoolCode, setSchoolCode] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'studentCount' ? (value === '' ? '' : Number(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = registrationSchema.parse(formData);
      setIsSubmitting(true);

      const code = generateSchoolCode(validated.schoolName);

      const { error } = await supabase.from('schools').insert({
        school_code: code,
        school_name: validated.schoolName,
        city_region: validated.cityRegion,
        contact_name: validated.contactName,
        contact_role: validated.contactRole,
        contact_email: validated.contactEmail,
        student_count: (typeof validated.studentCount === 'number' && validated.studentCount > 0) ? validated.studentCount : null,
        preferred_language: validated.preferredLanguage,
      });

      if (error) throw error;

      setSchoolCode(code);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/dashboard?code=${code}`);
      }, 3000);
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: error.message || 'An error occurred during registration' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your school has been registered.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">Your School Code:</p>
            <p className="text-2xl font-mono font-bold text-green-700">{schoolCode}</p>
          </div>
          <p className="text-sm text-gray-600">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Taste & Grow</h1>
          <p className="text-lg text-gray-600">
            Register Your School to Begin Your Journey
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                School Name *
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.schoolName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your school name"
              />
              {errors.schoolName && (
                <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>
              )}
            </div>

            <div>
              <label htmlFor="cityRegion" className="block text-sm font-medium text-gray-700 mb-1">
                City / Region *
              </label>
              <input
                type="text"
                id="cityRegion"
                name="cityRegion"
                value={formData.cityRegion}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.cityRegion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city or region"
              />
              {errors.cityRegion && (
                <p className="mt-1 text-sm text-red-600">{errors.cityRegion}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.contactName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.contactName && (
                <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactRole" className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                id="contactRole"
                name="contactRole"
                value={formData.contactRole}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.contactRole ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
                <option value="coordinator">Coordinator</option>
                <option value="other">Other</option>
              </select>
              {errors.contactRole && (
                <p className="mt-1 text-sm text-red-600">{errors.contactRole}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your.email@school.com"
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="studentCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Students (Optional)
              </label>
              <input
                type="number"
                id="studentCount"
                name="studentCount"
                value={formData.studentCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Approximate student enrollment"
                min="1"
              />
            </div>

            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Language *
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.preferredLanguage ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
                <option value="fr">Français</option>
              </select>
              {errors.preferredLanguage && (
                <p className="mt-1 text-sm text-red-600">{errors.preferredLanguage}</p>
              )}
            </div>

            {errors.submit && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating Your Profile...' : 'Create My School Profile'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              After submission, you'll receive a unique school code and dashboard access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
