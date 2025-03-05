import { Navigate } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function AuthorizationRoute({ children }) {
    const { authToken } = useAuth();

    return authToken ? <Navigate to="/profile" replace /> : children;
}