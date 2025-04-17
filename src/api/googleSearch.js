const API_KEY = 'AIzaSyDn2YK4QdeeptA3cGcuXKkUSLL14plQtKQ';
const CSE_ID = '44e242bceb19845d0'; // Replace with your Custom Search Engine ID

export async function fetchSearchResults(query) {
    const endpoint = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CSE_ID}`;
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.items || []; // Return search results
    } catch (error) {
        console.error('Failed to fetch search results:', error);
        return [];
    }
}