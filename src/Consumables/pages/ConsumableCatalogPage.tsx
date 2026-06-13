import { useNavigate } from "react-router";
import { useConsumables } from "../hooks/useConsumables";
import { useConsumableBagStore } from "../hooks/useConsumableBagStore";
import { ConsumableCard } from "../components/ConsumableCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2, PackageOpen, ArrowLeft, ArrowRight } from "lucide-react";
import type { Consumable } from "../interfaces/consumable.interfaces";

export default function ConsumablesCatalogPage() {
  const navigate = useNavigate();
  
  const { consumables, isLoading, error } = useConsumables();
  const { bagIds, toggleBagItem, isInBag } = useConsumableBagStore();

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Cargando catálogo de consumibles...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/5 border border-destructive/20 rounded-xl max-w-xl mx-auto my-12 shadow-sm">
        <p className="font-semibold text-destructive text-lg">Error al conectar con el almacén</p>
        <p className="text-sm text-muted-foreground mt-1">
          No se pudieron recuperar los consumibles del inventario. Por favor reintente la operación.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Reintentar conexión
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      
      {/* SECCIÓN 1: CABECERA Y SEGUIMIENTO GLOBAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-5 border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Módulo de Reabastecimiento
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Catálogo de Consumibles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona los consumibles que ingresarán al almacén para configurarlos en el nuevo lote.
          </p>
        </div>
        
        {/* Botón de control de flujo */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="text-muted-foreground hidden md:flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>

          <Button 
            onClick={() => navigate("/batches/create")} 
            className="relative h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 shadow-md w-full md:w-auto rounded-lg gap-2"
            disabled={bagIds.length === 0}
          >
            <ShoppingBag className="h-4 w-4" />
            Continuar con el Lote
            <ArrowRight className="h-4 w-4 opacity-70" />
            
            {bagIds.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold shadow-sm border-2 border-background animate-scale-up">
                {bagIds.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* SECCIÓN 2: GRID DE ITEMS / VACÍO */}
      {consumables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-2xl border-dashed bg-muted/10 p-6">
          <PackageOpen className="h-14 w-14 text-muted-foreground/40 mb-3 stroke-1" />
          <h3 className="text-base font-semibold text-foreground">Catálogo sin registros</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            No encontramos consumibles activos en el inventario general. Registra uno nuevo en el panel primario.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {consumables.map((item: Consumable) => (
            <ConsumableCard
              key={item.id}
              item={item}
              isInBag={isInBag(item.id)}
              onToggleBag={() => toggleBagItem(item.id)}
              handleDownClick={(c) => {
                console.log("Inspección de item:", c.item_code);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}