import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes, AdminRoutes, StandardRoutes } from './components';
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
    AuctionList,
    Details
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

            <Route element={<StandardRoutes />}>
                <Route path="/" element={<AuctionList />} />
                <Route path="/auctions/:id" element={<Details />} />
            </Route>

            <Route element={<PrivateRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user" element={<UserProfile />} />

                <Route element={<AdminRoutes />}>
                    <Route path="/admin" element={<Panel />} />
                    <Route path="/profiles" element={<Profile />} />
                    <Route path="/categories" element={<Category />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;