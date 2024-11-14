import React from 'react';

interface SearchButtonProps {
  name: string;
  onClick?: () => void; // Optional click handler
  className?: string; // Optional additional classes
}
const SearchButton: React.FC<SearchButtonProps> = ({ name, onClick }) => (
    <button 
      onClick={onClick}
      type="button" 
      className={`flex justify-center items-center rounded-md mr-1 bg-[#b00202] w-1/3 h-9 text-xs leading-4 text-white shadow-sm hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300`} 
      aria-label={name}> {name}
    </button>
  );
export default SearchButton;