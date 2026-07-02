import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { sileo } from "sileo";
import { isAxiosError } from "axios";
import { useDepartment } from "../hooks/useDepartment";
import { useUpdateDepartment } from "../hooks/useUpdateDepartment";
import { CustomDepartmentForm } from "../components/CustomDepartmentForm";
import { CustomSkeletonInformation } from "@/components/custom/CustomSkeletonInformation";
import type { Department } from "../interfaces/department.interface";
import type { BackendError } from "@/interfaces/backendError.interfaces";
import { CustomTitlePageWithBack } from "@/components/custom/CustomTitlePageWithBack";
import { logError } from "@/utils/logger";

const DepartmentEditPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const { department, isLoading: isLoadingData } = useDepartment();
  const { updateDepartment, isUpdating } = useUpdateDepartment();

  const handleUpdate = async (data: Department) => {
    if (!id) return;

    // Se removió el 'folio' del payload
    const payload = {
      name: data.name.trim(),
      acronym: data.acronym.trim().toUpperCase(),
      priority: data.priority,
    };

    try {
      await sileo.promise(updateDepartment({ id, data: payload }), {
        loading: { title: t("departments.pages.departmentEditPage.sileo.loading") },
        success: { 
          title: t("departments.pages.departmentEditPage.sileo.successTitle"), 
          description: t("departments.pages.departmentEditPage.sileo.successDescription"),
          duration: 4000 
        },
        error: (err) => { 
          let backendMessage = t("departments.pages.departmentEditPage.sileo.errorDefault");
          if (isAxiosError<BackendError>(err) && err.response?.data?.message) {
            const rawMessage = err.response.data.message;
            backendMessage = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
          }
          return {
            title: t("departments.pages.departmentEditPage.sileo.errorTitle"), 
            description: backendMessage,
            duration: 5000,
          };
        }
      });
      navigate("/departments");
    } catch (error) {
      logError(error, "DepartmentEditPage");
    }
  };

  if (isLoadingData) {
    return <CustomSkeletonInformation />;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <CustomTitlePageWithBack
        backLink="/departments"
        title={t("departments.pages.departmentEditPage.title")}
        description={t("departments.pages.departmentEditPage.description")}
      />

      <CustomDepartmentForm 
        mode="edit" 
        department={department} 
        onSubmitCallback={handleUpdate} 
        isMutating={isUpdating} 
      />
    </div>
  );
};

export default DepartmentEditPage;