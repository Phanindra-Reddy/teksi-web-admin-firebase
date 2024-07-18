export function getInitials(firstName, lastName) {
  if (!firstName || !lastName) {
    throw new Error("Both first name and last name must be provided");
  }

  const firstInitial = firstName?.charAt(0)?.toUpperCase();
  const lastInitial = lastName?.charAt(0)?.toUpperCase();

  return firstInitial + lastInitial;
}
