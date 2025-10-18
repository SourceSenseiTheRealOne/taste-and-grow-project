import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `px-3 py-2 text-sm rounded-md transition-colors ${
      isActive(path)
        ? 'bg-green-100 text-green-900 font-medium'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Taste & Grow</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            <Link to="/" className={linkClass('/')}>
              Registration
            </Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/activate" className={linkClass('/activate')}>
              Activate
            </Link>
            <Link to="/parent-link/demo" className={linkClass('/parent-link/demo')}>
              Parent Link
            </Link>
            <Link to="/teacher-access" className={linkClass('/teacher-access')}>
              Teacher Access
            </Link>
            <Link to="/admin" className={linkClass('/admin')}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
