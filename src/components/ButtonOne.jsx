import React from "react";

const ButtonOne = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer text-white bg-blue-500 px-6 py-2 rounded-lg transition-transform duration-150
        shadow-[0_4px_0_0_#2563eb] hover:brightness-110 hover:translate-y-[-1px]
        active:brightness-90 active:translate-y-[2px] active:shadow-[0_2px_0_0_#2563eb]
        ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonOne;
