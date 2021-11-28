import "./searchbar.css";

//get and set the search value in the searchbar
const Searchbar = ({ searchValue, changeSearchValue }) => {
  return (
    <div className="searchBar input-group">
      <input
        className="input-group rounded searchBar"
        type="text"
        id="search"
        name="search"
        autoComplete="off"
        placeholder="search by subject .."
        value={searchValue}
        onChange={(event) => changeSearchValue(event.target.value)}
      />
      <span
        className="input-group-text border-0"
        id="search-addon"
        style={{ background: "transparent", display: "inline-block" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </span>
    </div>
  );
};

export default Searchbar;
