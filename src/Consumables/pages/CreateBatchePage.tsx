// pages/CreateBatchPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { useConsumablesBagData } from "../hooks/useConsumables";
import { createBatchesProductAction, type CreateBatchProductPayload } from "../actions/post-batches-consumables.action";
import { CreateBatchForm } from "../components/CustomCreateBatchForm";
import { Button } from "@/components/ui/button";
import { Loader2, PackagePlus, PackageOpen } from "lucide-react";
import { CustomBackToList } from "@/components/custom/CustomBackToList";

export default function CreateBatchPage() {
    const navigate = useNavigate();
    const { bagIds, removeItem, clearBag } = useConsumableBagStore();
    const { bagConsumables, isBagLoading } = useConsumablesBagData(bagIds);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: CreateBatchProductPayload) => {
        setIsSubmitting(true);
        try {
            const response = await createBatchesProductAction(data);
            clearBag();
            alert(response.message || "Lote guardado con éxito.");
            navigate("/batches-products");
        } catch (error) {
            console.error("Error al guardar el lote:", error);
            alert("Hubo un error al procesar el lote en el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isBagLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-4 ">

            {/* ENCABEZADO ESTILO ENLACE DE RETORNO (Igual a la imagen) */}
            <div className="w-full items-center justify-between">
                <CustomBackToList
                    onBack={() => navigate("/consumables")}
                    backLabel="Listar Consumibles"
                />
            </div>

            {/* TÍTULO PRINCIPAL CON ÍCONO Y DESCRIPCIÓN (Coherente con Generar Salida) */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted shadow-sm dark:bg-muted-foreground/25 shrink-0">
                        <PackagePlus className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Registrar Entrada de Lote
                    </h1>
                </div>
                <p className="text-sm text-muted-foreground  pl-1">
                    Revisa los artículos seleccionados para el reabastecimiento e ingresa el número de requisición o factura, las unidades físicas recibidas y sus costo total.
                </p>
            </div>

            {/* CONDICIONAL: ESTADO VACÍO O FORMULARIO */}
            {bagIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border rounded-2xl bg-card max-w-md mx-auto my-12 space-y-4">
                    <div className="p-4 rounded-full bg-muted text-muted-foreground/50">
                        <PackageOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-semibold tracking-tight">No hay remesas por procesar</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            No has agregado ningún consumible a la bolsa para estructurar un nuevo lote de mercancía.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/consumables")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm h-10 px-4"
                    >
                        Explorar Catálogo
                    </Button>
                </div>
            ) : (
                <div className="animate-in fade-in duration-200">
                    <CreateBatchForm
                        bagConsumables={bagConsumables}
                        isSubmitting={isSubmitting}
                        onSubmit={handleFormSubmit}
                        onRemoveItem={removeItem}
                        onCancel={() => navigate(-1)}
                    />
                </div>
            )}
        </div>
    );
}