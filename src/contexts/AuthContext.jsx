import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

let logoutTimer;
let sessionWarningTimer;

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
    const [isSessionModalVisible, setIsSessionModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!token;

    const handleAuthentication = useCallback((data) => {
        const { token, user, expiresIn } = data;

        setToken(token);
        setUser(user);

        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        setTokenExpirationDate(expirationDate);

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }, []);

    const login = async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        handleAuthentication(response.data);
    };

    const register = async (credentials) => {
        const response = await api.post('/auth/register', credentials);
        handleAuthentication(response.data);
    };

    const refreshToken = async () => {
        try {
            const response = await api.post('/auth/refresh');
            handleAuthentication(response.data);

            setIsSessionModalVisible(false);
        } catch (error) {
            toast.error('Sessão expirada. Faça login novamente.');
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setTokenExpirationDate(null);
        setIsSessionModalVisible(false);

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');

        if (sessionWarningTimer) clearTimeout(sessionWarningTimer);
        if (logoutTimer) clearTimeout(logoutTimer);
    }, []);

    useEffect(() => {
        if (sessionWarningTimer) clearTimeout(sessionWarningTimer);
        if (logoutTimer) clearTimeout(logoutTimer);

        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            const warningTime = remainingTime - 2 * 60 * 1000;

            if (warningTime > 0) {
                sessionWarningTimer = setTimeout(() => {
                    setIsSessionModalVisible(true);
                }, warningTime);
            }

            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(sessionWarningTimer);
            clearTimeout(logoutTimer);
        }
    }, [token, tokenExpirationDate, logout]);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        const storedExpiration = localStorage.getItem('tokenExpiration');
        const expirationDate = new Date(storedExpiration);

        if (storedToken && storedUser && expirationDate > new Date()) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setTokenExpirationDate(expirationDate);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
        }

        setLoading(false);
    }, []);

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshToken,
        isSessionModalVisible,
        tokenExpirationDate
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };