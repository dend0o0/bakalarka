
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthProvider.jsx";
import {useState} from "react";

function AdminButton({ currentPage, lastPage, onPageChange }) {
    return (
        <div className={"pagination"} style={{marginTop: "1rem"}}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>

            <span style={{margin: "0 10px"}}>
                            Strana {currentPage} z {lastPage}
                        </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
            >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
)


}

export default AdminButton;