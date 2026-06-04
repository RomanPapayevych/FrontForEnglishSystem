import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GrSchedule } from "react-icons/gr";
import { MdOutlineSchedule } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { GrSchedules } from "react-icons/gr";

const TeacherManagement = () => {
    const token = localStorage.getItem('token');

    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`https://localhost:7186/api/Teacher/AvaibleGroups`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const cleanedGroups = response.data.$values.map(group => ({
                    id: group.id,
                    name: group.name,
                    startTime: group.startTime,
                    endTime: group.endTime,
                    startTimeOfLesson: group.startTimeOfLesson,
                    endTimeOfLesson: group.endTimeOfLesson,
                    englishLevel: group.englishLevel,
                    teacher: group.teacher,
                    daysOfWeek: group.daysOfWeek.$values,
                }));
                setGroups(cleanedGroups);
            } catch (error) {
                console.error("Error fetching groups:", error.response?.data || error.message);
                setMessage(error.response?.data?.message || "Failed to load available groups.");
            }
        };
        fetchGroups();
    }, [token]);

    const AssignTeacherForGroup = async (groupId) => {
        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            await axios.post(
                `https://localhost:7186/api/Teacher/AssignTeacherForGroup`,
                { groupId, teacherId: userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Group assigned successfully.");
            setGroups((prevGroups) => prevGroups.filter((g) => g.id !== groupId));
        } catch (error) {
            console.error("Error assigning group:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Could not assign this group.");
        }
    };

    const formatDate = (value) => new Date(value).toLocaleDateString("uk-UA");
    const formatTime = (value) =>
        new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="teacher-dashboard__content teacher-available-page">
            <header className="teacher-available-page__header">
                <h1 className="teacher-available-page__title">Available Groups</h1>
                <p className="teacher-available-page__subtitle">Choose a group to teach</p>
            </header>

            {message && (
                <p className="teacher-available-page__message" role="status">{message}</p>
            )}

            {groups.length > 0 ? (
                <ul className="teacher-available-page__list">
                    {groups.map((group) => (
                        group ? (
                            <li key={group.id} className="teacher-available-page__card">
                                <div className="teacher-available-page__body">
                                    <div className="teacher-available-page__title-row">
                                        <h2 className="teacher-available-page__group-name">
                                            {group.name || "Unnamed group"}
                                        </h2>
                                        {group.englishLevel && (
                                            <span className="teacher-dashboard__level-badge">
                                                {group.englishLevel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="teacher-available-page__meta-grid">
                                        <div className="teacher-available-page__meta-item">
                                            <GrSchedule className="teacher-available-page__meta-icon" aria-hidden />
                                            <div>
                                                <span className="teacher-available-page__meta-label">Period</span>
                                                <span className="teacher-available-page__meta-value">
                                                    {formatDate(group.startTime)} - {formatDate(group.endTime)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="teacher-available-page__meta-item">
                                            <MdOutlineSchedule className="teacher-available-page__meta-icon" aria-hidden />
                                            <div>
                                                <span className="teacher-available-page__meta-label">Lesson time</span>
                                                <span className="teacher-available-page__meta-value">
                                                    {formatTime(group.startTimeOfLesson)} - {formatTime(group.endTimeOfLesson)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="teacher-available-page__meta-item">
                                            <GrSchedules className="teacher-available-page__meta-icon" aria-hidden />
                                            <div>
                                                <span className="teacher-available-page__meta-label">Schedule</span>
                                                <span className="teacher-available-page__meta-value">
                                                    {Array.isArray(group.daysOfWeek)
                                                        ? group.daysOfWeek.join(", ")
                                                        : "-"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="teacher-available-page__meta-item">
                                            <RxPerson className="teacher-available-page__meta-icon" aria-hidden />
                                            <div>
                                                <span className="teacher-available-page__meta-label">Teacher</span>
                                                <span className="teacher-available-page__meta-value">
                                                    {group.teacher
                                                        ? `${group.teacher.firstName} ${group.teacher.lastName}`
                                                        : "Not assigned"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="group-details-page__btn group-details-page__btn--primary teacher-available-page__submit"
                                    onClick={() => AssignTeacherForGroup(group.id)}
                                >
                                    Choose
                                </button>
                            </li>
                        ) : null
                    ))}
                </ul>
            ) : (
                <div className="teacher-dashboard__empty">
                    <p>No available groups right now.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;

