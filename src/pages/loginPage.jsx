import Wrapper from "../components/wrapper";
import AuthForm from "../components/Authform";
import { Link } from "react-router-dom";

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