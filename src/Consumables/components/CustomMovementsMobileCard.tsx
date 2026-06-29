import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye } from "lucide-react";
import { Link } from "react-router";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import type { GroupedMovement } from "../interfaces/consumable-movement.interfaces";

interface Props {
    movements: GroupedMovement[];
}

export const CustomMovementsMobileCard = ({ movements }: Props) => {
    if (movements.length === 0) {
        return (
            <div className="block md:hidden text-center p-6 border border-dashed rounded-lg bg-card text-muted-foreground text-sm">
                {t("movementCard.noMovements")}
            </div>
        );
    }

    return (
        <div className="block md:hidden space-y-4">
            {movements.map((group) => {
                const isTypeOne = group.movement_type?.id === 1 || group.movement_type?.id === '1';

                const badgeColors = isTypeOne
                    ? "border-green-600 bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400 uppercase"
                    : "border-yellow-600 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-400 uppercase";

                return (
                    <Card key={group.code_movement_aplication} className="overflow-hidden border-muted/70 shadow-sm">
                        <CardContent className="p-4 space-y-3">

                            {/* Encabezado Card */}
                            <div className="flex justify-between items-start gap-2">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                        {t("movementCard.lblFolio")}
                                    </span>
                                    <h3 className="font-bold text-base text-foreground font-mono">{group.code_movement_aplication}</h3>
                                </div>
                                <Badge className={`text-xs font-semibold shadow-none ${badgeColors}`}>
                                    {group.movement_type?.name || "N/A"}
                                </Badge>
                            </div>

                            {/* Grid de metadata básica */}
                            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t  border-dashed">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {t("movementCard.lblDate")}
                                    </p>
                                    <p className="font-medium">
                                        {/* {new Date(group.created_at).toLocaleDateString()} */}
                                        {(() => {
                                            const dateStr = group.created_at.endsWith("Z") ? group.created_at : `${group.created_at}Z`;

                                            return new Date(dateStr).toLocaleString('es-MX', {
                                                timeZone: 'America/Mexico_City',
                                            });
                                        })()}
                                    </p>
                                </div>
                                <div className=" text-right space-y-1">
                                    <p className="text-muted-foreground ">
                                        {t("movementCard.lblApplication")}
                                    </p>
                                    <p className="font-medium truncate">{group.movement_aplication?.name || "N/A"}</p>
                                </div>
                            </div>

                            {/* Subtotales Monetarios */}
                            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-dashed">
                                <div className="text-xs">
                                    <span className="text-muted-foreground block">{t("movementCard.lblQuantity")}</span>
                                    <strong className="text-foreground">
                                        {group.total_quantity}{" "}
                                        {group.total_quantity === 1 ? t("movementCard.unit") : t("movementCard.units")}
                                    </strong>
                                </div>
                                <div className="text-right text-xs">
                                    <span className="text-muted-foreground block">{t("movementCard.lblTotalCost")}</span>
                                    <strong className="text-blue-600 dark:text-blue-400 text-sm">
                                        ${group.total_cost.toFixed(2)}
                                    </strong>
                                </div>
                            </div>

                            {/* Botón de Acción Directa a Detalles */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground border-zinc-200 dark:border-zinc-800"
                                asChild
                            >
                                <Link to={`/consumable-movements/details/${encodeURIComponent(group.code_movement_aplication)}`}>
                                    <Eye className="h-3.5 w-3.5" />
                                    {t("movementCard.btnDetails")}
                                </Link>
                            </Button>

                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};