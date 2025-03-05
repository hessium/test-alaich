import { Navigate } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
    const { authToken } = useAuth();

    return authToken ? children : <Navigate to="/login" replace />;
}