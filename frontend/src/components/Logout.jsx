import { useAuth } from "../context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        console.log("Odhlásenie úspešné");
        navigate("/login");
    };

    return <button onClick={handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i> Odhlásiť</button>;
}

export default Logout;