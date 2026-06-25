import { Calendar, FileText, LayoutGrid, Package, Clipboard, File } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { GroupedMovement } from "../interfaces/consumable-movement.interfaces";
import { t } from "i18next";

interface Props {
    movement: GroupedMovement;
}

export const MovementDetailView = ({ movement }: Props) => {
    const isInput = movement.movement_type?.id === 1 || movement.movement_type?.id === '1';

    return (
        <div className="space-y-4 p-3 sm:p-6 w-full mx-auto animate-in fade-in duration-300">

            {/* ================= SECCIÓN SUPERIOR: RESUMEN Y METADATOS ================= */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider block">
                            {t("movementDetail.operationFolio")}
                        </span>
                        <h2 className="text-2xl font-black tracking-tight text-foreground">
                            {movement.code_movement_aplication}
                        </h2>
                        <Badge
                            variant="outline"
                            className={`font-semibold uppercase tracking-wider text-[11px] px-2.5 py-0.5 shadow-none ${isInput
                                ? "border-green-600 bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400"
                                : "border-yellow-600 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400"
                                }`}
                        >
                            {movement.movement_type?.name}
                        </Badge>
                    </div>

                    {/* Caja del Importe Total Destacado */}
                    <div className="bg-background border-2 border-blue-500/20 rounded-xl p-4 flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                            {t("movementDetail.totalCost")}
                        </span>
                        <span className="text-3xl font-bold font-mono tracking-tight text-blue-600 dark:text-blue-400">
                            ${(movement.total_cost ?? 0).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* METADATOS EN REJILLA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-dashed border-muted-foreground/30 text-xs">
                    <div className="flex items-start gap-2.5">
                        <Calendar className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="text-xs uppercase font-bold tracking-wider block">
                                {t("movementDetail.dateTime")}
                            </span>
                            <p className="font-bold text-foreground">
                                {(() => {
                                    const dateStr = movement.created_at.endsWith("Z") ? movement.created_at : `${movement.created_at}Z`;

                                    return new Date(dateStr).toLocaleString('es-MX', {
                                        timeZone: 'America/Mexico_City',
                                    });
                                })()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <LayoutGrid className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="text-xs uppercase font-bold tracking-wider block">
                                {t("movementDetail.destinationApplication")}
                            </span>
                            <p className="font-bold text-foreground">
                                {movement.movement_aplication?.name || t("movementDetail.notAvailable")}
                            </p>
                            {movement.department && (
                                <span className="text-xs font-semibold text-muted-foreground uppercase block mt-0.5">
                                    {movement.department.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <Package className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="text-xs uppercase font-bold tracking-wider block">
                                {t("movementDetail.totalUnits")}
                            </span>
                            <p className="text-sm font-bold text-foreground">
                                {movement.total_quantity}{" "}
                                <span className="text-xs text-muted-foreground font-medium">
                                    {movement.total_quantity === 1 ? t("movementDetail.unit") : t("movementDetail.units")}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notas / Observaciones */}
                <div className="pt-3 border-t border-muted/40 space-y-1.5">
                    <div className="text-xs flex items-center gap-1.5 ">
                        <Clipboard className="h-3.5 w-3.5 text-orange-600" />
                        <span className="font-bold uppercase tracking-wider">
                            {t("movementDetail.observations")}
                        </span>
                    </div>
                    <p className="text-sm bg-muted/30 p-2.5 rounded-lg leading-relaxed ">
                        {movement.observations?.trim() || t("movementDetail.noObservations")}
                    </p>
                </div>
            </div>

            {/* ================= SECCIÓN INFERIOR: CONSUMIBLES AFECTADOS ================= */}
            <div className="p-5 sm:p-6 border-2 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-1">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <h3 className="text-xl font-black uppercase tracking-wider text-foreground">
                        {t("movementDetail.itemsBreakdown")}
                    </h3>
                </div>

                {/* 🖥️ VISTA TABLA: Escritorio (md y superiores) */}
                <div className="hidden md:block border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader className=" text-xs tracking-wider font-bold">
                            <TableRow>
                                <TableHead>{t("movementDetail.table.consumable")}</TableHead>
                                <TableHead>{t("movementDetail.table.code")}</TableHead>
                                <TableHead>{t("movementDetail.table.batch")}</TableHead>
                                <TableHead>{t("movementDetail.table.quantity")}</TableHead>
                                <TableHead>{t("movementDetail.table.unitCost")}</TableHead>
                                <TableHead>{t("movementDetail.table.subtotal")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movement.subItems?.map((sub) => {
                                const subCost = Number(sub.movement_cost || 0);
                                const quantity = Number(sub.quantity_consumable || 0);
                                const unitCost = quantity > 0 ? subCost / quantity : 0;

                                return (
                                    <TableRow key={sub.id} className="hover:bg-muted/20 transition-colors text-xs font-semibold">
                                        <TableCell className="font-medium text-foreground cursor-help" title={sub.consumable?.description}>
                                            {sub.consumable?.name || t("movementDetail.notAvailable")}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-muted-foreground px-1.5 py-0.5 rounded border bg-background font-mono text-[11px]">
                                                {sub.consumable?.item_code || t("movementDetail.notAvailable")}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-semibold text-xs ">
                                            <div className="flex items-center gap-1">
                                                <File className="h-3 w-3 text-blue-600 shrink-0" />
                                                <span>
                                                    {sub.batch?.num_requirement ? `${sub.batch.num_requirement}` : "---"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            {quantity} {quantity === 1 ? t("movementDetail.unit") : t("movementDetail.units")}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono">
                                            ${unitCost.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-blue-600 dark:text-blue-400 font-mono">
                                            ${subCost.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className="block md:hidden space-y-3">
                    {movement.subItems?.map((sub) => {
                        const subCost = Number(sub.movement_cost || 0);
                        const quantity = Number(sub.quantity_consumable || 0);
                        const unitCost = quantity > 0 ? subCost / quantity : 0;

                        return (
                            <div key={sub.id} className="p-3.5 rounded-xl border bg-muted/10 space-y-3 text-xs">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1.5 max-w-[70%]">
                                        <p className="font-bold text-foreground leading-tight">
                                            {sub.consumable?.name || t("movementDetail.noDescription")}
                                        </p>
                                        <span className="inline-block text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                                            {sub.consumable?.item_code || t("movementDetail.notAvailable")}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-[9px] text-muted-foreground block font-medium uppercase tracking-wider">
                                            {t("movementDetail.table.subtotal")}
                                        </span>
                                        <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold text-sm">
                                            ${subCost.toFixed(2)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-muted text-[11px]">
                                    <div>
                                        <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">
                                            {t("movementDetail.table.batch")}
                                        </span>
                                        <span className="font-mono">
                                            {sub.batch?.num_requirement ? `${sub.batch.num_requirement}` : "---"}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">
                                            {t("movementDetail.table.quantity")}
                                        </span>
                                        <strong className="text-foreground">
                                            {quantity} {t("movementDetail.unitShort")}
                                        </strong>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[9px] uppercase tracking-wider text-muted-foreground">
                                            {t("movementDetail.table.unitCost")}
                                        </span>
                                        <span className="font-mono text-foreground">${unitCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};