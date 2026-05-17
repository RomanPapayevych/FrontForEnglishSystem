import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { GrSchedule } from "react-icons/gr";
import { MdOutlineSchedule } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { GrSchedules } from "react-icons/gr";

const GroupDetails = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const { email, id} = location.state || {};
    const { group } = location.state || {};
    const token = localStorage.getItem('token');
    const [lessons, setLessons] = useState([]);
    const [message, setMessage] = useState('');

    const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [content, setContent] = useState('');

    const [isEditHomeworkModalOpen, setIsEditHomeworkModalOpen] = useState(false);
    const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        if (group?.id) {
            const fetchLessons = async () => {
                try {
                    const response = await axios.get(`https://localhost:7186/api/Teacher/LessonsOfGroup/${group.id}`,{ 
                        headers: { Authorization: `Bearer ${token}` } 
                    });
                    const cleanedLessons = response.data.$values.map(lesson => ({
                        id: lesson.id,
                        date: lesson.date,  
                        topic: lesson.topic,
                        description: lesson.description,
                        homework: lesson.homework.$values,
                    }))
                    setLessons(cleanedLessons);
                } catch (error) {
                    console.error("Error fetching lessons:", error.response?.data || error.message);
                    setMessage("An error occurred while fetching lessons.");
                }
            };
            fetchLessons();
        }
    }, [group, token]);

    const RemoveTeacherFromGroup = async (groupId) => {
        if (!groupId) {
            setMessage("Group ID is missing. Please refresh the page.");
            return;
        }
        try{
            await axios.delete(`https://localhost:7186/api/Teacher/${groupId}/RemoveTeacherFromGroup`, {
                headers : {Authorization : `Bearer ${token}`}, 
            });
            navigate("/profile", {state: {email, id}})
        }catch(error){
            console.error("Error leaving the group:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
        }
    }

    const deleteLesson = async (lessonId) => {
        if(!lessonId) return;
        try{
            await axios.delete(`https://localhost:7186/api/Teacher/${lessonId}/RemoveLesson`, {
                headers : {Authorization : `Bearer ${token}`}, 
            });
            setLessons((prevLessons) => prevLessons.filter((l) => l.id !== lessonId));
            setMessage("Lesson deleted successfully.");
        }catch(error){
            console.error("lesson not deleted: ", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Lesson not deleted");
        }
    }

    const openHomeworkModal = (lessonId) => {
        setSelectedLessonId(lessonId);
        setIsHomeworkModalOpen(true);
    };
    const closeHomeworkModal = () => {
        setIsHomeworkModalOpen(false);
        setSelectedLessonId(null);
        setContent('');
    };

    const openEditHomeworkModal = (homeworkId, currentContent) => {
        setSelectedHomeworkId(homeworkId);
        setEditContent(currentContent);
        setIsEditHomeworkModalOpen(true);
    }
    const closeEditHomeworkModal = () => {
        setIsEditHomeworkModalOpen(false);
        setSelectedHomeworkId(null);
        setEditContent('');
    };

    const addHomework = async () => {
        if (!selectedLessonId) {
            setMessage("Please provide valid homework description.");
            return;
        }
        try{
            const response = await axios.post(`https://localhost:7186/api/Teacher/${selectedLessonId}/Homework`, { content }, {
                headers : {Authorization : `Bearer ${token}`}, 
            })
            const newHomework = response.data;
            setLessons((prevLessons) =>
                prevLessons.map((lesson) =>
                    lesson.id === selectedLessonId
                        ? { ...lesson, homework: [...lesson.homework, newHomework] }
                        : lesson
                )
            );
            setMessage("Homework created successfully.");
            closeHomeworkModal();
        }catch(error){
            console.error("Homework not added: ", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Homework not added");
        }
    }

    const deleteHomework = async (homeworkId, lessonId) => {
        try{
            await axios.delete(`https://localhost:7186/api/Teacher/${homeworkId}/RemoveHomework`, {
                headers : {Authorization : `Bearer ${token}`}, 
            })
            setLessons((prevLessons) => prevLessons.map((lesson) => lesson.id === lessonId ? {...lesson, homework: lesson.homework.filter((hw) => hw.id !== homeworkId)}: lesson))
            setMessage("Homework deleted.");
        }catch(error) {
            console.error("Homework not deleted: ", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Homework not deleted")
        }
    }

    const updateHomework = async () => {
        try{
            await axios.put(`https://localhost:7186/api/Teacher/${selectedHomeworkId}/UpdateHomework`, {content: editContent }, {
                headers : {Authorization : `Bearer ${token}`}, 
            })
            setLessons(prevLessons => 
                prevLessons.map(lesson => ({
                    ...lesson,
                    homework: lesson.homework.map(hw =>
                        hw.id === selectedHomeworkId ? { ...hw, content: editContent } : hw
                    )
                }))
            );
            setMessage("Homework updated successfully.");
            closeEditHomeworkModal();
        }catch(error) {
            console.error("Homework not changed: ", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Homework not changed")
        }
    }

    const goBack = () => {
        navigate("/profile", {state: {email, id}})
    }

    const formatDate = (value) => new Date(value).toLocaleDateString("uk-UA");
    const formatTime = (value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return(
        <div className="group-details-page">
            <header className="group-details-page__topbar">
                <button type="button" onClick={goBack} className="group-details-page__back" aria-label="Go back">
                    <IoIosArrowBack size={22} />
                    <span>Back</span>
                </button>
                {message && <p className="group-details-page__toast" role="status">{message}</p>}
            </header>

            <div className="group-details-page__layout">
                <aside className="group-details-page__sidebar">
                    <h1 className="group-details-page__title">{group?.name}</h1>
                    <ul className="group-details-page__meta">
                        <li>
                            <GrSchedule className="group-details-page__meta-icon" aria-hidden />
                            <div>
                                <span className="group-details-page__meta-label">Study period</span>
                                <span className="group-details-page__meta-value">
                                    {formatDate(group?.startTime)} вЂ“ {formatDate(group?.endTime)}
                                </span>
                            </div>
                        </li>
                        <li>
                            <MdOutlineSchedule className="group-details-page__meta-icon" aria-hidden />
                            <div>
                                <span className="group-details-page__meta-label">Lesson time</span>
                                <span className="group-details-page__meta-value">
                                    {formatTime(group?.startTimeOfLesson)} вЂ“ {formatTime(group?.endTimeOfLesson)}
                                </span>
                            </div>
                        </li>
                        <li>
                            <RxPerson className="group-details-page__meta-icon" aria-hidden />
                            <div>
                                <span className="group-details-page__meta-label">Teacher</span>
                                <span className="group-details-page__meta-value">
                                    {group?.teacher ? `${group.teacher.firstName} ${group.teacher.lastName}` : 'Not assigned'}
                                </span>
                            </div>
                        </li>
                        <li>
                            <GrSchedules className="group-details-page__meta-icon" aria-hidden />
                            <div>
                                <span className="group-details-page__meta-label">Schedule</span>
                                <span className="group-details-page__meta-value">{group?.daysOfWeek?.join(", ")}</span>
                            </div>
                        </li>
                    </ul>
                    <button
                        type="button"
                        className="group-details-page__leave-btn"
                        onClick={() => RemoveTeacherFromGroup(group.id)}
                    >
                        Leave group
                    </button>
                </aside>

                <main className="group-details-page__main">
                    <div className="group-details-page__main-header">
                        <h2 className="group-details-page__section-title">Lessons</h2>
                        <span className="group-details-page__lesson-count">{lessons.length} total</span>
                    </div>

                    {lessons.length > 0 ? (
                        <div className="group-details-page__lessons">
                            {lessons.map((lesson) => (
                                <article className="group-details-page__lesson-card" key={lesson.id}>
                                    <header className="group-details-page__lesson-header">
                                        <time className="group-details-page__lesson-date" dateTime={lesson.date}>
                                            {formatDate(lesson.date)}
                                        </time>
                                        <h3 className="group-details-page__lesson-topic">{lesson.topic}</h3>
                                    </header>

                                    <p className="group-details-page__lesson-desc">{lesson.description}</p>

                                    <section className="group-details-page__homework-block">
                                        <h4 className="group-details-page__homework-title">Homework</h4>
                                        {Array.isArray(lesson.homework) && lesson.homework.length > 0 ? (
                                            <ul className="group-details-page__homework-list">
                                                {lesson.homework.map((hw) => (
                                                    <li className="group-details-page__homework-item" key={hw.id}>
                                                        <p className="group-details-page__homework-text">{hw.content}</p>
                                                        <div className="group-details-page__homework-actions">
                                                            <button
                                                                type="button"
                                                                className="group-details-page__btn group-details-page__btn--ghost"
                                                                onClick={() => openEditHomeworkModal(hw.id, hw.content)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="group-details-page__btn group-details-page__btn--danger"
                                                                onClick={() => deleteHomework(hw.id, lesson.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="group-details-page__homework-empty">No homework yet</p>
                                        )}
                                    </section>

                                    <footer className="group-details-page__lesson-actions">
                                        <button
                                            type="button"
                                            className="group-details-page__btn group-details-page__btn--primary"
                                            onClick={() => openHomeworkModal(lesson.id)}
                                        >
                                            Add homework
                                        </button>
                                        <button
                                            type="button"
                                            className="group-details-page__btn group-details-page__btn--secondary"
                                            onClick={() => navigate("/editLesson", {state: {lesson, group, token}})}
                                        >
                                            Edit lesson
                                        </button>
                                        <button
                                            type="button"
                                            className="group-details-page__btn group-details-page__btn--danger"
                                            onClick={() => deleteLesson(lesson.id)}
                                        >
                                            Delete lesson
                                        </button>
                                    </footer>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="group-details-page__empty">
                            <p>No lessons found for this group yet.</p>
                        </div>
                    )}
                </main>
            </div>

            {isHomeworkModalOpen && (
                <div className="modal-overlay" onClick={closeHomeworkModal}>
                    <div className="modal-content group-details-page__modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-modal group-details-page__modal-close" onClick={closeHomeworkModal}>×</button>
                        <h2>Add homework</h2>
                        <textarea
                            className="group-details-page__textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter homework description"
                            rows={5}
                        />
                        <button type="button" className="group-details-page__btn group-details-page__btn--primary group-details-page__modal-submit" onClick={addHomework}>
                            Save homework
                        </button>
                    </div>
                </div>
            )}

            {isEditHomeworkModalOpen && (
                <div className="modal-overlay" onClick={closeEditHomeworkModal}>
                    <div className="modal-content group-details-page__modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-modal group-details-page__modal-close" onClick={closeEditHomeworkModal}>×</button>
                        <h2>Edit homework</h2>
                        <textarea
                            className="group-details-page__textarea"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Edit homework content"
                            rows={5}
                        />
                        <button type="button" className="group-details-page__btn group-details-page__btn--primary group-details-page__modal-submit" onClick={updateHomework}>
                            Update homework
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
export default GroupDetails;
