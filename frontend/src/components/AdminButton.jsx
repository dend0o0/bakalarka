
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthProvider.jsx";

function AdminButton() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleClick = async () => {
        navigate("/admin");
    };

    if (user.name === "denis") {
        return <button onClick={handleClick}><i className="fa fa-sign-out" aria-hidden="true"></i> Admin</button>;
    } else {
        return null;
    }


}

export default AdminButton;