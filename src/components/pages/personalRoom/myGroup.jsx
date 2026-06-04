import axios from "axios";
import Swal from 'sweetalert2'

import './personalRoom.css'

import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

import { FaLayerGroup } from "react-icons/fa";
import { MdPlayLesson } from "react-icons/md";
import { MdSpaceDashboard } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { FiBox } from "react-icons/fi";

import MyGroupTab from './myGroupTab';
import LessonsTab from './lessonTab';
import DashboardTab from './dashboardTab';
import AccountTab from './accountTab';

const MyGroup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {email, id, groupId: initialGroupId} = location.state || {};
    const token = localStorage.getItem('token');
    const [groupId, setGroupId] = useState(initialGroupId);
    const [myGroup, setMyGroup] = useState();
    const [lessons, setLessons] = useState([]);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState([]);

    const [activeTab, setActiveTab] = useState("Dashboard");
    
    const [open, setOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    
    useEffect(() => {
        if (groupId) {
            fetchGroupId(groupId);
            fetchLessons();
            fetchUser();
        } else {
            fetchGroupId();
        }
    }, [groupId]);

    const fetchGroupId = async () => {
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const response = await axios.get(`https://localhost:7186/api/Student/MyGroup/${userId}`,{
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.status === 200 && response.data) {
                setMessage("Group ID fetched successfully.");
                setMyGroup(response.data)
                console.log("Group data: ", response.data)
                setGroupId(response.data.id);
            }
        } catch (error) {
            console.error("Error fetching group ID:", error.response?.data || error.message);
            setMessage("Failed to fetch group ID.");
        }
    };

    const fetchLessons = async () => {
        try {            
            const response = await axios.get(`https://localhost:7186/api/Student/${groupId}/GetLesson`,{
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const cleanedLessons = response.data.$values.map(lesson => ({
                id: lesson.id,
                date: lesson.date,  
                topic: lesson.topic,
                description: lesson.description,
                homework: lesson.homework.$values,
            }))
            console.log("Lessons data: ", response.data)
            setLessons(cleanedLessons)
        } catch (error) {
            console.error("Error fetching lessons:", error.response?.data || error.message);
            setMessage("Failed to fetch lessons.");
        }
    };

    const LeaveGroup = async () => {
        Swal.fire({
            title: 'Do you really want to leave from group?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: '#fff',
            color: 'black',
            iconColor: '#c20000',
            confirmButtonColor: "#c20000",
            cancelButtonColor: "#007718",
            customClass: {
                popup: "my-custom-popup",
                title: "my-custom-title",
                confirmButton: "my-custom-confirm-button",
                cancelButton: "my-custom-cancel-button",
            }
        }).then(async (result) => {
            if(result.isConfirmed){
                if (!groupId) {
                    setMessage("Group ID is missing. Please refresh the page.");
                    return;
                }
                const decodedToken = jwtDecode(token);
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                try {
                    const response = await axios.delete(`https://localhost:7186/api/Student/${groupId}/GetOut/${userId}`,{
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    console.log("You left the group successfully:", response.data);
                    setMessage("You have successfully left the group.");
                    navigate('/profile', { state: { email, id } });
                } catch (error) {
                    console.error("Error leaving the group:", error.response?.data || error.message);
                    setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
                }
            }
        })
        
    };

    const handleLogout = async () => {
        try {
            await axios.post("https://localhost:7186/api/Auth/logout", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    };

    const fetchUser = async () => {
        try{
            const decoded = jwtDecode(token);
            const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const response = await axios.get(`https://localhost:7186/api/Student/GetUserById/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User data: ", response.data)
            setUser(response.data);
        }catch(error){
            console.error("User not found:", error.response ? error.response.data : error.message);
        }
    }

    const renderContent = () => {
        switch(activeTab){
            case 'myGroup': 
                return <MyGroupTab myGroup={myGroup} LeaveGroup={LeaveGroup}/>
            case 'Lessons': 
                return(
                    <LessonsTab 
                        lessons={lessons}
                        open={open} 
                        setOpen={setOpen}
                        selectedLesson={selectedLesson}
                        setSelectedLesson={setSelectedLesson}
                        zoomLink={myGroup?.zoomLink}
                    />
                );
            case 'Dashboard': 
                return(
                    <DashboardTab user={user}/>
                );

            case 'Account': 
                return(
                    <AccountTab handleLogout={handleLogout} user={user}/>
                );
            default: 
                return <p>Select a tab</p>;
        }
    };

    return (
        <div className="dashboard">           
            <div className='content-container'>
                <div className='navbar'>
                    <ul className='navbar-content'>
                        <h2 className='navbar-greeting'><FiBox /> Hi, {email}</h2>
                    </ul>
                    <ul className='navbar-content'>
                        <li className={activeTab === 'Dashboard' ?  "active" : ""} onClick={() => setActiveTab("Dashboard")}><MdSpaceDashboard className='sidebarItems'/>Dashboard</li>
                        <li className={activeTab === 'myGroup' ?  "active" : ""} onClick={() => setActiveTab("myGroup")}><FaLayerGroup className='sidebarItems'/>My Group</li>
                        <li className={activeTab === 'Lessons' ?  "active" : ""} onClick={() => setActiveTab("Lessons")}><MdPlayLesson className='sidebarItems'/>Lessons</li>
                        <li className={activeTab === 'Account' ?  "active" : ""} onClick={() => setActiveTab("Account")}><IoPerson className='sidebarItems'/>Account</li>
                    </ul>
                </div>
            </div>
            <div key={activeTab} className="content page-enter">
                {renderContent()}
            </div>   
        </div>
    );
};

export default MyGroup;