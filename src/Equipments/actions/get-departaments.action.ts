import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
export interface Department {
    id: string;
    name: string;
}

// actions/get-department.action.ts
export const getDepartmentsAction = async () => {
    const { data } = await soporteTecnicoApi.get(`/departments`);// Ajusta a tu endpoint real
    return data;
};
// Asegúrate de extraer el id si lo que recibes es el objeto del selector
export const getDepartmentByIdAction = async (idOrObject: string | { id: string }) => {
    // Si es un objeto, extraemos el id; si no, usamos el valor directamente
    const id = typeof idOrObject === 'object' ? idOrObject.id : idOrObject;

    if (!id) return null;

    const { data } = await soporteTecnicoApi.get<Department>(`/departments/${id}`);
    return data;
};
