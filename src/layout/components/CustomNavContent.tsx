import { memo } from "react"; // <-- 1. Importamos memo
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
  Cog,
  Bell,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

const getItemClass = (isActive: boolean) => cn(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
  isActive 
    ? "bg-primary text-primary-foreground shadow-sm" 
    : "text-muted-foreground hover:bg-muted hover:text-foreground"
);

const getSubItemClass = (isActive: boolean) => cn(
  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted hover:text-foreground",
  isActive
    ? "font-medium text-foreground bg-muted" 
    : "text-muted-foreground"
);

const triggerClass = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer group/collapsible";


// 3. ENVOLVEMOS EL COMPONENTE EN React.memo()
export const CustomNavContent = memo(() => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <ScrollArea className="flex-1 px-3 py-4">
      <nav className="flex flex-col gap-1">

        <Link to="/" className={getItemClass(pathname === '/')}>
          <Home className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("start")}</span>
        </Link>

        {/* --- ITEM SIMPLE: DASHBOARD --- */}
        <a href="/" className={getItemClass(false)}>
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("dashboard")}</span>
        </a>

        <Collapsible className="group/collapsible" defaultOpen={pathname.startsWith("/user") || pathname.startsWith("/department")}>
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
              
              <Link to='/user'  className={getItemClass(pathname.startsWith("/user"))}>
                <List className="h-4 w-4"/> {t("custom_nav_content_users")}
              </Link>

              <Link to='/department'  className={getItemClass(pathname.startsWith("/department"))}>
                <List className="h-4 w-4"/> {t("custom_nav_content_depatment")}
              </Link>
              
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
  );
});