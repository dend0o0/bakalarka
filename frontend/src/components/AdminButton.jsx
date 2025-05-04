
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

function AdminButton() {
    const { user } = useAuth();

    if (user.name === "denis") {
        return (
            <button>
                <Link to={`/admin`}>Administrácia</Link>
            </button>
        );
    } else {
        return null;
    }


}

export default AdminButton;