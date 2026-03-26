export const formatDate = (dateValue?: Date | string) => {
  if (!dateValue) return "No disponible";

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) return "Fecha inválida";

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};