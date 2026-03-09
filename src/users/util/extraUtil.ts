
export const getFullName = (name:string, paternal:string, maternal:string) => {
  return `${name} ${paternal} ${maternal}`
}

export const getInitials = (nombres: string, apellido: string) => {
  return `${nombres.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
}