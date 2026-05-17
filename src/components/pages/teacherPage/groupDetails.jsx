import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
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


    const [students, setStudents] = useState([]);
    const [selectedGroupName, setSelectedGroupName] = useState(''); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (group.id) {
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
                    console.log("Server response:", response.data);
                    setLessons(cleanedLessons);
                } catch (error) {
                    console.error("Error fetching lessons:", error.response?.data || error.message);
                    setMessage("An error occurred while fetching lessons.");
                }
            };
            fetchLessons();
        }
    }, [group]);

    
    const createLesson = async () => {
        navigate('/createLesson', {state: {group, email, id}})
    };
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
            navigate("/profile", {state: {email, id}})
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
    const deleteLesson = async (lessonId) => {
        if(!lessonId){
            console.error("Lesson ID is missing or invalid:", lessonId);
            return
        }
        try{
            const response = await axios.delete(`https://localhost:7186/api/Teacher/${lessonId}/RemoveLesson`, {
                headers : {Authorization : `Bearer ${token}`}, 
            });
            setLessons((prevLessons) => prevLessons.filter((l) => l.id !== lessonId));
            setMessage("Lesson deleted successfully.");
        }catch(error){
            console.error("lesson not deleted: ", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "lesson not deleted");
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
        const contentData = {
            content: content,
        }
        try{
            const response = await axios.post(`https://localhost:7186/api/Teacher/${selectedLessonId}/Homework`, contentData ,{
                headers : {Authorization : `Bearer ${token}`}, 
            })
            const newHomework = response.data;
            setLessons((prevLessons) =>
                prevLessons.map((lesson) =>
                    lesson.id === selectedLessonId
                        ? {
                            ...lesson,
                            homework: [...lesson.homework, newHomework], 
                        }
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
            const response = await axios.delete(`https://localhost:7186/api/Teacher/${homeworkId}/RemoveHomework`, {
                headers : {Authorization : `Bearer ${token}`}, 
            })
            setLessons((prevLessons) => prevLessons.map((lesson) => lesson.id === lessonId ? {...lesson, homework: lesson.homework.filter((hw) => hw.id !== homeworkId)}: lesson))
        }catch(error) {
            console.error("Homework not deleted: ", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Homework not deleted")
        }
    }

    const updateHomework = async () => {
        try{
            const response = await axios.put(`https://localhost:7186/api/Teacher/${selectedHomeworkId}/UpdateHomework`, {content: editContent }, {
                headers : {Authorization : `Bearer ${token}`}, 
            })
            setLessons(prevLessons => 
                prevLessons.map(lesson => ({
                    ...lesson,
                    homework: lesson.homework.map(hw =>
                        hw.id === selectedHomeworkId
                            ? { ...hw, content: editContent }
                            : hw
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
    
    const formatDisplayTime = (dateTime) => {
        const formattedDate = new Date(dateTime);
        return formattedDate.toLocaleDateString("uk-UA");
    };

    const goBack = () => {
        navigate("/profile", {state: {email, id}})
    }
    
    return(
        <div style={{backgroundColor:"white"}}>
            <button onClick={goBack} className="go-back-button"><IoIosArrowBack size={30}/></button>
            <div className='teacher-space-btw-container'>
                <div>
                    <div className='teacher-group-details'>
                        <div className='align-container'>
                            <h2 className='teacher-h'>{group?.name}</h2>
                        </div>
                        <div className='card-info'>
                            <div className='card-column flex margin-top'>
                                <div>
                                    <GrSchedule className='card-icon'/>
                                </div>
                                <div>
                                    {/* <p className='card-column-p'>Duration of studying:</p> */}
                                    <p className='card-column-p'>{new Date(group?.startTime).toLocaleDateString()} - {new Date(group?.endTime).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className='card-column flex margin-top'>
                                <div>
                                    <MdOutlineSchedule className='card-icon'/>
                                </div>
                                <div>
                                    {/* <p className='card-column-p'>Lesson time:</p> */}
                                    <p className='card-column-p'>
                                        {new Date(group?.startTimeOfLesson).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(group?.endTimeOfLesson).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}  
                                    </p>
                                </div>
                            </div>
                            <div className='card-column flex margin-top'>
                                <div>
                                    <RxPerson className='card-icon'/>
                                </div>
                                <div>
                                    {/* <p className='card-column-p'>Teacher:</p> */}
                                    <p className='card-column-p'>{group?.teacher ? `${group.teacher.firstName} ${group.teacher.lastName}` : 'No teacher assigned'}</p>
                                </div>
                            </div>
                            <div className='card-colum flex margin-top'>
                                <div>
                                    <GrSchedules className='card-icon'/>
                                </div>
                                <div>
                                    {/* <p className='card-column-p'>Schedule:</p> */}
                                    <p className='card-column-p'>{group?.daysOfWeek?.join(", ")}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => RemoveTeacherFromGroup(group.id)}>Leave group</button>
                    </div>
                </div>
                <div className='teacher-container'>
                    <div className='align-container'>
                        <h2 className='teacher-h'>Lessons</h2>
                    </div>
                    <div className='align-container'>
                        {lessons.length > 0 ? (
                            <div className="user-grid">
                                {lessons.map((lesson) => (
                                    <div className='group-details' key={lesson.id}>
                                        <p>Date: {new Date(lesson.date).toLocaleDateString()}</p>
                                        <p>Topic: {lesson.topic}</p>
                                        <p style={{ whiteSpace: "pre-wrap" }}>Description: {lesson.description}</p>
                                        <p>Homework:</p>
                                        {Array.isArray(lesson.homework) && lesson.homework.length > 0 ? (
                                            <ul>
                                                {lesson.homework.map((hw) => (
                                                    <div key={hw.id}>
                                                        {hw.content}
                                                        <button onClick={(() => deleteHomework(hw.id, lesson.id))}>Delete Homework</button>
                                                        <button onClick={(() => openEditHomeworkModal(hw.id, hw.content))}>Edit Homework</button>
                                                    </div>
                                                ))}
                                            </ul>
                                        ):(
                                            <p>No homework yet</p>
                                        )}
                                        <button onClick={(() => deleteLesson(lesson.id))}>Delete Lesson</button>
                                        <button onClick={(() => navigate("/editLesson", {state: {lesson, group, token}}))}>Edit Lesson</button>
                                        <button onClick={(() => openHomeworkModal(lesson.id))}>Add homework</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No lessons found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
        // <div className='user-card' style={{color: "white"}}>
        //     <button onClick={goBack} className="go-back-button">go back</button>
        //     <button onClick={() => RemoveTeacherFromGroup(group.id)}>Leave group</button>
        //     <button onClick={() => ShowStudentsOfGroup(group.id, group.name)}>List students of group</button>
        //     <h2>Group Details</h2>
        //     <h2>{group?.name}</h2>
        //     <p>English Level: {group?.englishLevel}</p>
        //     <p>Start Time: {formatDisplayTime(group.startTime)}</p>
        //     <p>End Time: {formatDisplayTime(group.endTime)}</p>
        //     <p>Days of Week: {group?.daysOfWeek?.join(", ")}</p>
        //     <p>Time: {new Date(group?.startTimeOfLesson).toLocaleTimeString()} - {new Date(group?.endTimeOfLesson).toLocaleTimeString()}</p>
        //     <button onClick={(() =>createLesson())}>Create Lesson</button>
        //     <h2>Lessons</h2>
        //     {lessons.length > 0 ? (
        //         <div className="user-grid">
        //             {lessons.map((lesson) => (
        //                 <div className='user-card' key={lesson.id}>
        //                     <p>Date: {new Date(lesson.date).toLocaleDateString()}</p>
        //                     <p>Topic: {lesson.topic}</p>
        //                     <p style={{ whiteSpace: "pre-wrap" }}>Description: {lesson.description}</p>
        //                     <p>Homework:</p>
        //                     {Array.isArray(lesson.homework) && lesson.homework.length > 0 ? (
        //                         <ul>
        //                             {lesson.homework.map((hw) => (
        //                                 <div key={hw.id}>
        //                                     {hw.content}
        //                                     <button onClick={(() => deleteHomework(hw.id, lesson.id))}>Delete Homework</button>
        //                                     <button onClick={(() => openEditHomeworkModal(hw.id, hw.content))}>Edit Homework</button>
        //                                 </div>
        //                             ))}
        //                         </ul>
        //                     ):(
        //                         <p>No homework yet</p>
        //                     )}
        //                     <button onClick={(() => deleteLesson(lesson.id))}>Delete Lesson</button>
        //                     <button onClick={(() => navigate("/editLesson", {state: {lesson, group, token}}))}>Edit Lesson</button>
        //                     <button onClick={(() => openHomeworkModal(lesson.id))}>Add homework</button>
        //                 </div>
        //             ))}
        //         </div>
        //     ) : (
        //         <p>No lessons found.</p>
        //     )}

        //     {isHomeworkModalOpen && (
        //         <div className="modal-overlay">
        //             <div className="modal-content">
        //                 <button className="close-modal" onClick={closeHomeworkModal}>X</button>
        //                 <h2 style={{ color: "black" }}>Add Homework</h2>
        //                 <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter homework description" style={{ width: "100%", height: "100px", marginBottom: "10px" }}/>
        //                 <button onClick={addHomework}>Submit</button>
        //             </div>
        //         </div>
        //     )}

        //     {isEditHomeworkModalOpen && (
        //         <div className="modal-overlay">
        //             <div className="modal-content">
        //                 <button className="close-modal" onClick={closeEditHomeworkModal}>X</button>
        //                 <h2 style={{ color: "black" }}>Edit Homework</h2>
        //                 <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} placeholder="Edit homework content" style={{ width: "100%", height: "100px", marginBottom: "10px" }}/>
        //                 <button onClick={updateHomework}>Update</button>
        //             </div>
        //         </div>
        //     )}

        //     {isModalOpen && (
        //         <div className="modal-overlay">
        //             <div className="modal-content">
        //             <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
        //                 <h2 style={{color: "black"}}>Students in {selectedGroupName}</h2>
        //                 {students.length > 0 ? (
        //                     <ol style={{ textAlign: "left", paddingLeft: "20px" }}>
        //                         {students.map(student => (
        //                             <li  key={student.id} style={{marginBottom: "10px", marginLeft: "20px", color: "black"}}>{student.firstName} {student.lastName} <br/>{student.phoneNumber}</li>
        //                         ))}
        //                     </ol>
        //                 ) : (
        //                     <p style={{color: "black"}}>No students in this group.</p>
        //                 )}
        //             </div>
        //         </div>
        //     )}
        //     {message && <p>{message}</p>}
        // </div>
    );
}
export default GroupDetails;