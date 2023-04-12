import { cn } from "@/utils/classname";
import { FC, PropsWithChildren, ReactNode, useState } from "react";

type Props = {
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
};

export const Tooltip: FC<PropsWithChildren<Props>> = ({
  children,
  content,
  position = "right",
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div
      className="relative flex max-w-fit"
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {children}
      <div
        className={cn(
          "absolute bg-black text-white p-2 rounded shadow-xl text-xs z-10 w-[400%]",
          isHovered && "block",
          !isHovered && "hidden",
          position === "top" && "bottom-full mb-2",
          position === "bottom" && "top-full mt-2",
          position === "left" && "right-full mr-2",
          position === "right" && "left-full ml-2"
        )}
      >
        {content}
      </div>
    </div>
  );
};
