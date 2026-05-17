import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoPersonSharp } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import './adminPage.css';

const AdminManagement = () => {
    const navigate = useNavigate('')   
    const location = useLocation('')
    const email = location.state?.email
    const id = location.state?.id
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([])
    const [error, setError] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState({});
    const roleOptions = ["User", "Admin", "Teacher"];

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const response = await axios.get(`https://localhost:7186/api/Auth/users-with-roles`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log("Fetched users:", response.data);
                setUsers(response.data.$values)
            }catch(error){
                console.error("Error fetching orders", error);
                setError("Error fetching orders");
            }
        }
        fetchUsers();
    }, [token])

    const handleRoleChange = (userId, role) =>{
        setSelectedRoles((prev) => ({
            ...prev,[userId]: role
        }));
    }

    const handleAssignRole = async (userId) => {
        const newRole = selectedRoles[userId];
        if (!newRole) {
            alert("Виберіть роль перед наданням!");
            return;
        }
        try{
            const response = await axios.post(`https://localhost:7186/api/Auth/assign-role`, {userId: userId.toString(), roleName: newRole}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Sending request:", { userId: userId, roleName: newRole });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId
                        ? { ...user, roles: [newRole] }
                        : user
                )
            );
        }catch(error){
            console.error("Failed to assign role", error.response?.data || error.message);
            alert(`Помилка: ${error.response?.data || "Невідома помилка"}`);
        }
    }

    const handleDelete = async (userId) => {
        try{
            const response = await axios.delete(`https://localhost:7186/api/Auth/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        }catch(error){
            console.error("Failed to delete user", error.response?.data || error.message);
        }
    }

    const goBack = () => {
        navigate("/profile", {state: {email, id}})
    }
    
    return(
        <div>
            {users.length > 0 ? (
                <div className='admin-container'>
                    <div className='user-header'>
                        <h2 className='user-header-h'>Users</h2>
                        <p className='user-header-p'>Here you can manage rules for each user</p>
                    </div>
                    {users.map(user => (
                        <div key={user.id} className='div-containers'>
                                <div className='wrapper-start'>
                                    <IoPersonSharp className='user-photo'/>
                                    <p>{user.email}</p>
                                </div>
                                <div className='wrapper-end'>
                                    <select className='dropdown' onChange={(e) => handleRoleChange(user.id, e.target.value)} value={selectedRoles[user.id] || ""}>
                                        <option value="" disabled>{user.roles && user.roles.$values && user.roles.$values.length > 0 ? user.roles.$values.join(", ") : "No roles"}</option>
                                        {roleOptions.map((role) => (
                                            <option className='dropdown-options' key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleAssignRole(user.id)} className="btn"><FaCheck /></button>
                                    <button onClick={() => handleDelete(user.id)} className="btn-delete"><FaRegTrashCan /></button>
                                </div>
                        </div>
                    ))}
                </div>
            ): (
                <div className='admin-container'>
                    <p style={{color: "black"}}>Empty catalog of users</p>
                </div>
            )}
        </div>
    );
}
export default AdminManagement;