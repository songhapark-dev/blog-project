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
        w-[300px]
        h-8
        border
        border-[#39ff14]
        bg-black
        shadow-[0_0_8px_rgba(57,255,20,0.25)]
        focus-within:shadow-[0_0_10px_rgba(0,170,255,0.5)]
        transition-all
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
          text-[#39ff14]
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
          text-[#00aaff]
          text-lg
          hover:text-[#bf00ff]
          hover:drop-shadow-[0_0_6px_rgba(191,0,255,0.9)]
          transition-all
        "
      >
        🔍
      </button>
    </form>
  );
}

export default SearchBar;