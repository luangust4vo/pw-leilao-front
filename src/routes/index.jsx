import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register } from '../features/auth';
import { Dashboard } from '../features/dashboard';
import Profile from '../features/profile';
import Category from '../features/category';
import { PrivateRoutes, PublicRoutes, AdminRoutes } from './components';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<PublicRoutes />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<PrivateRoutes />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route element={<AdminRoutes />}>
                        <Route path="/profiles" element={<Profile />} />
                        <Route path="/categories" element={<Category />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;