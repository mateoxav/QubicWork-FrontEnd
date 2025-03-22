import React from "react";

const SearchInput = ({ placeholder = "Buscar servicios...", onChange, value }) => { return ( <div className="w-full max-w-xs"> <input type="search" name="search" value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-2 text-gray-800 placeholder-gray-400 bg-gray-100 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" /> </div> ); };

export default SearchInput;