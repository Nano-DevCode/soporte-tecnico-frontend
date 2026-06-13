import { useNavigate } from "react-router";
import { 
    ArrowLeft, Tag, MapPin, AlertCircle, 
    Box, ImageIcon, Layers, Calendar,
    ColumnsSettings
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { soporteTecnicoApi } from "@/api/soporteTecnicoApi";
import type { Consumable } from "../interfaces/consumable.interfaces";

interface Props {
    consumable: Consumable;
}

export function ConsumableDetailsView({ consumable }: Props) {
    const navigate = useNavigate();

    // Formateo dinámico de imagen apuntando al puerto 3000 con prefijo /api/
    const getFullImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
            return url;
        }
        let backendBaseUrl = soporteTecnicoApi.defaults.baseURL || "http://localhost:3000/api";
        backendBaseUrl = backendBaseUrl.replace(/\/$/, "");
        const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
        return `${backendBaseUrl}/${cleanUrl}`;
    };

    const finalImageUrl = getFullImageUrl(consumable.imageUrl);

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-4">
            
            {/* Botón de navegación minimalista fuera del marco */}
            <div className="flex items-center">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/consumables")} 
                    className="hover:bg-muted text-muted-foreground hover:text-foreground text-xs gap-2 pl-2 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Volver al listado
                </Button>
            </div>

            {/* --- CUADRO ÚNICO CONTENEDOR PRINCIPAL --- */}
            <Card className="overflow-hidden border border-border/70 bg-background shadow-md rounded-xl">
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border/60">
                    
                    {/* SECCIÓN IZQUIERDA: FLUJO DE INFORMACIÓN */}
                    <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 md:order-1">
                        
                        {/* Cabecera: Título y Datos de Identificación */}
                        <div className="space-y-3"> 
                            <span className="text-[12px] font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 w-fit block">
                                {consumable.item_code}
                            </span>
                            
                            <h1 className="  text-xl font-bold tracking-tight text-foreground leading-snug text-justify line-clamp-2">
                                {consumable.description}
                            </h1>
                        </div>

                        {/* BLOQUE DE INVENTARIO Y MÉTRICAS (Todo junto para mayor coherencia) */}
                        <div className="space-y-3 bg-muted/90 p-4 rounded-xl border border-border/40">
                            <span className="text-[11px] font-bold uppercase tracking-wider block">
                                Control de Inventario
                            </span>
                            
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Estado del Stock */}
                                {consumable.available_stock <= 5 ? (
                                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40 gap-1.5 text-[12px] font-bold px-2.5 py-1">
                                        <AlertCircle className="h-4 w-4 text-red-700" /> Stock crítico: {consumable.available_stock}
                                    </Badge>
                                ) : consumable.available_stock < 10 ? (
                                    <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40 gap-1.5 text-[12px] font-bold px-2.5 py-1">
                                        <AlertCircle className="h-4 w-4 text-amber-700" /> Stock bajo: {consumable.available_stock}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/75 gap-1.5 text-[12px] font-bold px-2.5 py-1">
                                        <Box className="h-4 w-4 text-blue-700" /> Stock disponible: {consumable.available_stock}
                                    </Badge>
                                )}

                                {/* Unidad de Medida */}
                                <Badge variant="secondary" className="bg-zinc-200 text-zinc-800 border-zinc-400 dark:bg-zinc-800/50 dark:text-white dark:border-zinc-500 gap-1.5 text-[12px] font-bold px-2.5 py-1">
                                    Métrica: {consumable.id_unit_measurement?.name || "No asignada"}
                                </Badge>
                            </div>

                            {/* Rendimiento estimado (unido al bloque de stock/unidad) */}
                            {consumable.number_uses > 0 && (
                                <div className="font-semibold text-[12px] text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-2">
                                    <ColumnsSettings className="h-4 w-4 shrink-0 text-emerald-600" />
                                    <span>Número de usos: <strong >{consumable.number_uses} </strong>{consumable.number_uses > 1 ? "usos" : "uso"}.</span>
                                </div>
                            )}
                        </div>

                        {/* Listado Técnico Sintetizado */}
                        <div className="space-y-3 text-sm pt-1">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Tag className="h-4 w-4 shrink-0 text-orange-500" />
                                <span>Marca: <strong className="text-foreground font-medium">{consumable.id_brand_consumable?.name || "Genérica"}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Layers className="h-4 w-4 shrink-0 text-blue-600" />
                                <span>Categoría: <strong className="text-foreground font-medium">{consumable.id_type_consumable?.name || "General"}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0 text-red-600" />
                                <span>Ubicación: <strong className="text-foreground font-medium">{consumable.id_ubication_consumable?.name || "No asignada"}</strong></span>
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* CUADRO GRIS PARA FECHAS (Metadata de auditoría limpia) */}
                        <div className="bg-muted/100 border border-border/30 rounded-lg p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-muted-foreground tracking-wide">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                                <span className="font-bold">Fecha de Alta: <strong className="text-foreground/80 font-medium">{consumable.created_at ? `${new Date(consumable.created_at).toLocaleDateString()} a las ${new Date(consumable.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}` : "—"} hrs.</strong></span>
                            </div>
                            {consumable.updated_at && (
                                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-border/60 pt-2 sm:pt-0 sm:pl-3">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                                    <span className="font-bold">Último Cambio: <strong className="text-foreground/80 font-medium">{new Date(consumable.updated_at).toLocaleDateString()} a las {new Date(consumable.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})} hrs.</strong></span>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* SECCIÓN DERECHA: VISUALIZADOR DE IMAGEN (md:order-2) */}
                    <div className="md:col-span-5 bg-muted/10 p-6 flex items-center justify-center relative min-h-[300px] sm:min-h-[380px] md:order-2">
                        {finalImageUrl ? (
                            <img
                                src={finalImageUrl}
                                alt={consumable.description}
                                className="max-w-full max-h-[280px] sm:max-h-[320px] object-contain select-none transition-transform duration-200 hover:scale-102"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/500x500?text=Sin+Imagen";
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                                <ImageIcon className="h-12 w-12 stroke-1" />
                                <span className="text-[11px] uppercase tracking-wider font-medium">Sin imagen</span>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}