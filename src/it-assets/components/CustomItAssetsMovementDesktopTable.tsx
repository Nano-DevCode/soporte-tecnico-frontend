import { memo, useState } from "react";
import { Link } from "react-router";
import { Eye, ArrowRightLeft, ArrowDownRight, ArrowUpRight, Monitor } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ItAssetsMovement } from "../interfaces/itAssetsMovementResponse";

interface Props {
  movements: ItAssetsMovement[];
}

const AssetThumbnail = ({ src }: { src?: string | null }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="h-10 w-10 mx-auto rounded-md bg-muted flex items-center justify-center border border-border shadow-sm">
        <Monitor className="h-5 w-5 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="h-10 w-10 mx-auto rounded-md overflow-hidden border border-border shadow-sm bg-muted flex items-center justify-center">
      <img 
        src={src} 
        alt="Thumbnail" 
        onError={() => setHasError(true)} 
        className="h-full w-full object-cover transition-transform hover:scale-110" 
      />
    </div>
  );
};

export const CustomItAssetsMovementDesktopTable = memo(({ movements }: Props) => {
  return (
    <div className="hidden md:block rounded-xl border border-border shadow-sm overflow-hidden bg-card">
      {/* LA MAGIA ESTÁ AQUÍ: Agregamos table-fixed */}
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {/* Le damos anchos fijos a las columnas que NO queremos que se estiren */}
            <TableHead>Fecha</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead className="text-center">Foto</TableHead>
            
            {/* AL NO PONERLE ANCHO, ESTA COLUMNA TOMARÁ EL 100% DEL ESPACIO RESTANTE */}
            <TableHead>Activo (N° Serie)</TableHead>
            
            <TableHead className="text-center">Detalles</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {movements.map((mov) => {
            const formattedDate = new Date(mov.createdAt).toLocaleDateString('es-MX', {
              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            const isInput = mov.type === "IN" || mov.movementIn !== null;
            
            return (
              <TableRow key={mov.id} className="group transition-colors">
                
                {/* FECHA */}
                <TableCell className="align-middle py-4 text-sm font-medium text-muted-foreground truncate max-w-none">
                  {formattedDate}
                </TableCell>

                {/* TIPO */}
                <TableCell className="align-middle text-center py-4 uppercase max-w-none">
                  <Badge 
                    variant="outline"
                    className={cn(
                      "font-semibold px-2.5 py-0.5 rounded-full shadow-sm gap-1",
                      isInput 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" 
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                    )}
                  >
                    {isInput ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {isInput ? "Entrada" : "Salida"}
                  </Badge>
                </TableCell>
                
                {/* FOTO */}
                <TableCell className="align-middle py-4 text-center max-w-none">
                  <AssetThumbnail src={mov.itAsset.imageUrl} />
                </TableCell>

                {/* ACTIVO / SERIAL */}
                <TableCell className="align-middle py-4 truncate max-w-none">
                  {/* min-w-0 permite que el truncate funcione maravillosamente dentro de flexbox */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-foreground truncate block">
                      {mov.itAsset.serialNumber}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono truncate block">
                      ID: {mov.itAsset.idInventary || "N/A"}
                    </span>
                  </div>
                </TableCell>

                {/* ACCIÓN (DETALLES) */}
                <TableCell className="text-center align-middle py-4 max-w-none">
                  <Link to={`/it-assets/movements/${mov.id}`}>
                    <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>

              </TableRow>
            );
          })}

          {/* ESTADO VACÍO */}
          {movements.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground max-w-none">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center border border-border">
                    <ArrowRightLeft className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      No se encontraron movimientos
                    </p>
                    <p className="text-sm">
                      Aún no hay registros de entradas o salidas para los activos.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});