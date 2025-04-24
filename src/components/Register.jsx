import React from 'react';
import Wrapper from '../components/Wrapper';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom'; // Ensure correct import for routing

const Register = () => {
    return (
        <Wrapper>
            <h1 className="title">Register</h1>
            <AuthForm isRegister={true} />
            <Link to="/login" className="login-link">
                Already have an account? Login here.
            </Link>
        </Wrapper>
    );
};

export default Register;