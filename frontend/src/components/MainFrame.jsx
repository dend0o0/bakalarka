import PropTypes from "prop-types";

function MainFrame( { children}) {
    return (
        <div className="main-frame">
            { children }
        </div>
    );
}

export default MainFrame;

MainFrame.propTypes = {
    children: PropTypes.node.isRequired,
}

