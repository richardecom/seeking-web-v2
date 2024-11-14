import React from 'react'
interface DialogButtonProps {
    name: string;
    // onClick: () => void;
}
const DialogButton: React.FC<DialogButtonProps> = ({ name  }) => (
    <button 
      type="button" 
      className={`flex justify-center items-center rounded-md mr-1 bg-[#b00202] w-1/3 h-9 text-xs leading-4 text-white shadow-sm hover:bg-[#800000]-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300`} 
      aria-label={name}> {name}
    </button>
  );
export default DialogButton;