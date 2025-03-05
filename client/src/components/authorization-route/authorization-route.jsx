import { Navigate } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function AuthorizationRoute({ children }) {
    const { user } = useAuth();

    return user ? <Navigate to="/profile" replace /> : children;
}