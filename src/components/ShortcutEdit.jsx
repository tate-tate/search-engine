import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const ShortcutEdit = ({ isLoggedIn, onClose }) => {
    const { userID } = useContext(AuthContext); // Retrieve userID from AuthContext
    const [shortcuts, setShortcuts] = useState([]);
    const [newShortcut, setNewShortcut] = useState({userID: userID, title: '', link: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    //console.log("ShortcutEdit initialized. userID:", userID); // Debugging log

    useEffect(() => {
        if (isLoggedIn && userID) {
            fetch(`https://web.ics.purdue.edu/~shaverb/390final/fetch-w-id-final.php?userID=${userID}`, {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setShortcuts(data.shortcuts);
                    } else {
                        setError(data.error);
                    }
                })
                .catch((err) => setError(err.message));
        }
    }, [isLoggedIn, userID]);

    const handleAddShortcut = () => {
        if (newShortcut.title.trim() && newShortcut.link.trim()) {
            const updatedShortcuts = [...shortcuts, newShortcut];
            setShortcuts(updatedShortcuts);
            setNewShortcut({ userID: userID, title: '', link: '' });
            saveShortcuts(updatedShortcuts); // Save to the server
        } else {
            setError('Both title and link are required.');
            setSuccess('');
        }
    };

    const handleDeleteShortcut = (index) => {
        const updatedShortcuts = shortcuts.filter((_, i) => i !== index);
        setShortcuts(updatedShortcuts);
        saveShortcuts(updatedShortcuts); 
    };

    const saveShortcuts = (updatedShortcuts) => {
        console.log("Saving shortcuts:", updatedShortcuts); // Debugging log
        if (userID) {
            fetch(`https://web.ics.purdue.edu/~shaverb/390final/send-data-with-id.php?userID=${userID}`, {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shortcuts: updatedShortcuts, userID: userID }), // Include userID in the body
            })
                .then((response) => response.text()) // Log raw response
                .then((text) => {
                    console.log("Raw response:", text);
                    const data = JSON.parse(text); // Parse JSON
                    console.log("Parsed response:", data);
                    if (data) {
                        setSuccess('Shortcuts updated successfully.');
                        setError('');
                    } else {
                        setError('Failed to update shortcuts.');
                        setSuccess('');
                    }
                })
                .catch((err) => {
                    // console.error("Fetch error:", err.message); // Log fetch error
                    setError('Failed to update shortcuts.');
                    setSuccess('');
                });
        } else {
            setError('User ID is missing.');
            setSuccess('');
        }
    };

    if (!isLoggedIn) {
        return <p>You must be logged in to edit your shortcuts.</p>;
    }

    return (
        <div className="shortcut-edit">
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <h2>Edit Shortcuts</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <ul>
                {shortcuts.map((shortcut, index) => (
                    <li key={index}>
                        <strong>{shortcut.title}</strong> - <a href={shortcut.link} target="_blank" rel="noopener noreferrer">{shortcut.link}</a>
                        <button onClick={() => handleDeleteShortcut(index)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Shortcut Title"
                value={newShortcut.title}
                onChange={(e) => setNewShortcut({ ...newShortcut, title: e.target.value })}
            />
            <input
                type="text"
                placeholder="Shortcut Link"
                value={newShortcut.link}
                onChange={(e) => setNewShortcut({ ...newShortcut, link: e.target.value })}
            />
            <button onClick={handleAddShortcut}>Add Shortcut</button>
        </div>
    );
};

export default ShortcutEdit;
