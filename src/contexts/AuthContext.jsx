import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!token;

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, [token]);

    const handleAuthentication = (data) => {
        const { token, user } = data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const login = async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        handleAuthentication(response.data);
    };

    const register = async (credentials) => {
        const response = await api.post('/auth/register', credentials);
        handleAuthentication(response.data);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };