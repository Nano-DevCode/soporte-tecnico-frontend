import { Link, useSearchParams } from "react-router";
import { Plus, LayoutGrid, Monitor, Printer, Network, Box, type LucideIcon } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { CustomEquipmentFilters } from "../components/CustomEquipmentFilters";
import { CustomEquipmentDesktopTable } from "../components/CustomEquipmentDesktopTable";
import { CustomEquipmentMobileCard } from "../components/CustomEquipmentMobileCard";
import { useEquipments } from "../hooks/useEquipments";
import type { EquipmentCategory } from "../interfaces/equipment.interface";
import { EquipmentActionDialog } from "../components/EquipmentActionDialog";
import { t } from "i18next";

const GET_HEADER_CONFIG = (category: string) => {
  const configs: Record<string, { title: string; icon: LucideIcon }> = {
    all: { title: t("eq_page_cat_all"), icon: LayoutGrid },
    computer: { title: t("eq_page_cat_computer"), icon: Monitor },
    computadora: { title: t("eq_page_cat_computer"), icon: Monitor },
    printer: { title: t("eq_page_cat_printer"), icon: Printer },
    impresora: { title: t("eq_page_cat_printer"), icon: Printer },
    network: { title: t("eq_page_cat_network"), icon: Network },
    red: { title: t("eq_page_cat_network"), icon: Network },
  };
  return configs[category.toLowerCase()] || { title: category, icon: Box };
};

export const EquipmentPage = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
  const { title, icon } = GET_HEADER_CONFIG(currentCategory);

  // Consumimos el hook que ya expone de forma directa la nueva estructura { data, meta }
  const { equipments, meta, isLoading } = useEquipments();

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <div className="flex items-center gap-3 text-[14px] font-bold">
          <CustomTitleCard
            title={t("eq_page_title")}
            description={currentCategory === 'all' ? t("eq_page_desc_all") : `${t("eq_page_desc_prefix")} ${title}`}
            icon={icon}
          />
          <span className="bg-blue-700 text-white text-[13px] font-bold px-2.5 py-2 rounded-sm  mt-1">
            {t("eq_page_total_label")}: {meta.total} {meta.total === 1 ? t("eq_page_total_singular") : t("eq_page_total_plural")}
          </span>
        </div>

        <Button asChild className="bg-blue-700 hover:bg-blue-800">
          <Link to={currentCategory === 'all' ? '/equipments/create' : `/equipments/create?category=${currentCategory}`}>
            <Plus className="mr-2 h-4 w-4" />
            {t("eq_page_btn_add")}
          </Link>
        </Button>
      </div>
      <CustomEquipmentFilters />

      {isLoading ? (
        <CustomSkeletonTableCard />
      ) : (
        <div className="space-y-4">
          <CustomEquipmentDesktopTable
            equipments={equipments}
            category={currentCategory}
          />

          <CustomEquipmentMobileCard
            equipments={equipments}
            category={currentCategory}
          />

          {/* AJUSTE SEGURO: Si lastPage no existe aún, pasamos 1 por defecto en lugar de 0 
              para que el componente de paginación no intente renderizar páginas inexistentes u ocultar controles */}
          <CustomPagination totalPages={meta?.lastPage ?? 1} />
        </div>
      )}

      {/* Sigue manejando de forma global el estado de tus diálogos */}
      <EquipmentActionDialog />
    </div>
  );
};

// import { Link, useSearchParams } from "react-router";
// import { Plus, LayoutGrid, Monitor, Printer, Network, Box, type LucideIcon } from "lucide-react";
// import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
// import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
// import { CustomPagination } from "@/components/custom/CustomPagination";
// import { Button } from "@/components/ui/button";
// import { CustomEquipmentFilters } from "../components/CustomEquipmentFilters";
// import { CustomEquipmentDesktopTable } from "../components/CustomEquipmentDesktopTable";
// import { CustomEquipmentMobileCard } from "../components/CustomEquipmentMobileCard";
// import { useEquipments } from "../hooks/useEquipments";
// import type { EquipmentCategory } from "../interfaces/equipment.interface";
// import { EquipmentActionDialog } from "../components/EquipmentActionDialog";

// const GET_HEADER_CONFIG = (category: string) => {
//   const configs: Record<string, { title: string; icon: LucideIcon }> = {
//     all: { title: 'General', icon: LayoutGrid },
//     computer: { title: 'Cómputo', icon: Monitor },
//     computadora: { title: 'Cómputo', icon: Monitor },
//     printer: { title: 'Impresión', icon: Printer },
//     impresora: { title: 'Impresión', icon: Printer },
//     network: { title: 'Red', icon: Network },
//     red: { title: 'Red', icon: Network },
//   };
//   return configs[category.toLowerCase()] || { title: category, icon: Box };
// };

// export const EquipmentPage = () => {
//   const [searchParams] = useSearchParams();
//   const currentCategory = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
//   const { title, icon } = GET_HEADER_CONFIG(currentCategory);

//   // Consumimos el hook que ya expone de forma directa la nueva estructura { data, meta }
//   const { equipments, meta, isLoading } = useEquipments();

//   return (
//     <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
//         <div className="flex items-center gap-3 text-[14px] font-bold">
//           <CustomTitleCard
//             title="Gestión de Equipos"
//             description={currentCategory === 'all' ? "Inventario completo" : `Equipos de ${title}`}
//             icon={icon}
//           />
//           <span className="bg-blue-700 text-white text-[13px] font-bold px-2.5 py-2 rounded-sm  mt-1">
//             Total de equipos segun los parámetros: {meta.total} {meta.total === 1 ? 'equipo' : 'equipos'}
//           </span>
//         </div>

//         <Button asChild className="bg-blue-700 hover:bg-blue-800">
//           <Link to={currentCategory === 'all' ? '/equipments/create' : `/equipments/create?category=${currentCategory}`}>
//             <Plus className="mr-2 h-4 w-4" />
//             Agregar un Equipo
//           </Link>
//         </Button>
//       </div>
//       <CustomEquipmentFilters />

//       {isLoading ? (
//         <CustomSkeletonTableCard />
//       ) : (
//         <div className="space-y-4">
//           <CustomEquipmentDesktopTable
//             equipments={equipments}
//             category={currentCategory}
//           />

//           <CustomEquipmentMobileCard
//             equipments={equipments}
//             category={currentCategory}
//           />

//           {/* AJUSTE SEGURO: Si lastPage no existe aún, pasamos 1 por defecto en lugar de 0 
//               para que el componente de paginación no intente renderizar páginas inexistentes u ocultar controles */}
//           <CustomPagination totalPages={meta?.lastPage ?? 1} />
//         </div>
//       )}

//       {/* Sigue manejando de forma global el estado de tus diálogos */}
//       <EquipmentActionDialog />
//     </div>
//   );
// };
