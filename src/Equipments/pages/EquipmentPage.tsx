import { Link, useSearchParams } from "react-router";
import { Plus, LayoutGrid, Monitor, Printer, Network, Box, type LucideIcon} from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { CustomEquipmentFilters } from "../components/CustomEquipmentFilters";
import { CustomEquipmentDesktopTable } from "../components/CustomEquipmentDesktopTable";
import { CustomEquipmentMobileCard } from "../components/CustomEquipmentMobileCard";
import { useEquipments } from "../hooks/useEquipments";
import type {  EquipmentCategory } from "../interfaces/equipment.interface";

// 1. IMPORTA EL NUEVO DIÁLOGO QUE CREAMOS
import { EquipmentActionDialog } from "../components/EquipmentActionDialog"; 

const GET_HEADER_CONFIG = (category: string) => {
  const configs: Record<string, { title: string; icon: LucideIcon }> = {
    all: { title: 'General', icon: LayoutGrid },
    computer: { title: 'Cómputo', icon: Monitor },
    computadora: { title: 'Cómputo', icon: Monitor },
    printer: { title: 'Impresión', icon: Printer },
    impresora: { title: 'Impresión', icon: Printer },
    network: { title: 'Red', icon: Network },
    red: { title: 'Red', icon: Network },
  };
  return configs[category.toLowerCase()] || { title: category, icon: Box };
};
// ... (imports se mantienen igual)

export const EquipmentPage = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = (searchParams.get('category') || 'all') as EquipmentCategory | 'all';
  const { title, icon } = GET_HEADER_CONFIG(currentCategory);

  const { equipments, meta, isLoading } = useEquipments();

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CustomTitleCard
          title="Gestión de Equipos"
          description={currentCategory === 'all' ? "Inventario completo" : `Equipos de ${title}`}
          icon={icon}
        />
        <Button asChild className="bg-blue-700 hover:bg-blue-800">
          <Link to={currentCategory === 'all' ? '/equipments/create' : `/equipments/create?category=${currentCategory}`}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar un Equipo
          </Link>
        </Button>
      </div>

      <CustomEquipmentFilters />

      {isLoading ? (
        <CustomSkeletonTableCard />
      ) : (
        <div className="space-y-4">
          {/* AJUSTE AQUÍ: Eliminamos las funciones innecesarias */}
          <CustomEquipmentDesktopTable
            equipments={equipments}
            category={currentCategory}
          />
          
          <CustomEquipmentMobileCard
            equipments={equipments}
            category={currentCategory}
          />

          <CustomPagination totalPages={meta?.lastPage ?? 0} />
        </div>
      )}

      {/* Este componente es el que ahora maneja toda la lógica de los diálogos */}
      <EquipmentActionDialog /> 
    </div>
  );
};
