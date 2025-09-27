import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            const response = await axios.post("https://localhost:7186/api/Auth/login", {email, password})
            const token = response.data;
            localStorage.setItem("token", token);

            const id = response.data;
            localStorage.setItem("id", id)
            console.log(("id:", id));
            navigate('/profile', {state: {email, id}});
            console.log("Login successful:", response.data.message);
        }catch(error){
            setErrorMessage("Invalid email or password");
            console.error("Login failed:", error.response ? error.response.data : error.message);
        }finally{
            setLoading(false)
        }
    }
    
    return(
        <div className="login-background">
            <div className="background-blur"></div>
            <div className="login_frame">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="login-input">
                    <MdOutlineEmail className="login-icons" />
                    <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/>
                </div>
                <div className="login-input">
                    <TbLockPassword className="login-icons" />
                    <input className="inp" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password"/>
                </div>
                <button type="submit">Login</button>
            </form>
            {loading && <div className="loader"></div>}
            <p className="login-p">Don't have an account?</p>
            <Link to="/registration"> registration </Link>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
}
export default Login;