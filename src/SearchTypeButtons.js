import './SearchTypeButtons.css'

function SearchTypeButtons(props) {
    return (
        <div className="SearchTypeButtons">
            <button id="simple-search-button" onClick={props.simpleClickHandler}>
                Simple Search
            </button>
            <button id="advanced-search-button" onClick={props.advancedClickHandler}>
                Advanced Search
            </button>
        </div>
    );
}

export default SearchTypeButtons