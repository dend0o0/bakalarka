import { useAuth } from "../context/AuthProvider.jsx";
import PropTypes from "prop-types";
import Logout from "./Logout.jsx";

function Suggestions({ suggestions, onClick }) {
    const { user } = useAuth();
    if (suggestions.length > 0) {
        return (
            <div id={"suggestions-container"}>
                <ul>
                    {
                        suggestions.map(s => (
                            <li className="shopping-list-item" key={s.id}
                                onClick={() => onClick(s.name)}>
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