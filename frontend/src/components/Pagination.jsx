import PropTypes from "prop-types";


function Pagination({ currentPage, lastPage, onPageChange }) {
    return (
        <div className={"pagination"}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </button>

            <span style={{margin: "0 10px"}}>Strana {currentPage} z {lastPage}</span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
            >
                <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
)


}

export default Pagination;

Pagination.propTypes = {
    lastPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

