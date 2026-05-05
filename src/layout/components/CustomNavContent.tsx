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
  Tickets,
  CalendarRange,
  ShieldUser,
  Hammer
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { useUserRoles } from "@/auth/hooks/useUserRoles";

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
  const { isSuperAdmin, isBossCC, isCoordinator } = useUserRoles();

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

        {(isSuperAdmin || isCoordinator || isBossCC) && 
          (<Collapsible className="group/collapsible" defaultOpen={pathname.startsWith("/user") || pathname.startsWith("/department")}>
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

                <Link to='/users' className={getItemClass(pathname.startsWith("/users"))}>
                  <List className="h-4 w-4" /> {t("custom_nav_content_users")}
                </Link>

                <Link to='/departments' className={getItemClass(pathname.startsWith("/departments"))}>
                  <List className="h-4 w-4" /> {t("custom_nav_content_depatment")}
                </Link>


              </div>
            </CollapsibleContent>
          </Collapsible>)
        }

        {(isSuperAdmin || isCoordinator || isBossCC) &&
          (<Link to="/tools" className={getItemClass(pathname === '/tools')}>
            <Hammer className="h-5 w-5 shrink-0" />
            <span className="flex-1">{t("custom_nav_content_subitem_list_tickets")}</span>
          </Link>)
        }


        <Collapsible className="group/collapsible" defaultOpen={pathname.startsWith("/user") || pathname.startsWith("/department")}>
          <CollapsibleTrigger asChild>
            <button className={triggerClass}>
              <Users className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">
                Inventarios
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">

              <Link to='/equipment' className={getItemClass(pathname.startsWith("/equipment"))}>
                <List className="h-4 w-4" /> Lista de equipos
              </Link>

              <Link to='/department' className={getItemClass(pathname.startsWith("/department"))}>
                <List className="h-4 w-4" /> Lista de materiales
              </Link>


            </div>
          </CollapsibleContent>
        </Collapsible>

        <Link to="/tickets" className={getItemClass(pathname === '/tickets')}>
          <Tickets className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("custom_nav_content_subitem_list_tickets")}</span>
        </Link>

        <Link to="/school-period" className={getItemClass(pathname === '/school-period')}>
          <CalendarRange className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("custom_nav_content_subitem_list_school_periods")}</span>
        </Link>

        <Link to="/center-managers" className={getItemClass(pathname === '/center-managers')}>
          <ShieldUser className="h-5 w-5 shrink-0" />
          <span className="flex-1">{t("custom_nav_content_subitem_list_center_managers")}</span>
        </Link>

        {/* --- ITEM COLAPSABLE: TICKETS --- */}
        {/* Puedes pasarle 'defaultOpen={true}' al Collapsible si un hijo está activo */}
        {/* <Collapsible className="group/collapsible" defaultOpen={pathname.includes('/ticket')}>
          <CollapsibleTrigger asChild>
            <button className={triggerClass}>
              <Tickets className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">
                {t("custom_nav_content_tickets")}
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">

              <Link to='/ticket' className={getSubItemClass(true)}>
                <List className="h-4 w-4" /> {t("custom_nav_content_subitem_list_tickets")}
              </Link>

            </div>
          </CollapsibleContent>
        </Collapsible> */}

        {/* --- ITEM COLAPSABLE: PERIODO ESCOLAR --- */}
        {/* <Collapsible className="group/collapsible" defaultOpen={pathname.includes('/school-period')}>
          <CollapsibleTrigger asChild>
            <button className={triggerClass}>
              <CalendarRange className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">
                {t("custom_nav_content_school_periods")}
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">

              <Link to='/school-period' className={getSubItemClass(true)}>
                <List className="h-4 w-4" /> {t("custom_nav_content_subitem_list_school_periods")}
              </Link>

            </div>
          </CollapsibleContent>
        </Collapsible> */}

        {/* --- ITEM COLAPSABLE: Jefe cc --- */}
        {/* <Collapsible className="group/collapsible" defaultOpen={pathname.includes('/center-managers')}>
          <CollapsibleTrigger asChild>
            <button className={triggerClass}>
              <ShieldUser className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">
                {t("custom_nav_content_center_managers")}
              </span>
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">

              <Link to='/center-managers' className={getSubItemClass(true)}>
                <List className="h-4 w-4" /> {t("custom_nav_content_subitem_list_center_managers")}
              </Link>

            </div>
          </CollapsibleContent>
        </Collapsible> */}

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