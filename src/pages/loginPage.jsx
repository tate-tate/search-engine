import Wrapper from "../components/Wrapper";
import AuthForm from "../components/Authform";
import { Link } from "react-router-dom";
import '../styles/Login.css';

const Login = () => {
    return(
        <Wrapper>
            <h1>Login</h1>
            <AuthForm isRegister={false}/>
            <Link to="/register">Don't have an account yet? Register here</Link>
        </Wrapper>
    );
}
export default Login;