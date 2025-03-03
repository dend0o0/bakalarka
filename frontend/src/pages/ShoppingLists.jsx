import {Link, useParams} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import dayjs from "dayjs";



function ShoppingLists() {
    const navigate = useNavigate();
    const { shop_id } = useParams();
    const [shoppingLists, setList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get(`/api/${shop_id}`)
            .then(response => {
                console.log("Dáta boli načítane.");
                setList(response.data);
                setErrorMessage("");
            })
            .catch(error => {
                console.error("Dáta sa nenačítali:", error);
                setErrorMessage("Nebolo možné načítať dáta.");
            });
    }, [shop_id]);

    const handleNewList = async () => {
        try {
            const response = await axios.post(`/api/${shop_id}`);
            console.log(response.data);
            const newListId = response.data.shopping_list.id;
            navigate(`/list/${newListId}`);
            setErrorMessage("");
        } catch (error) {
            console.error("Nastala chyba: " + error);
            setErrorMessage("Nastala chyba pri vytváraní zoznamu.");
        }

    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/list/${id}`);
            setList(prevItems => prevItems.filter(list => list.id !== id));
            setErrorMessage("");
        } catch (error) {
            console.error("Nastala chyba pri mazaní: " + error);
            setErrorMessage("Nastala chyba pri mazaní zoznamu.");
        }

    }

    return (
        <div>
            <h2>Nákupné zoznamy</h2>
            <Link to={`/`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <p>Pre vytvorenie nového nákupu stlač tlačidlo pod týmto textom.</p>
            <button className={"add"} onClick={handleNewList}><i className="fa fa-plus" aria-hidden="true"></i> Nový nákupný zoznam</button>
            <h2>Predošlé nákupné zoznamy</h2>
            {shoppingLists.length > 0 ? ( <ul>
                {shoppingLists.map(list => (
                    <li key={list.id}>

                        <Link to={`/list/${list.id}`}> <i className={"fa fa-calendar"} aria-hidden="true"></i> {dayjs(list.created_at).format("DD.MM.YYYY HH:mm")}
                        </Link>
                        <button className={"delete"} onClick={() => handleDelete(list.id)}><i className="fa fa-trash" aria-hidden="true"></i> Odstrániť
                        </button>
                    </li>

                ))}</ul>
                )
                :
                (
                    <p>Ešte nie sú vytvorené žiadne nákupné zoznamy.</p>
                )}
        </div>
    );
}

export default ShoppingLists;