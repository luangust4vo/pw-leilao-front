import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    const isAdmin = user?.profiles?.some(profile => profile.type === 'ROLE_ADMIN');

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoutes;