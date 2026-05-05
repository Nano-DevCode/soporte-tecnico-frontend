import { useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useTools } from "../hooks/useTools";
import { CustomToolForm, type ToolFormValues } from "../components/CustomToolForm";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { Loader2 } from "lucide-react";

export const ToolUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const { 
    updateToolAsync, 
    isUpdating,
    tool: initialData, 
    toolLoading: isLoadingTool
  } = useTools();

  const handleUpdate = async (data: ToolFormValues) => {
    if (!id || !data.model?.id || !data.type?.id) return;

    const payload = {
      id: id,
      quantity: Number(data.quantity),
      description: data.description,
      modelId: data.model.id,
      typeId: data.type.id,
    };

    try {
      await sileo.promise(updateToolAsync(payload), {
        loading: { title: "Actualizando herramienta..." },
        success: { 
          title: "¡Herramienta actualizada!", 
          description: `Los cambios se guardaron correctamente.`,
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = "Revisa los datos e intenta de nuevo.";
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: "Error al actualizar", 
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
      console.error("Error en la actualización:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList 
        onBack={() => navigate('/tools')} 
        backLabel="Lista de Herramientas"
      />

      {isLoadingTool ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando datos de la herramienta...</p>
        </div>
      ) : initialData ? (
        <CustomToolForm 
          mode="update" 
          initialData={initialData} 
          onSubmitCallback={handleUpdate} 
          isMutating={isUpdating} 
        />
      ) : (
        <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
          No se encontró la herramienta o fue eliminada.
        </div>
      )}
    </div>
  );
};