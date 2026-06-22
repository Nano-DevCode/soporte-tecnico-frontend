import { Skeleton } from '../ui/skeleton'

export const CustomSkeletonTableCard = () => {
  return (
    <>
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* SKELETON PARA DESKTOP (TABLA) */}
          <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            
            {/* Cabecera (Simulando los 5 TableHeads) */}
            <div className="flex items-center p-4 border-b bg-muted/30 gap-4">
              <div className="w-37.5"><Skeleton className="h-4 w-20" /></div>
              <div className="w-30 flex justify-center"><Skeleton className="h-4 w-12" /></div>
              <div className="w-20 flex justify-center"><Skeleton className="h-4 w-10" /></div>
              <div className="flex-1"><Skeleton className="h-4 w-32" /></div>
              <div className="w-25 flex justify-center"><Skeleton className="h-4 w-16" /></div>
            </div>

            {/* Filas */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center p-4 border-b last:border-0 gap-4">
                
                {/* 1. Fecha */}
                <div className="w-37.5">
                  <Skeleton className="h-4 w-28" />
                </div>
                
                {/* 2. Tipo (Simulando el Badge) */}
                <div className="w-30 flex justify-center">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                
                {/* 3. Foto (Simulando el AssetThumbnail cuadrado) */}
                <div className="w-20 flex justify-center">
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
                
                {/* 4. Activo / Serie (Simulando los dos textos apilados) */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[60%] max-w-50" />
                  <Skeleton className="h-3 w-[40%] max-w-30" />
                </div>
                
                {/* 5. Detalles (Simulando el Botón del ojo) */}
                <div className="w-25 flex justify-center">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                
              </div>
            ))}
          </div>

          {/* SKELETON PARA MOBILE (CARDS) */}
          <div className="md:hidden space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 flex gap-4 shadow-sm">
                {/* Imagen del móvil */}
                <Skeleton className="h-14 w-14 rounded-md shrink-0" />
                
                <div className="flex-1 space-y-3">
                  {/* Fila superior: Serie y Tipo */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                  </div>
                  
                  {/* Fila inferior: Fecha */}
                  <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>    
    </>
  )
}