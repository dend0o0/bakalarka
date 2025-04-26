import { useState, useEffect } from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import dayjs from "dayjs";


function ShoppingList() {
    const {id} = useParams();
    const [list, setList] = useState([]);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        axios.get(`/api/list/${id}`)
            .then(async response => {
                setList(response.data.list);
                const sortedResponse = await axios.get(`/api/sort/${id}`);
                setItems(sortedResponse.data.items);
            })
            .catch(error => {
                console.error(error);
                setErrorMessage("Dáta neboli načítané.");
            });

    }, [id]);



    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/item/${id}`);
            setItems(prevItems => prevItems.filter(item => item.id !== id));
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            setErrorMessage("Nastal problém pri odstránení položky.");
        }

    }

    const handleSubmit = async (event) => {
        if (event?.preventDefault) {
            event.preventDefault();
        }


        try {
            if (newItem.length > 30) {
                setErrorMessage("Názov položky môže mať max 30 znakov");
                return;
            }

            const response = await axios.post(`/api/item/${id}`, {
                name: newItem
            });

            setSuggestions([]);

            setItems([response.data.item, ...items])
            setNewItem("");
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            setErrorMessage("Nastala chyba pri pridávaní položky do zoznamu.")
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setNewItem(query);

        if (query.length > 1) {
            try {
                const response = await axios.get(`/api/search?q=${query}`);
                setSuggestions([...response.data]);
            } catch (error) {
                console.error("Nastala chyba pri získaní návrhov:", error);
            }
        } else {
            setSuggestions([]);
        }

    };
    const handleCheckboxChange = async (id, checked, shop_id, item) => {
        try {
            const response = await axios.patch(`/api/item/${id}`, { checked: !checked, shop_id, id});
            setItems(prevItems => {
                return prevItems.map(item =>
                    item.id === id ? { ...item, checked: !checked } : item
                )
            });
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Nebolo možné aktualizovať stav položky. Skúste to znova.");
            console.error("Chyba pri aktualizácií:", error);
        }
    };

    const handleSuggestionClick = async (name) => {

        const response = await axios.post(`/api/item/${id}`, {
            name: name
        });
        setItems([response.data.item, ...items])
        setNewItem("");
        setSuggestions([]);
    }

    const handleSort = async (id) => {
        try {
            const response = await axios.get(`/api/sort/${id}`);
            console.log("Zoradený zoznam:", response.data.items);
            setItems(response.data.items);
        } catch (error) {
            console.error("Chyba pri zoraďovaní zoznamu:", error);
            setErrorMessage("Nastala chyba pri zoraďovaní zoznamu.");
        }
    };



    return (
        <div>
            <h1>{list?.shop?.name}</h1>
            <div className={"main-frame"}>
                <div className={"list-header"}>
                    <Link to={`/${list.shop_id}`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
                    <button className={"add"} onClick={() => handleSort(list.id)}><i className={"fa fa-sort-amount-asc"}
                                                                                     aria-hidden="true"></i> Zoradiť
                        zoznam
                    </button>
                </div>

                {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
                <form onSubmit={handleSubmit} id={"list-form"} autoComplete={"off"}>
                    <div id={"list-input-container"}>
                        <input
                            type="text"
                            name="name"
                            value={newItem}
                            onChange={handleSearch}
                            placeholder="Pridať do zoznamu"
                            autoComplete={"off"}
                            required
                        />
                        <button type="submit" className={"add"}><i className="fa-solid fa-plus"></i></button>
                    </div>

                    {suggestions.length > 0 && (
                        <div id={"suggestions-container"}>
                            <ul>
                                {
                                    suggestions.map(s => (
                                        <li className="shopping-list-item" key={s.id}
                                            onClick={() => handleSuggestionClick(s.name)}>
                                            {s.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}


                </form>
            </div>

            <ul>

                {items.map(item => (
                    <li className={"shopping-list-item"} key={item.id}
                        style={{textDecoration: item.checked ? "line-through" : "none"}}>
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleCheckboxChange(item.id, item.checked, list.shop_id, item)}
                        />
                        <p>{item.item.name}</p>
                        <button className={"delete"} onClick={() => handleDelete(item.id)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </li>

                ))}

            </ul>

        </div>
    );
}

export default ShoppingList;