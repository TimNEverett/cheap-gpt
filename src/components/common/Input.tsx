// make a react typescript input component that extends the button element
// use tailwindcss to style it
// give it a disabled prop that is a boolean
// give alternate styles

import { cn } from "@/utils/classname";
import { Tooltip } from "./tooltip";
import { BiQuestionMark } from "react-icons/bi";

const Input = ({
  onChange,
  className,
  disabled,
  name,
  label,
  type,
  tooltip,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  label?: string;
  type?: "password" | "text" | "email";
  tooltip?: string;
}) => {
  return (
    <>
      {label && tooltip && (
        <Tooltip content={tooltip} position="right">
          <label className="flex items-center text-gray-500 text-sm font-bold text-left">
            {label}
            <BiQuestionMark />
          </label>
        </Tooltip>
      )}
      {label && !tooltip && (
        <label className="block text-gray-500 text-sm font-bold text-left">
          {label}
        </label>
      )}

      <input
        className={cn(
          "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
          className,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onChange={onChange}
        disabled={disabled}
        name={name}
        type={type}
      />
    </>
  );
};

export default Input;
