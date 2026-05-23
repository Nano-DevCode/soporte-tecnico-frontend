import { useNavigate, useParams } from "react-router";
import { sileo } from "sileo";
import { isAxiosError } from "axios";

// Hooks y Componentes
import { useTools } from "../hooks/useTools";
import { CustomToolForm, type ToolFormValues } from "../components/CustomToolForm";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import type { BackendError } from "@/interfaces/backendError.interfaces"; 
import { t } from "i18next";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import { CustomToolNotFound } from "@/components/custom/CustomNotFound";

export const ToolEditPage = () => {
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
      description: data.description,
      modelId: data.model.id,
      typeId: data.type.id,
      idInternal: data.idInternal,

      image: data.image && data.image.length > 0 ? data.image[0] : undefined,
    };

    try {
      await sileo.promise(updateToolAsync(payload), {
        loading: { title: t("tools.edit.sileo.loading.title") },
        success: { 
          title: t("tools.edit.sileo.success.title"), 
          description: t("tools.edit.sileo.success.description"),
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = t("generic_error_backend_message");
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: t("tools.edit.sileo.error.title"), 
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
      console.error(t("tools.edit.logs.error"), error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomBackToList 
        onBack={() => navigate('/tools')} 
        backLabel={t("tools.backList.backLabel")}
      />

      {isLoadingTool ? (
        <CustomSkeletonInformation/>
      ) : initialData ? (
        <CustomToolForm 
          mode="update" 
          initialData={initialData} 
          onSubmitCallback={handleUpdate} 
          isMutating={isUpdating} 
        />
      ) : (
        <CustomToolNotFound title={t("tools.notFound.title")} />
      )}
    </div>
  );
};