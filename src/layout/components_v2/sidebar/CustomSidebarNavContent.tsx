import React, { memo, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from 'react-i18next';
import { useUserRoles } from "@/auth/hooks/useUserRoles";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LayoutDashboard, Users, ChevronRight, List, Cog, Home, Ticket, CalendarRange, ShieldUser, Archive, ClipboardList, MonitorCog, FileDigit, Building, Building2, MessageSquareReply, Blocks, TicketCheck, Headset, FileSpreadsheet, HelpCircle, HammerIcon, Sparkles } from "lucide-react";

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

// Funciones puras movidas FUERA del componente para no desperdiciar memoria
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

export const CustomSidebarNavContent = memo(() => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isSuperAdmin, isBossCC, isCoordinator, isBoss, isPlaning, isSecretaryCC, isTechnician, isInventory, isVisitor } = useUserRoles();

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
      show: isSuperAdmin || isBossCC || isCoordinator,
    },
    {
      title: t("tickets.menu_options.label"),
      icon: Headset,
      show: isSuperAdmin || isBossCC || isCoordinator || isBoss || isPlaning || isSecretaryCC || isTechnician || isVisitor,
      subItems: [
        {
          title: t("tickets.menu_options.current"),
          icon: Ticket,
          path: "/tickets/currents",
          show: isSuperAdmin || isBossCC || isCoordinator || isBoss || isPlaning || isSecretaryCC || isTechnician,
        },
        {
          title: t("tickets.menu_options.history"),
          icon: TicketCheck,
          path: "/tickets",
          show: isSuperAdmin || isBossCC || isCoordinator || isBoss || isPlaning || isSecretaryCC || isTechnician || isVisitor,
        },
        {
          title: t("tickets.menu_options.archive"),
          icon: Archive,
          path: "/tickets/archives",
          show: isSuperAdmin || isBossCC || isSecretaryCC || isPlaning,
        },
        {
          title: t("technical_reports.menu_item.title"),
          icon: ClipboardList,
          path: "/technical-reports",
          show: isSuperAdmin || isBossCC || isCoordinator || isSecretaryCC || isTechnician || isVisitor,
        },
      ]
    },
    {
      title: t("common.nav_content.settings.folios.item"),
      icon: FileDigit,
      show: isSuperAdmin || isBossCC || isBoss || isPlaning,
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
          show: isSuperAdmin || isBoss || isPlaning
        },
        {
          title: t("common.nav_content.settings.folios.subitems.responses"),
          icon: MessageSquareReply,
          path: "/folios/responses",
          show: isSuperAdmin || isBossCC
        },
        {
          title: t("common.nav_content.settings.folios.subitems.ot"),
          icon: MessageSquareReply,
          path: "/folios/ot",
          show: isSuperAdmin || isBossCC
        },
      ]
    },
    {
      title: t("custom_nav_content_users"),
      icon: Users,
      show: isSuperAdmin || isCoordinator || isBossCC || isVisitor,
      subItems: [
        { title: t("custom_nav_content_users"), path: "/users", show: true },
        { title: t("custom_nav_content_depatment"), path: "/departments", show: true },
      ]
    },
    {
      title: t("custom_nav_content_it_assets"),
      icon: MonitorCog,
      show: isSuperAdmin || isCoordinator || isBossCC || isVisitor || isInventory,
      subItems: [
        { title: t("custom_nav_content_inventory"), path: "/it-assets", show: true },
        { title: t("custom_nav_content_log"), path: "/it-assets/movements", show: true },
      ]
    },
    {
      title: t("custom_nav_content_tools"),
      icon: HammerIcon,
      show: isSuperAdmin || isCoordinator || isBossCC || isVisitor || isInventory,
      subItems: [
        { title: t("custom_nav_content_inventory"), path: "/tools", show: true },
        { title: t("custom_nav_content_log"), path: "/tools/movements", show: true },
      ]
    },
    {
      title: t("custom_nav_content_subitem_list_consumables"),
      icon: Blocks,
      show: isSuperAdmin || isInventory || isBossCC || isCoordinator || isSecretaryCC || isVisitor,
      subItems: [
        { title: t("custom_nav_content_catalog_consumables"), path: "/consumables", show: isSuperAdmin || isInventory || isBossCC || isCoordinator || isSecretaryCC || isVisitor, },
        { title: t("custom_nav_content_movements_history"), path: "/consumable-movements", show: isSuperAdmin || isInventory || isBossCC || isCoordinator || isSecretaryCC || isVisitor, },
      ]
    },
    {

      title: t("custom_nav_content_list_equipments"),
      icon: Archive,
      show: isSuperAdmin || isTechnician || isCoordinator || isBossCC || isSecretaryCC || isVisitor,
      path: "/equipments",
    },
    {
      title: t("reports.menu.label"),
      icon: FileSpreadsheet,
      path: "/reports",
      show: isSuperAdmin || isBossCC || isCoordinator || isSecretaryCC,
    },
    {
      title: t("settings"),
      icon: Cog,
      show: true,
      subItems: [
        {
          title: t("custom_nav_content_subitem_list_school_periods"),
          icon: CalendarRange,
          path: "/school-period",
          show: isSuperAdmin || isBossCC,
        },
        {
          title: t("custom_nav_content_subitem_list_center_managers"),
          icon: ShieldUser,
          path: "/center-managers",
          show: isSuperAdmin || isBossCC,
        },
        {
          icon: HelpCircle,
          title: t("surveys.menu.questions"),
          path: "/survey/questions",
          show: isSuperAdmin
        },
        {
          icon: Sparkles,
          title: t("future_features", "Funciones Futuras"),
          path: "/features",
          show: isSuperAdmin
        },
      ]
    }
  ], [t, isSuperAdmin, isCoordinator, isBossCC, isVisitor, isInventory, isSecretaryCC, isTechnician, isBoss, isPlaning]);

  const activeMenuPath = useMemo(() => {
    const allPaths = navItems
      .flatMap(item => (item.subItems ? item.subItems.map(sub => sub.path) : [item.path]))
      .filter(Boolean) as string[];

    let bestMatch = "";

    for (const path of allPaths) {
      if (path === "/") {
        if (pathname === "/") bestMatch = "/";
        continue;
      }

      const isMatch = pathname === path || pathname.startsWith(`${path}/`);

      if (isMatch && path.length > bestMatch.length) {
        bestMatch = path;
      }
    }

    return bestMatch;
  }, [pathname, navItems]);

  return (
    <ScrollArea className="flex-1 min-h-0 px-3 py-4">
      <nav className="flex flex-col gap-1">
        {navItems.reduce((acc: React.ReactNode[], item) => {
          if (!item.show) return acc;

          if (item.subItems) {
            const isActiveGroup = item.subItems.some(sub => sub.path === activeMenuPath);

            acc.push(
              <Collapsible key={item.title} className="group/collapsible" defaultOpen={isActiveGroup}>
                <CollapsibleTrigger asChild>
                  <button type="button" className={getTriggerClass(isActiveGroup)}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                    {item.subItems.reduce((subAcc: React.ReactNode[], sub) => {
                      if (!sub.show) return subAcc;
                      subAcc.push(
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={getSubItemClass(sub.path === activeMenuPath)}
                        >
                          {sub.icon ? <sub.icon className="h-4 w-4" /> : <List className="h-4 w-4" />}
                          {sub.title}
                        </Link>
                      );
                      return subAcc;
                    }, [])}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          } else {
            acc.push(
              <Link
                key={item.path!}
                to={item.path!}
                className={getItemClass(item.path === activeMenuPath)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.title}</span>
              </Link>
            );
          }

          return acc;
        }, [])}
      </nav>
    </ScrollArea>
  );
});