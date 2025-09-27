// // import { useNavigate } from 'react-router-dom';
// // import { useLocation } from "react-router-dom";
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {jwtDecode} from "jwt-decode";

// // const TeacherGroups = () => {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     const {email, id} = location.state || {};
// //     const token = localStorage.getItem('token');
// //     const [groups, setGroups] = useState([]);
// //     const [message, setMessage] = useState('');

// //     const [students, setStudents] = useState([]); // Стан для студентів
// //     const [selectedGroupName, setSelectedGroupName] = useState(''); // Назва групи для модального вікна
// //     const [isModalOpen, setIsModalOpen] = useState(false); // Видимість модального вікна

// //     useEffect(() => {
// //     const ChoosenGroups = async () => {
// //         try{
// //             const decodedToken = jwtDecode(token);
// //             const teacherId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

// //             const response = await axios.get(`https://localhost:7186/api/Teacher/teacher/${teacherId}/groups`, {
// //                 headers: {Authorization: `Bearer ${token}`}
// //             })
// //             const cleanedGroups = response.data.$values.map(group => ({
// //                 id: group.id,
// //                 name: group.name,
// //                 startTime: group.startTime,
// //                 endTime: group.endTime,
// //                 startTimeOfLesson: group.startTimeOfLesson,
// //                 endTimeOfLesson: group.endTimeOfLesson,
// //                 englishLevelId: group.englishLevelId,
// //                 englishLevel: group.englishLevel,
// //                 teacher: group.teacher,
// //                 daysOfWeek: group.daysOfWeek.$values,
// //             }))
// //             setGroups(cleanedGroups)
// //             setMessage("Groups retrived Successfull")
// //             }catch(error){
// //                 console.error("Error choosing the group:", error.response?.data || error.message);
// //                 setMessage(error.response?.data?.message || "An error occurred while choosen the group.");
// //             }
// //         }
// //         ChoosenGroups()
// //     })

// //     const RemoveTeacherFromGroup = async (groupId) => {
// //         if (!groupId) {
// //             setMessage("Group ID is missing. Please refresh the page.");
// //             return;
// //         }
// //         try{
// //             const response = await axios.delete(`https://localhost:7186/api/Teacher/${groupId}/RemoveTeacherFromGroup`, {
// //                 headers : {Authorization : `Bearer ${token}`}, 
// //             });
// //             console.log("You left the group successfully:", response.data);
// //             setMessage("You have successfully left the group.");
// //         }catch(error){
// //             console.error("Error leaving the group:", error.response?.data || error.message);
// //             setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
// //         }
// //     }
// //     const ShowStudentsOfGroup = async (groupId, groupName) => {
// //         if (!groupId) {
// //             setMessage("Group ID is missing. Please refresh the page.");
// //             return;
// //         }
// //         try{
// //             const response = await axios.get(`https://localhost:7186/api/Teacher/${groupId}/GetStudentsFromGroup`, {
// //                 headers : {Authorization : `Bearer ${token}`}, 
// //             });
// //             console.log("You retrieved list of students successfully:", response.data);
// //             setMessage("ou retrieved list of students successfully.");
// //             setStudents(response.data.$values);
// //             setSelectedGroupName(groupName)
// //             setIsModalOpen(true);
// //         }catch(error){
// //             console.error("Error leaving the group:", error.response?.data || error.message);
// //             setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
// //         }
// //     }

// //     const formatDisplayTime = (dateTime) => {
// //         const formattedDate = new Date(dateTime);
// //         return formattedDate.toLocaleDateString("uk-UA");
// //     };

// //     const goBack = () => {
// //         navigate("/profile", {state: {email, id}})
// //     }

// //     return(
// //         <div>
// //             Choosen Groups
// //             <button onClick={goBack} className="go-back-button">go back</button>
// //             {groups.length > 0 ? (
// //             <div className="user-grid">
// //                 {groups.map((group) => ( group ? (
// //                     <div key={group.id} className='user-card'>
// //                         <p>Name: {group.name || "No name available"}</p>
// //                         <p>Start Time: {formatDisplayTime(group.startTime)}</p>
// //                         <p>End Time: {formatDisplayTime(group.endTime)}</p>
// //                         <p>Start time of Lesson: {new Date(group.startTimeOfLesson).toLocaleTimeString()}</p>
// //                         <p>End time of Lesson: {new Date(group.endTimeOfLesson).toLocaleTimeString()}</p>
// //                         <p>English Level: {group.englishLevel}</p>
// //                         <p>Teacher: {group.teacher ? `${group.teacher.firstName} ${group.teacher.lastName}` : 'No teacher assigned'}</p>
// //                         <p>Days of Week: {Array.isArray(group.daysOfWeek) ? group.daysOfWeek.join(', ') : 'No days available'}</p>
// //                         <button onClick={() => RemoveTeacherFromGroup(group.id)}>Leave group</button>
// //                         <button onClick={() => ShowStudentsOfGroup(group.id, group.name)}>List students of group</button>
// //                     </div>
// //                 ) : null
// //                 ))}
// //             </div>
// //             ) : (
// //                 <p>No groups created yet.</p>
// //             )}

