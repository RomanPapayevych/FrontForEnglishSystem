import React, { useState } from "react";
import axios from "axios";
import { useNavigate,useNavigation,Link} from 'react-router-dom';
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";


const Registration = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try{
            const response = await axios.post("https://localhost:7186/api/Auth/register", {firstName, lastName, email, phoneNumber, password, confirmPassword});
            if(response.status === 200){
                setSuccess('User registered!');
                setTimeout(() => {navigate('/login');}, 1000) 
            }
        }catch(error){
            console.error("Login failed:", error.response ? error.response.data : error.message)
        }
    }
    
    return(
        <div className="login-background">
            <div className="background-blur"></div>
            <div className="login_frame">
                <h1>Registration</h1>
                <form onSubmit={handleSubmit}>
                    <div className="login-input">
                        <IoPersonOutline className="login-icons" />
                        <input className="inp" value={firstName} onChange={(e) => setFirstName(e.target.value)} type="name" required placeholder="Fist Name"/>
                    </div>
                    <div className="login-input">
                        <IoPersonOutline className="login-icons" />
                        <input className="inp" value={lastName} onChange={(e) => setLastName(e.target.value)} type="name" required placeholder="Last Name"/>
                    </div>
                    <div className="login-input">
                        <MdOutlineEmail className="login-icons" />
                        <input className="inp" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email"/>
                    </div>
                    <div className="login-input">
                        <LuPhone className="login-icons"/>
                        <input className="inp" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="phone" required placeholder="Phone Number"/>
                    </div>
                    <div className="login-input">
                        <TbLockPassword className="login-icons" />
                        <input className="inp" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password"/>
                    </div>
                    <div className="login-input">
                        <GiConfirmed className="login-icons"/>
                        <input className="inp" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required placeholder="Confirm Password"/>
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p className="login-p">Do you have an account?</p>
                <Link to="/login"> login </Link>
                {errorMessage && <p>{errorMessage}</p>}
            </div>
        </div>
    );
    }
    export default Registration;