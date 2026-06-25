import { useNavigate } from "react-router";
import { t } from "i18next";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { useConsumablesBagData } from "../hooks/useConsumables"; 
import { ConsumableOutputForm } from "../components/CustomConsumableOutputForm";
import { Button } from "@/components/ui/button";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { ShoppingBag, PackageOpen, Loader2, AlertCircle } from "lucide-react";
import { CanAction } from "../permissions/Can"

export const ConsumableOutputPage = () => {
    const navigate = useNavigate();
    const { bagIds, clearBag, removeItem } = useConsumableBagStore();
    
    // El hook robusto recibe el arreglo de IDs de la tienda y busca en las páginas del backend
    const { bagConsumables, isBagLoading } = useConsumablesBagData(bagIds);

    const handleSuccessOutput = () => {
        clearBag(); // Limpia la bolsa de Zustand tras procesar la salida PEPS con éxito
        navigate("/consumables");
    };

    const handleRemoveItem = (id: string) => {
        removeItem(id); // Al remover el ID de la tienda, el hook recalcula automáticamente
    };

    // 1. VALIDACIÓN: Estado de carga global
    if (isBagLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const hasInconsistency = bagIds.length > 0 && bagConsumables.length === 0;

    return (
        <CanAction permission="CREATE_CONSUMABLE_OUTPUT">
        <div className="w-full space-y-4">
            <div className="w-full items-center justify-between">
                <CustomBackToList 
                    onBack={() => navigate("/consumables")} 
                    backLabel={t("consumableOutput.backLabel")} 
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-muted shadow-sm dark:bg-muted-foreground/25 shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                            {t("consumableOutput.title")}
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground pl-1">
                        {t("consumableOutput.subtitle")}
                    </p>
                </div>
            </div>

            {/* 3. CONTROL DE RENDERS SEGÚN VALIDACIONES */}
            {hasInconsistency ? (
                <div className="flex flex-col items-center justify-center text-center p-12 border border-destructive/40 bg-destructive/5 rounded-2xl max-w-md mx-auto my-12 space-y-4">
                    <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-semibold tracking-tight text-destructive">
                            {t("consumableOutput.syncErrorTitle")}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            {t("consumableOutput.syncErrorDesc")}
                        </p>
                    </div>
                    <CanAction permission="CREATE_CONSUMABLE_OUTPUT">
                        <Button 
                            onClick={() => { clearBag(); navigate("/consumables"); }}
                            variant="destructive"
                            className="mt-2 font-semibold shadow-sm bg-red-700"
                        >
                            {t("consumableOutput.btnCleanBag")}
                        </Button>
                    </CanAction>
                </div>
            ) : bagConsumables.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border/80 rounded-2xl bg-card shadow-sm max-w-md mx-auto my-12 space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-full bg-muted text-muted-foreground/40">
                        <PackageOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-semibold tracking-tight">
                            {t("consumableOutput.emptyTitle")}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            {t("consumableOutput.emptyDesc")}
                        </p>
                    </div>
                    <CanAction permission="CREATE_CONSUMABLE_OUTPUT">
                        <Button 
                            onClick={() => navigate("/consumables")}
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                        >
                            {t("consumableOutput.btnExplore")}
                        </Button>
                    </CanAction>
                </div>
            ) : (
                <div className="animate-in duration-300">
                    {/* <CanAction permission="CREATE_CONSUMABLE_OUTPUT"> */}
                        <ConsumableOutputForm
                            selectedItems={bagConsumables}
                            onSuccess={handleSuccessOutput}
                            onRemoveItem={handleRemoveItem}
                        />
                    {/* </CanAction> */}
                </div>
            )}
        </div>
        </CanAction>
    );
};
// [Esta pantalla loLo puede ver el rol : SuperAdmin, JefeCC, Coordinador, Inventario ]
// import { useNavigate } from "react-router";
// import { t } from "i18next";
// import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
// import { useConsumablesBagData } from "../hooks/useConsumables"; 
// import { ConsumableOutputForm } from "../components/CustomConsumableOutputForm";
// import { Button } from "@/components/ui/button";
// import { CustomBackToList } from "@/components/custom/CustomBackToList";
// import { ShoppingBag, PackageOpen, Loader2, AlertCircle } from "lucide-react";

