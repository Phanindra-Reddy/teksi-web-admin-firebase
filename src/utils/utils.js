export function getInitials(firstName, lastName) {
  if (!firstName || !lastName) {
    throw new Error("Both first name and last name must be provided");
  }

  const firstInitial = firstName?.charAt(0)?.toUpperCase();
  const lastInitial = lastName?.charAt(0)?.toUpperCase();

  return firstInitial + lastInitial;
}

export function getDateTime(val) {
   const booking_date = new Date(val).toDateString();
  const booking_time = timeFormat(val);
  
  return `${booking_date} ${booking_time}`
}

export function timeFormat(val) {
  const now = new Date(val);

  let hours = now.getHours();
  const minutes = now.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  const timeString = `${hours}:${minutesStr} ${ampm}`;

  return timeString;
}
