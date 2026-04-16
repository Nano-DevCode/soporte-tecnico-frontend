import { Settings } from "lucide-react";
import { CustomLanguageConfiguration } from "../components/CustomLanguageConfiguration";
import { CustomPasswordConfiguration } from "../components/CustomPasswordConfiguration";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { useTranslation } from "react-i18next";

export const ConfigurationPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex w-full max-w-4xl flex-col p-4 md:p-8 mx-auto animate-in fade-in duration-500">
      
      {/* Encabezado Principal usando tu componente */}
      <CustomTitleCard 
        title={t("configuration_page_title_card")} 
        description={t("configuration_page_description_card")}
        icon={Settings} 
      />

      {/* Grid de Tarjetas */}
      <div className="flex flex-col gap-8 mt-2">
        <CustomLanguageConfiguration />
        <CustomPasswordConfiguration />
      </div>

    </div>
  );
};