import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const EditLesson = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { lesson, group, token } = location.state || {};

    const [topic, setTopic] = useState(lesson?.topic || "");
    const [description, setDescription] = useState(lesson?.description || "");
    const [lessonDateTime, setLessonDateTime] = useState(lesson?.date ? new Date(lesson.date).toISOString().slice(0, 10) : "");
    const [message, setMessage] = useState("");

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        try {
            const updatedLesson = {
                topic,
                description,
                date: lessonDateTime,
            };
            const response = await axios.put(`https://localhost:7186/api/Teacher/${lesson.id}/UpdateLesson`, updatedLesson, {
                    headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Lesson updated successfully:", response.data);
            setMessage("Lesson updated successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Failed to update lesson:", error.response?.data || error.message);
            setMessage(error.response?.data?.message || "Failed to update lesson");
        }
    };
    const goBack = () => {
        navigate(-1);
    };
    return(
        <div>
            <button onClick={goBack}>Back to Group Details</button>
            <h2>Create Lesson</h2>
            <form onSubmit={handleUpdateLesson}>
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
                <button type="submit">Update</button>
            </form>
        </div>
    );
}
export default EditLesson;