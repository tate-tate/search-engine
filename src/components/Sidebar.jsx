import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const { isLogin, logout, userID } = useContext(AuthContext); // Retrieve userID from AuthContext
    const [shortcuts, setShortcuts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isLogin && userID) {
            fetch(`https://web.ics.purdue.edu/~shaverb/390final/fetch-w-id-final.php?userID=${userID}`, {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setShortcuts(data.shortcuts);
                        setError('');
                    } else {
                        setError(data.error);
                    }
                })
                .catch(() => setError('Failed to fetch shortcuts.'));
        }
    }, [isLogin, userID]);

    const handleDeleteShortcut = (index) => {
        const updatedShortcuts = shortcuts.filter((_, i) => i !== index);
        setShortcuts(updatedShortcuts);
        fetch(`https://web.ics.purdue.edu/~shaverb/390final/send-data-with-id.php?userID=${userID}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shortcuts: updatedShortcuts }),
        }).catch(() => setError('Failed to update shortcuts.'));
    };

    return (
        <div className={`sidebar ${isOpen ? 'active' : ''}`}>
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <h2>Shortcuts</h2>
            {isLogin ? (
                error ? (
                    <p className="error">{error}</p>
                ) : (
                    <ul className="shortcut-list">
                        {shortcuts.map((shortcut, index) => (
                            <li key={index} className="shortcut-item">
                                <a href={shortcut.link} target="_blank" rel="noopener noreferrer">
                                    {shortcut.title}
                                </a>
                                <button onClick={() => handleDeleteShortcut(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )
            ) : (
                <p>Please log in to view your shortcuts.</p>
            )}
            <div className="auth-buttons">
                {!isLogin && (
                    <>
                        <Link to="/login" className="auth-button login-button">
                            Login
                        </Link>
                        <Link to="/register" className="auth-button register-button">
                            Register
                        </Link>
                    </>
                )}
                {isLogin && (
                    <button className="logout-button" onClick={logout}>
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;