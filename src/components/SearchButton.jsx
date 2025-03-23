import React from "react"; 
import { Search } from "lucide-react";
const SearchButton = ({ onClick }) => { return ( <button onClick={onClick} className="cursor-pointer transition-all bg-blue-500 text-white p-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]" aria-label="Buscar" > <Search className="w-5 h-5" /> </button> ); };
export default SearchButton;