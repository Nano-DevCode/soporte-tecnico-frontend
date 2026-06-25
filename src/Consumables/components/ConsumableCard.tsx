import { Check, Tag, MapPin, Blocks, AlertCircle, Box, ImageIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Consumable } from "../interfaces/consumable.interfaces";
import { CustomConsumableActionsMenu } from "./CustomConsumablesActionsMenu";
import { Link } from "react-router";
import { t } from "i18next"; // <-- Hook para traducción reactiva
import { CanAction } from "../permissions/Can";

interface Props {
    item: Consumable;
    isInBag: boolean;
    onToggleBag: () => void;
}

export function ConsumableCard({ item, isInBag, onToggleBag }: Props) {
    const finalImageUrl = item.imageUrl;

    return (
        <Link to={`/consumables/details/${item.id}`} className="flex w-full h-full">
            <Card className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg w-full h-full",
                isInBag
                    ? "border border-green-500/40 ring-1 ring-green-500/20 shadow-sm shadow-green-500/5 bg-green-50/5 dark:bg-green-950/5"
                    : "border-border/60 hover:border-blue-500/30"
            )}
            title={t("consumables.card.click_details")}>
                <div className="group relative w-full h-44 bg-muted/40 border-b border-border/40 flex items-center justify-center overflow-hidden p-4">
                    {/* Código del ítem */}
                    <span className="absolute bottom-2 left-2 text-[12px] font-bold px-2 py-0.5 rounded-md bg-zinc-200
                    text-zinc-900 dark:bg-white dark:text-zinc-900 border border-zinc-300 dark:border-zinc-100
                    shadow-sm z-10 transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-200 
                    dark:group-hover:text-zinc-900 group-hover:translate-x-0.5">
                        {item.item_code}
                    </span>

                    {finalImageUrl ? (
                        <img
                            src={finalImageUrl}
                            alt={item.description}
                            className="max-w-full max-h-full object-contain z-0 transition-transform duration-300 group-hover:scale-120"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Sin+Imagen";
                            }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground/50 transition-transform duration-300 group-hover:scale-105">
                            <ImageIcon className="h-10 w-10 stroke-1" />
                            <span className="text-[10px] tracking-wider uppercase font-medium">{t("consumables.card.no_image")}</span>
                        </div>
                    )}
                </div>

                {/* Contenido de la Tarjeta */}
                <CardContent className="p-4 flex-1 flex flex-col gap-3 justify-between">
                    <div className="space-y-2.5">
                        {/* Fila de Stock y Unidad de Medida */}
                        <div className="flex items-center justify-between gap-2">
                            {item.available_stock <= 5 ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                    <AlertCircle className="h-3.5 w-3.5 text-red-500" /> {t("consumables.card.stock_critical", { stock: item.available_stock })}
                                </Badge>
                            ) : item.available_stock < 10 ? (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> {t("consumables.card.stock_low", { stock: item.available_stock })}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                    <Box className="h-3.5 w-3.5 text-blue-500" /> {t("consumables.card.stock_normal", { stock: item.available_stock })}
                                </Badge>
                            )}

                            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {item.id_unit_measurement?.name || "U.M."}
                            </span>
                        </div>

                        {/* Descripción del Consumible */}
                        <div className="text-sm font-medium pt-1 line-clamp-2 text-justify group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                        </div>
                    </div>

                    {/* Detalles Técnicos Intermedios */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs mt-auto">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                            <span className="line-clamp-2">{t("consumables.card.brand_label")}<strong className="text-foreground/80 font-medium">{item.id_brand_consumable?.name || t("consumables.card.brand_fallback")}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                            <span className="line-clamp-2">{t("consumables.card.ubication_label")}<strong className="text-foreground/80 font-medium">{item.id_ubication_consumable?.name || t("consumables.card.ubication_fallback")}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                            <span className="line-clamp-2">{t("consumables.card.category_label")}<strong className="text-foreground/80 font-medium">{item.id_type_consumable?.name || t("consumables.card.category_fallback")}</strong></span>
                        </div>

                        {item.number_uses > 0 && (
                            <div className="text-blue-800 dark:text-blue-400 font-xs pt-0.5">
                                {item.number_uses > 1 ? (
                                    <span dangerouslySetInnerHTML={{ __html: t("consumables.card.performance_plural", { uses: item.number_uses }) }} />
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: t("consumables.card.performance_singular", { uses: item.number_uses }) }} />
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer con el botón de acción */}
                <CardFooter className="justify-center items-center w-full p-4 pt-0">
                    <div className="flex items-center gap-2 w-full max-w-sm">
                        <CanAction permission="ADD_CONSUMABLE_BAG">
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); 
                                onToggleBag();
                            }}
                            variant={isInBag ? "outline" : "default"}
                            className={cn(
                                "flex-1 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm rounded-lg h-10",
                                isInBag
                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50 dark:hover:bg-green-950/40"
                                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                            )}
                        >
                            {isInBag ? (
                                <>
                                    <Check className="mr-1.5 h-4 w-4 stroke-[3]" />
                                    {t("consumables.card.btn_added")}
                                </>
                            ) : (
                                <>
                                    <Blocks className="mr-1.5 h-4 w-4" />
                                    {t("consumables.card.btn_add")}
                                </>
                            )}
                        </Button>
                        </CanAction>

                        <div 
                            className="border-muted-foreground"
                            onClick={(e) => e.preventDefault()}
                        >
                            <CanAction permission="EDIT_CONSUMABLE">
                            <CustomConsumableActionsMenu consumable={item} />
                            </CanAction>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}