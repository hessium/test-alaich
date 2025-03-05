import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';
import './assets/styles/main.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </BrowserRouter>
);