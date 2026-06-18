
import { Calendar, FileText, LayoutGrid, Package, Clipboard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { GroupedMovement } from "../interfaces/consumable-movement.interfaces";

interface Props {
    movement: GroupedMovement;
}

export const MovementDetailView = ({ movement }: Props) => {
    const isInput = movement.movement_type?.id === 1 || movement.movement_type?.id === '1';

    return (
        <div className="space-y-6 p-3 sm:p-6 w-full mx-auto animate-in fade-in duration-300">
            

            <div className=" overflow-hidden space-y-4">
                
                <div className="p-5 sm:p-6 rounded-2xl border-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                                Folio de Operación
                            </span>
                            <h2 className="text-2xl font-black tracking-tight">
                                {movement.code_movement_aplication}
                            </h2>
                            <Badge className={`font-semibold uppercase tracking-wider text-[11px] px-2.5 py-0.5 shadow-none border ${
                                isInput 
                                    ? "border-green-600 bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400" 
                                    : "border-yellow-600 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400"
                            }`}>
                                {movement.movement_type?.name}
                            </Badge>
                        </div>

                        {/* Caja del Importe Total Destacado */}
                        <div className="bg-background border-2 border-blue-500/20 rounded-xl p-4 sm:p-4 flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="space-y-0.5">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Importe Total</span>
                            </div>
                            <span className="text-3xl font-bold font-mono tracking-tight text-blue-600 dark:text-blue-400 ">
                                ${movement.total_cost.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* METADATOS EN FILA GRIDS (Responsivo) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-dashed border-muted-foreground/30 text-xs">
                        <div className="flex items-start gap-2.5">
                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <span className="text-xs uppercase font-bold  tracking-wider block">Fecha y Hora</span>
                                <p className="text-xs font-bold">{new Date(movement.created_at).toLocaleString()}hrs.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <LayoutGrid className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <span className="text-xs uppercase font-bold tracking-wider block">Destino / Aplicación</span>
                                <p className="font-bold text-xs">{movement.movement_aplication?.name || "N/A"}</p>
                                {movement.department && (
                                    <span className="text-xs font-semibold text-muted-foreground mt-1 uppercase">
                                        {movement.department.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Package className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div className="space-y-2 text-xs ">
                                <span className="text-xs uppercase font-bold tracking-wider block">Total unidades consumidas</span>
                                <p className="text-sm font-bold">{movement.total_quantity} <span className="text-xs text-muted-foreground font-medium">{movement.total_quantity > 1 ? "unidades" : "unidad"}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Notas / Observaciones */}
                    <div className="mt-4 pt-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs">
                            <Clipboard className="h-3.5 w-3.5" />
                            <span className=" font-bold uppercase tracking-wider">Observaciones</span>
                        </div>
                        <p className="text-xs bg-background/60 p-2.5 rounded-lg  leading-relaxed ">
                            {movement.observations || "Sin comentarios registrados en este folio."}
                        </p>
                    </div>
                </div>

                {/* ================= SECCIÓN INFERIOR: CONSUMIBLES AFECTADOS ================= */}
                <div className="p-5 sm:p-6 border-2 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 pb-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-xl font-bold uppercase tracking-wider ">
                            Artículos y Consumibles Desglosados 
                        </h3>
                    </div>

                    {/* 🖥️ VISTA TABLA: Perfecto para pantallas medianas y grandes */}
                    <div className="hidden md:block border rounded-xl overflow-hidden  text-xs">
                        <Table>
                            <TableHeader className=" text-xs tracking-wider font-bold">
                                <TableRow>
                                    <TableHead className="min-w-27.5 max-w-30">Consumible</TableHead>
                                    <TableHead className="min-w-27.5 max-w-30">Código</TableHead>
                                    <TableHead className="min-w-27.5 max-w-30">Folio Lote</TableHead>
                                    <TableHead className="min-w-27.5 max-w-30">Cantidad</TableHead>
                                    <TableHead className="min-w-27.5 max-w-30">Costo Unitario</TableHead>
                                    <TableHead className="min-w-27.5 max-w-30">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movement.subItems.map((sub) => {
                                    const subCost = Number(sub.movement_cost || 0);
                                    const unitCost = sub.quantity_consumable > 0 ? subCost / sub.quantity_consumable : 0;

                                    return (
                                        <TableRow key={sub.id} className="hover:bg-muted/20 transition-colors text-xs font-semibold">
                                            <TableCell>
                                                {sub.id_batches_product?.id_consumable?.description || "Consumible"}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-muted-foreground  px-1.5 py-0.5 rounded border-2">
                                                    {sub.id_batches_product?.id_consumable?.item_code || "N/A"}
                                                </span>
                                            </TableCell>
                                            <TableCell >
                                                #{sub.id_batches_product?.num_requirement || "---"}
                                            </TableCell>
                                            <TableCell>
                                                {sub.quantity_consumable > 1 ? `${sub.quantity_consumable} unidades` : `${sub.quantity_consumable} unidad`}
                                            </TableCell>
                                            <TableCell>
                                                ${unitCost.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-blue-600 font-bold">
                                                ${subCost.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="block md:hidden space-y-3">
                        {movement.subItems.map((sub) => {
                            const subCost = Number(sub.movement_cost || 0);
                            const unitCost = sub.quantity_consumable > 0 ? subCost / sub.quantity_consumable : 0;

                            return (
                                <div key={sub.id} className="p-3.5 rounded-xl border bg-muted/10 space-y-2.5 text-xs">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="space-y-1 max-w-[70%]">
                                            <p className="font-bold text-foreground leading-tight">
                                                {sub.id_batches_product?.id_consumable?.description || "Consumible"}
                                            </p>
                                            <span className="inline-block text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                                                {sub.id_batches_product?.id_consumable?.item_code || "N/A"}
                                            </span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-[9px] text-muted-foreground block font-medium uppercase">Subtotal</span>
                                            <strong className="text-foreground font-mono font-bold text-sm">${subCost.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-muted text-[11px] text-muted-foreground">
                                        <div>
                                            <span className="block text-[9px] uppercase tracking-wider text-muted-foreground/80">Lote</span>
                                            <span className="font-mono font-medium text-foreground">#{sub.id_batches_product?.num_requirement || "---"}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-[9px] uppercase tracking-wider text-muted-foreground/80">Cantidad</span>
                                            <strong className="text-foreground">{sub.quantity_consumable} u.</strong>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[9px] uppercase tracking-wider text-muted-foreground/80">Costo U.</span>
                                            <span className="font-mono text-foreground">${unitCost.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

        </div>
    );
};