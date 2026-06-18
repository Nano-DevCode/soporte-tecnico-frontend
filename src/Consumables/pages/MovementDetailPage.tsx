import { useParams, Link, useNavigate } from "react-router";
import { useConsumableMovementsList } from "../hooks/useConsumableMovements";
import { Button } from "@/components/ui/button";
import { MovementDetailView } from "../components/CustomMovementDetailView";
import { CustomBackToList } from "@/components/custom/CustomBackToList";

export const MovementDetailPage = () => {
    const { code_movement_aplication } = useParams<{ code_movement_aplication: string }>();
    const { movements, isLoading } = useConsumableMovementsList();
    const navigate= useNavigate();


    // Localizamos usando el parámetro de la URL
    const movement = movements.find((m) => m.code_movement_aplication === code_movement_aplication);

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
                Cargando detalles operativos del movimiento...
            </div>
        );
    }

    if (!movement) {
        return (
            <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground max-w-xl mx-auto mt-12 space-y-4">
                <p className="text-base font-medium">El movimiento con folio registrado no fue localizado.</p>
                <Button asChild variant="outline">
                    <Link to="/consumable-movements">Lista de Movimientos</Link>
                </Button>
            </div>
        );
    }

    // Retorna la vista inyectándole la data filtrada
    return (
    <div className="w-full mx-auto space-y-4">
        <CustomBackToList onBack={() => navigate("/consumable-movements")} backLabel="Lista de Movimientos" />
        <MovementDetailView movement={movement} />
    </div>)
};