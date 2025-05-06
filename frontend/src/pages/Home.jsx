import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AdminButton from "../components/AdminButton.jsx";
import Pagination from "../components/Pagination.jsx";
import MainFrame from "../components/MainFrame.jsx";

function Home() {
    const [shops, setShops] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        axios.get(`/api/shops?page=${currentPage}`)
            .then(response => {
                console.log("Načítané dáta:", response.data);
                setShops(response.data);
                setCurrentPage(response.data.current_page);
                setLastPage(response.data.last_page);
                setErrorMessage("");
            })
            .catch(error => {
                console.error("Dáta sa nenačítali:", error);
                setErrorMessage("Nebolo možné načítať obchody.");
            });
    }, [currentPage]);

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

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div>
            <h1>Dostupné obchody</h1>
            {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
            <MainFrame>
                <button className={"add"} id={"add-shop"}>
                    <Link to={`/add_shop`}>Pridať obchod</Link>
                </button>
                <AdminButton></AdminButton>
            </MainFrame>

            <MainFrame>

                    {shops.data?.length > 0 ? (
                        <div id={"shops-container"}>
                            {shops.data?.map(shop => (
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
                    ) : (
                        <div id={"shops-container"}>
                            <p>Pridajte svoj prvý obchod.</p>
                        </div>
                    )}


            </MainFrame>

            <MainFrame>
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    onPageChange={handlePageChange}
                />
            </MainFrame>

        </div>
    );
}

export default Home;