import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return <p>Načítava sa...</p>;
    }

    return user ? children : null;
};

export default ProtectedRoute;