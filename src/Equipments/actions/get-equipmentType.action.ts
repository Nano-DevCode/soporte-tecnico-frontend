import { soporteTecnicoApi } from "../../api/soporteTecnicoApi";

export const getEquipmentTypesAction = async () => {
  try {
    const { data } = await soporteTecnicoApi.get('/equipmenttypes'); // Tu endpoint de catálogos
    return data; // Retorna [{id: 1, name: 'Computer'}, {id: 2, name: 'Printer'}]
  } catch (error) {
    console.error("Error al obtener tipos:", error);
    return [];
  }
};