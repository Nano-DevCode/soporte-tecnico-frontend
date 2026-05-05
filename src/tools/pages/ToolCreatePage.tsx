import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// Hooks y Componentes
import { useTools } from "../hooks/useTools";

import { CustomBackToList } from "@/components/custom/CustomBackToList";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomToolForm, type ToolFormValues } from "../components/CustomToolForm";

export const ToolCreatePage = () => {
  const navigate = useNavigate();
  const { createToolAsync, isCreating } = useTools();

  const handleCreate = async (data: ToolFormValues) => {
    if (!data.model?.id || !data.type?.id) return;

    const payload = {
      quantity: Number(data.quantity),
      description: data.description,
      modelId: data.model.id,
      typeId: data.type.id,
    };

    try {
      await sileo.promise(createToolAsync(payload), {
        loading: { title: "Registrando herramienta..." },
        success: { 
          title: "¡Herramienta registrada!", 
          description: `La herramienta se guardó correctamente.`,
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: "Error al registrar", 
            description: backendMessage,
            duration: 5000,
            fill: "#18181b",
            styles: {
              title: "text-red-500! font-semibold!",
              description: "text-zinc-400!",
            }
          };
        }
      });
      navigate("/tools");
    } catch (error) {
      console.error("Error en la creación:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList 
        onBack={() => navigate('/tools')} 
        backLabel="Lista de Herramientas"
      />

      <CustomToolForm 
        mode="create" 
        onSubmitCallback={handleCreate} 
        isMutating={isCreating} 
      />
    </div>
  );
};