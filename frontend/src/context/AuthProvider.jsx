import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        axios.get("/api/user")
            .then(response => {
                setUser(response.data);
                setIsLoading(false);
            })
            .catch(() => {
                setUser(null);
                setIsLoading(false);
                setErrorMessage("Pre používanie aplikácie je nutné sa prihlásiť.")
            });
    }, []);

    const login = async (credentials) => {
        try {
            await axios.get("/sanctum/csrf-cookie");
            const csrfToken = axios.defaults.headers.common['X-CSRF-TOKEN'];
            await axios.post("/api/login", credentials, { withCredentials: true });
            const { data } = await axios.get("/api/user", { withCredentials: true });
            setUser(data);
        } catch (error) {
            setErrorMessage("Prihlasovacie údaje neboli správne.")
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/logout", {});
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, errorMessage}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}