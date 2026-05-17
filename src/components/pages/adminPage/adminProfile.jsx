import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useState, useEffect} from "react";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";

import GroupManagement from './groupManagement';
import LevelManagement from './levelManagement';
import AdminManagement from './adminManagement';
import AccountTab from '../personalRoom/accountTab';

import { FiBox } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa";
import { MdPlayLesson } from "react-icons/md";
import { IoPerson } from "react-icons/io5";

const AdminProfile = () => {
    const navigate = useNavigate('')   
    const location = useLocation('')
    const email = location.state?.email
    const token = localStorage.getItem('token');
    const id = location.state?.id
    const [activeTab, setActiveTab] = useState("GroupManagement");
    const [user, setUser] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

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

    // const Manage = () => {
    //     navigate("/adminManagement", {state: {email, id}})   
    // }
    // const CreateLevel = () => {
    //     navigate("/levelManagement", {state: {email, id}})   
    // }
    // const CreateGroup = () => {
    //     navigate("/groupManagement", {state: {email, id}})   
    // }

     const fetchUser = async () => {
        try{
            const decoded = jwtDecode(token);
            const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const response = await axios.get(`https://localhost:7186/api/Student/GetUserById/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User data: ", response.data)
            setUser(response.data);
        }catch(error){
            console.error("User not found:", error.response ? error.response.data : error.message);
        }
    }

    const renderContent = () => {
        switch(activeTab){
            case 'AdminManagement': 
                return(
                    <AdminManagement/>
                ); 

            case 'LevelManagement': 
                return(
                    <LevelManagement/>
                );

            case 'GroupManagement': 
                return(
                    <GroupManagement/>
                );

            case 'Account': 
                return(
                    <AccountTab handleLogout={handleLogout} user={user}/>
                );
            default: 
                return <p>Select a tab</p>;
        }
    };

    return(
        <div className="dashboard">           
            <div className='content-container'>
                <div className='navbar'>
                    <ul className='navbar-content'>
                        <h2 className='navbar-greeting'><FiBox /> Hi, {email}</h2>
                    </ul>
                    <ul className='navbar-content'>
                        <li className={activeTab === 'AdminManagement' ?  "active" : ""} onClick={() => setActiveTab("AdminManagement")}><MdSpaceDashboard className='sidebarItems'/>Users</li>
                        <li className={activeTab === 'LevelManagement' ?  "active" : ""} onClick={() => setActiveTab("LevelManagement")}><FaLayerGroup className='sidebarItems'/>Levels</li>
                        <li className={activeTab === 'GroupManagement' ?  "active" : ""} onClick={() => setActiveTab("GroupManagement")}><MdPlayLesson className='sidebarItems'/>Groups</li>
                        <li className={activeTab === 'Account' ?  "active" : ""} onClick={() => setActiveTab("Account")}><IoPerson className='sidebarItems'/>Account</li>
                    </ul>
                </div>
            </div>
            <div key={activeTab} className="content page-enter">
                {renderContent()}
            </div>   
        </div>
    );
}
export default AdminProfile;