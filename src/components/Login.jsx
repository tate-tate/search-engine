import React from 'react';
import Wrapper from './Wrapper';
import AuthForm from './Authform';
import { Link } from 'react-router-dom'; // Ensure correct import for routing

const Login = () => {
    return (
        <Wrapper>
            <h1 className="title">Login</h1>
            <AuthForm isRegister={false} />
            <Link to="/register" className="register-link">
                Don't have an account? Register here.
            </Link>
        </Wrapper>
    );
};

export default Login;