import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import CreateGroup from './createGroup';
import { GrSchedule } from "react-icons/gr";
import { MdOutlineSchedule } from "react-icons/md";
import { RxPerson } from "react-icons/rx";
import { GrSchedules } from "react-icons/gr";
import Modal from '../modalWindow/modal';

const GroupManagement = () => {
    const navigate = useNavigate('');
    const location = useLocation('');
    const email = location.state?.email
    const id = location.state?.id
    const token = localStorage.getItem('token');
    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('')

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
            setMessage(error.response?.data?.title || "Failed to delete group. Please try again.");
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
        <div className='admin-container'>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CreateGroup></CreateGroup>
            </Modal>
            {groups.length > 0 ? (
            <div>
                <div className='user-header'>
                    <h2 className='user-header-h'>Available Groups</h2>
                    <p className='user-header-p'>Here you can manage English Groups</p>
                </div>
                <div className='add-wrapper'>
                    <button className='btn-add' onClick={openModal}>Add new group</button>
                </div>
                <div className="group-table-container">
                    <div className="group-table-header">
                    <div>Group</div>
                    <div>Study Period</div>
                    <div>Lesson Time</div>
                    <div>English Level</div>
                    <div>Teacher</div>
                    <div>Days of Week</div>
                    <div>Action</div>
                    </div>

                    {groups.map((group) => (
                    <div key={group.id} className="group-table-row">
                        <div>{group.name || "No name available"}</div>
                        <div>
                            {formatDisplayTime(group.startTime)} - {formatDisplayTime(group.endTime)}
                        </div>
                        <div>
                        {new Date(group.startTimeOfLesson).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -  
                        {new Date(group.endTimeOfLesson).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div>{group.englishLevel}</div>
                        <div>
                        {group.teacher 
                            ? `${group.teacher.firstName} ${group.teacher.lastName}` 
                            : 'No teacher assigned'}
                        </div>
                        <div>
                        {Array.isArray(group.daysOfWeek) 
                            ? group.daysOfWeek.join(', ') 
                            : 'No days available'}
                        </div>
                        <div>
                        <button className="btn-delete" onClick={() => deleteLevel(group.id)}>
                            <FaRegTrashCan />
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            ) : (
            <p>No groups created yet.</p>
            )}
        </div>
    );
};

export default GroupManagement;
