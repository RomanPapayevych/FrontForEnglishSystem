import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { FaLayerGroup } from "react-icons/fa";
import { MdPlayLesson } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import Swal from 'sweetalert2'
import image from '../images/Photo8.jpg'

const MyGroup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, id, groupId: initialGroupId} = location.state || {};
    const token = localStorage.getItem('token');
    const [groupId, setGroupId] = useState(initialGroupId);
    const [myGroup, setMyGroup] = useState();
    const [lessons, setLessons] = useState([]);
    const [message, setMessage] = useState('');

    const [activeTab, setActiveTab] = useState("myGroup");

    useEffect(() => {
        if (groupId) {
            fetchGroupId(groupId);
            fetchLessons()
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
            background: '#11212D',
            color: 'white',
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

    const renderContent = () => {
        if(activeTab === "myGroup") {
            return(
                <div className="my-card">
                    {myGroup ? (
                    <div>
                        <h2><strong>{myGroup.name}</strong></h2>
                        <div>
                            <p>Duration of styding: <strong>{new Date(myGroup.startTime).toLocaleDateString()} - {new Date(myGroup.endTime).toLocaleDateString()}</strong></p>
                            <p>Duration of Lesson: <strong>{new Date(myGroup.startTimeOfLesson).toLocaleTimeString()} - {new Date(myGroup.endTimeOfLesson).toLocaleTimeString()}</strong></p>
                            <p>EnglishLevel: <strong>{myGroup.englishLevel}</strong></p>
                            <p>Teacher: <strong>{myGroup.teacher ? `${myGroup.teacher.firstName} ${myGroup.teacher.lastName}` : 'No teacher assigned'}</strong></p>
                            <p>Days of Week: <strong>{Array.isArray(myGroup.daysOfWeek.$values) ? myGroup.daysOfWeek.$values.join(', ') : 'No days available'}</strong></p>
                        </div>  
                    </div>
                    ): (
                        <p>Loading group information...</p>
                    )}
                    <button onClick={LeaveGroup} className="btn">Leave group</button>
                </div>
            );
        } else if(activeTab === "Lessons"){
            return(
                <div className="lessons">
                    {Array.isArray(lessons) && lessons.length > 0 ? (
                        <div>
                            {lessons.map((lesson) => (
                                <div className="lesson-card" key={lesson.id}>
                                    <p className='lesson-date'>{new Date(lesson.date).toLocaleDateString()}</p>
                                    <p>{lesson.topic}</p>
                                    <p>{lesson.description}</p>
                                    {Array.isArray(lesson.homework) && lesson.homework.length > 0 ? (
                                        <ul>
                                            <p className='lesson-homework'>Homework:</p>
                                            {lesson.homework.map((hw) => (
                                                <div key={hw.id}>
                                                    <p>{hw.content}</p>
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className='no-homework'>No homework yet</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ):(
                         <div className='not-found-container'>
                            <div className='not-found-content'>
                                <img className='not-found-image' src={image} alt="" />
                            </div>
                            <div className='not-found-content'>
                                <h3 className='not-found'>{"No lessons yet :("}</h3>
                            </div>
                            <p className='description-p'>New lessons coming soon!</p>
                        </div>
                    )}
                </div>
            );
        } else if(activeTab === 'Account') {
            return (
                <div className="account">
                    <p>Person</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            );
        } else {
            return <p>Select a tab to view details.</p>;
        }
    }
    return (
        <div className="dashboard">
            <div className="sidebar">
                <h2>My App</h2>
                <ul>
                    <li className={activeTab === 'myGroup' ?  "active" : ""} onClick={() => setActiveTab("myGroup")}><FaLayerGroup className='sidebarItems'/>My Group</li>
                    <li className={activeTab === 'Lessons' ?  "active" : ""} onClick={() => setActiveTab("Lessons")}><MdPlayLesson className='sidebarItems'/>Lessons</li>
                    <li className={activeTab === 'Account' ?  "active" : ""} onClick={() => setActiveTab("Account")}><IoPerson className='sidebarItems'/>Account</li>
                </ul>
            </div>
            <div className="content">
                {renderContent()}
            </div>   
        </div>
    );
};

export default MyGroup;