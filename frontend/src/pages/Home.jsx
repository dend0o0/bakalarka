import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function Home() {
    const [shops, setShops] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get(`/api/shops`)
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

    return (
        <div>
            <h1>Dostupné obchody</h1>
            <p>Vyberte si obchod, v ktorom chcete spravovať nákupné zoznamy.</p>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div id="shops-container">
                {shops.map(shop => (
                    <div className="shop" key={shop.id}>
                        <h3>{shop.name}</h3>
                        <p>{shop.city}, {shop.address}</p>
                        <button className={"add"}>
                            <Link to={`/${shop.id}`}><i className="fa fa-shopping-cart" aria-hidden="true"></i>  Nakupovať</Link>
                        </button>
                    </div>

                ))}
            </div>

        </div>
    );
}

export default Home;