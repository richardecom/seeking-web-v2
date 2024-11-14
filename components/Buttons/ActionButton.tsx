import React from 'react';

interface ActionButtonProps {
  bgColor: string;
  hoverColor: string;
  icon: React.ReactNode;
  ariaLabel: string;
}
export const ActionButton: React.FC<ActionButtonProps> = ({ bgColor, hoverColor, icon, ariaLabel }) => (
  <button 
    type="button" 
    className={`flex m-1 justify-center rounded-md ${bgColor} p-3 px-1 py-1 text-sm font-semibold leading-4 text-white shadow-sm ${hoverColor} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 transition duration-300`} 
    aria-label={ariaLabel}>
    {icon}
  </button>
);
