import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  Settings,
  ChevronRight,
  List,
  UserPlus,
  Cog,
  Bell,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';


export const CustomNavContent = () => {
  const { t } = useTranslation();
  const {pathname} = useLocation();
  /* console.log(pathname); */

  // 1. Convertimos las constantes en funciones que aceptan (isActive: boolean)
  const getItemClass = (isActive: boolean) => cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
    isActive 
      ? "bg-primary text-primary-foreground shadow-sm" // Estilo ACTIVO (Resaltado)
      : "text-muted-foreground hover:bg-muted hover:text-foreground" // Estilo INACTIVO
  )

  const getSubItemClass = (isActive: boolean) => cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground",
    isActive
      ? "font-medium text-foreground bg-muted" // Estilo Sub-item ACTIVO
      : "text-muted-foreground" // Estilo Sub-item INACTIVO
  )

  // Clase base para el disparador del acordeón (se queda igual, o puedes aplicarle lógica también)
  const triggerClass = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer group/collapsible"

  return (
    <ScrollArea className="flex-1 px-3 py-4">
      <nav className="flex flex-col gap-1">
        
        {/* --- ITEM SIMPLE: Inicio (False) --- */}
        <Link to="/" className={getItemClass(pathname === '/')}>
          <Home className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("start")}</span>
        </Link>

        {/* --- ITEM SIMPLE: DASHBOARD (True - EJEMPLO ACTIVO) --- */}
        <a href="/" className={getItemClass(false)}>
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("dashboard")}</span>
        </a>

        {/* --- ITEM COLAPSABLE: USUARIOS --- */}
        {/* Puedes pasarle 'defaultOpen={true}' al Collapsible si un hijo está activo */}
        <Collapsible className="group/collapsible" defaultOpen={pathname.includes('/user')}>
          <CollapsibleTrigger asChild>
            <button className={triggerClass}>
              <Users className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">
                {t("users")}
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              
              <Link to='/user'  className={getSubItemClass(true)}>
                <List className="h-4 w-4"/> {t("list_users")}
              </Link>

              <a href="/users/create" className={getSubItemClass(false)}>
                <UserPlus className="h-4 w-4" /> {t("create_user")}
              </a>
              
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* --- ITEM COLAPSABLE: CONFIGURACIÓN --- */}
        <Collapsible className="group/collapsible">
          <CollapsibleTrigger asChild>
            <button className={triggerClass}>
              <Settings className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">{t("settings")}</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
              <a href="/settings/general" className={getSubItemClass(false)}>
                <Cog className="h-4 w-4" /> {t("general")}
              </a>
              <a href="/settings/notifications" className={getSubItemClass(false)}>
                <Bell className="h-4 w-4" /> {t("notifications")}
              </a>
            </div>
          </CollapsibleContent>
        </Collapsible>

      </nav>
    </ScrollArea>
  )
}