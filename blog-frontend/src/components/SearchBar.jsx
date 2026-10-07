import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

function SearchBar() {
  const navigate = useNavigate();

  const searchQuery = useStore(
    (state) => state.searchQuery
  );

  const setSearchQuery = useStore(
    (state) => state.setSearchQuery
  );

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate('/search');
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="
        flex
        items-center
        w-full
        h-9
        border
        border-[#333]
        bg-black
        focus-within:border-[#555]
        transition-colors
      "
    >
      <input
        type="text"
        placeholder="SEARCH..."
        value={searchQuery}
        onChange={handleChange}
        className="
          flex-1
          min-w-0
          h-full
          px-3
          bg-transparent
          text-white
          placeholder-[#555]
          font-mono
          text-xs
          outline-none
        "
      />

      <button
        type="submit"
        aria-label="Search"
        className="
          w-9
          h-full
          shrink-0
          flex
          items-center
          justify-center
          bg-transparent
          border-none
          text-[#888]
          text-lg
          hover:text-white
          transition-colors
        "
      >
        🔍
      </button>
    </form>
  );
}

export default SearchBar;