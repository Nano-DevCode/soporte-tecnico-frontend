import { useNavigate, useLocation } from "react-router";
import { t } from "i18next";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { useConsumablesBagData } from "../hooks/useConsumables";
import { createBatchesProductAction, type CreateBatchProductPayload } from "../actions/post-batches-consumables.action";
import { CreateBatchForm } from "../components/CustomCreateBatchForm";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";
import { Loader2, PackagePlus, PackageOpen } from "lucide-react";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { handleBackendErrors } from "../utils/handleBackendErrors";
import type { UseFormSetError } from "react-hook-form";

export default function CreateBatchPage() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { bagIds, removeItem, clearBag } = useConsumableBagStore();
    const { bagConsumables, isBagLoading } = useConsumablesBagData(bagIds);

    const autoCreatedId = location.state?.autoCreatedId;

    // Recibimos 'setError' desde el Formulario si este lo expone al hacer el submit
    const handleFormSubmit = async (data: CreateBatchProductPayload, setErrorForm?: UseFormSetError<CreateBatchProductPayload>) => {
        try {
            await sileo.promise(
                createBatchesProductAction(data),
                {
                    loading: { title: t("createBatch.loadingTitle") },
                    success: (response) => {
                        clearBag();
                        return {
                            title: t("createBatch.successTitle"),
                            description: response?.message || t("createBatch.successDesc"),
                            duration: 8000
                        };
                    },
                    error: (err) => {
                        let dynamicDescription = t("createBatch.dynamicErrorDesc");

                        // Si el formulario nos provee su setError, mapeamos las respuestas del backend
                        if (setErrorForm) {
                            handleBackendErrors(
                                err,
                                setErrorForm,
                                [
                                    { backendKeyword: "invoice", fieldPath: "invoice_number" },
                                    { backendKeyword: "quantity", fieldPath: "quantity_received" },
                                    { backendKeyword: "cost", fieldPath: "total_cost" },
                                ],
                                (cleanMessage) => {
                                    dynamicDescription = cleanMessage;
                                }
                            );
                        }

                        return {
                            title: t("createBatch.errorTitle"),
                            description: dynamicDescription,
                            duration: 8000
                        };
                    }
                }
            );

            navigate("/consumables");

        } catch (e) {
            console.error("Flujo de envío interrumpido:", e);
        }
    };

    // Manejador centralizado para la cancelación del formulario
    const handleCancelForm = () => {
        if (autoCreatedId) {
            // Si el usuario cancela tras crear un consumible, lo sacamos de la bolsa
            removeItem(autoCreatedId);
        }
        navigate("/consumables");
    };

    if (isBagLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">

            {/* ENCABEZADO ESTILO ENLACE DE RETORNO */}
            <div className="w-full items-center justify-between">
                <CustomBackToList
                    onBack={handleCancelForm}
                    backLabel={t("createBatch.backLabel")}
                />
            </div>

            {/* TÍTULO PRINCIPAL CON ÍCONO Y DESCRIPCIÓN */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted shadow-sm dark:bg-muted-foreground/25 shrink-0">
                        <PackagePlus className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        {t("createBatch.title")}
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground pl-1">
                    {t("createBatch.subtitle")}
                </p>
            </div>

            {/* CONDICIONAL: ESTADO VACÍO O FORMULARIO */}
            {bagIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border rounded-2xl bg-card max-w-md mx-auto my-12 space-y-4">
                    <div className="p-4 rounded-full bg-muted text-muted-foreground/50">
                        <PackageOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-semibold tracking-tight">{t("createBatch.emptyTitle")}</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            {t("createBatch.emptyDesc")}
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/consumables")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm h-10 px-4"
                    >
                        {t("createBatch.btnExplore")}
                    </Button>
                </div>
            ) : (
                <div className="animate-in fade-in duration-200">
                    <CreateBatchForm
                        bagConsumables={bagConsumables}
                        onSubmit={handleFormSubmit}
                        onRemoveItem={removeItem}
                        onCancel={handleCancelForm} 
                        isSubmitting={false}                    
                    />
                </div>
            )}
        </div>
    );
}