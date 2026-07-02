import { ArrowRightLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useToolsMovements } from "../hooks/useToolsMovements";

import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomToolsMovementDesktopTable } from "../components/CustomToolsMovementDesktopTable";
import { CustomToolsMovementMobileCard } from "../components/CustomToolsMovementMobileCard";
import { CustomToolsMovementsFilters } from "../components/CustomToolsMovementsFilters";
import { useAuthStore } from "@/auth/store/auth.store";

const ToolsMovementsPage = () => {
  const { t } = useTranslation();
  const { toolsMovements, meta, isLoadingMovements } = useToolsMovements();
  const isVisitor = useAuthStore((state) => state.isVisitor);
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      {isVisitor() && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CustomTitleCard 
            icon={ArrowRightLeft} 
            title={t("tools.movementsPage.header.title")} 
            description={t("tools.movementsPage.header.description")}
          />
      </div>)}
      
      <CustomToolsMovementsFilters />

      {isLoadingMovements ? (
        <CustomSkeletonTableCard />
      ) : (
        <>
          <CustomToolsMovementDesktopTable movements={toolsMovements} />
          
          <CustomToolsMovementMobileCard movements={toolsMovements} />
          
          <CustomPagination totalPages={meta?.lastPage ?? 0} />
        </>
      )}
    </div>
  );
};

export default ToolsMovementsPage;