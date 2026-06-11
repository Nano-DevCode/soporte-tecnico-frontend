import { ArrowRightLeft } from "lucide-react";

import { useItAssetsMovements } from "../hooks/useItAssetsMovements";

import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomItAssetsMovementDesktopTable } from "../components/CustomItAssetsMovementDesktopTable";
import { CustomItAssetsMovementMobileCard } from "../components/CustomItAssetsMovementMobileCard";
import { CustomItAssetsMovementsFilters } from "../components/CustomItAssetsMovementsFilters";

export const ItAssetsMovementsPage = () => {
  const { itAssetsMovements, meta, isLoadingMovements } = useItAssetsMovements();
  console.log(itAssetsMovements, meta);
  

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CustomTitleCard 
          icon={ArrowRightLeft} 
          title="Movimientos de Activos" 
          description="Historial de entradas y salidas de los activos de TI."
        />
      </div>
      
      <CustomItAssetsMovementsFilters />

      {isLoadingMovements ? (
        <CustomSkeletonTableCard />
      ) : (
        <>
          <CustomItAssetsMovementDesktopTable movements={itAssetsMovements} />
          
          <CustomItAssetsMovementMobileCard movements={itAssetsMovements} />
          
          <CustomPagination totalPages={meta?.lastPage ?? 0} />
        </>
      )}
    </div>
  );
};