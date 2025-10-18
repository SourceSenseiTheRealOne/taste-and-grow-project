import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Building2, TrendingUp, Calendar, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate } from '../lib/utils';

interface Stats {
  totalSchools: number;
  activeExperiences: number;
  totalRaised: number;
  upcoming: number;
}

interface SchoolActivation {
  id: string;
  school_name: string;
  contact_name: string;
  experience_name: string;
  event_date: string;
  fundraiser_amount: number;
  total_raised: number;
  status: string;
  city_region: string;
}

export default function AdminView() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0,
    activeExperiences: 0,
    totalRaised: 0,
    upcoming: 0,
  });
  const [activations, setActivations] = useState<SchoolActivation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/admin/login');
        return;
      }

      const { data: hasAdminRole, error } = await supabase
        .rpc('has_role', {
          _user_id: user.id,
          _role: 'admin',
        });

      if (error || !hasAdminRole) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setIsAuthorized(true);
      loadDashboardData();
    } catch (err) {
      navigate('/admin/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      const { count: schoolCount } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('school_activations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { data: raisedData } = await supabase
        .from('school_activations')
        .select('total_raised');

      const totalRaised = raisedData?.reduce((sum, item) => sum + (item.total_raised || 0), 0) || 0;

      const today = new Date().toISOString().split('T')[0];
      const { count: upcomingCount } = await supabase
        .from('school_activations')
        .select('*', { count: 'exact', head: true })
        .gte('event_date', today);

      setStats({
        totalSchools: schoolCount || 0,
        activeExperiences: activeCount || 0,
        totalRaised,
        upcoming: upcomingCount || 0,
      });

      const { data: activationsData } = await supabase
        .from('school_activations')
        .select(`
          id,
          event_date,
          fundraiser_amount,
          total_raised,
          status,
          school:schools!inner(school_name, contact_name, city_region),
          experience:experiences!inner(name)
        `)
        .order('event_date', { ascending: false })
        .limit(50);

      const formattedActivations = activationsData?.map((a: any) => ({
        id: a.id,
        school_name: a.school.school_name,
        contact_name: a.school.contact_name,
        city_region: a.school.city_region,
        experience_name: a.experience.name,
        event_date: a.event_date,
        fundraiser_amount: a.fundraiser_amount,
        total_raised: a.total_raised || 0,
        status: a.status,
      })) || [];

      setActivations(formattedActivations);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      delivered: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!isAuthorized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Taste & Grow Internal</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalSchools}</span>
            </div>
            <p className="text-sm text-gray-600">Total Schools</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.activeExperiences}</span>
            </div>
            <p className="text-sm text-gray-600">Active Experiences</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">€</span>
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(stats.totalRaised).replace('€', '')}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Raised</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.upcoming}</span>
            </div>
            <p className="text-sm text-gray-600">Upcoming Events</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">School Activations</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Add-On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Raised
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No activations yet
                    </td>
                  </tr>
                ) : (
                  activations.map((activation) => (
                    <tr key={activation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{activation.school_name}</div>
                          <div className="text-sm text-gray-500">{activation.city_region}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {activation.contact_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {activation.experience_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(activation.event_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {activation.fundraiser_amount > 0
                          ? formatCurrency(activation.fundraiser_amount)
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(activation.total_raised)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(activation.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            No individual teacher accounts needed — one code per school keeps administration simple
          </p>
        </div>
      </div>
    </div>
  );
}
