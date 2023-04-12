import { FC, PropsWithChildren, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  menuTitle?: string;
};

export const MobileMenu: FC<PropsWithChildren<Props>> = ({
  children,
  isOpen,
  setIsOpen,
  menuTitle,
}) => {
  return (
    <>
      <button
        className="bg-primary-500 rounded-full p-2 text-white fixed z-10 top-16 right-4 block lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BiMenu size="2em" />
      </button>
      {isOpen && (
        <div className="absolute inset-0 z-20 bg-white block lg:hidden">
          <div className="w-full h-12 flex justify-end px-2">
            <div>{menuTitle}</div>
            <button onClick={() => setIsOpen(!isOpen)}>
              <BiX size="2em" />
            </button>
          </div>
          {children}
        </div>
      )}
    </>
  );
};
