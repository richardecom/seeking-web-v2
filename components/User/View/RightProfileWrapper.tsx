import React from "react";

const RightProfileWrapper = ({ children }: any) => {
  return (
    <div className="w-[100%] md:w-[65%] p-1">
      <div className="w-full bg-gray-100 rounded-sm pb-3">{children}</div>
    </div>
  );
};

export default RightProfileWrapper;
