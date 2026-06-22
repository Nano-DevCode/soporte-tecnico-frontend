import { ArrowDownRight, ArrowUpRight, Eye } from "lucide-react";
import { Link } from "react-router";
import { t } from "i18next";
import type { GroupedMovement } from "../interfaces/consumable-movement.interfaces";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
    movements: GroupedMovement[];
}

export const CustomMovementsDesktopTable = ({ movements }: Props) => {
    if (movements.length === 0) {
        return (
            <div className="hidden md:block text-center p-8 border rounded-lg bg-card text-muted-foreground">
                {t("movementTable.noMovements")}
            </div>
        );
    }

    return (
        <div className="hidden md:block rounded-md border bg-card overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-27.5 max-w-50">{t("movementTable.thCode")}</TableHead>
                        <TableHead className="min-w-27.5 max-w-30">{t("movementTable.thType")}</TableHead>
                        <TableHead className="min-w-27.5 max-w-50">{t("movementTable.thApplication")}</TableHead>
                        <TableHead className="min-w-27.5 w-50 max-w-60">{t("movementTable.thDate")}</TableHead>
                        <TableHead className="text-center min-w-27.5 max-w-40">{t("movementTable.thTotalQuantity")}</TableHead>
                        <TableHead className="text-right w-30">{t("movementTable.thTotalCost")}</TableHead>
                        <TableHead className="w-20 text-center">{t("movementTable.thActions")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {movements.map((group) => {
                        const isTypeOne = group.movement_type?.id === 1 || group.movement_type?.id === '1';

                        const badgeColors = isTypeOne
                            ? "border-green-600 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950/60 dark:text-green-400 uppercase"
                            : "border-yellow-600 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/60 dark:text-yellow-400 uppercase";

                        return (
                            <TableRow key={group.code_movement_aplication} className="hover:bg-muted/30 transition-colors text-xs font-bold">
                                <TableCell className="font-bold ">
                                    {group.code_movement_aplication}
                                </TableCell>
                                <TableCell>
                                    {group.movement_type ? (
                                        <Badge className={`font-semibold shadow-none gap-1 items-center inline-flex ${badgeColors}`}>
                                            {isTypeOne ? (
                                                <ArrowDownRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                            ) : (
                                                <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                            )}
                                            {group.movement_type.name}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground">N/A</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-0.5 ">
                                        <span className="font-bold">
                                            {group.movement_aplication?.name || group.code_movement_aplication}
                                        </span>
                                        {group.department && (
                                            <p className="font-semibold text-muted-foreground tracking-wider">
                                                {group.department.name}
                                            </p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="space-y-1">
                                    {(() => {
                                        const dateStr = group.created_at.endsWith("Z") ? group.created_at : `${group.created_at}Z`;

                                        return new Date(dateStr).toLocaleString('es-MX', {
                                            timeZone: 'America/Mexico_City',
                                        });
                                    })()}
                                </TableCell>
                                <TableCell className="text-center">
                                    {group.total_quantity}{" "}
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {group.total_quantity === 1 ? t("movementTable.unit") : t("movementTable.units")}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                                    ${group.total_cost.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-md" asChild>
                                        <Link to={`/consumable-movements/details/${encodeURIComponent(group.code_movement_aplication)}`}>
                                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};