import {useDocumentTitle} from "../shared/hooks/use-document-title.js";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useCallback, useState} from "react";
import {apiRequest} from "../shared/api/api.js";
import {useNavigate} from "react-router-dom";
import {EMAIL_REGEX} from "../shared/constants/regex.js";
import {Button, TextField} from "@mui/material";

export default function Login() {
    useDocumentTitle('Sign in');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formState, setFormState] = useState({
        email: '',
        password: '',
        error: '',
        isLoading: false
    });

    const handleInputChange = useCallback((field) => (e) => {
        setFormState(prev => ({
            ...prev,
            [field]: e.target.value,
            error: '' // Сбрасываем ошибку при изменении поля
        }));
    }, []);

    const validateForm = useCallback(() => {
        const { email, password } = formState;

        if (!email || !password) {
            setFormState(prev => ({ ...prev, error: 'All fields are required' }));
            return false;
        }

        if (!EMAIL_REGEX.test(email)) {
            setFormState(prev => ({ ...prev, error: 'Invalid email format' }));
            return false;
        }

        return true;
    }, [formState.email, formState.password]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormState(prev => ({ ...prev, isLoading: true }));

        try {
            const data = await apiRequest('POST', '/login', {
                email: formState.email,
                password: formState.password
            });

            if (!data.success) {
                setFormState(prev => ({
                    ...prev,
                    error: data.message || 'Authentication failed',
                    isLoading: false
                }));
                return;
            }

            login({ token: data.data.token });
            navigate('/profile')
        } catch (err) {
            setFormState(prev => ({
                ...prev,
                error: err.message || 'An error occurred during login',
                isLoading: false
            }));
        }
    }, [formState.email, formState.password, login, navigate, validateForm]);

    return (
        <div className='form__wrapper'>
            {formState.error && (
                <div className="form__error">{formState.error}</div>
            )}

            <form className="form" onSubmit={handleSubmit}>
                <div className="form__group">
                    <label htmlFor='email' className='form__label'>Email</label>
                    <TextField variant="outlined"
                               type="email"
                               size="small"
                               id="email"
                               placeholder="Enter email"
                               value={formState.email}
                               fullWidth
                               onChange={handleInputChange('email')}
                               disabled={formState.isLoading}
                    />
                    <span>We'll never share your email with anyone else"</span>
                </div>

                <div className="form__group">
                    <label htmlFor='password' className='form__label'>Password</label>
                    <TextField variant="outlined"
                               size="small"
                               type="password"
                               id="password"
                               placeholder="Password"
                               fullWidth
                               value={formState.password}
                               onChange={handleInputChange('password')}
                               disabled={formState.isLoading}
                    />
                </div>

                <Button type='submit' variant="contained" loading={formState.isLoading}>Submit</Button>
            </form>
        </div>
    );
}