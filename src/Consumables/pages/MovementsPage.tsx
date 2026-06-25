import { Link } from "react-router";
import { Plus, History, Activity } from "lucide-react";
import { t } from "i18next";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { CustomMovementHistoryFilters } from "../components/CustomMovementHistoryFilters"; 
import { CustomMovementsDesktopTable } from "../components/CustomMovementsDesktopTable";
import { CustomMovementsMobileCard } from "../components/CustomMovementsMobileCard";
import { useConsumableMovementsList } from "../hooks/useConsumableMovements";
import { CanAction } from "../permissions/Can";
export const MovementsPage = () => {
    const { movements, meta, isLoading } = useConsumableMovementsList();

    return (
        <CanAction permission="VIEW_MOVEMENTS_HISTORY">
            <div className="space-y-6  animate-in fade-in duration-500">

                {/* HEADER OPERATIVO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 text-2xl">
                        <CustomTitleCard
                            title={t("movementsPage.title")}
                            description={t("movementsPage.description")}
                            icon={History}
                        />
                    </div>

                    <CanAction permission="MOV_ADD_CONSUMABLE_TO_THE_BAG">
                        <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white w-full sm:w-auto">
                            <Link to="/consumables">
                                <Plus className="mr-2 h-4 w-4" />
                                {t("movementsPage.btnSelectConsumables")}
                            </Link>
                        </Button>
                    </CanAction>
                </div>

                <CustomMovementHistoryFilters />

                <h4 className="text-sm text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    {t("movementsPage.totalOperations", { count: meta?.total ?? 0 })}
                </h4>

                {/* RENDERIZADO CONDICIONAL DE VISTAS */}
                {isLoading ? (
                    <CustomSkeletonTableCard />
                ) : (
                    <div className="space-y-4">
                        <CustomMovementsDesktopTable movements={movements} />
                        <CustomMovementsMobileCard movements={movements} />
                        <CustomPagination totalPages={meta?.lastPage ?? 1} />
                    </div>
                )}
            </div>
        </CanAction>
    );
};