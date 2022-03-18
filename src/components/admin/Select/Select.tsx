import { FieldError, UseFormRegister } from "react-hook-form";

import { AnyForm } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

export interface Option {
  name: string;
  value: string;
}

type SelectProps = {
  options: WithId<AnyVenue, string>[];
  register: UseFormRegister<AnyForm>;
  name: string;
  error?: FieldError;
};

export const Select: React.FC<SelectProps> = ({
  options,
  register,
  name,
  error,
}) => {
  return (
    <div className="relative inline-block w-full text-gray-700">
      <select
        className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
        placeholder="Regular input"
        {...register(name)}
      >
        {options?.map((option) => (
          <option
            key={option.name}
            className="bg-white w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
          >
            {option.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </div>
      {error && <span>{error?.message}</span>}
    </div>
  );
};
