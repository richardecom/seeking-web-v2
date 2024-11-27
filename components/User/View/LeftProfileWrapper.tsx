import React from "react";

const LeftProfileWrapper = ({children}:any) => {
  return (
    <div className="p-1 md:w-[35%] sm:w-[100%]">
      <div className=" px-3 py-2 rounded-sm border">
        {children}
      </div>
    </div>
  );
};

export default LeftProfileWrapper;
