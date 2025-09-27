import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoPersonSharp } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

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
        <div className="catalog-container">
            <h2>Users</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {users.length > 0 ? (
                <div className="user-grid">
                    {users.map((user) => (
                        <div key={user.id} className="div-containers">
                            <p><IoPersonSharp className='user-photo' /></p>
                            <p>{user.email}</p>
                            <div className='wrapper'>
                                <select className='dropdown' onChange={(e) => handleRoleChange(user.id, e.target.value)} value={selectedRoles[user.id] || ""}>
                                    <option value="" disabled>{user.roles && user.roles.$values && user.roles.$values.length > 0 ? user.roles.$values.join(", ") : "No roles"}</option>
                                    {roleOptions.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            <button onClick={() => handleAssignRole(user.id)} className="btn"><FaCheck /></button>
                            </div>
                            <div className='wrapper'>
                                <button onClick={() => handleDelete(user.id)} className="btn-delete"><FaRegTrashCan /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p style={{color: "black"}}>Empty catalog of users</p>
                </div>
            )}
            {/* <button onClick={goBack} className="go-back-button">goBack</button> */}
        </div>
    );
}
export default AdminManagement;