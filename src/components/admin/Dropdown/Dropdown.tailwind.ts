import CN from "./Dropdown.module.scss";

export const buttonTailwind =
  "relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-3 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex justify-between";
export const optionWrapper =
  "absolute z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700";
export const listTailwind =
  "absolute z-10 mt-1 min-w-full w-auto bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm";

export const checkmarkSelected = `${CN.dropdownSelected} text-white inset-y-0 right-0 flex items-center pr-4 h-5 w-5 mr-2 bg-indigo-600`;
export const checkmarkTailwind = `${CN.dropdownSelected} text-indigo-600 inset-y-0 right-0 flex items-center pr-4 h-5 w-5 mr-2 bg-white`;
export const listItem = `${CN.optionContainer} text-gray-900 cursor-pointer hover:bg-indigo-600 hover:text-white flex justify-between items-center`;
