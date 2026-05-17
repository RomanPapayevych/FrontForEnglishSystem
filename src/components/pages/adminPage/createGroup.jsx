import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
const CreateGroup = () => {
    const navigate = useNavigate('');
    const location = useLocation('');
    const email = location.state?.email
    const id = location.state?.id
    const token = localStorage.getItem('token');

    const [groups, setGroups] = useState([]);
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [englishLevelId, setEnglishLevelId] = useState('');
    const [englishLevels, setEnglishLevels] = useState([]);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [startTimeOfLesson, setStartTimeOfLesson] = useState("");
    const [endTimeOfLesson, setEndTimeOfLesson] = useState("");

    const handleDayChange = (day) => {
        setDaysOfWeek(prevDays =>
            prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const startTimeOfLessonDate = new Date(`${startTime}T${startTimeOfLesson}+00:00`).toISOString();
        const endTimeOfLessonDate = new Date(`${endTime}T${endTimeOfLesson}+00:00`).toISOString();
        const daysMap = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6,
        };
        const daysOfWeekNumbers = daysOfWeek.map(day => daysMap[day]);

        const groupData = {
            name,
            startTime: startTime,
            endTime: endTime,
            startTimeOfLesson: startTimeOfLessonDate,
            endTimeOfLesson: endTimeOfLessonDate,
            englishLevelId: parseInt(englishLevelId),
            daysOfWeek: daysOfWeekNumbers,
        };
        console.log('Submitting group data:', groupData);
        try {
            const response = await axios.post('https://localhost:7186/api/Admin/CreateGroup', groupData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            console.log('Group created:', response.data);
            setGroups([...groups, response.data]); 
            setTimeout(() => {
                navigate('/adminProfile', { state: { email, id } });
            }, 1000)
        } catch (error) {
            console.error('Server validation errors:', error.response.data.errors);
            console.error('Error creating group:', error);
            console.error('Server responded with error:', error.response.data);
        }
    };
    useEffect(() => {
        fetchEnglishLevels();
    }, []);
        const fetchEnglishLevels = async () => {
            try {
                const response = await axios.get('https://localhost:7186/api/Admin/AllLevels', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEnglishLevels(response.data.$values || []); 
            } catch (error) {
                console.error('Error fetching English levels:', error);
            }
        };

    const goBack = () => {
        navigate("/adminProfile", {state: {email, id}})
    }
    return(
        <div>
            <h2 className='modal-title'>Create New Group</h2>
            <form onSubmit={handleSubmit}>
                <div className='modal-container-items'>
                    <label className='modal-label'>Name</label>
                    <input className='modal-input' type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder='Enter group name'/>
                </div>
                <div className='modal-container-items'>
                    <label className='modal-label'>Launch of Course</label>
                    <input className='modal-input' type="date" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div className='modal-container-items'>
                    <label className='modal-label'>Finishing of Course</label>
                    <input className='modal-input' type="date" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                <div className='modal-container-items'>
                    <label className='modal-label'>English Level</label>
                    <select className='modal-input' value={englishLevelId} onChange={(e) => setEnglishLevelId(e.target.value)} required>
                        <option value="">Select English Level</option>
                        {englishLevels.map(level => (
                            <option key={level.id} value={level.id}>{level.level}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className='modal-container-items'>
                        <label className='modal-label'>Start Time of Lesson</label>
                        <input className='modal-input' type="time" value={startTimeOfLesson} onChange={(e) => setStartTimeOfLesson(e.target.value)} placeholder="Start time of Lesson"/>
                    </div>
                    <div className='modal-container-items'>
                        <label className='modal-label'>End Time of Lesson</label>
                        <input className='modal-input' type="time" value={endTimeOfLesson} onChange={(e) => setEndTimeOfLesson(e.target.value)} placeholder="End time of Lesson"/>
                    </div>
                    <div className='modal-container-items'>
                        <label className='modal-label'>Days of Week</label>
                        <div className='modal-checkboxes-container'>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                            <label key={day} className={`modal-checkbox ${daysOfWeek.includes(day) ? 'checked' : ''}`}>
                                <input id={day} 
                                    type="checkbox" 
                                    checked={daysOfWeek.includes(day)} 
                                    onChange={() => handleDayChange(day)} />
                                    <span>{day}</span>
                            </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='modal-button-container'>
                    <button type="submit">Create Group</button>
                </div>
            </form>
        </div>
    );
}
export default CreateGroup;