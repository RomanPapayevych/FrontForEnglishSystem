import { FaBook } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";
import { LiaCertificateSolid } from "react-icons/lia";
import { LuBookMarked } from "react-icons/lu";

const DashboardTab = ({user}) => {
    return(
        <div>
            <p className="dashboard-greet">Hello, {user.firstName} &#128075;</p>
            <div className='dashboard-card-container'>
                <div className='dashboard-card'>
                    <FaBook className='dashboard-icon'/>
                    <p className='dashboard-h'>BOOK</p>
                </div>
                <div className='dashboard-card'>
                    <FaNewspaper className='dashboard-icon'/>
                    <p className='dashboard-h'>NEWS</p>
                </div>
                <div className='dashboard-card'>
                    <LiaCertificateSolid className='dashboard-icon'/>
                    <p className='dashboard-h'>CERTEFICATES</p>
                </div>
                <div className='dashboard-card'>
                    <LuBookMarked className='dashboard-icon'/>
                    <p className='dashboard-h'>VOCABULARY</p>
                </div>
            </div>
        </div>
        
    );
}
export default DashboardTab;