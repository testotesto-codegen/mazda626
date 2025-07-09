import { useState } from "react";
import { MdSearch, MdExpandMore, MdExpandLess } from "react-icons/md";

import SearchSuggestion from "./SearchSuggestion";
import useDebounce from "../../../hooks/useDebounce";

const SearchInputContainer = () => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedInput = useDebounce(input, 200);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="relative h-full z-50">
      <MdSearch
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
      />
      <input
        type="text"
        placeholder="Search anything here"
        className=" z-50 py-3 px-14 text-sm w-96 placeholder:text-inherit placeholder:text-xs placeholder:font-medium bg-[#1D2022] rounded-full outline-none"
        onChange={handleChange}
        value={input}
        onClick={() => setShowSuggestions(true)}
      />
      {!showSuggestions ? (
        <MdExpandMore
          size={20}
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
        />
      ) : (
        <MdExpandLess
          size={20}
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
        />
      )}
      {showSuggestions && (
        <SearchSuggestion
          input={debouncedInput}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
      )}
    </div>
  );
};

export default SearchInputContainer;
