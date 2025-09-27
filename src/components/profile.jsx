import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from "jwt-decode"    
import { useLocation } from "react-router-dom";
import TeacherProfile from "./teacherProfile";
import AdminProfile from "./adminProfile";
import UserProfile from "./userProfile";
import Logo from '../images/LogoOfEnglish.jpg'
import { GiStaryu } from "react-icons/gi";
import { HiOutlineMenu } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

const Profile = () => {
    const navigate = useNavigate('')
    const location = useLocation();
    const email = location.state?.email;
    // const [menuOpen, setMenuOpen] = useState(false);
    
    const token = localStorage.getItem("token");
    let decodedToken = null;
    let isAdmin = false; 
    let isTeacher = false; 

    if(token){
        console.log("Stored token:", token);
        try{
            decodedToken = jwtDecode(token);
            console.log("Decoded token:", decodedToken);
            isAdmin = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin';
            isTeacher = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Teacher';
        }catch(error){
            console.error("Error decoding token:", error.message);
        }
    }
    const handleLogout = async (e) => {
        e.preventDefault();
        try{
            await axios.post("https://localhost:7186/api/Auth/logout", {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            localStorage.removeItem("token");
            navigate("/login");
        }catch(error){
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    }
    return(
        <div className='container_profile'>
            <div className="header-background">
            {decodedToken ? (
                <>
                    {email ? (
                        isAdmin ? (<AdminProfile/>) : (<UserProfile/> && isTeacher ? (<TeacherProfile/>) : (<UserProfile/>))
                    ) : (
                        <div>
                            <p className='welcome-text'>Email not provided.</p>
                            <button onClick={handleLogout}>Go to Login</button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <p>Token not decoded</p>
                </>
            )}
            </div>
        </div>
    );
}
export default Profile;