// export const ConsumableOutputPage = () => {
//     const navigate = useNavigate();
//     const { bagIds, clearBag, removeItem } = useConsumableBagStore();
    
//     // El hook robusto recibe el arreglo de IDs de la tienda y busca en las páginas del backend
//     const { bagConsumables, isBagLoading } = useConsumablesBagData(bagIds);

//     const handleSuccessOutput = () => {
//         clearBag(); // Limpia la bolsa de Zustand tras procesar la salida PEPS con éxito
//         navigate("/consumables");
//     };

//     const handleRemoveItem = (id: string) => {
//         removeItem(id); // Al remover el ID de la tienda, el hook recalcula automáticamente
//     };

//     // 1. VALIDACIÓN: Estado de carga global
//     if (isBagLoading) {
//         return (
//             <div className="flex h-[60vh] items-center justify-center">
//                 <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//             </div>
//         );
//     }

//     const hasInconsistency = bagIds.length > 0 && bagConsumables.length === 0;

//     return (
//         <div className="w-full space-y-4">
//             <div className="w-full items-center justify-between">
//                 <CustomBackToList 
//                     onBack={() => navigate("/consumables")} 
//                     backLabel={t("consumableOutput.backLabel")} 
//                 />
//             </div>

//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40">
//                 <div className="space-y-1">
//                     <div className="flex items-center gap-2.5">
//                         <div className="p-2 rounded-lg bg-muted shadow-sm dark:bg-muted-foreground/25 shrink-0">
//                             <ShoppingBag className="w-5 h-5" />
//                         </div>
//                         <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
//                             {t("consumableOutput.title")}
//                         </h1>
//                     </div>
//                     <p className="text-sm text-muted-foreground pl-1">
//                         {t("consumableOutput.subtitle")}
//                     </p>
//                 </div>
//             </div>

//             {/* 3. CONTROL DE RENDERS SEGÚN VALIDACIONES */}
//             {hasInconsistency ? (
//                 <div className="flex flex-col items-center justify-center text-center p-12 border border-destructive/40 bg-destructive/5 rounded-2xl max-w-md mx-auto my-12 space-y-4">
//                     <div className="p-3 rounded-full bg-destructive/10 text-destructive">
//                         <AlertCircle className="w-8 h-8" />
//                     </div>
//                     <div className="space-y-1.5">
//                         <h3 className="text-base font-semibold tracking-tight text-destructive">
//                             {t("consumableOutput.syncErrorTitle")}
//                         </h3>
//                         <p className="text-sm text-muted-foreground max-w-xs mx-auto">
//                             {t("consumableOutput.syncErrorDesc")}
//                         </p>
//                     </div>
//                     [Lo puede ver el rol : SuperAdmin, JefeCC, Coordinador, Inventario ]
//                     <Button 
//                         onClick={() => { clearBag(); navigate("/consumables"); }}
//                         variant="destructive"
//                         className="mt-2 font-semibold shadow-sm bg-red-700"
//                     >
//                         {t("consumableOutput.btnCleanBag")}
//                     </Button>
//                 </div>
//             ) : bagConsumables.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border/80 rounded-2xl bg-card shadow-sm max-w-md mx-auto my-12 space-y-4 animate-in fade-in duration-200">
//                     <div className="p-4 rounded-full bg-muted text-muted-foreground/40">
//                         <PackageOpen className="w-10 h-10" />
//                     </div>
//                     <div className="space-y-1.5">
//                         <h3 className="text-base font-semibold tracking-tight">
//                             {t("consumableOutput.emptyTitle")}
//                         </h3>
//                         <p className="text-sm text-muted-foreground max-w-xs mx-auto">
//                             {t("consumableOutput.emptyDesc")}
//                         </p>
//                     </div>
//                     [Lo puede ver el rol : SuperAdmin, JefeCC, Coordinador, Inventario ]
//                     <Button 
//                         onClick={() => navigate("/consumables")}
//                         className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
//                     >
//                         {t("consumableOutput.btnExplore")}
//                     </Button>
//                 </div>
//             ) : (
//                 <div className="animate-in duration-300">
//                     <ConsumableOutputForm
//                         selectedItems={bagConsumables}
//                         onSuccess={handleSuccessOutput}
//                         onRemoveItem={handleRemoveItem}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// };