import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../styles/Sidebar.css'; // Import the CSS for the sidebar

const Sidebar = ({ isOpen, onClose, shortcuts }) => {
    return (
        <div className={`sidebar ${isOpen ? 'active' : ''}`}>
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <h2>Shortcuts</h2>
            <ul className="shortcut-list">
                {shortcuts.map((shortcut, index) => (
                    <li key={index} className="shortcut-item">
                        <a href={shortcut.link} target="_blank" rel="noopener noreferrer">
                            {shortcut.name}
                        </a>
                    </li>
                ))}
            </ul>
            <div className="auth-buttons">
                <Link to="/login" className="auth-button login-button">
                    Login
                </Link>
                <Link to="/register" className="auth-button register-button">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;