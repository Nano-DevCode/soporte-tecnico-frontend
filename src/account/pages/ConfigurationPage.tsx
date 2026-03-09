import { Settings } from "lucide-react";
import { CustomLanguageConfiguration } from "../components/CustomLanguageConfiguration";
import { CustomPasswordConfiguration } from "../components/CustomPasswordConfiguration";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";

export const ConfigurationPage = () => {
  return (
    <div className="flex w-full max-w-4xl flex-col p-4 md:p-8 mx-auto animate-in fade-in duration-500">
      
      {/* Encabezado Principal usando tu componente */}
      <CustomTitleCard 
        title="Configuración" 
        description="Administra tus preferencias de sistema y la seguridad de tu cuenta." 
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