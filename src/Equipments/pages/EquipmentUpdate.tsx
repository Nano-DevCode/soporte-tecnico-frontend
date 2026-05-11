import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { EquipmentForm } from "../components/CustomEquipmentForm";
import { useEquipments } from "../hooks/useEquipments";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import { Loader2 } from "lucide-react";
import type { EquipmentPayload } from "../actions/post-equipment.action";

export const UpdateEquipmentPage = () => {
    const { id } = useParams(); // Obtiene el ID desde la ruta /equipments/edit/:id
    const navigate = useNavigate();
    const { updateEquipmentAsync, isUpdating } = useEquipments();

    // 1. Obtener los datos actuales del equipo para rellenar el formulario
    const { data: equipment, isLoading, isError } = useQuery({
        queryKey: ["equipment", id],
        queryFn: async () => {
            const { data } = await soporteTecnicoApi.get(`/equipments/${id}`);
            return data;
        },
        enabled: !!id, // Solo se ejecuta si el ID existe
    });

    // 2. Función que se dispara al dar clic en "Actualizar"
    const handleUpdate = async (formData: EquipmentPayload) => {
        try {
            if (!id) return;
            await updateEquipmentAsync({ id, data: formData });
            navigate("/equipments"); // O la ruta de tu lista de inventario
        } catch (error) {
            // El error ya lo maneja el Toast dentro del hook useEquipments
            console.error("Error al actualizar:", error);
        }
    };

    // Estado de carga inicial (mientras descargamos los datos del equipo)
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={40} />
                <p className="text-slate-500 font-medium">Cargando información del equipo...</p>
            </div>
        );
    }

    // Estado de error (si el equipo no existe)
    if (isError) {
        return (
            <div className="text-center p-10 bg-red-50 rounded-xl border border-red-200">
                <h2 className="text-red-800 font-bold">Error</h2>
                <p className="text-red-600">No se pudo encontrar el equipo solicitado.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 underline">Volver atrás</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Actualizar Equipo</h1>
                <p className="text-slate-500">Modifica los detalles técnicos o la asignación del equipo.</p>
            </header>

            {/* Reutilizamos el formulario pasándole los datos iniciales */}
            <EquipmentForm 
                onSubmit={handleUpdate} 
                isSubmitting={isUpdating}
                initialData={equipment} 
            />
        </div>
    );
};