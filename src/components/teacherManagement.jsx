import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const TeacherManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, id} = location.state || {};
    const token = localStorage.getItem('token');

    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        const Groups = async () => {
            try{
                //const decodedToken = jwtDecode(token);
                //const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                const response = await axios.get(`https://localhost:7186/api/Teacher/AvaibleGroups`, {
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
            }
        }
        Groups()
    },[token])

    const AssignTeacherForGroup = async (groupId) => {
        try{
            const decodedToken = jwtDecode(token);
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const response = await axios.post(`https://localhost:7186/api/Teacher/AssignTeacherForGroup`, {groupId, teacherId: userId}, {
                headers: {Authorization: `Bearer ${token}`}
            })
            console.log("You choosen group successfully:", response.data);
            setMessage("You choosen successfully.");
            setGroups((prevGroups) => prevGroups.filter((g) => g.id !== groupId));
        }catch(error){
            console.error("Error choosing the group:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "An error occurred while choosen the group.");
        }
    }
    const formatDisplayTime = (dateTime) => {
        const formattedDate = new Date(dateTime);
        return formattedDate.toLocaleDateString("uk-UA");
    };
    const goBack = () => {
        navigate("/profile", {state: {email, id}})
    }
    return(
        <div className='content'>
            {/* <button onClick={goBack} className="go-back-button">go back</button> */}
            <h2>Available Groups</h2>
            {groups.length > 0 ? (
            <div className="user-grid">
                {groups.map((group) => ( group ? (
                    <div key={group.id} className='my-card'>
                        <h2>{group.name || "No name available"}</h2>
                        <p>Duration of studying: <strong>{formatDisplayTime(group.startTime)} - {formatDisplayTime(group.endTime)}</strong></p>
                        <p>Duration of Lesson: <strong>{new Date(group.startTimeOfLesson).toLocaleTimeString()} - {new Date(group.endTimeOfLesson).toLocaleTimeString()}</strong></p>
                        <p>English Level: <strong>{group.englishLevel}</strong></p>
                        <p>Teacher: <strong>{group.teacher ? `${group.teacher.firstName} ${group.teacher.lastName}` : 'No teacher assigned'}</strong></p>
                        <p>Days of Week: <strong>{Array.isArray(group.daysOfWeek) ? group.daysOfWeek.join(', ') : 'No days available'}</strong></p>
                        <button className='btn' onClick={() => AssignTeacherForGroup(group.id)}>Choose group for teaching</button>
                    </div>
                ) : null
                ))}
            </div>
            ) : (
                <p>No groups created yet.</p>
            )}
        </div>
    )
}
export default TeacherManagement