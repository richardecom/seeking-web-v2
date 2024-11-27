import React from "react";
import Spinner from "./Spinner";

const SubmitButton = ({isFormValid, buttonName, isLoading}) => {
  return (
    <button
      disabled={!isFormValid || isLoading}
      type="submit"
      className={`flex justify-center items-center rounded-md  px-4 h-9 text-xs leading-4 text-white shadow-sm bg-[#b00202] hover:bg-[#800000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-green-600 transition duration-300 active:bg-[#b00202] active:scale-90 active:shadow-lg focus:outline-none transition transform duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed${
        isFormValid
          ? ""
          : ""
      }`}
    >
      {isLoading && (<Spinner className="w-4 h-4"/>)}
      {buttonName}
    </button>
  );
};

export default SubmitButton;
