import { PiUserFocusFill } from "react-icons/pi";
import Swal from 'sweetalert2'

const AccountTab = ({handleLogout, user}) => {

    const DeleteAvatar = async () => {
        Swal.fire({
            title: 'Do you really want to delete your Avatar?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: '#fff',
            color: 'black',
            iconColor: '#a8a8a8',
            confirmButtonColor: "#a18df8",
            cancelButtonColor: "#a18df8",
            customClass: {
                popup: "my-custom-popup",
                title: "my-custom-title",
                confirmButton: "my-custom-confirm-button",
                cancelButton: "my-custom-cancel-button",
            }
        }).then(async (result) => {
            if(result.isConfirmed){
                console.log("Avatar deleted")
                // if (!groupId) {
                //     setMessage("Group ID is missing. Please refresh the page.");
                //     return;
                // }
                // const decodedToken = jwtDecode(token);
                // const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                // try {
                //     const response = await axios.delete(`https://localhost:7186/api/Student/${groupId}/GetOut/${userId}`,{
                //             headers: { Authorization: `Bearer ${token}` },
                //         }
                //     );
                //     console.log("You left the group successfully:", response.data);
                //     setMessage("You have successfully left the group.");
                //     navigate('/profile', { state: { email, id } });
                // } catch (error) {
                //     console.error("Error leaving the group:", error.response?.data || error.message);
                //     setMessage(error.response?.data?.message || "An error occurred while leaving the group.");
                // }
            }
        })
        
    };

    return(
        <div className="account">
            <div className="account-container">
                <div className="account-header">
                    <h1 className="account-header-h">Profile</h1>
                    <p className="account-header-p">Here you can manage your account</p>
                </div>
                
                <div className="">
                    {user && (
                        <div className="account-items">
                            <div className="account-flex">
                                <PiUserFocusFill className="account-icon" />
                                <button className="account-button">Upload new picture</button>
                                <button className="account-btn-delete" onClick={DeleteAvatar}>Delete</button>
                            </div>
                           
                            <input 
                                type="text"
                                defaultValue={user.firstName}
                                className="account-input"
                            />
                            
                            <input 
                                type="text"
                                defaultValue={user.lastName}
                                className="account-input"
                            />
                            
                            <input 
                                type="text"
                                defaultValue={user.email}
                                className="account-input"
                            />
                            
                            <input 
                                type="text"
                                defaultValue={user.phoneNumber}
                                className="account-input"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <button className="account-button">Save changes</button>
                    <button className="account-button" onClick={handleLogout}>Logout</button>
                </div>
            </div> 
        </div>
    );
}
export default AccountTab;