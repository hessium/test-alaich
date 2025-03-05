import './navigation.css'
import { Link } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";
import { Button } from '@mui/material';

export default function Navigation() {
    const { authToken, logout } = useAuth();

    return (
        <nav className='navigation'>
            <ul className='navigation__list'>
                <li className='navigation__item'>
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/"
                        color="grey">
                        About us
                    </Button>
                </li>
                {authToken ? (
                    <>
                        <li className='navigation__item'>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/profile"
                                color="grey">
                                Profile
                            </Button>
                        </li>
                        <li className='navigation__item'>
                            <Button
                                variant="outlined"
                                color="grey"
                                onClick={() => logout()}>
                                Sign out
                            </Button>
                        </li>
                    </>
                ) : (
                    <li className='navigation__item'>
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/login"
                            color="grey">
                            Sing in
                        </Button>
                    </li>
                )}
            </ul>
        </nav>
    );
}