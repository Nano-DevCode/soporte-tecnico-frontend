import { useTranslation } from 'react-i18next';
import LogoIto from '@/assets/logo-SinFondo.png'

export const CustomLogo = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-16 items-center gap-2 border-b px-4">
      <div className="flex h-8 w-8 items-center justify-center">
        <img 
          src={LogoIto} 
          alt="Logo" 
          className="h-full w-full object-contain" 
        />
      </div>
      <span className="text-lg font-semibold text-foreground">
        {t("title_app")}
      </span>
    </div>
  );
};