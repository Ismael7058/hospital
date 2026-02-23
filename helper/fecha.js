exports.adaptarFecha = (dateInput) => {
  if (!dateInput) return null;
  const date = new Date(dateInput);
  date.setUTCHours(12, 0, 0, 0);
  return date;
};

exports.restarMinutos = (hora, minutosARestar) => {
  if (!hora || typeof hora !== 'string' || !hora.includes(':')) {
    return null;
  }
  const [hours, minutes] = hora.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes) - minutosARestar, 0, 0);
  
  return date.toTimeString().slice(0, 5);
};