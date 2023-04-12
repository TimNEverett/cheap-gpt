// write a class name utility function

export const cn = (...args: any[]) => {
  return args.filter(Boolean).join(" ");
};
