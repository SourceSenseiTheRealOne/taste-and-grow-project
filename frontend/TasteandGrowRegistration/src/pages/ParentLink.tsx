import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Leaf, Calendar, Euro, Info, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

interface ActivationData {
  id: string;
  event_date: string;
  fundraiser_amount: number;
  school: {
    school_name: string;
  };
  experience: {
    name: string;
    description: string;
    items_included: string[];
    base_price: number;
  };
}

export default function ParentLink() {
  const { qrCode } = useParams();
  const [data, setData] = useState<ActivationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!qrCode) {
      setError('Invalid link');
      setLoading(false);
      return;
    }

    loadActivationData(qrCode);
  }, [qrCode]);

  const loadActivationData = async (code: string) => {
    try {
      // Mock activation data - replace with actual backend API call
      const mockActivationData: ActivationData = {
        id: '1',
        event_date: '2024-01-15',
        fundraiser_amount: 5.00,
        school: {
          school_name: 'Your School Name',
        },
        experience: {
          name: 'Taste & Grow Experience',
          description: 'A wonderful experience for your child',
          items_included: ['Item 1', 'Item 2', 'Item 3'],
          base_price: 25.00,
        },
      };
      setData(mockActivationData);
    } catch (err: any) {
      setError(err.message || 'Failed to load experience details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const totalPrice = data.experience.base_price + data.fundraiser_amount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">Taste & Grow</h1>
                  <p className="text-green-100 text-sm">{data.school.school_name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {data.experience.name} Experience
            </h2>
            <p className="text-gray-600 mb-6">{data.experience.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Event Date</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(data.event_date)}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">School Fundraiser</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {data.fundraiser_amount > 0
                    ? `+${formatCurrency(data.fundraiser_amount)} per order`
                    : 'No additional fundraiser'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-3">
                {data.experience.items_included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Product Price</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(data.experience.base_price)}
                  </span>
                </div>
                {data.fundraiser_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">School Fundraiser</span>
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(data.fundraiser_amount)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total per Order</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Payment Instructions</h3>
                  <p className="text-sm text-gray-700">
                    Please proceed with payment using the school's payment instructions. Include your
                    child's class name in the payment reference.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p>
                  All proceeds support Portuguese farmers and your school's programs.
                  <br />
                  <span className="font-medium text-green-600">
                    ✓ Taste & Grow takes no transaction fees
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Questions? Contact your school coordinator for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
