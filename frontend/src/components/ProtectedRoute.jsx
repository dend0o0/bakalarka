import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import PropTypes from "prop-types";
import Pagination from "./Pagination.jsx";


const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                navigate("/login");
            } else if (adminOnly && user.name !== "denis") {
                navigate("/");
            }
        }
    }, [user, isLoading, navigate, adminOnly]);

    if (isLoading) {
        return <p>Načítava sa...</p>;
    }

    if (!user || (adminOnly && user.name !== "denis")) {
        return null;
    }

    return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    adminOnly: PropTypes.bool.isRequired,
};