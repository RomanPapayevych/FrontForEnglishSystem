import { useNavigate, Link} from 'react-router-dom';
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "./modal"
import { FaCloudDownloadAlt } from "react-icons/fa";

const LevelManagement = () => {
    const navigate = useNavigate('');
    const location = useLocation('');
    const email = location.state?.email
    const id = location.state?.id
    const token = localStorage.getItem('token');

    const [level, setLevel] = useState('')
    //-------------new--------
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    //-------------new--------
    const [levels, setLevels] = useState([]);
    const [message, setMessage] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    

    useEffect(() => {
        const fetchLevels = async () => {
            try{
                const response = await axios.get(`https://localhost:7186/api/Admin/AllLevels`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                console.log("Fetched users:", response.data);
                setLevels(response.data.$values)
            }catch(error){
                console.error("Error creating level:", error);
                setMessage("Failed to fetch levels.");
            }
        }
        fetchLevels();
    }, []) 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const createLevel = async () => {
        const formData = new FormData();
        formData.append('name', level);
        formData.append('description', description);
        if (image) {
            formData.append('imageFile', image);
        } 
        try{
            const response = await axios.post(`https://localhost:7186/api/Admin/CreateLevel`,formData, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if(response.status === 200){
                setMessage("Level created successfully!");
                setLevels((prevLevels) => [...prevLevels, response.data.data]);
                setLevel("");
                setDescription('');
                setImage(null);
                setPreview(null);
                setIsModalOpen(false);
            }           
        }catch(error){
            console.error("Error creating level:", error.response?.data || error.message);
            setMessage(error.response?.data?.title ||"Failed to create level. Please try again.");
        }
    }

    const deleteLevel = async (id) => {
        try{
            const response = await axios.delete(`https://localhost:7186/api/Admin/DeleteEnglishLevel/${id}`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            if(response.status === 200){
                setMessage("Level deleted successfully!");
                setLevels((prevLevels) => prevLevels.filter((lvl) => lvl.id !== id))
            }           
        }catch(error){
            console.error("Error creating level:", error.response?.data || error.message);
            setMessage(error.response?.data?.title ||"Failed to create level. Please try again.");
        }
    }


    const goBack = () => {
        navigate("/profile", {state: {email, id}})
    }

    const openModal = () => {
        setIsModalOpen(true);
        setMessage(null);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setLevel("");
        setDescription('');
        setImage(null);
        setPreview(null);
        setMessage(null);
    }

    return(
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
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
        </Modal> 

        <h2>Available Levels</h2>
        <div className='add-wrapper'>
            <button className='btn-add' onClick={openModal}><FaCirclePlus/></button>
        </div>
        {levels.length > 0 ? (
            <div className="user-grid">
                <div className="user-grid">
                    {levels.map((lvl) =>(
                        <div key={lvl.id} className='my-card'>
                            <h2 key={lvl.id}>{lvl.level}</h2>
                            <p>{lvl.description}</p>
                            {lvl.imageUrl && <img src={`https://localhost:7186${lvl.imageUrl}`} alt='Level' style={{ width: '50px', height: '50px' }} />}
                            <div className='wrapper'>
                                <button className='btn-delete' onClick={() => deleteLevel(lvl.id)}><FaRegTrashCan/></button>
                            </div>
                        </div> 
                    ))}
                </div> 
            </div>
        ) : (
            <p>No levels created yet.</p>
        )}
      </div>  
    );  
}
export default LevelManagement;

