import { Skeleton } from "@/components/ui/skeleton";

export const CustomItAssetDesktopCatalogSkeleton = () => {
  return (
    // Imitamos la misma cuadrícula responsiva de tu catálogo real
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
      
      {/* Generamos 8 tarjetas para llenar bien la pantalla mientras carga */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm"
        >
          {/* === ÁREA DE IMAGEN (ASPECT 4:3) === */}
          <div className="relative aspect-[4/3] w-full bg-muted/20">
            {/* Esqueleto del ID (Izquierda) */}
            <Skeleton className="absolute top-3 left-3 h-5 w-16 rounded-md" />
            
            {/* Esqueleto de Disponibilidad (Derecha) */}
            <Skeleton className="absolute top-3 right-3 h-5 w-20 rounded-md" />
            
            {/* Esqueleto del icono central de la imagen */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Skeleton className="h-16 w-16 rounded-full opacity-20" />
            </div>
          </div>

          {/* === CONTENIDO PRINCIPAL === */}
          <div className="flex flex-1 flex-col p-5 pt-4">
            
            {/* Fila: Tipo y Estado */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-3 w-20 rounded-sm" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            {/* Fila: Modelo y Marca */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-3/4 rounded-sm" />
              <Skeleton className="h-4 w-1/2 rounded-sm" />
            </div>

            {/* Fila: Código de Barras / Número de Serie */}
            <div className="mt-4">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>

          </div>

          {/* === FOOTER CON BOTONES === */}
          <div className="p-3 px-5 bg-muted/10 border-t border-border/50 flex justify-between items-center gap-3">
            {/* Esqueleto del botón principal (Entrada/Salida) */}
            <Skeleton className="h-9 flex-1 rounded-md" />
            
            {/* Esqueleto del botón de menú de acciones */}
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
          </div>

        </div>
      ))}
    </div>
  );
};