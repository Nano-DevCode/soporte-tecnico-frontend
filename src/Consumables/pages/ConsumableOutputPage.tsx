// pages/ConsumableOutputPage.tsx
import { useNavigate } from "react-router";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { useConsumables } from "../hooks/useConsumables";
import { ConsumableOutputForm } from "../components/CustomConsumableOutputForm";
import { Button } from "@/components/ui/button";
import { CustomBackToList } from "@/components/custom/CustomBackToList";
import { ShoppingBag, PackageOpen } from "lucide-react";

export const ConsumableOutputPage = () => {
    const navigate = useNavigate();
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
        removeItem(id);
    };

    return (
        <div className="w-full space-y-4">
            
            {/* BOTÓN REGRESAR - Sutil y limpio */}
            <div className="w-full items-center justify-between">
                <CustomBackToList 
                    onBack={() => navigate("/consumables")} 
                    backLabel="Listar Consumibles" 
                />
            </div>

            {/* ENCABEZADO DE LA PÁGINA (UX/UI Elegant) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-muted shadow-sm dark:bg-muted-foreground/25 shrink-0">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                            Generar Salida de Consumibles
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground   pl-1">
                        Revisa los artículos seleccionados en tu bolsa de despacho y completa el formulario con los detalles del movimiento de inventario.
                    </p>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL / ESTADO VACÍO */}
            {selectedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-border/80 rounded-2xl bg-card shadow-sm max-w-md mx-auto my-12 space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-full bg-muted text-muted-foreground/40">
                        <PackageOpen className="w-10 h-10" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="text-base font-semibold tracking-tight">Tu bolsa está vacía</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            No tienes consumibles seleccionados para generar un movimiento de salida en este momento.
                        </p>
                    </div>
                    <Button 
                        onClick={() => navigate("/consumables")}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                    >
                        Explorar Catálogo
                    </Button>
                </div>
            ) : (
                <div className="animate-in duration-300">
                    <ConsumableOutputForm
                        selectedItems={selectedItems}
                        onSuccess={handleSuccessOutput}
                        onRemoveItem={handleRemoveItem}
                    />
                </div>
            )}
        </div>
    );
};