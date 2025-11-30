import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes, AdminRoutes } from './components';
import {
    ForgotPassword,
    Login,
    Register,
    ResetPassword,
    VerifyAccount,
    VerifyResetCode,
    Dashboard,
    Profile,
    Category,
    Panel,
    UserProfile,
    Auction
} from '../features'

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-account" element={<VerifyAccount />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-reset-code" element={<VerifyResetCode />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route element={<PrivateRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user" element={<UserProfile />} />
                <Route path="/auction" element={<Auction />} />

                <Route element={<AdminRoutes />}>
                    <Route path="/admin" element={<Panel />} />
                    <Route path="/profiles" element={<Profile />} />
                    <Route path="/categories" element={<Category />} />
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;