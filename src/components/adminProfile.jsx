import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import axios from 'axios';
import GroupManagement from './groupManagement';
import LevelManagement from './levelManagement';
import AdminManagement from './adminManagement';

const AdminProfile = () => {
    const navigate = useNavigate('')   
    const location = useLocation('')
    const email = location.state?.email
    const id = location.state?.id
    const [activeTab, setActiveTab] = useState("groupManagement");


    const handleLogout = async (e) => {
        e.preventDefault();
        try{
            await axios.post("https://localhost:7186/api/Auth/logout", {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            localStorage.removeItem("token");
            navigate("/login");
        }catch(error){
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    }

    const Manage = () => {
        navigate("/adminManagement", {state: {email, id}})   
    }
    const CreateLevel = () => {
        navigate("/levelManagement", {state: {email, id}})   
    }
    const CreateGroup = () => {
        navigate("/groupManagement", {state: {email, id}})   
    }
    const renderContent = () => {
        if(activeTab === "adminManagement"){
            return(
                <div className='content'>
                    <AdminManagement/>
                </div>
            );
        }else if(activeTab === "levelManagement"){
            return(
                <div className='content'>
                    <LevelManagement/>
                </div>
            )
        }else if(activeTab === "groupManagement"){
            return(
                <div className='content'>
                    <GroupManagement/>
                </div>
            )
        }else if(activeTab === "account"){
            return(
                <div className="content">
                    <p>Person</p>
                    <button onClick={handleLogout} className='btn'>Logout</button>
                </div>
            )
        }else{
            return <p>Select a tab to view details.</p>;
        }
    }

    return(
        <div className='teacher-container'>
        <div className="dashboard">
            <div className='sidebar'>
                <h2>Admin</h2>
                <ul>
                    <li className={activeTab === 'groupManagement' ?  "active" : ""} onClick={() => setActiveTab("groupManagement")}>Group Management</li>
                    <li className={activeTab === 'adminManagement' ?  "active" : ""} onClick={() => setActiveTab("adminManagement")}>Manage of users</li>
                    <li className={activeTab === 'levelManagement' ?  "active" : ""} onClick={() => setActiveTab("levelManagement")}>Level Management</li>
                    <li className={activeTab === 'account' ?  "active" : ""} onClick={() => setActiveTab("account")}>Account</li>
                </ul>
            </div>
        </div>
        <div>
            {renderContent()}
        </div>
    </div>
        
    );
}
export default AdminProfile;