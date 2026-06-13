// pages/ConsumableOutputPage.tsx
import { useNavigate } from "react-router";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { useConsumables } from "../hooks/useConsumables";
import { ConsumableOutputForm } from "../components/ConsumableOutputForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export const ConsumableOutputPage = () => {
    const navigate = useNavigate();
    // Traemos 'removeFromBag' (o como se llame en tu store para quitar un ID)
    const { bagIds, clearBag, removeItem } = useConsumableBagStore();
    const { consumables } = useConsumables();

    // Filtramos los datos de los consumibles agregados al carrito para obtener los objetos completos
    const selectedItems = consumables
        .filter((c) => bagIds.includes(String(c.id)))
        .map((c) => ({ ...c, description: c.description || `ID: ${c.id}` }));

    const handleSuccessOutput = () => {
        clearBag(); // Vaciamos la bolsa para que quede libre de operaciones futuras
        navigate("/consumables"); // Redirección automática a la vista principal
    };

    const handleRemoveItem = (id: string) => {
        // Si tu store usa un método específico para remover un ítem por ID:
        removeItem(id);

        // NOTA: Si tu store no tiene un 'removeFromBag', puedes usar la función 
        // que use tu store para actualizar los ids directos, por ejemplo:
        // setBagIds(bagIds.filter(bagId => bagId !== id));
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al catálogo
                </Button>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border order-1 sm:order-2 w-full sm:w-auto">
                    <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Consumibles seleccionados: {selectedItems.length}</span>
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Salida de Material</h1>

            </div>

            {selectedItems.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-xl bg-card">
                    <p className="text-muted-foreground mb-4">No tienes consumibles seleccionados en tu bolsa para generar una salida.</p>
                    <Button onClick={() => navigate("/consumables")}>Explorar Catálogo</Button>
                </div>
            ) : (
                <ConsumableOutputForm
                    selectedItems={selectedItems}
                    onSuccess={handleSuccessOutput}
                    onRemoveItem={handleRemoveItem}
                />
            )}
        </div>
    );
};