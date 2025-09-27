import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./teacherProfile.css";
import TeacherManagement from "./teacherManagement";

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
        ChoosenGroups()
    })

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
    const GroupDetails = async (group) => {
        navigate("/groupDetails", {state: {email, group}})
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
        if(activeTab === "myGroups") {
            return(
                <div className='content'>
                    <h1>Hello Teacher</h1>
                    <div>
                        {groups.length > 0 ? (
                            <div className="user-grid">
                                {groups.map((group) => ( group ? (
                                    <div key={group.id} className='user-card' onClick={() => GroupDetails(group)} style={{ cursor: "pointer" }}>
                                        <p>{group.name || "No name available"} ___ {new Date(group.startTimeOfLesson).toLocaleTimeString()} - {new Date(group.endTimeOfLesson).toLocaleTimeString()} ___ {group.englishLevel}</p>
                                        <p>Days of Week: {Array.isArray(group.daysOfWeek) ? group.daysOfWeek.join(', ') : 'No days available'}</p>
                                    </div>
                                ) : null
                            ))}
                            </div>
                        ) : (
                            <p>No groups created yet.</p>
                        )}

                        {isModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
                                    <h2 style={{color: "black"}}>Students in {selectedGroupName}</h2>
                                    {students.length > 0 ? (
                                        <ol style={{ textAlign: "left", paddingLeft: "20px" }}>
                                            {students.map(student => (
                                                <li  key={student.id} style={{marginBottom: "10px", marginLeft: "20px", color: "black"}}>{student.firstName} {student.lastName} <br/>{student.phoneNumber}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p style={{color: "black"}}>No students in this group.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>  
                </div> 
            );
        }else if(activeTab === "account"){
            return(
                <div className="content">
                    <p>Person</p>
                    <button onClick={handleLogout} className='btn'>Logout</button>
                </div>
            ); 
        }else if(activeTab === "teacherManagement"){
            return <TeacherManagement/>
        }else{
            return <p>Select a tab to view details.</p>;
        }
    }

    return(
    <div className='teacher-container'>
        <div className="dashboard">
            <div className='sidebar'>
                <h2>Teacher</h2>
                <ul>
                    <li className={activeTab === 'myGroups' ?  "active" : ""} onClick={() => setActiveTab("myGroups")}>My Groups</li>
                    <li className={activeTab === 'teacherManagement' ?  "active" : ""} onClick={() => setActiveTab("teacherManagement")}>Groups</li>
                    <li className={activeTab === 'account' ?  "active" : ""} onClick={() => setActiveTab("account")}>Account</li>
                </ul>
            </div>
        </div>
        <div>
            {renderContent()}
        </div>
    </div>
    );
}
export default TeacherProfile;