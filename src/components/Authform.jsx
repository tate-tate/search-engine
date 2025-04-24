import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AuthForm = ({ isRegister = false }) => {
    const { login } = useContext(AuthContext); // Ensure context is provided
    const [data, setData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const [submited, setSubmited] = useState(false);
    const [successM, setSuccessM] = useState('');
    const navigate = useNavigate();
    const nameRef = useRef(null);

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmited(true);
    
        const formData = new FormData(e.target);
        formData.append('username', data.username.trim());
        formData.append('password', data.password.trim());
        if (isRegister) formData.append('email', data.email.trim());
        formData.append('action', isRegister ? 'register' : 'login');
    
        try {
            const response = await fetch(
                'https://web.ics.purdue.edu/~shaverb/390final/auth.php',
                {
                    method: 'POST',
                    body: formData,
                }
            );
    
            // Log the response to debug
            const textResponse = await response.text();
            console.log('Server Response:', textResponse);
    
            // Attempt to parse JSON
            const responseData = JSON.parse(textResponse);
    
            if (responseData.success) {
                setData({ username: '', password: '', email: '' });
                setSuccessM(responseData.success);
                login(); // Call login from context
                setError('');
                navigate('/');
            } else {
                setError(responseData.error);
                setSuccessM('');
            }
        } catch (error) {
            setError(error.message);
            setSuccessM('');
        } finally {
            setSubmited(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <input
                ref={nameRef}
                type="text"
                name="username"
                placeholder="Username"
                required
                value={data.username}
                onChange={handleChange}
            />
            {isRegister && (
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={data.email}
                    onChange={handleChange}
                />
            )}
            <input
                type="password"
                name="password"
                placeholder="Password (min 8 char)"
                minLength="8"
                required
                value={data.password}
                onChange={handleChange}
            />
            <button
                type="submit"
                disabled={
                    submited ||
                    data.username.trim() === '' ||
                    (isRegister && data.email.trim() === '') ||
                    data.password.trim() === ''
                }
            >
                Submit
            </button>
            {error && <p>{error}</p>}
            {successM && <p>{successM}</p>}
        </form>
    );
};

export default AuthForm;