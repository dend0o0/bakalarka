import { useAuth } from "../context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

import Logout from "./Logout.jsx";
import AdminButton from "./AdminButton.jsx";

function Header() {
    const { user } = useAuth();

    return (user ? (
            <div id={"header"}>
                <p><i className="fa fa-user" aria-hidden="true"></i> {user.name}</p>
                <Logout></Logout>
            </div>
        ) : "");
}

export default Header;