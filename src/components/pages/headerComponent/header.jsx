import { FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useNavigate, Link} from 'react-router-dom';
import './header.css'


const Header = ({token}) => {
    const navigate = useNavigate('')   

    const handleLogout = async (e) => {
        e.preventDefault();
        try{
            await axios.post("https://localhost:7186/api/Auth/logout", {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            localStorage.removeItem("token");
            navigate("/");
        }catch(error){
            console.error("Logout failed:", error.response ? error.response.data : error.message);
        }
    }

    return(
        <header className='index-header'>
            <a href="" className="index-headerLogo">BLUE.STAR</a>
            <input type="checkbox" id="menu-toggle" className="menu-toggle"></input>
            <label htmlFor="menu-toggle" className="burger">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </label>
            <nav className="index-nav-links">
                <Link className="index-nav-item" to="/">Home</Link>
                <a href="" className="index-nav-item">Contact</a>
                <a href="" className="index-nav-item">About</a>
                {token ? (
                    <>
                        <button className="index-nav-item btn-login" onClick={handleLogout}>
                            <FiLogOut className="logout-icon"/>
                        </button>
                    </>
                ) : (
                    <>
                        <Link className="index-nav-item btn-login" to="/login">
                            Login
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;