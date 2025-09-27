import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode" 
import image from '../images/Photo7.jpg'
import Swal from 'sweetalert2'
import { HiOutlineMenu } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";


const UserGroups = () => {
    const navigate = useNavigate('')   
    const location = useLocation('')
    const { englishLevelId, email, id } = location.state || {};
    const token = localStorage.getItem('token');    

    const [groups, setGroups] = useState([])
    const [message, setMessage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const Groups = async (englishLevelId) => {
        if (!englishLevelId) {
            console.error("EnglishLevelId is missing!");
            setMessage("Invalid English Level. Please try again.");
            return;
        }
        try{
            const response = await axios.get(`https://localhost:7186/api/Student/GetAvailableGroups/${englishLevelId}`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            console.log("Fetched groups:", response.data);
            setGroups(response.data.$values)
        }catch(error){
            console.error("Error fetching groups:", error.response?.data || error.message);
            setMessage("We couldn't find any groups yet.");
        }
    }

    const ChooseGroups = async (group) => {
        Swal.fire({
            title: 'Are you sure about your choice?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: '#11212D',
            color: 'white',
            iconColor: '#f9d835',
            confirmButtonColor: "#007718",
            cancelButtonColor: "#c20000",
            customClass: {
                popup: "my-custom-popup",
                title: "my-custom-title",
                confirmButton: "my-custom-confirm-button",
                cancelButton: "my-custom-cancel-button",
            }
        }).then(async (result) => {
            if(result.isConfirmed){
                let decodedToken = null;
                decodedToken = jwtDecode(token);
                const userId = decodedToken[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`]  
                try{
                    const response = await axios.post(`https://localhost:7186/api/Student/ChooseGroup`,{userId: parseInt(userId), groupId: group.id}, {
                        headers: {Authorization: `Bearer ${token}`}
                    })
                    console.log("Group chosen successfully:", response.data);
                    setMessage("Group successfully selected!");
                    navigate('/myGroup', {state: {email, id, group}})
                }catch(error){
                    console.error("Error fetching groups:", error.response?.data || error.message);
                    setMessage("We couldn't find any groups yet.");
                }
        }})
       
    }
    useEffect(() => {
        if (englishLevelId) {
            Groups(englishLevelId);
        }
    }, [englishLevelId]);
      
    const goBack = () => {
        navigate("/profile", {state: {email, id}})
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

    const daysOfWeekMap = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    const daysMap = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6,
    };
return(
    <div className="groups-container">
        <div className="header">
            <a href="" className="headerLogo">Blue Star</a>
                <nav className="nav-links">
                    <a href="" className="nav-item">Home</a>
                    <a href="" className="nav-item">Contact</a>
                    <a href="" className="nav-item">About</a>
                </nav>
                <div className="menu-container">
                    <button className="menu-button" onClick={() => (setMenuOpen(!menuOpen))}><HiOutlineMenu/></button>
                        {menuOpen && (
                            <div className="dropdown-menu" onMouseLeave={() => (setMenuOpen(false))}>
                                <button className="logout-button" onClick={handleLogout}>Logout<FiLogOut className="logout-icon"/></button>
                            </div>
                        )}
                </div>
        </div>
        <div className="button-back-container">
            <button onClick={goBack} className="button-back">{'<'}</button>
        </div>
        {groups.length > 0 ? (
            groups.map((group) => (
                <div className='card' key={group.id}>
                    <h2>{group.name}</h2>
                    <div className='card-p'>
                        <p>Duration of course: <strong>{new Date(group.startTime).toLocaleDateString()} - {new Date(group.endTime).toLocaleDateString()}</strong></p>
                        <p>Start Time Of Lesson: <strong>{new Date(group.startTimeOfLesson).toLocaleTimeString()} - {new Date(group.endTimeOfLesson).toLocaleTimeString()}</strong></p>
                        <p>English level: <strong>{group.englishLevel}</strong></p>
                        <p>Teacher: <strong>{group.teacher ? `${group.teacher.firstName} ${group.teacher.lastName}` : 'No teacher assigned'}</strong></p>
                        <p>Days of Week: <strong>{Array.isArray(group.daysOfWeek.$values) ? group.daysOfWeek.$values.join(', ') : 'No days available'}</strong></p>
                    </div>
                    <div className="button-container">
                        <button className="select-button-two" onClick={() => ChooseGroups(group)}>Join Group</button>
                    </div>
                </div>
            ))
        ) : (
            <div className='not-found-container'>
                <div className='not-found-content'>
                    <img className='not-found-image' src={image} alt="" />
                </div>
                <div className='not-found-content'>
                    <h3 className='not-found'>{message || "No groups available."}</h3>
                </div>
                <p className='description-p'>New groups coming soon</p>
            </div>
        )}
    </div>
)
} 
export default UserGroups;
