import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Euro, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, generateQRCode } from '../lib/utils';
import { format } from 'date-fns';

interface Experience {
  id: string;
  name: string;
  description: string;
  base_price: number;
}

type FundraiserMode = 'preset' | 'custom';

export default function ActivateExperience() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [fundraiserMode, setFundraiserMode] = useState<FundraiserMode>('preset');
  const [fundraiserAmount, setFundraiserAmount] = useState(2);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const experienceId = searchParams.get('experienceId');
    if (!experienceId) {
      setError('No experience selected');
      setLoading(false);
      return;
    }

    loadExperience(experienceId);
  }, [searchParams]);

  const loadExperience = async (experienceId: string) => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', experienceId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError('Experience not found');
        setLoading(false);
        return;
      }

      setExperience(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!eventDate) {
      setError('Please select an event date');
      return;
    }

    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Event date must be in the future');
      return;
    }

    const schoolCode = sessionStorage.getItem('schoolCode');
    if (!schoolCode) {
      setError('School code not found. Please return to dashboard.');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('id')
        .eq('school_code', schoolCode)
        .maybeSingle();

      if (schoolError) throw schoolError;
      if (!schoolData) throw new Error('School not found');

      const { data: existingActivation, error: checkError } = await supabase
        .from('school_activations')
        .select('id')
        .eq('school_id', schoolData.id)
        .eq('status', 'active')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingActivation) {
        setError('You already have an active experience. Please complete it before activating a new one.');
        setIsSubmitting(false);
        return;
      }

      const finalAmount = fundraiserMode === 'preset'
        ? fundraiserAmount
        : parseFloat(customAmount) || 0;

      if (finalAmount < 0 || finalAmount > 100) {
        setError('Fundraiser amount must be between €0 and €100');
        setIsSubmitting(false);
        return;
      }

      const parentQR = generateQRCode();
      const teacherQR = generateQRCode();

      const { error: insertError } = await supabase
        .from('school_activations')
        .insert({
          school_id: schoolData.id,
          experience_id: experience!.id,
          event_date: eventDate,
          fundraiser_amount: finalAmount,
          parent_qr_code: parentQR,
          teacher_qr_code: teacherQR,
          status: 'active',
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/teacher-access');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to activate experience');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error && !experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience Activated!</h2>
          <p className="text-gray-600">
            Your QR codes and access links are now available in the Teacher Access page.
          </p>
        </div>
      </div>
    );
  }

  const minDate = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Activate Experience</h1>

          {experience && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{experience.name}</h2>
                  <p className="text-gray-600 mb-2">{experience.description}</p>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(experience.base_price)}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Event Date *
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={minDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Euro className="w-4 h-4 inline mr-2" />
                Fundraiser Amount
              </label>

              <div className="space-y-4">
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fundraiserMode"
                      checked={fundraiserMode === 'preset'}
                      onChange={() => setFundraiserMode('preset')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">Preset Amount</p>
                      <select
                        value={fundraiserAmount}
                        onChange={(e) => setFundraiserAmount(Number(e.target.value))}
                        disabled={fundraiserMode !== 'preset'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value={0}>No fundraiser</option>
                        <option value={2}>€2 per order</option>
                        <option value={3}>€3 per order</option>
                        <option value={4}>€4 per order</option>
                        <option value={5}>€5 per order</option>
                        <option value={6}>€6 per order</option>
                        <option value={7}>€7 per order</option>
                        <option value={8}>€8 per order</option>
                        <option value={9}>€9 per order</option>
                        <option value={10}>€10 per order</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fundraiserMode"
                      checked={fundraiserMode === 'custom'}
                      onChange={() => setFundraiserMode('custom')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">Custom Amount</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">€</span>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          disabled={fundraiserMode !== 'custom'}
                          placeholder="Enter custom amount"
                          min="0"
                          max="100"
                          step="0.5"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Activating...' : 'Activate Experience & Generate Links'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              After activation, parent QR codes and access links will be available in your Teacher Access dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
