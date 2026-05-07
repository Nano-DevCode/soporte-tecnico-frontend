import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { CustomHeaderAvatar } from "../components/CustomHeaderAvatar";

interface Props {
  onSidebarToggle: () => void;
}

export function CustomAppHeader({ onSidebarToggle }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 sm:h-16 sm:px-6 flex-none">
        <div className="flex items-center gap-3">

          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
          >
            <Menu />
            <span className="sr-only">
              {t("open_menu")}
            </span>
          </Button>
        </div>

        <CustomHeaderAvatar />
      </header>
    </>
  )
}
