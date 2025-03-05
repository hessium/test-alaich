import './navigation.css'
import { Link } from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function Navigation() {
    const { authToken, logout } = useAuth();

    return (
        <nav className='navigation'>
            <ul className='navigation__list'>
                <li className='navigation__item'>
                    <Link className='navigation__link' to="/">About us</Link>
                </li>
                {authToken ? (
                    <>
                        <li className='navigation__item'>
                            <Link className='navigation__link' to="/profile">Profile</Link>
                        </li>
                        <li className='navigation__item'>
                            <button className='navigation__link' onClick={() => logout()}>Sign out</button>
                        </li>
                    </>
                ) : (
                    <li className='navigation__item'>
                        <Link className='navigation__link' to="/login">Sign in</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}