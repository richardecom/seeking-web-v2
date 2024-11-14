import React from "react";

const FullProfileWrap = ({children}:any) => {
  return (
    <div className="p-1 md:w-[100%] sm:w-[100%]">
      <div className="bg-gray-100 px-3 py-2 rounded-sm">
        {children}
      </div>
    </div>
  );
};

export default FullProfileWrap;
