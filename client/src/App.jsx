import {Routes, Route} from 'react-router-dom';
import Navigation from "./components/navigation/navigation.jsx";
import Login from "./pages/login.jsx";
import ProtectedRoute from "./components/protected-route/protected-route.jsx";
import Profile from "./pages/profile.jsx";
import {NotFound} from "./pages/not-found.jsx";
import About from "./pages/about.jsx";
import AuthorizationRoute from "./components/authorization-route/authorization-route.jsx";

export default function App() {
    return (
        <div className="container">
            <Navigation/>

            <Routes>
                <Route path="/" element={<About/>}/>
                <Route path="*" element={<NotFound/>}/>
                <Route
                    path="/login"
                    element={
                        <AuthorizationRoute>
                            <Login/>
                        </AuthorizationRoute>}/>
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}