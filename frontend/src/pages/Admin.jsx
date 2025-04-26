import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function Admin() {
    const [shops, setShops] = useState([]);
    const [shopName, setShopName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/shopsAdmin`)
            .then(response => {
                console.log("Načítané dáta:", response.data);
                setShops(response.data);
                setErrorMessage("");
            })
            .catch(error => {
                console.error("Dáta sa nenačítali:", error);
                setErrorMessage("Nebolo možné načítať obchody.");
            });
    }, []);
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


    return (
        <div>
            <h1>Administrácia</h1>
            <Link to={`/`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <ul>

                {shops.length > 0 && (
                    shops.map(shop => (
                        <li key={shop.id}>
                            ${shop.name}
                        </li>
                    ))
                )}

            </ul>

        </div>


    )
}

export default Admin;