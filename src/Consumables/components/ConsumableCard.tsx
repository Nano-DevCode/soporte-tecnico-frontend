import { Check, Tag, MapPin, Blocks, AlertCircle, Box, ImageIcon, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Consumable } from "../interfaces/consumable.interfaces";
// import { CustomConsumableActionsMenu } from "./CustomConsumablesActionsMenu";
import { CustomConsumableActionsMenu } from "./CustomConsumablesActionsMenu";

interface Props {
    item: Consumable;
    isInBag: boolean;
    onToggleBag: () => void;
    handleDownClick: (consumable: Consumable) => void;
}

export function ConsumableCard({ item, isInBag, onToggleBag, handleDownClick }: Props) {
    const finalImageUrl = item.imageUrl;

    return (
        <Card className={cn(
            "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg min-h-420px",
            isInBag
                ? "border border-green-500/40 ring-1 ring-green-500/20 shadow-sm shadow-green-500/5 bg-green-50/5 dark:bg-green-950/5"
                : "border-border/60 hover:border-blue-500/30"
        )}>
            {/* --- CONTENEDOR DE LA IMAGEN (Estilo E-commerce) --- */}
            <div className="relative w-full h-44 bg-muted/40 border-b border-border/40 flex items-center justify-center overflow-hidden p-4">

                <span className="absolute bottom-2 left-2 text-[12px] font-bold px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-900 border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-zinc-900/50 ">
                    {item.item_code}
                </span>
                {finalImageUrl ? (
                    <img
                        src={finalImageUrl}
                        alt={item.description}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Sin+Imagen";
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground/50">
                        <ImageIcon className="h-10 w-10 stroke-1" />
                        <span className="text-[10px] tracking-wider uppercase font-medium">Sin imagen</span>
                    </div>
                )}
            </div>

            {/* Contenido de la Tarjeta */}
            <CardContent className="p-4 flex-1 flex flex-col gap-3 justify-between">

                <div className="space-y-2.5">
                    {/* Fila de Stock y Unidad de Medida */}
                    <div className="flex items-center justify-between gap-2">
                        {/* Control de Stock Dinámico */}
                        {item.available_stock <= 5 ? (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                <AlertCircle className="h-3.5 w-3.5 text-red-500" /> Stock crítico: {item.available_stock}
                            </Badge>
                        ) : item.available_stock < 10 ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Stock bajo: {item.available_stock}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5">
                                <Box className="h-3.5 w-3.5 text-blue-500" /> Stock: {item.available_stock}
                            </Badge>
                        )}

                        {/* Unidad de medida */}
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {item.id_unit_measurement?.name || "U.M."}
                        </span>
                    </div>

                    {/* Descripción del Consumible */}
                    <div className="pt-1">
                        <p className="text-[14px] font-semibold text-justify group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {item.description}
                        </p>
                    </div>
                </div>

                {/* Detalles Técnicos Intermedios */}
                <div className="space-y-1.5 pt-2 border-t border-border/40 text-[12px]">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span className="truncate">Marca: <strong className="text-foreground/80 font-medium">{item.id_brand_consumable?.name || "Genérica"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span className="truncate">Ubicación: <strong className="text-foreground/80 font-medium">{item.id_ubication_consumable?.name || "No asignada"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Layers className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span className="truncate">Categoría: <strong className="text-foreground/80 font-medium">{item.id_type_consumable?.name || "General"}</strong></span>
                    </div>

                    {/* Muestra los usos si aplica estructuralmente */}
                    {item.number_uses > 0 && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
                            • Rendimiento estimado: {item.number_uses} usos
                        </div>
                    )}
                </div>
            </CardContent>
            {/* Footer con el botón de acción MercadoLibre Style */}
            <CardFooter className="justify-center items-center w-full">
                <div className="flex items-center gap-2 w-full max-w-sm">
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
                                Agregado a la lista
                            </>
                        ) : (
                            <>
                                <Blocks className="mr-1.5 h-4 w-4" />
                                Agregar a la lista
                            </>
                        )}
                    </Button>

                    {/* Menú de Opciones Secundarias */}
                    <div className="flex items-center justify-center h-10 w-10 border rounded-lg border-zinc-200 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:border-zinc-800 transition-all shadow-sm">
                        <CustomConsumableActionsMenu
                            consumable={item}
                            handleDownClick={handleDownClick}
                        />
                    </div>

                </div>
            </CardFooter>
        </Card>
    );
}