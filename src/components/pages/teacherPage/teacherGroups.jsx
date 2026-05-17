import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import { AiOutlineSchedule } from "react-icons/ai";
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
    }, [token]);

    const formatTime = (value) =>
        new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const formatDateRange = (start, end) =>
        `${new Date(start).toLocaleDateString("uk-UA")} - ${new Date(end).toLocaleDateString("uk-UA")}`;

    return(
        <div className='content teacher-dashboard__content'>
            <p className="dashboard-greet teacher-dashboard__greet">
                Hello, {user?.firstName || 'Teacher'} &#128075;
            </p>

            {groups.length > 0 ? (
                <div className="teacher-grid teacher-dashboard__grid">
                    {groups.map((group) => ( group ? (
                        <article
                            key={group.id}
                            className='teacher-card teacher-dashboard__card'
                            onClick={() => GroupDetails(group)}
                            onKeyDown={(e) => e.key === 'Enter' && GroupDetails(group)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className='teacher-card-time-container teacher-dashboard__time'>
                                <MdAccessTime size={28} aria-hidden />
                                <span className='teacher-dashboard__time-value'>
                                    {formatTime(group.startTimeOfLesson)}
                                </span>
                            </div>

                            <div className='teacher-card-items-container teacher-dashboard__card-body'>
                                <div className='teacher-dashboard__card-top'>
                                    <h3 className='teacher-h teacher-dashboard__group-name'>
                                        {group.name || "No name available"}
                                    </h3>
                                    {group.englishLevel && (
                                        <span className='teacher-dashboard__level-badge'>
                                            {group.englishLevel}
                                        </span>
                                    )}
                                </div>

                                <div className='teacher-dashboard__card-meta'>
                                    <p className='teacher-dashboard__schedule'>
                                        <AiOutlineSchedule className='teacher-dashboard__meta-icon' aria-hidden />
                                        {Array.isArray(group.daysOfWeek)
                                            ? group.daysOfWeek.join(', ')
                                            : 'No schedule'}
                                    </p>
                                    <p className='teacher-dashboard__dates'>
                                        {formatDateRange(group.startTime, group.endTime)}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ) : null
                    ))}
                </div>
            ) : (
                <p className="teacher-dashboard__empty">No groups yet.</p>
            )}
        </div>
    );
}

export default TeacherGroups;
