import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css'; // Import CSS without assigning it to a variable
import App from '../App';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);