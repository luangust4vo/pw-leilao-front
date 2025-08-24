import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register } from '../features/auth';
import { Dashboard } from '../features/dashboard';
import { PrivateRoute, PublicRoute } from './components';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;