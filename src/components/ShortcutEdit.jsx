import React, { useState } from 'react';

const ShortcutEdit = ({ shortcuts, setShortcuts, isLoggedIn, onClose }) => {
    const [newShortcut, setNewShortcut] = useState({ name: '', link: '' });

    if (!isLoggedIn) {
        return <p>You must be logged in to edit your shortcuts.</p>;
    }

    const handleAddShortcut = () => {
        setShortcuts([...shortcuts, newShortcut]);
        setNewShortcut({ name: '', link: '' });
    };

    return (
        <div className="shortcut-edit">
            <button className="close-button" onClick={onClose}>
                &times;
            </button>
            <h2>Edit Shortcuts</h2>
            <ul>
                {shortcuts.map((shortcut, index) => (
                    <li key={index}>
                        {shortcut.name} - {shortcut.link}
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Shortcut Name"
                value={newShortcut.name}
                onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
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
