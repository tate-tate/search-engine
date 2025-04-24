import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { AuthContext } from './AuthContext'; // Import AuthContext for logout functionality
import '../styles/Sidebar.css'; // Import the CSS for the sidebar

const Sidebar = ({ isOpen, onClose, shortcuts, isLoggedIn }) => {
    const { logout } = useContext(AuthContext);

    return (
        <div className={`sidebar ${isOpen ? 'active' : ''}`}>
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <h2>Shortcuts</h2>
            {isLoggedIn ? (
                <ul className="shortcut-list">
                    {shortcuts.map((shortcut, index) => (
                        <li key={index} className="shortcut-item">
                            <a href={shortcut.link} target="_blank" rel="noopener noreferrer">
                                {shortcut.name}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Please log in to view your shortcuts.</p>
            )}
            <div className="auth-buttons">
                <Link to="/login" className="auth-button login-button">
                    Login
                </Link>
                <Link to="/register" className="auth-button register-button">
                    Register
                </Link>
            </div>
            {isLoggedIn && (
                <button className="logout-button" onClick={logout}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Sidebar;