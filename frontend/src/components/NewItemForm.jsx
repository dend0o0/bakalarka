import PropTypes from "prop-types";
import Suggestions from "./Suggestions.jsx";

function NewItemForm({ suggestions, onSubmit, onSearch, newItem, onSuggestionClick }) {

        return (
            <form onSubmit={onSubmit} id={"list-form"} autoComplete={"off"}>
                <div id={"list-input-container"}>
                    <input
                        type="text"
                        name="name"
                        value={newItem}
                        onChange={onSearch}
                        placeholder="Pridať do zoznamu"
                        autoComplete={"off"}
                        required
                    />
                    <button type="submit" className={"add"}><i className="fa-solid fa-plus"></i></button>
                </div>

                <Suggestions suggestions={suggestions} onClick={onSuggestionClick} />

            </form>
        )


}

export default NewItemForm;

NewItemForm.propTypes = {
    suggestions: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuggestionClick: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    newItem: PropTypes.string.isRequired,
};