import axios from "axios";
import {useEffect, useState} from "react";
import Pagination from "../components/Pagination.jsx";
import {Link} from "react-router-dom";
import MainFrame from "../components/MainFrame.jsx";

function Admin() {
    const [shops, setShops] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        axios.get(`/api/shopsAdmin?page=${currentPage}`)
            .then(response => {
                setShops(response.data.data);
                setErrorMessage("");
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
            })
            .catch(error => {
                console.error("Dáta sa nenačítali:", error);
                setErrorMessage("Nebolo možné načítať obchody.");
            });
    }, [currentPage]);

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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage) {
            setCurrentPage(newPage);
        }
    };


    return (
        <div>
            <h1>Administrácia</h1>
            <MainFrame>
                <Link to={`/`}><i className="fa fa-chevron-left" aria-hidden="true"></i> Späť</Link>
                {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
            </MainFrame>
            <MainFrame>
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
            </MainFrame>
            <MainFrame>
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </MainFrame>


        </div>


    )
}

export default Admin;