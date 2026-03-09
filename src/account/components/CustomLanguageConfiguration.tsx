import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export const CustomLanguageConfiguration = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language?.split('-')[0] || 'es';

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
  };

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          {t("custom_language_configuration_title")}
        </CardTitle>
        <CardDescription>
          {t("custom_language_configuration_description")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-5 md:p-6">
        <div className="max-w-md space-y-3">
          {/* Label sin colores fijos */}
          <Label className="text-sm font-medium">
            {t("custom_language_configuration_now_language")}
          </Label>
          
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            {/* Input adaptativo: gris clarito/oscuro en reposo, fondo puro al enfocar */}
            <SelectTrigger className="w-full h-11 bg-muted/20 focus:bg-background transition-colors">
              <SelectValue placeholder="Selecciona un idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">{t("custom_language_configuration_select_language_es")}</SelectItem>
              <SelectItem value="en">{t("custom_language_configuration_select_language_en")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};