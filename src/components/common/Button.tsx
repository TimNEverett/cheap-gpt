// make a react typescript button component that exetends the button element
// use tailwindcss to style it
// give it an onClick prop that is a function that returns void
// give it a disabled prop that is a boolean
// give alternate styles

import { cn } from "@/utils/classname";

const Button = ({
  children,
  onClick,
  disabled,
  className,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "submit" | "button";
}) => {
  return (
    <button
      className={cn(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
