import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./teacherProfile.css";
import { FiBox } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";
import { MdPlayLesson } from "react-icons/md";
import { IoPerson } from "react-icons/io5"; 
import AccountTab from '../personalRoom/accountTab';
import TeacherGroups from './teacherGroups';
import TeacherManagement from "./teacherManagement";
// import MyGroups from './myGroups';
// import Modal from '../modalWindow/modal';
// import GroupDetails from './groupDetails';
// import EditLesson from './editLesson';
// import MyGroups from '../personalRoom/myGroup';

const TeacherProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, id} = location.state || {};
    const token = localStorage.getItem('token');
    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');

    const [activeTab, setActiveTab] = useState("myGroups");

    const [students, setStudents] = useState([]);
    const [selectedGroupName, setSelectedGroupName] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [user, setUser] = useState([]);

    useEffect(() => {
    const ChoosenGroups = async () => {
        try{
            const decodedToken = jwtDecode(token);
            const teacherId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            const response = await axios.get(`https://localhost:7186/api/Teacher/teacher/${teacherId}/groups`, {
                headers: {Authorization: `Bearer ${token}`}
            })
            const cleanedGroups = response.data.$values.map(group => ({
                id: group.id,
                name: group.name,
                startTime: group.startTime,
                endTime: group.endTime,
                startTimeOfLesson: group.startTimeOfLesson,
                endTimeOfLesson: group.endTimeOfLesson,
                englishLevelId: group.englishLevelId,
                englishLevel: group.englishLevel,
                teacher: group.teacher,
                daysOfWeek: group.daysOfWeek.$values,
            }))
            setGroups(cleanedGroups)
            setMessage("Groups retrived Successfull")
            }catch(error){
                console.error("Error choosing the group:", error.response?.data || error.message);
                setMessage(error.response?.data?.message || "An error occurred while choosen the group.");
            }
        }
        ChoosenGroups();
        fetchUser();
    }, []);

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

    const RemoveTeacherFromGroup = async (groupId) => {
        if (!groupId) {
            setMessage("Group ID is missing. Please refresh the page.");
            return;
        }
        
        try{
            const response = await axios.delete(`https://localhost:7186/api/Teacher/${groupId}/RemoveTeacherFromGroup`, {
                headers : {Authorization : `Bearer ${token}`}, 
            });
            console.log("You left the group successfully:", response.data);
            setMessage("You have successfully left the group.");
        }catch(error){
            console.error("Error leaving the group:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
        }
    }
    const ShowStudentsOfGroup = async (groupId, groupName) => {
        if (!groupId) {
            setMessage("Group ID is missing. Please refresh the page.");
            return;
        }
        try{
            const response = await axios.get(`https://localhost:7186/api/Teacher/${groupId}/GetStudentsFromGroup`, {
                headers : {Authorization : `Bearer ${token}`}, 
            });
            console.log("You retrieved list of students successfully:", response.data);
            setMessage("ou retrieved list of students successfully.");
            setStudents(response.data.$values);
            setSelectedGroupName(groupName)
            setIsModalOpen(true);
        }catch(error){
            console.error("Error leaving the group:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
        }
    }

    const formatDisplayTime = (dateTime) => {
        const formattedDate = new Date(dateTime);
        return formattedDate.toLocaleDateString("uk-UA");
    };
   
    const Groups = async () => {
        navigate("/teacherManagement", {state: {email, id}})
    }
    
    // const ChoosenGroups = async () => {
    //     navigate("/teacherGroups", {state: {email, id}})
    // }
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

    const renderContent = () => {
        switch(activeTab){
            case "myGroups": 
                return <TeacherGroups 
                    user={user}
                    setIsModalOpen={setIsModalOpen}/>;
            case "teacherManagement":
                return <TeacherManagement />;
            case "account":
                return <AccountTab handleLogout={handleLogout} user={user}/>;
            default:
                return <p>Select a tab to view details.</p>;
        }
    }

    return(
        <div className="dashboard">           
            <div className='content-container'>
                <div className='navbar'>
                    <ul className='navbar-content'>
                        <h2 className='navbar-greeting'><FiBox /> Hi, {email}</h2>
                    </ul>
                    <ul className='navbar-content'>
                        <li className={activeTab === 'myGroups' ?  "active" : ""} onClick={() => setActiveTab("myGroups")}><MdSpaceDashboard className='sidebarItems'/>My Groups</li>
                        <li className={activeTab === 'teacherManagement' ?  "active" : ""} onClick={() => setActiveTab("teacherManagement")}><FaLayerGroup className='sidebarItems'/>Avaible groups</li>
                        <li className={activeTab === 'account' ?  "active" : ""} onClick={() => setActiveTab("account")}><IoPerson className='sidebarItems'/>Account</li>
                    </ul>
                </div>
            </div>
            <div key={activeTab} className="content page-enter">
                {renderContent()}
            </div>   
        </div>
    );
}
export default TeacherProfile;