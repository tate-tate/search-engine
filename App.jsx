import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './src/pages/SearchPage';
import Register from './src/components/Register';
import Login from './src/components/Login';
import { AuthProvider } from './src/components/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

export default App;