

    import { useEquipments } from "../hooks/useCreate-UpdateEquipment";
    import { EquipmentForm } from "../components/CustomEquipmentForm";
    import { useNavigate } from "react-router";
    import type { EquipmentPayload } from "../actions/post-equipment.action";


    export const CreateEquipmentPage = () => {
        const navigate = useNavigate();
        const { createEquipmentAsync, isCreating } = useEquipments();

        // ESTO ES LO QUE PREGUNTASTE:
        const handleFormSubmit = async (formData: EquipmentPayload) => {
            try {
                // 1. Llama a la mutación de React Query
                await createEquipmentAsync(formData);
                
                // 2. Si la API responde OK, rediriges al usuario
                navigate("/inventario"); 
            } catch (err) {
                // El error ya lo muestra el Toast (configurado en el hook)
                // Aquí puedes poner lógica extra, como limpiar un campo específico
                console.error("Error al guardar:", err);
            }
        };

        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Registrar Nuevo Equipo</h1>
                
                {/* Le pasas la función al formulario */}
                <EquipmentForm 
                    onSubmit={handleFormSubmit} 
                    isSubmitting={isCreating} 
                />
            </div>
        );
    };