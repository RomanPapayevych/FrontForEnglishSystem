import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import {jwtDecode} from "jwt-decode" 
import './userProfile.css'
import Header from './pages/headerComponent/header'
import { HiOutlineMenu } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { GiStaryu } from "react-icons/gi";


const UserProfile = () => {
    const navigate = useNavigate('')   
    const location = useLocation('')
    const email = location.state?.email
    const id = location.state?.id
    const token = localStorage.getItem("token");
    const [levels, setLevels] = useState([]);
    const [message, setMessage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const checkUserGroup = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

                const response = await axios.get(`https://localhost:7186/api/Student/MyGroup/${userId}`,{
                        headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200 && response.data) {
                    navigate("/myGroup", { state: { email, id, groupId: response.data.id } });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No group found, user can select English level.");
                } else {
                    console.error("Error checking user group:", error);
                }
            }
        };
        checkUserGroup()

        const fetchLevels = async () => {
            try{
                const response = await axios.get(`https://localhost:7186/api/Admin/AllLevels`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log("Fetched levels:", response.data);
                console.log("Received id:", id);
                setLevels(response.data.$values)
            }catch(error){
                console.error("Error creating level:", error);
                setMessage("Failed to fetch levels.");
            }
        }
        fetchLevels();
    }, [])
    
    const handleEnglish = async (englishLevelId) => {
        let decodedToken = null;
        decodedToken = jwtDecode(token);
        const userId = decodedToken[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`]  

        try{
            const response = await axios.post(`https://localhost:7186/api/Student/SetEnglishLevel`, {userId: parseInt(userId), englishLevelId}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage(response.data.message || "English level set successfully!");
            setTimeout(() => navigate("/userGroups", {state: {email, id, englishLevelId}}))
        }catch(error){
            console.error("Error setting English level:", error.response?.data || error.message);
            setMessage(error.response?.data?.errors?.[0]?.description || "Failed to set English level.");
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
            navigate("/");
        }catch(error){
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    }

    return(
    <div className="english-level-container">
    <Header token = {token}></Header>
    <div className='position-container'>
        <h2 className='english-level-container-h2'>Select Your English Level</h2>
    </div>
        {levels.length > 0 ? (
            <div className='levels-grid'>
                {levels.map((lvl) => (
                    <div className="level-card" key={lvl.id}>
                        <div className="level-content">
                            <div className='level-image'>
                                <p className='image-p'>{lvl.imageUrl && <img src={`https://localhost:7186${lvl.imageUrl}`} alt='Level' />}</p>
                            </div>
                            <div className="level-description">
                                <h3 className='title-level'>{lvl.level}</h3>
                                <p className='description-p'>{lvl.description}</p>
                                <button onClick={() => handleEnglish(lvl.id)} className="select-button">Choose</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div>
                <p>Problem..</p>
            </div>
        )}
    </div>
    );
}
export default UserProfile;