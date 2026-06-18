import { memo, useMemo } from "react";
import { Link, useLocation } from "react-router"; // <-- Cuidado aquí, en React Router v6 suele ser 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useUserRoles } from "@/auth/hooks/useUserRoles";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LayoutDashboard, Users, ChevronRight, List, Cog, Home, Ticket, CalendarRange, ShieldUser, Hammer, Archive, ClipboardList, MonitorCog, FileDigit, Building, Building2, MessageSquareReply, Blocks } from "lucide-react";

// Types para la configuración
type NavSubItem = {
  icon?: React.ElementType;
  title: string;
  path: string;
  show: boolean;
};
type NavItem = {
  title: string;
  icon: React.ElementType;
  path?: string;
  subItems?: NavSubItem[];
  show: boolean;
};

export const CustomSidebarNavContent = memo(() => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isSuperAdmin, isBossCC, isCoordinator, isBoss, isPlaning, isSecretaryCC, isTechnician } = useUserRoles();

  const navItems: NavItem[] = useMemo(() => [
    {
      title: t("start"),
      icon: Home,
      path: "/",
      show: true,
    },
    {
      title: t("dashboard"),
      icon: LayoutDashboard,
      path: "/dashboard",
      show: true,
    },
    {
      title: t("users"),
      icon: Users,
      show: isSuperAdmin || isCoordinator || isBossCC,
      subItems: [
        { title: t("custom_nav_content_users"), path: "/users", show: true },
        { title: t("custom_nav_content_depatment"), path: "/departments", show: true },
      ]
    },
    {
      title: "Activos TI",
      icon: MonitorCog,
      show: isSuperAdmin || isCoordinator || isBossCC,
      subItems: [
        { title: "Inventario", path: "/it-assets", show: true },
        { title: "Bicatora", path: "/it-assets/movements", show: true },
      ]
    },
    {
      title: t("custom_nav_content_subitem_list_tickets"),
      icon: Hammer,
      path: "/tools",
      show: isSuperAdmin || isCoordinator || isBossCC,
    },
    {
      title: t("custom_nav_content_subitem_list_consumables"),
      icon: Blocks,
      show: isSuperAdmin || isCoordinator || isBossCC,
      subItems: [
        { title: ("Consumibles"), path: "/consumables", show: true },
        { title: ("Historial de movimientos"), path: "/consumable-movements", show: true },
      ]
    },
    {
      title: t("equipment_list", "Inventario de Equipos"),
      icon: Archive,
      path: "/equipments",
      show: true,
    },
    {
      title: t("custom_nav_content_subitem_list_tickets"),
      icon: Ticket,
      path: "/tickets",
      show: isSuperAdmin || isBossCC || isCoordinator || isBoss || isPlaning || isSecretaryCC || isTechnician,
    },
    {
      title: t("technical_reports.menu_item.title"),
      icon: ClipboardList,
      path: "/technical-reports",
      show: isSuperAdmin || isBossCC || isCoordinator || isSecretaryCC || isTechnician,
    },
    {
      title: t("custom_nav_content_subitem_list_school_periods"),
      icon: CalendarRange,
      path: "/school-period",
      show: isSuperAdmin || isBossCC || isSecretaryCC,
    },
    {
      title: t("custom_nav_content_subitem_list_center_managers"),
      icon: ShieldUser,
      path: "/center-managers",
      show: isSuperAdmin || isBossCC || isSecretaryCC,
    },
    {
      title: t("common.nav_content.settings.folios.item"),
      icon: FileDigit,
      show: isSuperAdmin || isBossCC || isBoss,
      subItems: [
        {
          title: t("common.nav_content.settings.folios.subitems.list_departments"),
          icon: Building2,
          path: "/folios/tickets",
          show: isSuperAdmin || isBossCC
        },
        {
          title: t("common.nav_content.settings.folios.subitems.my_department"),
          icon: Building,
          path: "/folios/tickets/my-department",
          show: isSuperAdmin || isBoss
        },
        {
          title: t("common.nav_content.settings.folios.subitems.responses"),
          icon: MessageSquareReply,
          path: "/folios/responses",
          show: isSuperAdmin || isBoss
        },
      ]
    },
    {
      title: t("settings"),
      icon: Cog,
      show: true,
      subItems: [
        { title: t("general"), path: "/settings/general", show: true },
        { title: t("notifications"), path: "/settings/notifications", show: true },
      ]
    }
  ], [t, isSuperAdmin, isBossCC, isCoordinator, isBoss, isPlaning, isSecretaryCC, isTechnician]);

  const getItemClass = (isActive: boolean) => cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
    isActive
      ? "bg-primary text-primary-foreground shadow-sm"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  );

  const getSubItemClass = (isActive: boolean) => cn(
    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
    isActive
      ? "font-medium text-foreground bg-muted"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  );

  const getTriggerClass = (isActiveGroup: boolean) => cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer group/collapsible",
    isActiveGroup
      ? "text-foreground bg-slate-50 dark:bg-slate-800/50"
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  );

  return (
    <ScrollArea className="flex-1 min-h-0 px-3 py-4">
      <nav className="flex flex-col gap-1">
        {navItems.filter(item => item.show).map((item, index) => {

          if (item.subItems) {
            const isActiveGroup = item.subItems.some(sub => pathname === sub.path);

            return (
              <Collapsible key={index} className="group/collapsible" defaultOpen={isActiveGroup}>
                <CollapsibleTrigger asChild>
                  <button className={getTriggerClass(isActiveGroup)}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                    {item.subItems.filter(sub => sub.show).map((sub, subIdx) => (
                      <Link key={subIdx} to={sub.path} className={getSubItemClass(pathname === sub.path)}>
                        {
                          sub.icon ? <sub.icon className="h-4 w-4" /> : <List className="h-4 w-4" />
                        }
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          }

          return (
            <Link key={index} to={item.path!} className={getItemClass(pathname === item.path)}>
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );
});