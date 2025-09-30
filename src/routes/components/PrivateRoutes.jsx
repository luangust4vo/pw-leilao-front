import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';

const PrivateRoutes = () => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <main>
            <Navbar />
            <div className="container">
                <Outlet />
            </div>
        </main>
    );
}

export default PrivateRoutes