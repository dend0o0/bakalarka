import axios from "axios";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Suggestions from "../components/Suggestions.jsx";
import MainFrame from "../components/MainFrame.jsx";

function AddShop() {
    const [suggestions, setSuggestions] = useState([]);
    const [shopName, setShopName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        if (event?.preventDefault) {
            event.preventDefault();
        }


        try {
            if (shopName.length > 30) {
                setErrorMessage("Názov obchodu môže mať max 30 znakov");
                return;
            }

            const response = await axios.post(`/api/shop`, {
                name: shopName,
                city: city,
                address: address,
            });


            console.log("Pridaná položka:", response.data);
            setSuggestions([]);
            setShopName("");
            setErrorMessage("");
            navigate("/");
        } catch (error) {
            console.error("Chyba pri pridávaní položky do zoznamu:", error);
            setErrorMessage("Nastala chyba pri pridávaní položky do zoznamu.")
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setShopName(query);

        if (query.length > 1) {
            try {
                const response = await axios.get(`/api/searchShop?q=${query}`);
                console.log(response.data);
                setSuggestions([...response.data]);
            } catch (error) {
                console.error("Nastala chyba pri získaní návrhov:", error);
            }
        } else {
            setSuggestions([]);
        }

    };

    const handleSuggestionClick = async (s) => {
        setAddress(s.address);
        setCity(s.city);
        setShopName(s.name);
        setSuggestions([]);
    }

    return (
        <div>
            <h1>Pridať nový obchod</h1>
            <MainFrame>
                <Link to={`/`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </MainFrame>
            <MainFrame>
                <form onSubmit={handleSubmit}>
                    <input type={"text"} placeholder={"Názov obchodu"} onChange={handleSearch} value={shopName}
                           name={"name"} required={true} /*value={shopName}*//>
                    <Suggestions suggestions={suggestions} onClick={handleSuggestionClick}/>
                    <input type={"text"} placeholder={"Mesto"} value={city} onChange={(e) => setCity(e.target.value)}
                           required={true}/>
                    <input type={"text"} placeholder={"Adresa"} value={address}
                           onChange={(e) => setAddress(e.target.value)} required={true}/>
                    <button type={"submit"} className={"add"}>Pridať obchod</button>
                </form>
            </MainFrame>
        </div>


    )
}
export default AddShop;