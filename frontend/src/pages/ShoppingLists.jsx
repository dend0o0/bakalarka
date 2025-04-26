import {Link, useParams} from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import Pagination from "../components/Pagination.jsx";


function ShoppingLists() {
    const navigate = useNavigate();
    const { shop_id } = useParams();
    const [shoppingLists, setList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);



    useEffect(() => {
        axios.get(`/api/${shop_id}?page=${currentPage}`)
            .then(response => {
                console.log("Dáta boli načítane.");
                setList(response.data.data);
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
                setErrorMessage("");
            })
            .catch(error => {
                console.error("Dáta sa nenačítali:", error);
                setErrorMessage("Nebolo možné načítať dáta.");
            });
    }, [shop_id, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage) {
            setCurrentPage(newPage);
        }
    };

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
            <h1>Nákupné zoznamy</h1>
            <Link to={`/`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
            <div className={"main-frame"}>
                <p>Pre vytvorenie nového nákupu stlač tlačidlo pod týmto textom.</p>
                <button className={"add"} onClick={handleNewList}><i className="fa fa-plus" aria-hidden="true"></i> Nový
                    nákupný zoznam
                </button>
            </div>
            <div className={"main-frame"}>
                <h2>Predošlé nákupné zoznamy</h2>
                {shoppingLists.length > 0 ? (
                        <div>
                            <ul>
                                {shoppingLists.map(list => (

                                    <li key={list.id}>
                                        <Link to={`/list/${list.id}`}>
                                            <i className={"fa fa-calendar"}
                                               aria-hidden="true"></i> {dayjs(list.created_at).format("DD.MM.YYYY HH:mm")}
                                        </Link>
                                        <button className={"delete"} onClick={() => handleDelete(list.id)}><i
                                            className="fa fa-trash" aria-hidden="true"></i> Odstrániť
                                        </button>
                                    </li>

                                ))}
                            </ul>
                            <Pagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                                onPageChange={handlePageChange}
                            />

                        </div>)
                    :
                    (
                        <p>Ešte nie sú vytvorené žiadne nákupné zoznamy.</p>
                    )
                }
            </div>


        </div>
    )
        ;
}

export default ShoppingLists;