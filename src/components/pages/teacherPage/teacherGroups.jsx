import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import GroupDetails from './groupDetails';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

import { AiOutlineSchedule } from "react-icons/ai";
import { LiaLanguageSolid } from "react-icons/lia";
import { MdAccessTime } from "react-icons/md";

const TeacherGroups = ({user}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};
    const token = localStorage.getItem('token');
    const [groups, setGroups] = useState([]);

    const GroupDetails = async (group) => {
        navigate("/groupDetails", {state: {email, group}})
    }

    useEffect(() => {
        const fetchGroups = async () => {
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
                }catch(error){
                    console.error("Error choosing the group:", error.response?.data || error.message);
                }
            }
    
        fetchGroups();
    }, []);

    return(
        <div className='content'>
            <p className="dashboard-greet">Hello, {user.firstName} &#128075;</p>
            <div>
                {groups.length > 0 ? (
                    <div className="teacher-grid">
                        {groups.map((group) => ( group ? (
                            <div key={group.id} className='teacher-card' onClick={() => GroupDetails(group)}>
                                <div className='teacher-card-time-container'>
                                    <div className='margin-center-container'>
                                        <MdAccessTime size={60}/>
                                        <p className='teacher-p'>{new Date(group.startTimeOfLesson).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                    </div>
                                </div>
                               
                                <div className='teacher-card-items-container'>
                                    <div className='container-space-btw'>
                                        <div>
                                            <h3 className='teacher-h'>{group.name || "No name available"}</h3>
                                        </div>
                                        <div className='align-container'>
                                            {/* <LiaLanguageSolid size={30}/> */}
                                            <p className='shimmer teacher-p'>{group.englishLevel}</p>
                                        </div>
                                    </div>
                                    <div className='container-space-btw'>
                                        <div className='align-container'>
                                            <AiOutlineSchedule  className='custom-icon'/>
                                            <p className='teacher-p'>{Array.isArray(group.daysOfWeek) ? group.daysOfWeek.join(', ') : 'No days available'}</p>
                                        </div>
                                        <div className='align-container'>
                                            <p className='teacher-p'>{new Date(group.startTime).toLocaleDateString()} - {new Date(group.endTime).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        ) : null
                        ))}
                    </div>
                ) : (
                    <p>No groups created yet.</p>
                )}

                {/* {isModalOpen && (
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
                )} */}
            </div>  
        </div> 
    );
}

export default TeacherGroups;