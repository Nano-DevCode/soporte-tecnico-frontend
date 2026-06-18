import {
    Tag, MapPin, AlertCircle,
    Box, ImageIcon, Layers, Calendar,
    ColumnsSettings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Consumable } from "../interfaces/consumable.interfaces";

interface Props {
    consumable: Consumable;
}

export function ConsumableDetailsView({ consumable }: Props) {

    const getFullImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
            return url;
        }
        const backendBaseUrl = soporteTecnicoApi.defaults.baseURL;
        const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
        return `${backendBaseUrl}/${cleanUrl}`;
    };

    const finalImageUrl = getFullImageUrl(consumable.imageUrl);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in-50 duration-200">
            {/* CONTENEDOR PRINCIPAL */}
            <Card className="overflow-hidden border border-border bg-background shadow-xs rounded-xl">

                {/* ENCABEZADO DE LA SECCIÓN */}
                <div className="p-4  border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0 bg-zinc-50/30 dark:bg-zinc-900/5">

                    {/* SECCIÓN IZQUIERDA: DESCRIPCIÓN */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 sm:pr-10">
                        <div className="min-w-0 flex-1 flex-row">
                            <h1 className="text-xl font-bold tracking-tight text-foreground leading-snug whitespace-pre-wrap wrap-break-word">
                                {consumable.description}
                            </h1>
                        </div>
                    </div>

                    {/* SECCIÓN DERECHA: CÓDIGO IDENTIFICADOR */}
                    <div className="flex sm:justify-end shrink-0 self-start sm:self-center">
                        <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-md bg-background text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 shadow-2xs uppercase">
                            {consumable.item_code}
                        </span>
                    </div>

                </div>

                <CardContent className=" ">
                    {/* CONTENEDOR DE DISTRIBUCIÓN EN FILA */}
                    <div className="flex flex-col-reverse md:flex-row items-stretch gap-6 ">

                        {/* SECCIÓN IZQUIERDA: BLOQUES DE INFORMACIÓN */}
                        <div className="flex-1 min-w-0 max-w-xl space-y-5">

                            {/* Panel de Stock e Inventario (Sutil y Destacado) */}
                            <div className="space-y-3.5 rounded-xl border border-border/60 bg-zinc-50/40 dark:bg-zinc-900/10 p-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block">
                                    Control de Inventario
                                </span>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    {/* Estado del Stock */}
                                    {consumable.available_stock <= 5 ? (
                                        <Badge variant="outline" className="bg-background text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50 gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md shadow-2xs">
                                            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /> Stock crítico: {consumable.available_stock}
                                        </Badge>
                                    ) : consumable.available_stock < 10 ? (
                                        <Badge variant="outline" className="bg-background text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md shadow-2xs">
                                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Stock bajo: {consumable.available_stock}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-background text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md shadow-2xs">
                                            <Box className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> Stock disponible: {consumable.available_stock}
                                        </Badge>
                                    )}

                                    {/* Métrica / Unidad */}
                                    <Badge variant="outline" className="bg-background text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md">
                                        Unidad: {consumable.id_unit_measurement?.name || "No asignada"}
                                    </Badge>
                                </div>

                                {/* Rendimiento estimado */}
                                {consumable.number_uses > 0 && (
                                    <div className="text-xs text-muted-foreground pt-3 flex items-center gap-2 border-t border-border/40 w-full min-w-0">
                                        <ColumnsSettings className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                        <span className="break-words">
                                            Este insumo tiene asignados <strong className="text-foreground font-semibold">{consumable.number_uses}</strong> {consumable.number_uses > 1 ? "usos individuales" : "uso único"}.
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Fichas Técnicas Estructuradas (Inspirado en los campos de tu imagen) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">

                                {/* Bloque de Marca */}
                                <div className="p-3 border border-border/50 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/5 space-y-1.5 min-w-0">
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Tag className="h-3.5 w-3.5 text-amber-500" /> Marca del Producto
                                    </span>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold pl-5 break-words text-sm">
                                        {consumable.id_brand_consumable?.name || "Genérica"}
                                    </p>
                                </div>

                                {/* Bloque de Categoría */}
                                <div className="p-3 border border-border/50 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/5 space-y-1.5 min-w-0">
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers className="h-3.5 w-3.5 text-indigo-500" /> Categoría / Clase
                                    </span>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold pl-5 break-words text-sm">
                                        {consumable.id_type_consumable?.name || "General"}
                                    </p>
                                </div>

                                {/* Bloque de Ubicación (Ancho completo para mejor lectura) */}
                                <div className="p-3 border border-border/50 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/5 space-y-1.5 min-w-0 sm:col-span-2">
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-emerald-500" /> Ubicación Física en Almacén
                                    </span>
                                    <p className="text-zinc-900 dark:text-zinc-100 font-semibold pl-5 break-words text-sm">
                                        {consumable.id_ubication_consumable?.name || "No asignada"}
                                    </p>
                                </div>

                            </div>

                        </div>
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
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <Separator className="my-5 bg-border/50" />

                    {/* PIE DE AUDITORÍA (Estilo ultra-limpio) */}
                    <div className="rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-muted-foreground tracking-wide w-full min-w-0 bg-zinc-50/40 dark:bg-zinc-900/10 border border-border/40">
                        <div className="flex items-center gap-2 min-w-0">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span className="break-words">Alta en sistema: <span className="text-foreground/80 font-medium">{consumable.created_at ? `${new Date(consumable.created_at).toLocaleDateString()} a las ${new Date(consumable.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "—"}</span></span>
                        </div>
                        {consumable.updated_at && (
                            <div className="flex items-center gap-2 sm:border-l border-border/50 sm:pl-4 min-w-0">
                                <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                <span className="break-words">Último cambio: <span className="text-foreground/80 font-medium">{new Date(consumable.updated_at).toLocaleDateString()} a las {new Date(consumable.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}