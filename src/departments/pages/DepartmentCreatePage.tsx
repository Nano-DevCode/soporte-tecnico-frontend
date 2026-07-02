import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useCreateDepartment } from "../hooks/useCreateDepartment";
import { CustomDepartmentForm } from "../components/CustomDepartmentForm";
import type { Department } from "../interfaces/department.interface";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

export const DepartmentCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createDepartment, isCreating } = useCreateDepartment();

  const handleCreate = async (data: Department) => {
    const payload = {
      name: data.name.trim(),
      acronym: data.acronym.trim().toUpperCase(),
      priority: Number(data.priority),
    };

    try {
      await sileo.promise(createDepartment(payload), {
        loading: { title: t("departments.pages.departmentCreatePage.sileo.loading") },
        success: { 
          title: t("departments.pages.departmentCreatePage.sileo.successTitle"), 
          description: t("departments.pages.departmentCreatePage.sileo.successDescription", { name: payload.name }),
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = t("departments.pages.departmentCreatePage.sileo.errorDefault");
          
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          
          return {
            title: t("departments.pages.departmentCreatePage.sileo.errorTitle"), 
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
      navigate("/departments");
    } catch (error) {
      logError(error, "DepartmentCreatePage");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomTitlePageWithBack 
        backLink="/departments"
        title={t("departments.pages.departmentCreatePage.title")}
        description={t("departments.pages.departmentCreatePage.description")}
      />

      <CustomDepartmentForm 
        mode="create" 
        onSubmitCallback={handleCreate} 
        isMutating={isCreating} 
      />
    </div>
  );
};

export default DepartmentCreatePage;