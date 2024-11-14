import React from "react";

const SubmitButton = ({isFormValid, buttonName}) => {
  return (
    <button
      disabled={!isFormValid}
      type="submit"
      className={`flex justify-center items-center rounded-md  px-4 h-9 text-xs leading-4 text-white shadow-sm  ${
        isFormValid
          ? "bg-[#b00202] hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-600 transition duration-300"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {buttonName}
    </button>
  );
};

export default SubmitButton;
