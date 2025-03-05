import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState( null);

    const login = (token) => {
        if (!token) return;
        setAuthToken(token);
        localStorage.setItem('authToken', JSON.stringify(token));
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        setAuthToken(JSON.parse(token));
    }, []);

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);