
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthProvider.jsx";
import {useState} from "react";

function AdminButton() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= lastPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className={"pagination"} style={{marginTop: "1rem"}}>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>

            <span style={{margin: "0 10px"}}>
                            Strana {currentPage} z {lastPage}
                        </span>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
            >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
)


}

export default AdminButton;