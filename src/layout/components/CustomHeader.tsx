import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomHeaderAvatar } from "./CustomHeaderAvatar";
import { CustomMobileSidebar } from "./CustomMobileSidebar";
import { useTranslation } from 'react-i18next';


 
export function CustomHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-4 sm:h-16 sm:px-6 flex-none">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">
              {t("open_menu")}
            </span>
          </Button>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            
          </h2>
        </div>

        <CustomHeaderAvatar/>
      </header>
      <CustomMobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
