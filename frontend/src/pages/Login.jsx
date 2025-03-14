
import { useState } from "react";
import { useAuth } from "../context/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login, errorMessage } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        /*
        try {
            await axios.get("/sanctum/csrf-cookie", );
            await axios.post("/api/login", { email, password }, );

            navigate("/list");
        } catch (err) {
            setError("Nesprávne prihlasovacie údaje");
        }*/
        await login({email, password});
        navigate("/");
    };

    return (
        <div>


            <form id={"login"} onSubmit={handleLogin}>
                <h2>Prihlásenie</h2>
                {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
                <input type="email" placeholder="E-mail adresa" value={email} onChange={(e) => setEmail(e.target.value)}
                       required/>
                <input type="password" placeholder="Heslo" value={password}
                       onChange={(e) => setPassword(e.target.value)} required/>
                <br/><br/>
                <button type="submit" className={"add"}><i className="fa fa-key" aria-hidden="true"></i> Prihlásiť
                </button>
            </form>
        </div>
    );
}

export default Login;