import { useParams, useNavigate } from "react-router";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsumableDetails } from "../hooks/useConsumableDetails";
import { ConsumableDetailsView } from "../components/ConsumableDetailsView";

export default function ConsumableDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Consumimos el hook enviándole el id recuperado de la URL
    const { data: consumable, isLoading, isError, error } = useConsumableDetails(id || "");

    // 1. Estado de carga de datos
    if (isLoading) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm font-medium text-muted-foreground">Cargando especificaciones del consumible...</p>
            </div>
        );
    }

    // 2. Estado de error en la API o ID inexistente
    if (isError || !consumable) {
        return (
            <div className="h-[60vh] w-full flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center px-4">
                <div className="p-3 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-lg font-bold text-foreground">Error al cargar consumible</h2>
                    <p className="text-sm text-muted-foreground">
                        {error instanceof Error ? error.message : "El recurso solicitado no existe o no se pudo sincronizar con el servidor."}
                    </p>
                </div>
                <Button onClick={() => navigate("/consumables")} variant="outline" className="gap-2 mt-2">
                    <ArrowLeft className="h-4 w-4" />
                    Regresar al listado
                </Button>
            </div>
        );
    }

    // 3. Renderizado exitoso del componente visual de detalle
    return <ConsumableDetailsView consumable={consumable} />;
}