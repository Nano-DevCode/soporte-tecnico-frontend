import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { EquipmentForm } from "../components/CustomEquipmentForm";
import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEquipmentByIdAction } from "../actions/get-equipment.actions";
import type { EquipmentPayload } from "../actions/post-equipment.action";

export const UpdateEquipmentPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const { updateEquipmentAsync, isUpdating } = useEquipments();

    const { data: equipment, isLoading, isError } = useQuery({
        queryKey: ["equipment", id],
        queryFn: () => getEquipmentByIdAction(id!),
        enabled: !!id, 
        retry: 1,
        placeholderData: (previousData) => previousData,
    });

    // 1. AJUSTE EN LA FUNCIÓN DE ENVÍO
    const handleUpdate = async (formData: EquipmentPayload) => {
        try {
            if (!id) return;
            
            // El hook useEquipments espera { id, payload }
            // Cambiamos 'data: formData' por 'payload: formData' para que coincida con el hook
            await updateEquipmentAsync({ 
                id, 
                payload: formData 
            });
            
            navigate("/equipments"); 
        } catch (error) {
            console.error("Error en el flujo de actualización:", error);
        }
    };

    if (isLoading && !equipment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-400px">
                <Loader2 className="animate-spin  mb-2" size={40} />
                <p className="text-slate-500 font-medium">Cargando información del equipo...</p>
            </div>
        );
    }

    if (isError || !equipment) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                <h2 className="text-red-800 font-bold text-xl mb-2">Equipo no encontrado</h2>
                <p className="text-red-600/80 mb-6">El registro que intentas editar no existe o no se pudo recuperar.</p>
                <Button variant="outline" onClick={() => navigate("/equipments")} className="border-red-200 text-red-700 hover:bg-red-100">
                    Volver al inventario
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-5xl px-4 space-y-5">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mb-4 -ml-2 gap-2 hover:text-purple-600 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} /> Volver
                    </Button>
                    <h1 className="text-3xl font-bold ">Actualizar Equipo</h1>
                    <p className="text-semibold text-muted-foreground">
                        Modificando: <span className="font-bold text-foreground">{equipment.num_inventario || "Sin inventario"}</span>
                    </p>
                </div>
            </header>
            
            {/* 2. AJUSTE EN LAS PROPS DEL FORMULARIO */}
            <EquipmentForm 
                onSubmit={handleUpdate}
                isSubmitting={isUpdating}
                initialData={equipment} 
                mode="update" // Cambiado de "create" a "update"
            />
        </div>
    );
};