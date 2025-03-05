import {useDocumentTitle} from "../shared/hooks/use-document-title.js";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useEffect, useState} from "react";
import {apiRequest} from "../shared/api/api.js";
import {useNavigate} from "react-router-dom";
import {cn} from "../shared/utils/cn.js";
import {Button} from "../shared/ui/button/button.jsx";
import {InputField} from "../shared/ui/input-field/input-field.jsx";

export default function Login() {
    useDocumentTitle('Sign in')

    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setError('');
    }, [formData.email, formData.password]);

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email || !formData.password) {
            setError('All fields are required');
            return false;
        }

        if (!emailRegex.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const data = await apiRequest('POST', '/login', formData);

            if (!data.success) {
                setError(data.message || 'Authentication failed');
                return;
            }

            login({ token: data.data.token });
            navigate('/profile');
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="form__error">{error}</div>}

            <form className="form"  onSubmit={handleSubmit}>
                <InputField
                    type="email"
                    id="email"
                    label="Email address"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    warning="We'll never share your email with anyone else"
                    disabled={isLoading}
                />

                <InputField
                    type="password"
                    id="password"
                    label="Password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    disabled={isLoading}
                />


                <Button type='submit' loading={isLoading} >
                    Submit
                </Button>
            </form>
        </div>
    );
}