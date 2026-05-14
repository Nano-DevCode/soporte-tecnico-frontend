

import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
import { EquipmentForm } from "../components/CustomEquipmentForm";
import { useNavigate } from "react-router";
import type { EquipmentPayload } from "../actions/post-equipment.action";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { sileo } from "sileo";


export const CreateEquipmentPage = () => {
    const navigate = useNavigate();
    const { createEquipmentAsync, isCreating } = useEquipments();

    // ESTO ES LO QUE PREGUNTASTE:
    const handleFormSubmit = async (formData: EquipmentPayload) => {
        try {
            // Este se tiene que revisar con los errores a revisar 
            // createEquipmentAsync(formData);
            await sileo.promise(createEquipmentAsync(formData), {
                loading: { title: "Registrando herramienta..." },
                success: {
                    title: "¡Herramienta registrada!",
                    description: `La herramienta se guardó correctamente.`,
                    duration: 4000
                },
                error: {
                    title: "Error al guardar"}
            });

            // 2. Si la API responde OK, rediriges al usuario
            navigate("/equipments");
        } catch (err) {
            // El error ya lo muestra el Toast (configurado en el hook)
            // Aquí puedes poner lógica extra, como limpiar un campo específico
            console.error("Error al guardar:", err);
        }
    };

    return (
        <div className="p-8">
            <CustomBackToList onBack={() => navigate('/equipments')} backLabel={"regreso"} actionUrl="equipments" />

            <h1 className="text-2xl font-bold mb-4">Registrar Nuevo Equipo</h1>

            {/* Le pasas la función al formulario */}
            <EquipmentForm
                onSubmit={handleFormSubmit}
                isSubmitting={isCreating} mode={"create"}            />
        </div>
    );
};