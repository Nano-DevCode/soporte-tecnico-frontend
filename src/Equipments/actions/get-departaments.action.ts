import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";

// actions/get-department.action.ts
export const getDepartmentsAction = async () => {
    const { data } = await soporteTecnicoApi.get(`/departments`);// Ajusta a tu endpoint real
    return data;
};
export const getDepartmentByIdAction = async (id: string) => {
    try {
        // Asegúrate de que la URL se construye correctamente con el ID recibido
        const { data } = await soporteTecnicoApi.get(`/departments/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching department:", error);
        throw error;
    }
};
