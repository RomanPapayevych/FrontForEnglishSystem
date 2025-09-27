import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import Modal from "./modal"
import CreateGroup from './createGroup';

const GroupManagement = () => {
    const navigate = useNavigate('');
    const location = useLocation('');
    const email = location.state?.email
    const id = location.state?.id
    const token = localStorage.getItem('token');
    const [groups, setGroups] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('https://localhost:7186/api/Admin/AvaibleGroups', {
                    headers: {Authorization: `Bearer ${token}`}
                });
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
                }));
                setGroups(cleanedGroups);
                console.log('Group retrived:', response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
        fetchGroups();
    }, []);   

    const formatDisplayTime = (dateTime) => {
        const formattedDate = new Date(dateTime);
        return formattedDate.toLocaleDateString("uk-UA");
    };

    const goBack = () => {
        navigate("/profile", {state: {email, id}})
    }

    // const CreateGroup = () =>{
    //     navigate("/createGroup", {state: {email, id}})
    // }

    const deleteLevel = async (groupId) => {
        try {
            const response = await axios.delete(`https://localhost:7186/api/Admin/DeleteGroup/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setMessage("Group deleted successfully!");
                setGroups((prevGroups) => prevGroups.filter((g) => g.id !== groupId));
            }
        } catch (error) {
            console.error("Error deleting group:", error.response?.data || error.message);
            //setMessage(error.response?.data?.title || "Failed to delete group. Please try again.");
        }
    }

    const openModal = () => {
        setIsModalOpen(true);
        setMessage(null);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        // setLevel("");
        // setDescription('');
        // setImage(null);
        // setPreview(null);
        // setMessage(null);
    }
    
    return (
        <div>

            {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2>Create English Level</h2>
            <div className='default-wrapper'>
                <label class="custom-file-upload">
                    <div className='user-photo'>
                        <FaCloudDownloadAlt />
                    </div>
                    <input className='upload-image' type='file' accept='image/*' onChange={handleImageChange}/>
                    Click to upload
                </label>
                {preview && <img src={preview} alt='Preview' className='preview-photo'/>}
            </div>
            <input className='default-input' type="text" value={level} onChange={(e) =>setLevel(e.target.value)} placeholder="Enter level name (e.g., A1, B2)"/>
            <input className='default-input' type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter description (optional)' />
            <button className='btn' onClick={createLevel}>Add level</button> 
            {message && <p>{message}</p>}
            </Modal>  */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CreateGroup></CreateGroup>
            </Modal>

            <h2>Available Groups</h2>
            <div className='add-wrapper'>
                {/* <button className='btn-add' onClick={CreateGroup}><FaCirclePlus /></button> */}
                <button className='btn-add' onClick={openModal}><FaCirclePlus /></button>
            </div>
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
                        <div className='wrapper'>
                            <button className='btn-delete' onClick={() => deleteLevel(group.id)}><FaRegTrashCan /></button>
                        </div>
                    </div>
                ) : null
                ))}
            </div>
            ) : (
                <p>No groups created yet.</p>
            )}
        </div>
    );
};

export default GroupManagement;
