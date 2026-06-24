import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h4 className="mb-4">
          <span className="text-primary">AI</span>-Solutions
          <small className="d-block text-white-50 fs-6 mt-1">Admin Panel</small>
        </h4>
        <nav className="d-flex flex-column gap-2">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold bg-primary rounded px-3 py-2' : 'px-3 py-2'}`}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/inquiries" className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold bg-primary rounded px-3 py-2' : 'px-3 py-2'}`}>
            Inquiries
          </NavLink>
          <NavLink to="/admin/testimonials" className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold bg-primary rounded px-3 py-2' : 'px-3 py-2'}`}>
            Testimonials
          </NavLink>
          <NavLink to="/admin/blog" className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold bg-primary rounded px-3 py-2' : 'px-3 py-2'}`}>
            Blog
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold bg-primary rounded px-3 py-2' : 'px-3 py-2'}`}>
            Events
          </NavLink>
          <NavLink to="/admin/gallery" className={({ isActive }) => `nav-link text-white ${isActive ? 'fw-bold bg-primary rounded px-3 py-2' : 'px-3 py-2'}`}>
            Gallery
          </NavLink>
        </nav>
        <div className="mt-auto pt-5">
          <p className="text-white-50 small mb-2">{user?.name}</p>
          <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
