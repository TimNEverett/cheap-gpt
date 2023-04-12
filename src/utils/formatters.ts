//write a ts function to format a date or date string like this: 2021-01-01
export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  const hoursString = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
  const minutesString =
    d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  const amPm = d.getHours() < 12 ? "AM" : "PM";
  return `${d.getFullYear()}-${
    d.getMonth() + 1
  }-${d.getDate()} ${hoursString}:${minutesString} ${amPm}`;
};

export const formatRelativeDate = (date: Date | string) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    //return time
    return d.toLocaleTimeString();
  } else if (d.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return formatDate(d);
  }
};