// //             {isModalOpen && (
// //                 <div className="modal-overlay">
// //                     <div className="modal-content">
// //                     <button className="close-modal" onClick={() => setIsModalOpen(false)}>X</button>
// //                         <h2 style={{color: "black"}}>Students in {selectedGroupName}</h2>
// //                         {students.length > 0 ? (
// //                             <ol style={{ textAlign: "left", paddingLeft: "20px" }}>
// //                                 {students.map(student => (
// //                                     <li  key={student.id} style={{marginBottom: "10px", marginLeft: "20px", color: "black"}}>{student.firstName} {student.lastName} <br/>{student.phoneNumber}</li>
// //                                 ))}
// //                             </ol>
// //                         ) : (
// //                             <p style={{color: "black"}}>No students in this group.</p>
// //                         )}
// //                     </div>
// //                 </div>
// //             )}

// //         </div>
// //     )
// // }
// // export default TeacherGroups

// import { useNavigate } from 'react-router-dom';
// import { useLocation } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {jwtDecode} from "jwt-decode";

// const CreateLesson = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { email, id} = location.state || {};
//     const { group } = location.state || {};
//     const token = localStorage.getItem('token');

//     const [lessonData, setLessonData] = useState({
//         date: '',
//         topic: '',
//         description: '',
//         homework: '',
//     });
//     const [date, setDate] = useState('');
//     const [topic, setTopic] = useState('');
//     const [description, setDescription] = useState('');
//     const [message, setMessage] = useState('');
//     const createLesson = async (group) => {

//         try {
//             const lesson = {
//                 date, 
//                 topic,
//                 description
//             };
//             const response = await axios.post(`https://localhost:7186/api/Teacher/${group.schedule.id}/Lesson`, lesson, { 
//                 headers: { Authorization: `Bearer ${token}` } 
//             });
//             setMessage("Lesson created successfully.");
//             navigate("/groupDetails", { state: { group, email, id, createdLesson: response.data } });
//         } catch (error) {
//             console.error("Error creating lesson:", error.response?.data || error.message);
//             setMessage("An error occurred while creating a lesson.");
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setLessonData((prevData) => ({ ...prevData, [name]: value }));
//     };
//     const goBack = () => {
//         navigate("/groupDetails", {state: {email, id, group }})
//     }
//     return(
//         <div className='create-lesson-card'>
//             <h2>Create Lesson for {group?.name}</h2>
//             <div>
//                 <label>Date:</label>
//                 <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required/>
//             </div>
//             <div>
//                 <label>Topic:</label>
//                 <textarea value={topic} onChange={(e) => setTopic(e.target.value)} required/>
//             </div>
//             <div>
//                 <label>Description:</label>
//                 <textarea value={description} onChange={(e) => setDescription(e.target.value)} required/>
//             </div>
//             <button onClick={createLesson}>Create Lesson</button>
//             <button onClick={goBack}>Back</button>
//             {message && <p>{message}</p>}
//         </div>
//     )
// }
// export default CreateLesson
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const CreateLesson = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { group, email, id} = location.state || {};
    const token = localStorage.getItem('token');

    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [lessonDateTime, setLessonDateTime] = useState('');

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        const dateWithTime = `${lessonDateTime}T00:00:00.000Z`;
        try {
            const response = await axios.post(`https://localhost:7186/api/Teacher/${group.id}/Lesson`,{
                topic,
                description,
                date: dateWithTime,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('Lesson created successfully:', response.data);
        navigate('/groupDetails', { state: { group, email, id} });
        } catch (error) {
            console.error('Error creating lesson:', error.response?.data || error.message);
        }
    };

    const goBack = () => {
        navigate('/groupDetails', { state: { group, email, id } });
    };

    return (
        <div>
            <button onClick={goBack}>Back to Group Details</button>
            <h2>Create Lesson</h2>
            <form onSubmit={handleCreateLesson}>
                <label>
                    Topic:
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required/>
                </label>
                <br />
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required/>
                </label>
                <br />
                <label>
                    Date and Time:
                    <input type="date" value={lessonDateTime} onChange={(e) => setLessonDateTime(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Create Lesson</button>
            </form>
        </div>
    );
};

export default CreateLesson;
