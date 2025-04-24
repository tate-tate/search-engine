import Wrapper from "../components/wrapper";
import AuthForm from "../components/Authform";
import '../styles/Register.css';

const Register = () => {
    return(
        <Wrapper>
            <h1>Register</h1>
            <AuthForm isRegister={true}/>
        </Wrapper>
    );
}
export default Register;