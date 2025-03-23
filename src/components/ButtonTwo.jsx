import React from 'react';

const ButtonTwo = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-white flex justify-center items-center gap-2
        bg-blue-500 px-4 py-2 rounded-lg font-medium text-sm
        hover:bg-blue-700 transition-all ease-in duration-200
        ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonTwo;
