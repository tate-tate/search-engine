import React, { useState } from 'react';
import { fetchSearchResults } from '../api/googleSearch';
import Sidebar from '../components/Sidebar';
import '../styles/SearchPage.css';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const shortcuts = [
        { name: 'Google', link: 'https://www.google.com' },
        { name: 'GitHub', link: 'https://github.com' },
        { name: 'Stack Overflow', link: 'https://stackoverflow.com' },
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const searchResults = await fetchSearchResults(query);
            setResults(searchResults);
        } catch (err) {
            setError('Failed to fetch results. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page">
            <header className="search-header">
                <h1>Questor - A Search Engine</h1>
                <button
                    className="shortcuts-button"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    Shortcuts
                </button>
            </header>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the web... or don't"
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="search-results">
                {results.map((result, index) => (
                    <div key={index} className="search-result">
                        <a href={result.link} target="_blank" rel="noopener noreferrer">
                            <h3>{result.title}</h3>
                        </a>
                        <p>{result.snippet}</p>
                    </div>
                ))}
            </div>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                shortcuts={shortcuts}
            />
        </div>
    );
};

export default SearchPage;