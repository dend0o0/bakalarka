import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

function Admin() {
    const [shops, setShops] = useState([]);
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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/shops/${id}`);
            setShops(prevShops => prevShops.filter(item => item.id !== id));
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            setErrorMessage("Nastal problém pri odstránení položky.");
        }

    }


    return (
        <div>
            <h1>Administrácia</h1>
            <Link to={`/`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <ul>

                {shops.length > 0 && (
                    shops.map(shop => (
                        <li key={shop.id}>
                            {shop.name}
                            <button className={"delete"} onClick={() => handleDelete(shop.id)}><i
                                className="fa fa-trash" aria-hidden="true"></i> Odstrániť
                            </button>
                        </li>
                    ))
                )}

            </ul>

        </div>


    )
}

export default Admin;