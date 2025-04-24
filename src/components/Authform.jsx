import { useState, useRef , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../contexts/AuthContext";
import {useContext} from "react";
import useAuthForm from "../hooks/authFormHook";


const AuthForm = ({isRegister} = false) => {
    
    const {login} = useContext(AuthContext);
    const [data, setData] = useState({ username: "", password: "", email: ""});
    const [error, setError]= useState("");
    const [submited, setSubmited]= useState(false);
    const [successM, setSuccessM]= useState("");
    const navigate = useNavigate();
    const nameRef = useRef(null);
    useLayoutEffect(() => {
        nameRef.current.focus();
    }, []);

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmited(true);

        const formData = new FormData(e.target);
        formData.append("username", data.username.trim());
        formData.append("password", data.password.trim());
        if (isRegister) formData.append("email", data.email.trim());
        formData.append("action", isRegister ? "register" : "login");
        

        //console.log(data.image+"test");
        try{
            const response = await fetch("https://web.ics.purdue.edu/~shaverb/390final/auth.php",{
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if(data.success){
                setData({
                    username:"",
                    password: "",
                    email: "",
                });
                setSuccessM(data.success);
                login();
         
                setError("");
                navigate("/");
            }else{
                setError(data.error);
                setSuccessM("");
                console.log("success");
            }
        }
        catch(error){
            setError(error.message);
            setSuccessM("");
            console.log("success2");
        }
        finally{
            setSubmited(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <input ref={nameRef} type="text" name="username" placeholder="Userame" required value={data.username} onChange={handleChange} />
            {isRegister && <input type="email" name="email" placeholder="Email" required value={data.email} onChange={handleChange} />}
            <input type="password" name="password" placeholder="Password (min 8 char)" minLength="8" required value={data.password} onChange={handleChange} />
            <button type="submit" disabled={submited|| data.username.trim === "" || (isRegister && data.email.trim === "") ||data.password.trim === "" }>Submit</button>
            {error && <p>{error}</p>}
            {successM && <p>{successM}</p>}
        </form>
    )
}

export default AuthForm;