import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void
}

export const CustomMobilHeader = ({ onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <>
        <div className="flex h-16 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
            
            <div className="flex h-9 w-9 items-center justify-center">
                <img 
                    src="/logo-SinFondo.png" 
                    alt="Logo" 
                    className="h-full w-full object-contain" 
                />
            </div>
            
            <span className="text-lg font-semibold text-foreground">
                {t("title_app")}
            </span>
        </div>

        <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 cursor-pointer" 
            onClick={onClose}
        >
            <X className="h-5 w-5" />
            <span className="sr-only">
                {t("close_menu")}
            </span>
        </Button>
        </div>
    </>
  )
}
