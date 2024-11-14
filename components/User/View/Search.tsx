import React, { useState } from "react";

const Search = ({onClick, id, name, className}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const Search = () => {
        onClick(searchQuery);
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { Search() }
      };

  return (
    <div className={`w-full search-area mb-3 md:mb-0 md:flex justify-end ${className}`}>
      <input
        id={id}
        name={name}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={handleKeyPress}
        type="text"
        className="w-full text-xs mb-2 mr-1 rounded-md border h-9 border-gray-300 p-2 shadow-sm transition duration-200 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
        placeholder="Search..."
      />
      <div>
        <button
          type="button"
          onClick={Search}
          className="bg-[#b00202] px-4 py-2 text-white rounded-md text-xs w-full h-9 hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
