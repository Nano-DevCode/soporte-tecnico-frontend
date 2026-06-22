import { useNavigate } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// Hooks y Componentes
import { useTools } from "../hooks/useTools";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomToolForm, type ToolFormValues } from "../components/CustomToolForm";
import { t } from "i18next";

export const ToolCreatePage = () => {
  const navigate = useNavigate();
  const { createToolAsync, isCreating } = useTools();

  const handleCreate = async (data: ToolFormValues) => {
    // 1. Añadimos la validación para asegurar que exista la imagen
    if (!data.model?.id || !data.type?.id || !data.image || data.image.length === 0) {
      return;
    }

    // 2. Agregamos al payload SOLO los datos que espera NestJS (sin quantity)
    const payload = {
      description: data.description,
      modelId: data.model.id,
      typeId: data.type.id,
      // Si el usuario escribió algo, lo mandamos. Si no, lo omitimos.
      idInternal: data.idInternal ? data.idInternal : undefined,
      image: data.image[0], 
    };

    try {
      await sileo.promise(createToolAsync(payload), {
        loading: { title: t("tools.create.sileo.loading.title", "Creando herramienta...") },
        success: { 
          title: t("tools.create.sileo.success.title", "Herramienta creada exitosamente"), 
          description: t("tools.create.sileo.success.description", "La herramienta ha sido creada correctamente"),
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = t("generic_error_backend_message");
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: t("tools.create.sileo.error.title", "Error al crear la herramienta"), 
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
      console.error(t("tools.create.logs.error", "Error al crear la herramienta"), error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList 
        onBack={() => navigate('/tools')} 
        backLabel={t("tools.backList.backLabel", "Volver a la lista de herramientas")}
      />

      <CustomToolForm 
        mode="create" 
        onSubmitCallback={handleCreate} 
        isMutating={isCreating} 
      />
    </div>
  );
};