import React from 'react'
interface IconButtonProps {
    icon: React.ReactNode;
    name: string;
    isDisabled: boolean;
    onClick: () => void;
}
const IconButton: React.FC<IconButtonProps> = ({ icon, name, isDisabled, onClick }) => (
    <button 
      type="button"
      onClick={onClick}
      disabled = {isDisabled}
      className={`flex justify-center items-center rounded-md mr-1  w-1/4 h-9 text-xs leading-4 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300 ${isDisabled ? 'bg-gray-400 cursor-not-allowed': 'hover:bg-[#800000] bg-[#b00202]'}`} 
      aria-label={name}> 
      {icon}{name}
    </button>
  );
export default IconButton;