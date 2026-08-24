import {
    Tag, MapPin, AlertCircle,
    Box, ImageIcon, Layers, Calendar,
    ColumnsSettings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Consumable } from "../interfaces/consumable.interfaces";
import { t } from "i18next";

interface Props {
    consumable: Consumable;
}

const getFullImageUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
    }
    const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
    const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
    return `${backendBaseUrl}/${cleanUrl}`;
};

export function ConsumableDetailsView({ consumable }: Props) {
    // Se invoca la función del módulo externo pasando el valor reactivo por argumento
    const finalImageUrl = getFullImageUrl(consumable.imageUrl);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in-50 duration-200">
            {/* CONTENEDOR PRINCIPAL */}
            <Card className="overflow-hidden border border-border bg-background shadow-xs rounded-xl">

                {/* ENCABEZADO DE LA SECCIÓN */}
                <div className="px-10 p-2  border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0 bg-zinc-50/30 dark:bg-zinc-900/5">

                    {/* SECCIÓN IZQUIERDA: DESCRIPCIÓN */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 sm:pr-10">
                        <div className="min-w-0 flex-1 flex-row">
                            <h1 className="text-xl font-bold tracking-tight text-foreground leading-snug whitespace-pre-wrap wrap-break-word">
                                {consumable.name || t("consumables.details.name_fallback")}
                            </h1>
                        </div>
                    </div>

                    {/* SECCIÓN DERECHA: CÓDIGO IDENTIFICADOR */}
                    <div className="flex sm:justify-end shrink-0 self-start sm:self-center">
                        <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-md bg-background text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 shadow-2xs uppercase">
                            {consumable.item_code || t("consumables.details.code_fallback")}
                        </span>
                    </div>

                </div>

                <CardContent className=" ">
                    {/* CONTENEDOR DE DISTRIBUCIÓN EN FILA */}
                    <div className="flex flex-col-reverse md:flex-row items-stretch gap-6 ">

                        {/* SECCIÓN IZQUIERDA: BLOQUES DE INFORMACIÓN */}
                        <div className="flex-1 min-w-0 max-w-xl space-y-5">
                            <div className="  rounded-xl space-y-1.5 min-w-0 text-justify">
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                    {t("consumables.details.desc_label")}
                                </span>
                                <p className="text-zinc-900 dark:text-zinc-100 font-semibold break-words text-sm">
                                    {consumable?.description || t("consumables.details.desc_fallback")}
                                </p>
                            </div>

                            {/* Panel de Stock e Inventario */}
                            <div className="space-y-3.5 rounded-xl border border-border/60 bg-zinc-50/40 dark:bg-zinc-900/10 p-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
                                    {t("consumables.details.inventory_control")}
                                </span>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {consumable.available_stock <= (consumable.stockMin ?? 0) ? (
                                        //  ROJO: Stock minimo o muy bajo d stock
                                        <Badge
                                            variant="outline"
                                            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5"
                                        >
                                            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                                            {t("consumables.card.stock_critical", { stock: consumable.available_stock })}
                                        </Badge>
                                    ) : consumable.available_stock < (consumable.stockMax ?? 0) ? (
                                        // AMARILLO: Stock Medio (entre el min y el max)
                                        <Badge
                                            variant="outline"
                                            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5"
                                        >
                                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                            {t("consumables.card.stock_low", { stock: consumable.available_stock })}
                                        </Badge>
                                    ) : (
                                        // VERDE: Stock maxicom o saludable
                                        <Badge
                                            variant="outline"
                                            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 gap-1 text-[11px] font-semibold px-2 py-0.5"
                                        >
                                            <Box className="h-3.5 w-3.5 text-emerald-500" />
                                            {t("consumables.card.stock_normal", { stock: consumable.available_stock })}
                                        </Badge>
                                    )}

                                    {/* Métrica / Unidad */}
                                    <Badge variant="outline" className="bg-background text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md">
                                        {t("consumables.details.unit_label", { unit: consumable.id_unit_measurement?.name || t("consumables.details.unit_fallback") })}
                                    </Badge>
                                </div>

                                {/* Rendimiento estimado */}
                                {consumable.number_uses > 0 && (
                                    <div className="text-xs text-muted-foreground pt-3 flex items-center gap-2 border-t border-border/40 w-full min-w-0">
                                        <ColumnsSettings className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                        <span className="break-words">
                                            {consumable.number_uses > 1 ? (
                                                <span dangerouslySetInnerHTML={{ __html: t("consumables.details.performance_text", { uses: consumable.number_uses }) }} />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: t("consumables.details.performance_text_singular", { uses: consumable.number_uses }) }} />
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Fichas Técnicas Estructuradas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">

                                {/* Bloque de Marca */}
                                <div className="p-3 border border-border/50 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/5 space-y-1.5 min-w-0">
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Tag className="h-3.5 w-3.5 text-amber-500" /> {t("consumables.details.brand_title")}
                                    </span>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold pl-5 break-words text-sm">
                                        {consumable.id_brand_consumable?.name || t("consumables.details.brand_fallback")}
                                    </p>
                                </div>

                                {/* Bloque de Categoría */}
                                <div className="p-3 border border-border/50 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/5 space-y-1.5 min-w-0">
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers className="h-3.5 w-3.5 text-indigo-500" /> {t("consumables.details.category_title")}
                                    </span>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold pl-5 break-words text-sm">
                                        {consumable.id_type_consumable?.name || t("consumables.details.category_fallback")}
                                    </p>
                                </div>

                                {/* Bloque de Ubicación */}
                                <div className="p-3 border border-border/50 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/5 space-y-1.5 min-w-0 sm:col-span-2">
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-emerald-500" /> {t("consumables.details.ubication_title")}
                                    </span>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold pl-5 break-words text-sm">
                                        {consumable.id_ubication_consumable?.name || t("consumables.details.ubication_fallback")}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* SECCIÓN IMAGEN */}
                        <div className="shrink-0 w-full md:w-[260px] flex flex-col items-center md:items-end justify-start">
                            <div className="w-full max-w-[260px] rounded-xl bg-background border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-3.5 overflow-hidden shadow-2xs group transition-colors duration-200 hover:border-zinc-300 dark:hover:border-zinc-700">
                                {finalImageUrl ? (
                                    <img
                                        src={finalImageUrl}
                                        alt={consumable.description}
                                        className="w-full h-auto max-h-[260px] object-contain select-none filter contrast-[1.01] transition-transform duration-300 group-hover:scale-102"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Sin+Imagen";
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-12 text-zinc-300 dark:text-zinc-700 select-none">
                                        <ImageIcon className="h-8 w-8 stroke-[1.25] text-zinc-400" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">{t("consumables.details.no_image")}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <Separator className="my-5 bg-border/50" />

                    {/* PIE DE AUDITORÍA */}
                    <div className="rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground tracking-wide w-full min-w-0 bg-zinc-50/40 dark:bg-zinc-900/10 border border-border/40">
                        <div className="flex items-center gap-2 min-w-0">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span className="break-words">{t("consumables.details.created_at")}<span className="text-foreground/80 font-medium">
                                {(() => {
                                    const dateStr = consumable.created_at?.endsWith("Z") ? consumable.created_at : `${consumable.created_at}Z`;
                                    return new Date(dateStr).toLocaleString('es-MX', {
                                        timeZone: 'America/Mexico_City',
                                    });
                                })()}
                            </span></span>
                        </div>
                        {consumable.updated_at && (
                            <div className="flex items-center gap-2 sm:border-l border-border/50 sm:pl-4 min-w-0">
                                <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                <span className="break-words">{t("consumables.details.updated_at")}<span className="text-foreground/80 font-medium">
                                    {(() => {
                                        const dateStr = consumable.updated_at?.endsWith("Z") ? consumable.updated_at : `${consumable.updated_at}Z`;
                                        return new Date(dateStr).toLocaleString('es-MX', {
                                            timeZone: 'America/Mexico_City',
                                        });
                                    })()}
                                </span></span>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}