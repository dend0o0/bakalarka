import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                navigate("/login");
            } else if (adminOnly && user.name !== "admin") {
                navigate("/");
            }
        }
    }, [user, isLoading, navigate, adminOnly]);

    if (isLoading) {
        return <p>Načítava sa...</p>;
    }

    if (!user || (adminOnly && user.name !== "admin")) {
        return null;
    }

    return children;
};

export default ProtectedRoute;