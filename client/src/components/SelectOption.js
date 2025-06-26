import React from "react";

const SelectOption = ({ icon }) => {
  return (
    <div className="w-10 h-10 bg-white rounded-full border shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-800 hover:text-white hover:border-gray-800">
      {icon}
    </div>
  );
};

export default SelectOption;
