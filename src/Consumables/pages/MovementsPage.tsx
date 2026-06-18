import { Link } from "react-router";
import { Plus, History, Activity } from "lucide-react";
import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { CustomMovementHistoryFilters } from "../components/CustomMovementHistoryFilters"; 
import { CustomMovementsDesktopTable } from "../components/CustomMovementsDesktopTable";
import { CustomMovementsMobileCard } from "../components/CustomMovementsMobileCard";
import { useConsumableMovementsList } from "../hooks/useConsumableMovements";

export const MovementsPage = () => {
    const { movements, meta, isLoading } = useConsumableMovementsList();

    return (
        <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">

            {/* HEADER OPERATIVO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 text-2xl">
                    <CustomTitleCard
                        title="Historial de Movimientos"
                        description="Historial unificado de entradas y salidas de consumibles de almacén con desglose PEPS."
                        icon={History}
                    />
                </div>

                <Button asChild className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto">
                    <Link to="/consumables">
                        <Plus className="mr-2 h-4 w-4" />
                        Seleccionar consumibles
                    </Link>
                </Button>
            </div>

            <CustomMovementHistoryFilters />

            {/* CONTADOR DE REGISTROS */}
            <h4 className="text-sm text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Total de operaciones: {meta.total > 1 ? `${meta.total} operaciones` : `${meta.total} operación`}
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
    );
};
// import { Link } from "react-router";
// import { Plus, History, Activity } from "lucide-react";
// import { CustomTitleCard } from "@/components/custom/CustomTitleCard";
// import { CustomSkeletonTableCard } from "@/components/custom/CustomSkeletonTableCard";
// import { CustomPagination } from "@/components/custom/CustomPagination";
// import { Button } from "@/components/ui/button";
// import { CustomConsumableFilters } from "../components/CustomConsumableFilters"; // Reutiliza o adapta tu input de búsquedas
// import { CustomMovementsDesktopTable } from "../components/CustomMovementsDesktopTable";
// import { CustomMovementsMobileCard } from "../components/CustomMovementsMobileCard";
// import { useConsumableMovementsList } from "../hooks/useConsumableMovements";

// export const MovementsPage = () => {

//     // Consumo directo del hook matemático con datos agrupados reactivos
//     const { movements, meta, isLoading } = useConsumableMovementsList();

//     return (
//         <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">

//             {/* HEADER OPERATIVO */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div className="flex items-center gap-3 text-2xl ">
//                     <CustomTitleCard
//                         title="Historial de Movimientos"
//                         description="Historial unificado de entradas y salidas de consumibles de almacén con desglose PEPS."
//                         icon={History}
//                     />
//                 </div>

//                 <Button asChild className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto">
//                     <Link to="/consumables">
//                         <Plus className="mr-2 h-4 w-4" />
//                         Seleccionar consumibles
//                     </Link>
//                 </Button>
//             </div>

//             {/* FILTROS DE BÚSQUEDA */}
//             <CustomConsumableFilters />

//             {/* CONTADOR DE REGISTROS */}
//             <h4 className="text-sm text-muted-foreground font-semibold mb-1 flex items-center gap-1.5">
//                 <Activity className="h-4 w-4 text-muted-foreground" />
//                 Total de operaciones: {meta.total > 1 ? `${meta.total} operaciones` : `${meta.total} operación`}
//             </h4>

//             {/* RENDERIZADO CONDICIONAL DE VISTAS */}
//             {isLoading ? (
//                 <CustomSkeletonTableCard />
//             ) : (
//                 <div className="space-y-4">

//                     {/* Vista Escritorio Colapsable */}
//                     <CustomMovementsDesktopTable movements={movements} />

//                     {/* Vista Móvil Responsiva */}
//                     <CustomMovementsMobileCard movements={movements} />

//                     {/* Componente de Paginación Seguro */}
//                     <CustomPagination totalPages={meta?.lastPage ?? 1} />
//                 </div>
//             )}
//         </div>
//     );
// };