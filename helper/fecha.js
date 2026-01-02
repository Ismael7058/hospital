exports.adaptarFecha = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  date.setUTCHours(12, 0, 0, 0);
  return date;
};