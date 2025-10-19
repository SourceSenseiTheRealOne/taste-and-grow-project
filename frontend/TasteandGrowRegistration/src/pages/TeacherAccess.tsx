import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Leaf, QrCode, Calendar, Euro, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency, formatDate } from '../lib/utils';

interface School {
  school_code: string;
  school_name: string;
}

interface Activation {
  id: string;
  event_date: string;
  fundraiser_amount: number;
  parent_qr_code: string;
  status: string;
  experience: {
    name: string;
    base_price: number;
  };
}

export default function TeacherAccess() {
  const { qrCode } = useParams();
  const [searchParams] = useSearchParams();
  const [school, setSchool] = useState<School | null>(null);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [schoolCodeInput, setSchoolCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState<string | null>(null);

  useEffect(() => {
    if (qrCode) {
      loadByTeacherQR(qrCode);
    } else {
      const code = searchParams.get('code') || sessionStorage.getItem('schoolCode');
      if (code) {
        setSchoolCodeInput(code);
        loadBySchoolCode(code);
      }
    }
  }, [qrCode, searchParams]);

  const loadByTeacherQR = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      // Mock activation data - replace with actual backend API call
      const mockActivationData: any = {
        id: '1',
        event_date: '2024-01-15',
        fundraiser_amount: 5.00,
        parent_qr_code: 'parent-qr-code-123',
        status: 'active',
        school: {
          school_code: 'MOCK-0001',
          school_name: 'Your School Name',
        },
        experience: {
          name: 'Taste & Grow Experience',
          base_price: 25.00,
        },
      };

      setSchool(mockActivationData.school as any);
      setActivations([mockActivationData as any]);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadBySchoolCode = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      // Mock school data - replace with actual backend API call
      const mockSchoolData = {
        school_code: code,
        school_name: 'Your School Name',
      };

      setSchool(mockSchoolData);
      sessionStorage.setItem('schoolCode', code);

      // Mock activations data - replace with actual backend API call
      const mockActivationsData: any[] = [
        {
          id: '1',
          event_date: '2024-01-15',
          fundraiser_amount: 5.00,
          parent_qr_code: 'parent-qr-code-123',
          status: 'active',
          experience: {
            name: 'Taste & Grow Experience 1',
            base_price: 25.00,
          },
        },
      ];

      setActivations(mockActivationsData as any || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolCodeInput.trim()) {
      loadBySchoolCode(schoolCodeInput.trim());
    }
  };

  const downloadQR = (qrCode: string, experienceName: string) => {
    const svg = document.getElementById(`qr-${qrCode}`) as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = `${experienceName}-parent-qr.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getParentLink = (qrCode: string) => {
    return `${window.location.origin}/parent-link/${qrCode}`;
  };

  if (!school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schools Dashboard</h1>
            <p className="text-gray-600">Access your school's materials and resources</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleAccessSubmit} className="space-y-4">
              <div>
                <label htmlFor="schoolCode" className="block text-sm font-medium text-gray-700 mb-2">
                  School Access Code
                </label>
                <input
                  type="text"
                  id="schoolCode"
                  value={schoolCodeInput}
                  onChange={(e) => setSchoolCodeInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-center text-lg"
                  placeholder="XXXX-XXXX-XXXX"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Access Materials'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{school.school_name}</h1>
              <p className="text-sm text-gray-600">Schools Dashboard</p>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">School Code</p>
              <p className="text-lg font-mono font-bold text-green-700">{school.school_code}</p>
            </div>
          </div>
        </div>

        {activations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Experiences</h2>
            <p className="text-gray-600">
              Your school hasn't activated any experiences yet. Visit the dashboard to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activations.map((activation) => (
              <div key={activation.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-green-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{activation.experience.name}</h2>
                    <span className="px-3 py-1 bg-white text-green-600 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Event Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(activation.event_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Euro className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Fundraiser Amount</p>
                        <p className="font-semibold text-gray-900">
                          {activation.fundraiser_amount > 0
                            ? `${formatCurrency(activation.fundraiser_amount)} per order`
                            : 'No fundraiser'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Euro className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Base Price</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(activation.experience.base_price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">QR Code for Parents</h3>
                      <button
                        onClick={() => setShowQR(showQR === activation.id ? null : activation.id)}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                      >
                        <QrCode className="w-5 h-5" />
                        {showQR === activation.id ? 'Hide QR Code' : 'Show QR Code'}
                      </button>
                    </div>

                    {showQR === activation.id && (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <div className="inline-block bg-white p-4 rounded-lg shadow-md mb-4">
                          <QRCodeSVG
                            id={`qr-${activation.parent_qr_code}`}
                            value={getParentLink(activation.parent_qr_code)}
                            size={200}
                            level="H"
                          />
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => downloadQR(activation.parent_qr_code, activation.experience.name)}
                            className="inline-flex items-center gap-2 bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download QR Code
                          </button>
                          <p className="text-sm text-gray-600 mt-2">
                            Share this QR code with parents or use the link:
                          </p>
                          <div className="bg-white border border-gray-300 rounded-lg p-3 mt-2">
                            <p className="text-xs font-mono text-gray-700 break-all">
                              {getParentLink(activation.parent_qr_code)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fundraiser Summary</h3>
              {activations.map((activation) => (
                <div key={activation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Active Experience</p>
                      <p className="font-semibold text-gray-900">{activation.experience.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Event Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(activation.event_date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fundraiser per Order</p>
                      <p className="font-semibold text-gray-900">
                        {activation.fundraiser_amount > 0
                          ? formatCurrency(activation.fundraiser_amount)
                          : 'No fundraiser'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {activation.status.charAt(0).toUpperCase() + activation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Contact the school coordinator for detailed fundraising reports.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
