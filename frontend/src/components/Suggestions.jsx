import PropTypes from "prop-types";

function Suggestions({ suggestions, onClick }) {
    if (suggestions.length > 0) {
        return (
            <div id={"suggestions-container"}>
                <ul>
                    {
                        suggestions.map(s => (
                            <li className="shopping-list-item" key={s.id}
                                onClick={() => onClick(s)}>
                                {s.name}
                            </li>
                        ))}
                </ul>
            </div>
        )
    } else {
        return null;
    }
}

export default Suggestions;

Suggestions.propTypes = {
    suggestions: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
};