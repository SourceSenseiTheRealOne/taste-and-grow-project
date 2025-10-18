import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import ActivateExperience from './pages/ActivateExperience';
import ParentLink from './pages/ParentLink';
import TeacherAccess from './pages/TeacherAccess';
import AdminLogin from './pages/AdminLogin';
import AdminView from './pages/AdminView';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activate" element={<ActivateExperience />} />
        <Route path="/parent-link/:qrCode" element={<ParentLink />} />
        <Route path="/teacher-access" element={<TeacherAccess />} />
        <Route path="/teacher-access/:qrCode" element={<TeacherAccess />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </Router>
  );
}

export default App;
