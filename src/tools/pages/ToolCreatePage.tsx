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
    if (!data.model?.id || !data.type?.id) return;

    const payload = {
      quantity: Number(data.quantity),
      description: data.description,
      modelId: data.model.id,
      typeId: data.type.id,
    };

    try {
      await sileo.promise(createToolAsync(payload), {
        loading: { title: t("tools.create.sileo.loading.title") },
        success: { 
          title: t("tools.create.sileo.success.title"), 
          description: t("tools.create.sileo.success.title"),
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = t("generic_error_backend_message");
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: t("tools.create.sileo.error.title"), 
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
      console.error(t("tools.create.logs.error"), error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList 
        onBack={() => navigate('/tools')} 
        backLabel={t("tools.backList.backLabel")}
      />

      <CustomToolForm 
        mode="create" 
        onSubmitCallback={handleCreate} 
        isMutating={isCreating} 
      />
    </div>
  );
};