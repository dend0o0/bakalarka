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

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/shop/${id}`);
            setShops(prevShops => prevShops.filter(shop => shop.id !== id));
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            setErrorMessage("Nastal problém pri odstránení obchodu.");
        }

    }

    return (
        <div>
            <h1>Dostupné obchody</h1>
            <p>Vyberte si obchod, v ktorom chcete spravovať nákupné zoznamy.</p>

            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
            <button className={"add"} id={"add-shop"}>
                <Link to={`/add_shop`}>Pridať obchod</Link>
            </button>
            <div id="shops-container">
                {shops.map(shop => (
                    <div className="shop" key={shop.id}>
                        <h3>{shop.name}</h3>
                        <p>{shop.city}, {shop.address}</p>
                        <button className={"add"}>
                            <Link to={`/${shop.id}`}><i className="fa fa-shopping-cart"
                                                        aria-hidden="true"></i> Nakupovať</Link>
                        </button>
                        <button className={"delete-shop"} onClick={() => handleDelete(shop.id)}>
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>

                ))}
            </div>
        </div>
    );
}

export default Home;